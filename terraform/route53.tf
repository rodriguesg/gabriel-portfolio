# ─────────────────────────────────────────────
# Route 53
# ─────────────────────────────────────────────

# Lookup the hosted zone (must already exist in your AWS account)
data "aws_route53_zone" "portfolio" {
  name         = var.domain_name
  private_zone = false
}

# Apex domain A record → CloudFront (IPv4)
resource "aws_route53_record" "apex_ipv4" {
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

# Apex domain AAAA record → CloudFront (IPv6)
resource "aws_route53_record" "apex_ipv6" {
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

# www subdomain A record → CloudFront (IPv4)
resource "aws_route53_record" "www_ipv4" {
  count   = var.subdomain != "" ? 1 : 0
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = local.full_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

# www subdomain AAAA record → CloudFront (IPv6)
resource "aws_route53_record" "www_ipv6" {
  count   = var.subdomain != "" ? 1 : 0
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = local.full_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}
