output "site_url" {
  description = "The URL of your portfolio site"
  value       = local.full_domain != "" ? "https://${local.full_domain}" : "https://${aws_cloudfront_distribution.portfolio.domain_name}"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain (always available)"
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
  description = "ACM certificate ARN (empty when no domain configured)"
  value       = one(aws_acm_certificate.portfolio[*].arn)
}

output "deploy_command" {
  description = "Command to deploy your built site"
  value       = <<-EOT
    npm run build

    aws s3 sync dist/assets/ s3://${aws_s3_bucket.portfolio.bucket}/assets/ \
      --cache-control "public,max-age=31536000,immutable" \
      --delete

    aws s3 sync dist/ s3://${aws_s3_bucket.portfolio.bucket}/ \
      --exclude "assets/*" \
      --cache-control "public,max-age=300,must-revalidate" \
      --delete

    aws cloudfront create-invalidation \
      --distribution-id ${aws_cloudfront_distribution.portfolio.id} \
      --paths "/*"
  EOT
}
