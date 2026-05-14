variable "aws_region" {
  description = "Primary AWS region for resources (except ACM which is always us-east-1)"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be one of: production, staging, development."
  }
}

variable "domain_name" {
  description = "Your root domain name (e.g. yourname.dev)"
  type        = string
  # Example: "yourname.dev"
}

variable "subdomain" {
  description = "Subdomain prefix. Use empty string for apex domain."
  type        = string
  default     = "www"
}

variable "owner_name" {
  description = "Owner name for resource tagging"
  type        = string
  default     = "portfolio-owner"
}

variable "cloudfront_price_class" {
  description = "CloudFront price class (PriceClass_All gives global coverage)"
  type        = string
  default     = "PriceClass_100" # US, Canada, Europe — cheapest. Use PriceClass_All for global.
}

variable "enable_waf" {
  description = "Enable AWS WAF on the CloudFront distribution"
  type        = bool
  default     = false # Set to true to add WAF (adds cost)
}

variable "cache_ttl_default" {
  description = "Default CloudFront cache TTL in seconds (1 day)"
  type        = number
  default     = 86400
}

variable "cache_ttl_html" {
  description = "Cache TTL for HTML files (shorter so deploys propagate fast)"
  type        = number
  default     = 300 # 5 minutes
}
