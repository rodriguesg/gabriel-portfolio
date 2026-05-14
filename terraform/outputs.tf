output "site_url" {
  description = "The full URL of your portfolio site"
  value       = "https://${local.full_domain}"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain (use this before DNS propagates)"
  value       = "https://${aws_cloudfront_distribution.portfolio.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — needed for cache invalidations"
  value       = aws_cloudfront_distribution.portfolio.id
}

output "s3_bucket_name" {
  description = "S3 bucket name — use this when deploying built assets"
  value       = aws_s3_bucket.portfolio.bucket
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.portfolio.arn
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.portfolio.arn
}

output "deploy_command" {
  description = "Command to deploy your built site"
  value       = <<-EOT
    # Build React app
    npm run build

    # Upload to S3 (assets with long-cache headers)
    aws s3 sync dist/assets/ s3://${aws_s3_bucket.portfolio.bucket}/assets/ \
      --cache-control "public,max-age=31536000,immutable" \
      --delete

    # Upload HTML and other files (short cache)
    aws s3 sync dist/ s3://${aws_s3_bucket.portfolio.bucket}/ \
      --exclude "assets/*" \
      --cache-control "public,max-age=300,must-revalidate" \
      --delete

    # Invalidate CloudFront cache for HTML
    aws cloudfront create-invalidation \
      --distribution-id ${aws_cloudfront_distribution.portfolio.id} \
      --paths "/*.html" "/index.html"
  EOT
}
