# ─────────────────────────────────────────────
# S3 Bucket — Static website origin for CloudFront
# ─────────────────────────────────────────────

locals {
  bucket_name  = "${var.domain_name}-portfolio-${var.environment}"
  full_domain  = var.subdomain != "" ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  s3_origin_id = "portfolio-s3-origin"
}

resource "aws_s3_bucket" "portfolio" {
  bucket        = local.bucket_name
  force_destroy = var.environment != "production" # Only allow in non-prod
}

# Block all public access — CloudFront will access via OAC
resource "aws_s3_bucket_public_access_block" "portfolio" {
  bucket = aws_s3_bucket.portfolio.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for safe deploys / rollback
resource "aws_s3_bucket_versioning" "portfolio" {
  bucket = aws_s3_bucket.portfolio.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Lifecycle: keep last 5 versions, expire non-current after 30 days
resource "aws_s3_bucket_lifecycle_configuration" "portfolio" {
  bucket = aws_s3_bucket.portfolio.id

  rule {
    id     = "cleanup-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days           = 30
      newer_noncurrent_versions = 5
    }
  }
}

# Server-side encryption at rest
resource "aws_s3_bucket_server_side_encryption_configuration" "portfolio" {
  bucket = aws_s3_bucket.portfolio.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Logging bucket for S3 access logs
resource "aws_s3_bucket" "logs" {
  bucket        = "${local.bucket_name}-logs"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket                  = aws_s3_bucket.logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    id     = "expire-logs"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}

# CloudFront Origin Access Control — modern OAC (replaces legacy OAI)
resource "aws_cloudfront_origin_access_control" "portfolio" {
  name                              = "${local.bucket_name}-oac"
  description                       = "OAC for portfolio CloudFront → S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Bucket policy: only allow CloudFront (via OAC) to read objects
data "aws_iam_policy_document" "portfolio_s3" {
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.portfolio.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.portfolio.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "portfolio" {
  bucket = aws_s3_bucket.portfolio.id
  policy = data.aws_iam_policy_document.portfolio_s3.json

  depends_on = [aws_s3_bucket_public_access_block.portfolio]
}
