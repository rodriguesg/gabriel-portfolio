# Portfolio — Gabriel Rodrigues · React + AWS

Personal portfolio site built with **React + Vite**, deployed on **AWS CloudFront + S3**, managed by **Terraform**.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Pure CSS (custom design system) |
| Hosting | AWS S3 |
| CDN | AWS CloudFront (HTTP/3, Brotli) |
| SSL | AWS ACM |
| DNS | AWS Route 53 |
| IaC | Terraform ≥ 1.6 |
| CI/CD | GitHub Actions |

## Architecture

```
Browser → CloudFront (Edge) → S3 (Origin)
               ↓
        ACM Certificate (us-east-1)
               ↓
        Route 53 (DNS)
```

CloudFront serves the React SPA from S3 via **Origin Access Control (OAC)** — S3 is never public.

## Project Structure

```
portfolio/
├── src/
│   ├── components/      # Navbar, CustomCursor
│   ├── sections/        # Hero, About, Experience, Skills, Projects, Contact
│   ├── styles/          # global.css (design tokens)
│   ├── App.jsx
│   └── main.jsx
├── terraform/
│   ├── main.tf          # Providers
│   ├── variables.tf     # All configurable inputs
│   ├── s3.tf            # S3 bucket + OAC + bucket policy
│   ├── cloudfront.tf    # Distribution + ACM + cache policies + security headers
│   ├── route53.tf       # DNS A/AAAA records
│   └── outputs.tf       # Useful outputs (deploy commands, URLs)
├── .github/workflows/
│   └── deploy.yml       # CI/CD pipeline
└── index.html
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Infrastructure Setup

### Prerequisites
- AWS CLI configured (`aws configure`)
- Terraform ≥ 1.6 installed
- Domain already registered (Route 53 hosted zone must exist)

### 1. Configure variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your domain name and preferences
```

### 2. Deploy infrastructure

```bash
terraform init
terraform plan
terraform apply
```

> First apply takes ~10-15 minutes (ACM certificate validation via DNS).

### 3. Build and deploy the site

After `terraform apply`, use the generated `deploy_command` output:

```bash
terraform output -raw deploy_command
```

Or manually:

```bash
npm run build

# Assets (hashed filenames → 1 year cache)
aws s3 sync dist/assets/ s3://YOUR_BUCKET/assets/ \
  --cache-control "public,max-age=31536000,immutable" --delete

# HTML (short cache → fast invalidation)
aws s3 sync dist/ s3://YOUR_BUCKET/ \
  --exclude "assets/*" \
  --cache-control "public,max-age=300,must-revalidate" --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*.html" "/index.html"
```

## CI/CD with GitHub Actions

Set these **GitHub repository secrets**:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key (deploy-only permissions) |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `DOMAIN_NAME` | e.g. `yourname.dev` |
| `S3_BUCKET_NAME` | From `terraform output s3_bucket_name` |
| `CLOUDFRONT_DISTRIBUTION_ID` | From `terraform output cloudfront_distribution_id` |

Every push to `main` → builds React → syncs to S3 → invalidates CloudFront.

## Customization

### Personal info
Edit these files with your information:
- `src/components/Navbar.jsx` — your name
- `src/sections/Hero.jsx` — headline, bio, stats
- `src/sections/About.jsx` — bio text, social links
- `src/sections/Experience.jsx` — work history
- `src/sections/Skills.jsx` — skills and proficiency levels
- `src/sections/Projects.jsx` — your projects
- `src/sections/Contact.jsx` — contact info

### Design tokens
All colors, fonts, and spacing live in `src/styles/global.css` as CSS custom properties.

### Color palette
```css
--accent: #5AC8B4;    /* primary teal */
--accent-2: #A78BFA;  /* purple */
--accent-warm: #FB7185; /* pink-red */
```

## Cost estimate (AWS)

For a personal portfolio with low traffic:

| Service | Monthly cost |
|---|---|
| S3 (storage + requests) | ~$0.02 |
| CloudFront (PriceClass_100) | ~$0.50–$2.00 |
| Route 53 (hosted zone) | $0.50 |
| ACM | Free |
| **Total** | **~$1–3/month** |

## IAM Permissions for CI/CD

Create a dedicated IAM user with minimal permissions for GitHub Actions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::YOUR_BUCKET", "arn:aws:s3:::YOUR_BUCKET/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

## License

MIT
