# Meta + Google AI Integration

Your **meta** CLI now has Google AI/Cloud superpowers for cybersecurity content automation.

## 🚀 Setup

### 1. Enable Google APIs

```bash
gcloud services enable generativelanguage.googleapis.com   # Gemini
gcloud services enable aiplatform.googleapis.com           # Vertex AI  
gcloud services enable blogger.googleapis.com              # Blogger
gcloud services enable drive.googleapis.com                # Drive/Docs
gcloud services enable docs.googleapis.com                 # Docs API
gcloud services enable sheets.googleapis.com               # Sheets
```

### 2. Authentication

**Option A: ADC (Recommended)**
```bash
gcloud auth application-default login
```

**Option B: API Key**
```bash
export GOOGLE_API_KEY="your-gemini-api-key"
export BLOGGER_ID="your-blogger-id"
```

Get API key: https://makersuite.google.com/app/apikey

### 3. Install Dependencies

```bash
cd meta
pnpm install
pnpm run build
```

## 🛠️ Usage

### Basic Publishing (Original)
```bash
# Dry run with local templates
pnpm meta drafts/chrome-141.md dry-run

# Push to GitHub blog
pnpm meta drafts/chrome-141.md push
```

### Google AI Enhanced Publishing
```bash
# Enhance draft + generate AI social copies
pnpm meta drafts/chrome-141.md dry-run --google

# Publish to Blogger instead of GitHub
pnpm meta drafts/chrome-141.md push --blogger

# Full AI workflow: enhance + social + blogger
pnpm meta drafts/chrome-141.md push --google --blogger
```

### Google Docs Sync
```bash
# Pull from Google Docs to markdown
pnpm meta sync-from-docs "1BxYz..." drafts/new-post.md

# Push markdown to Google Docs  
pnpm meta sync-to-docs drafts/chrome-141.md
```

## 🔧 Configuration

Edit `meta.config.yaml`:

```yaml
google:
  model: "gemini-1.5-flash"
  blogger:
    enabled: true
  drive:
    draftsFolder: "1ABC..."  # Google Drive folder ID
  sheets:
    calendarId: "1XYZ..."    # Content calendar sheet
```

## 🤖 AI Features

### Enhanced Draft Generation
- **Input:** Raw markdown draft
- **Output:** Gemini-enhanced version with improved clarity, technical accuracy, and CTA
- **Trigger:** `--google` flag

### Smart Social Copy Generation  
- **Input:** Blog title + body + tags
- **Output:** Platform-optimized posts (X/Twitter, LinkedIn, Facebook)
- **Features:** Character limits, hashtag optimization, tone matching

### Content Calendar Integration
- Pull from Google Sheets for scheduled publishing
- Automatic tag suggestions based on content analysis

## 📝 Publishing Channels

### 1. GitHub Blog (Default)
- Creates PR with MDX + OG image
- Works with Next.js, Hugo, Eleventy

### 2. Google Blogger
- Direct publishing via Blogger API
- Markdown → HTML conversion
- Scheduled publishing support

### 3. Social Media
- **X (Twitter):** AI-optimized threads with OG images
- **LinkedIn:** Professional security content
- **Reddit:** Community engagement with subreddit targeting

### 4. Your Own Community
- **Discourse:** Self-hosted forums with categories & moderation
- **Lemmy:** Federated Reddit-like communities (sovereignty + federation)

### 5. Hybrid Workflow
- Docs → Draft → AI Enhancement → Multi-platform publish

## 🔌 Community Channel Setup

### Reddit
```bash
# Create "installed app" at reddit.com/prefs/apps
export CHANNEL_REDDIT=1
export REDDIT_SUB="vaultmesh"
export REDDIT_CLIENT_ID="..."
export REDDIT_CLIENT_SECRET="..."
export REDDIT_USERNAME="..."
export REDDIT_PASSWORD="..."

pnpm meta drafts/chrome-141.md push
```

### Discourse (Self-Hosted Forum)
```bash
# Install via Docker: https://github.com/discourse/discourse_docker
# Admin → API → Create Key
export CHANNEL_DISCOURSE=1
export DISC_BASE="https://community.vaultmesh.org"
export DISC_API_KEY="admin-api-key"
export DISC_API_USER="system"
export DISC_CATEGORY_ID="1"

pnpm meta drafts/chrome-141.md push
```

### Lemmy (Federated Community)
```bash
# Install via Docker: https://join-lemmy.org/docs/administration/installation.html
export CHANNEL_LEMMY=1
export LEMMY_BASE="https://lemmy.vaultmesh.org"
export LEMMY_COMMUNITY_ID="2"
export LEMMY_USER="sovereign"
export LEMMY_PASS="..."

pnpm meta drafts/chrome-141.md push
```

**All channels support:**
- ✅ Canonical URLs with UTM tracking (`?utm_source=reddit&utm_campaign=slug`)
- ✅ AI-generated platform-specific copies
- ✅ Dry-run mode for testing
- ✅ Google Sheets scheduler integration

## 🛡️ Security Workflow Example

```bash
# 1. Write security alert draft
echo "---
title: Chrome 142 WebGPU CVE-2025-12345
slug: chrome-142-cve
no_poc: true 
tags: [Chrome, WebGPU, CVE, Critical]
---

Critical WebGPU vulnerability allows RCE. Update immediately.
" > drafts/chrome-142.md

# 2. AI-enhance + generate social copies
pnpm meta drafts/chrome-142.md dry-run --google

# 3. Review, then publish everywhere
CHANNEL_X=1 CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 \
pnpm meta drafts/chrome-142.md push --google --blogger
```

**Output:**
- ✅ Enhanced blog post with technical details
- ✅ Optimized OG image (1200x630 PNG)
- ✅ Platform-specific social copies (X, LinkedIn, Reddit)
- ✅ Published to blog + Blogger + Discourse + Reddit
- ✅ Community engagement across sovereign platforms

## 🔄 GitHub Actions Integration

The existing workflows now support Google AI:

```yaml
# .github/workflows/meta-publish.yml
env:
  GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
  BLOGGER_ID: ${{ secrets.BLOGGER_ID }}
```

Add secrets in your repo settings.

## 🎯 Next: Vertex AI + Cloud Run

For production scale:

1. **Deploy to Cloud Run** - meta as HTTP service
2. **Cloud Scheduler** - automated publishing 
3. **Pub/Sub** - event-driven workflow
4. **Secret Manager** - secure token management
5. **Vertex AI** - advanced content analysis

---

**Meta Forge Status:** ⚔️ Ready for cybersecurity content warfare across the digital realm.