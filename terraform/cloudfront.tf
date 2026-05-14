# ─────────────────────────────────────────────
# ACM Certificate — must be us-east-1 for CloudFront
# ─────────────────────────────────────────────

resource "aws_acm_certificate" "portfolio" {
  provider = aws.us_east_1

  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Validate certificate via Route 53 DNS records
resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.portfolio.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "portfolio" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.portfolio.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}

# ─────────────────────────────────────────────
# CloudFront Cache Policies
# ─────────────────────────────────────────────

# Cache policy for assets (JS, CSS, images) — long TTL, immutable with hashed filenames
resource "aws_cloudfront_cache_policy" "assets" {
  name        = "${local.bucket_name}-assets-cache"
  comment     = "Long TTL for hashed static assets"
  default_ttl = var.cache_ttl_default
  max_ttl     = 31536000 # 1 year
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

# Cache policy for HTML — short TTL so new deploys propagate fast
resource "aws_cloudfront_cache_policy" "html" {
  name        = "${local.bucket_name}-html-cache"
  comment     = "Short TTL for HTML documents"
  default_ttl = var.cache_ttl_html
  max_ttl     = 3600 # 1 hour max
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

# ─────────────────────────────────────────────
# CloudFront Distribution
# ─────────────────────────────────────────────

resource "aws_cloudfront_distribution" "portfolio" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3" # Enable HTTP/3 (QUIC) for best performance
  comment             = "Portfolio distribution for ${local.full_domain}"
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class
  aliases             = [var.domain_name, local.full_domain]
  wait_for_deployment = true

  # S3 Origin via OAC
  origin {
    domain_name              = aws_s3_bucket.portfolio.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.portfolio.id
  }

  # Default cache behavior — serves HTML files
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = aws_cloudfront_cache_policy.html.id

    # Security headers via CloudFront response headers policy
    response_headers_policy_id = aws_cloudfront_response_headers_policy.portfolio.id
  }

  # Assets cache behavior — JS/CSS/images get long TTL
  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = aws_cloudfront_cache_policy.assets.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.portfolio.id
  }

  # SPA routing — return index.html for 404/403 (React Router support)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # SSL/TLS configuration
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.portfolio.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Geo restriction — remove to serve globally
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Access logging
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.logs.bucket_domain_name
    prefix          = "cloudfront/"
  }

  depends_on = [aws_acm_certificate_validation.portfolio]
}

# ─────────────────────────────────────────────
# Security Response Headers Policy
# ─────────────────────────────────────────────

resource "aws_cloudfront_response_headers_policy" "portfolio" {
  name    = "${local.bucket_name}-security-headers"
  comment = "Security headers for portfolio site"

  security_headers_config {
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }

    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';"
      override                = true
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }

    items {
      header   = "X-Powered-By"
      value    = "AWS CloudFront"
      override = true
    }
  }
}
