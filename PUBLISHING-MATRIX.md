# Meta Publishing Matrix — Quick Reference

## 🚀 One Command, Six Platforms

```bash
CHANNEL_X=1 CHANNEL_LI=1 CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 CHANNEL_LEMMY=1 \
pnpm meta drafts/your-post.md push --google
```

---

## 📊 Channel Comparison

| Channel | Type | Setup Time | Sovereignty | Federation | SEO | Moderation |
|---------|------|------------|-------------|------------|-----|------------|
| **GitHub Blog** | Static site | 5 min | ✅ Full | ❌ | ✅ Excellent | ✅ PRs |
| **X (Twitter)** | Social | 15 min | ❌ Corporate | ❌ | ⚠️ Limited | ⚠️ Basic |
| **LinkedIn** | Professional | 15 min | ❌ Corporate | ❌ | ✅ Good | ⚠️ Basic |
| **Reddit** | Aggregator | 5 min | ❌ Corporate | ❌ | ✅ Good | ✅ Mods |
| **Discourse** | Self-hosted | 30 min | ✅ Full | ❌ | ✅ Excellent | ✅ Advanced |
| **Lemmy** | Self-hosted | 30 min | ✅ Full | ✅ ActivityPub | ✅ Good | ✅ Advanced |

---

## 🔌 Environment Variables Cheat Sheet

### Core
```bash
export CANONICAL_BASE="https://blog.vaultmesh.org"
export SITE_REPO="VaultMesh/blog"
```

### AI
```bash
export GOOGLE_CLOUD_PROJECT="vaultmesh-ai"
# or
export GOOGLE_API_KEY="..."
```

### Corporate Platforms
```bash
export CHANNEL_X=1
export X_BEARER_TOKEN="..."

export CHANNEL_LI=1
export LI_ACCESS_TOKEN="..."
```

### Community Platforms
```bash
# Reddit (5 min setup)
export CHANNEL_REDDIT=1
export REDDIT_SUB="vaultmesh"
export REDDIT_CLIENT_ID="..."
export REDDIT_CLIENT_SECRET="..."
export REDDIT_USERNAME="..."
export REDDIT_PASSWORD="..."

# Discourse (30 min Docker)
export CHANNEL_DISCOURSE=1
export DISC_BASE="https://community.vaultmesh.org"
export DISC_API_KEY="..."
export DISC_API_USER="system"
export DISC_CATEGORY_ID="1"

# Lemmy (30 min Docker)
export CHANNEL_LEMMY=1
export LEMMY_BASE="https://lemmy.vaultmesh.org"
export LEMMY_COMMUNITY_ID="2"
export LEMMY_USER="sovereign"
export LEMMY_PASS="..."
```

---

## 🎯 Common Workflows

### Quick Alert (Corporate Only)
```bash
CHANNEL_X=1 CHANNEL_LI=1 \
pnpm meta drafts/alert.md push --google
```

### Community Engagement (Your Platforms)
```bash
CHANNEL_DISCOURSE=1 CHANNEL_LEMMY=1 \
pnpm meta drafts/discussion.md push --google
```

### Maximum Reach (Everything)
```bash
CHANNEL_X=1 CHANNEL_LI=1 CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 CHANNEL_LEMMY=1 \
pnpm meta drafts/major-announcement.md push --google
```

### Test Before Publishing
```bash
make test-all-channels
# Dry-run on all platforms, zero API calls
```

---

## 📝 Post Formats by Platform

### Blog (Canonical)
```markdown
---
title: Your Title
slug: your-slug
tags: [Security, CVE]
---
Full markdown content with code blocks, images, etc.
```

### X (Twitter)
```
🚨 Your Title

AI-generated 280-character summary with hashtags

Read: https://blog.vaultmesh.org/posts/slug?utm_source=x&utm_campaign=slug
```

### LinkedIn
```
🔐 Your Title

Professional AI-generated summary (1-2 paragraphs)
Technical details, business impact

Read: https://blog.vaultmesh.org/posts/slug?utm_source=linkedin&utm_campaign=slug
```

### Reddit
```
Title: Your Title
Body: AI-generated description optimized for Reddit tone

Read: https://blog.vaultmesh.org/posts/slug?utm_source=reddit&utm_campaign=slug
```

