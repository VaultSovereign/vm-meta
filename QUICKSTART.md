# Meta Forge — Quick Start

## ✅ Setup Complete

Your Meta publishing system is **fully operational** with:
- ✅ TypeScript builds without errors
- ✅ OG image generation working
- ✅ Vertex AI integration ready (ADC-first)
- ✅ Deterministic fallback templates
- ✅ `--google` flag for AI-powered copies

---

## 🚀 Usage Examples

### Basic Workflow (Deterministic)
```bash
export PNPM_HOME="/home/vaultsovereign/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
export CANONICAL_BASE="https://blog.vaultmesh.org"

cd /home/vaultsovereign/meta

# Dry-run (generates OG, no PR)
pnpm dev drafts/demo.md dry-run

# Push (opens PR in blog repo)
export SITE_REPO="VaultSovereign/blog"
pnpm dev drafts/demo.md push
```

### AI-Enhanced Workflow (Gemini)
```bash
# Set up Vertex AI (one-time)
gcloud auth application-default login
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GCP_LOCATION="us-central1"

# Generate with Gemini
pnpm dev drafts/demo.md dry-run --google

# Or use Makefile shortcut
make google D=demo.md M=dry-run
```

### Social Publishing (Optional)
```bash
# Enable channels only when ready to post
export CHANNEL_X=1
export CHANNEL_LI=1

# Post with AI copies
pnpm dev drafts/demo.md push --google
```

---

## 📁 Generated Artifacts

After running `pnpm dev drafts/demo.md dry-run`:

```
meta/
├── dist/
│   └── demo-meta-gemini/
│       └── og.png              # 1200x630 OG image
└── .meta-out/
    └── demo-meta-gemini/
        ├── demo-meta-gemini.mdx  # Blog post with front-matter
        └── og.png                 # Copy for blog repo
```

---

## 🔧 Environment Variables

### Required for Publishing
```bash
export SITE_REPO="VaultSovereign/blog"      # GitHub repo for blog
export CANONICAL_BASE="https://blog.vaultmesh.org"
export SITE_POSTS_DIR="posts"               # Default: posts
export SITE_OG_DIR="public/og"              # Default: public/og
```

### Google AI (Vertex AI - ADC mode)
```bash
export GOOGLE_CLOUD_PROJECT="your-gcp-project"
export GCP_LOCATION="us-central1"
# No API key needed with ADC!
```

### Google AI (API Key fallback)
```bash
export GOOGLE_API_KEY="your-gemini-api-key"
```

### Optional: Social Channels
```bash
# X/Twitter
export CHANNEL_X=1
export X_APP_KEY="..."
export X_APP_SECRET="..."
export X_ACCESS_TOKEN="..."
export X_ACCESS_SECRET="..."

# LinkedIn
export CHANNEL_LI=1
export LI_TOKEN="..."
export LI_AUTHOR_URN="urn:li:person:..."

# Reddit
export CHANNEL_REDDIT=1
export REDDIT_SUB="vaultmesh"
export REDDIT_CLIENT_ID="..."
export REDDIT_CLIENT_SECRET="..."
export REDDIT_USERNAME="..."
export REDDIT_PASSWORD="..."

# Discourse (self-hosted forum)
export CHANNEL_DISCOURSE=1
export DISC_BASE="https://community.vaultmesh.org"
export DISC_API_KEY="..."
export DISC_API_USER="system"
export DISC_CATEGORY_ID="1"

# Lemmy (federated community)
export CHANNEL_LEMMY=1
export LEMMY_BASE="https://lemmy.vaultmesh.org"
export LEMMY_COMMUNITY_ID="2"
export LEMMY_USER="sovereign"
export LEMMY_PASS="..."
```

**See:** `COMMUNITY-CHANNELS.md` for detailed setup guides.

---

## 🎯 Common Commands

