# ─────────────────────────────────────────────
# Route 53 — only created when domain_name is set
# The hosted zone must already exist in your AWS account
# ─────────────────────────────────────────────

data "aws_route53_zone" "portfolio" {
  count        = var.domain_name != "" ? 1 : 0
  name         = var.domain_name
  private_zone = false
}

resource "aws_route53_record" "apex_ipv4" {
  count   = var.domain_name != "" ? 1 : 0
  zone_id = one(data.aws_route53_zone.portfolio[*].zone_id)
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_ipv6" {
  count   = var.domain_name != "" ? 1 : 0
  zone_id = one(data.aws_route53_zone.portfolio[*].zone_id)
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_ipv4" {
  count   = var.domain_name != "" && var.subdomain != "" ? 1 : 0
  zone_id = one(data.aws_route53_zone.portfolio[*].zone_id)
  name    = local.full_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_ipv6" {
  count   = var.domain_name != "" && var.subdomain != "" ? 1 : 0
  zone_id = one(data.aws_route53_zone.portfolio[*].zone_id)
  name    = local.full_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}
