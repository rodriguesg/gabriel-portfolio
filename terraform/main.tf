terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment to use S3 as remote state backend
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "portfolio/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

# Primary provider — us-east-1 required for ACM certificates used with CloudFront
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "portfolio"
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = var.owner_name
    }
  }
}

# ACM certificate MUST be in us-east-1 for CloudFront
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "portfolio"
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = var.owner_name
    }
  }
}