```bash
# Build
pnpm run build

# Preview locally
pnpm dev drafts/your-post.md dry-run

# Preview with AI
pnpm dev drafts/your-post.md dry-run --google

# Publish (opens PR)
pnpm dev drafts/your-post.md push

# Publish with AI + social
CHANNEL_X=1 CHANNEL_LI=1 pnpm dev drafts/your-post.md push --google

# Publish to community channels
CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 pnpm dev drafts/your-post.md push --google

# Publish everywhere
CHANNEL_X=1 CHANNEL_LI=1 CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 CHANNEL_LEMMY=1 \
pnpm dev drafts/your-post.md push --google

# Makefile shortcuts
make preview              # Preview example.md
make preview-ai           # Preview with AI
make test-reddit          # Test Reddit dry-run
make test-discourse       # Test Discourse dry-run
make test-all-channels    # Test all community channels
make google D=post.md M=push  # Custom draft with AI
```

---

## 🛡️ Security Workflow Example

```bash
# 1. Create security alert draft
cat > drafts/chrome-142-rce.md <<'EOF'
---
title: Chrome 142 Critical RCE
slug: chrome-142-rce
no_poc: true
tags: [Chrome, CVE, Critical, RCE]
---

Critical remote code execution vulnerability in Chrome 142. 
Update to 142.0.7530.54+ immediately.

**CVE-2025-XXXXX** - WebGPU heap overflow allows arbitrary code execution.
EOF

# 2. Generate AI social copies
pnpm dev drafts/chrome-142-rce.md dry-run --google

# 3. Review output, then publish
CHANNEL_X=1 CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 \
pnpm dev drafts/chrome-142-rce.md push --google
```

**Result:**
- ✅ PR opened in `VaultSovereign/blog` with MDX + OG
- ✅ AI-generated social copies (X: 280 char, LinkedIn: professional)
- ✅ Posted to Reddit (r/vaultmesh), Discourse forum, X/Twitter
- ✅ All posts include canonical URL with UTM tracking

---

## 🔍 Troubleshooting

### TypeScript errors about `process`
```bash
# Reload pnpm PATH
export PNPM_HOME="/home/vaultsovereign/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"

# Rebuild
pnpm install
pnpm run build
```

### Font errors in OG generation
The system automatically tries these fonts:
- `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf` (Linux)
- `/System/Library/Fonts/Helvetica.ttc` (macOS)

Install DejaVu fonts if missing:
```bash
sudo apt-get install fonts-dejavu  # Debian/Ubuntu
```

### Gemini not returning JSON
Use a more reliable model:
```bash
export META_GEMINI_MODEL="gemini-1.5-pro-002"
```

### Different blog framework (Hugo/Eleventy)
Adjust paths in env:
```bash
export SITE_POSTS_DIR="content/posts"  # Hugo
export SITE_OG_DIR="static/og"         # Hugo
```

---

## 📊 Test Results

**System Status:** ✅ All tests passing

```
✅ Dependencies installed (104 packages)
✅ TypeScript build: no errors
✅ OG generation: working (19KB PNG)
✅ Dry-run: successful
✅ Canonical URL: https://blog.vaultmesh.org/posts/demo-meta-gemini
✅ Artifact: dist/demo-meta-gemini/og.png
```

---

## 🎖️ Next Steps

1. **Set up Google Cloud auth** (if using AI):
   ```bash
   gcloud auth application-default login
   export GOOGLE_CLOUD_PROJECT="your-project"
   ```

2. **Configure blog repo**:
   ```bash
   export SITE_REPO="VaultSovereign/blog"
   export CANONICAL_BASE="https://blog.vaultmesh.org"
   ```

3. **Test push workflow**:
   ```bash
   pnpm dev drafts/demo.md push
   ```

4. **Enable social channels** (when ready):
   ```bash
   export CHANNEL_X=1
   export CHANNEL_LI=1
   ```

---

**Meta Forge Status:** ⚔️ **OPERATIONAL**

Solve et Coagula → draft → OG → PR → social distribution