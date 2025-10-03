# Google Sheets Content Calendar Template

Create a Google Sheet with these columns:

| Title | Slug | Date | Status | Publish | Channel_X | Channel_LI | Channel_FB |
|-------|------|------|--------|---------|-----------|------------|------------|
| Chrome 141 Security Update | chrome-141-webgpu | 2025-10-03 | Draft | ✅ | ✅ | ✅ | ❌ |
| Demo: Meta + Gemini wired | demo-meta-gemini | 2025-10-04 | Ready | ✅ | ✅ | ❌ | ❌ |
| AI + Sovereignty Scroll | ai-sovereignty-scroll | 2025-10-05 | Draft | ❌ | ✅ | ✅ | ✅ |

## Column Definitions

- **Title** - Post title (for reference)
- **Slug** - Filename without .md (must match `drafts/{slug}.md`)
- **Date** - Target publish date (YYYY-MM-DD, informational)
- **Status** - Current state (Draft/Ready/Published/Failed)
- **Publish** - Master toggle: ✅ = publish now, ❌ = skip
- **Channel_X** - Post to X/Twitter: ✅ = yes, ❌ = no
- **Channel_LI** - Post to LinkedIn: ✅ = yes, ❌ = no
- **Channel_FB** - Post to Facebook: ✅ = yes, ❌ = no

## Setup

1. **Create Sheet** in Google Drive
2. **Copy Sheet ID** from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. **Set up auth**:
   ```bash
   gcloud auth application-default login
   export META_SHEET_ID="your-sheet-id"
   ```

## Usage

### Manual Run
```bash
# Set environment
export META_SHEET_ID="1ABC..."
export GOOGLE_CLOUD_PROJECT="your-project"
export CANONICAL_BASE="https://blog.vaultmesh.org"
export SITE_REPO="VaultSovereign/blog"

# Run scheduler
pnpm schedule
```

### CI/Scheduled Run (GitHub Actions)
```yaml
name: meta schedule
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    env:
      META_SHEET_ID: ${{ secrets.META_SHEET_ID }}
      GOOGLE_CLOUD_PROJECT: ${{ secrets.GOOGLE_CLOUD_PROJECT }}
      CANONICAL_BASE: https://blog.vaultmesh.org
      SITE_REPO: VaultSovereign/blog
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: pnpm i && pnpm run build
      - run: pnpm schedule:prod
```

### Cloud Scheduler (GCP)
```bash
# Create Cloud Run job
gcloud run jobs create meta-scheduler \
  --image=gcr.io/your-project/meta:latest \
  --set-env-vars="META_SHEET_ID=1ABC...,CANONICAL_BASE=https://blog.vaultmesh.org" \
  --region=us-central1

# Schedule daily
gcloud scheduler jobs create http meta-daily \
  --schedule="0 9 * * *" \
  --uri="https://run.googleapis.com/v1/jobs/meta-scheduler:run" \
  --oauth-service-account-email="meta-publisher@project.iam.gserviceaccount.com"
```

## How It Works

1. **Reads Sheet** - Fetches all rows with `Publish = ✅`
2. **For each item**:
   - Loads `drafts/{slug}.md`
   - Generates OG image
   - Uses Google AI if any channel is enabled
   - Opens PR in blog repo
   - Posts to enabled channels (X/LI/FB)
   - Updates Status to "Published" or "Failed: {error}"
3. **Logs results** to console

## Tips

- ✅ Use checkmark emoji (✅) or TRUE for toggles
- 📅 Date column is informational (not enforced yet)
- 🔄 Status auto-updates after each run
- 🚨 Failed items show error message in Status column
- 🎯 Each row = independent publish job

## Advanced: Time-based Publishing

To only publish items matching today's date:

```typescript
// In src/schedule.ts, filter by date:
const today = new Date().toISOString().slice(0, 10);
const publishable = items.filter(item => 
  item.publish && 
  item.slug && 
  item.date === today
);
```

This turns your Sheet into a **content calendar** with scheduled publishing!