### Discourse
```markdown
**Your Title**

AI-generated professional copy

Read: https://blog.vaultmesh.org/posts/slug?utm_source=discourse&utm_campaign=slug
```

### Lemmy
```
Title: Your Title
Body: AI-generated federated-friendly copy

Read: https://blog.vaultmesh.org/posts/slug?utm_source=lemmy&utm_campaign=slug
```

---

## 🛠️ Makefile Shortcuts

```bash
make build                # TypeScript compile
make preview              # Dry-run example.md
make preview-ai           # Dry-run with Gemini AI

make test-reddit          # Test Reddit channel
make test-discourse       # Test Discourse channel
make test-lemmy           # Test Lemmy channel
make test-all-channels    # Test all community channels

make schedule-dev         # Run Sheets scheduler (dev)
make schedule-prod        # Run Sheets scheduler (prod)
```

---

## 📈 Analytics (UTM Tracking)

All posts include source tracking:
```
?utm_source=reddit&utm_campaign=your-slug
?utm_source=discourse&utm_campaign=your-slug
?utm_source=lemmy&utm_campaign=your-slug
```

**Google Analytics:**
- Acquisition → Campaigns
- Filter by utm_source to see which platform drives traffic

---

## 🔐 Security Checklist

### Before First Publish
- [ ] Review `.env` — no credentials committed
- [ ] Test with `dry-run` mode first
- [ ] Verify canonical URLs are correct
- [ ] Check social copies for accuracy

### Production Deployment
- [ ] Separate dev/prod API keys
- [ ] Enable 2FA on all accounts
- [ ] Set up monitoring/alerts
- [ ] Document incident response plan

### Community Moderation
- [ ] Configure Discourse trust levels
- [ ] Set up Lemmy moderation team
- [ ] Monitor Reddit community guidelines
- [ ] Enable auto-mod rules

---

## 🎖️ Setup Priority

### Day 1 (Immediate)
1. ✅ Blog + OG images (already working)
2. ⏱️ Reddit (5 min) — quickest community win

### Week 1 (High Impact)
3. ⏱️ X/Twitter (15 min) — corporate reach
4. ⏱️ LinkedIn (15 min) — professional network

### Month 1 (Sovereignty)
5. ⏱️ Discourse (30 min) — your primary community
6. ⏱️ Lemmy (30 min) — federated community

### Ongoing
7. 📅 Google Sheets scheduler
8. 🤖 CI/CD automation
9. 📊 Analytics dashboard

---

## 📚 Documentation Reference

| Guide | Purpose | Lines |
|-------|---------|-------|
| `README.md` | Main integration guide | 200+ |
| `QUICKSTART.md` | Daily usage reference | 250+ |
| `COMMUNITY-CHANNELS.md` | Community setup guide | 450+ |
| `COMMUNITY-IMPLEMENTATION.md` | Technical deep-dive | 400+ |
| `SHEETS-CALENDAR.md` | Batch scheduler guide | 300+ |
| `FIXED.md` | Bug fixes & features log | 300+ |

---

## 🆘 Troubleshooting

### Reddit: "invalid_grant"
→ Check username/password, verify app credentials

### Discourse: 403 Forbidden
→ Verify API key scope is "Global", check username

### Lemmy: "not_logged_in"
→ Check username/password, verify instance URL

### Font errors in OG
→ Install `fonts-dejavu` on Linux

### TypeScript errors
→ Run `pnpm install && pnpm run build`

---

## 🎯 Sovereignty Spectrum

```
Corporate ←―――――――――――――――――――――――→ Sovereign

X/Twitter    LinkedIn    Reddit    Discourse    Lemmy
   ❌          ❌          ❌         ✅          ✅
   │           │           │          │           │
   └───────────┴───────────┴──────────┴───────────┘
        Reach                    Control + Federation
```

**Strategy:** Use both ends of the spectrum
- Corporate platforms for reach
- Self-hosted for sovereignty
- Lemmy for federated sovereignty

---

**Meta Publishing Matrix:** One command, six platforms, full sovereignty.

⚔️ Solve et Coagula → Draft → Enhance → Publish → **MY OWN COMMUNITY**
