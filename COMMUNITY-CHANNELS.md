# Community Channels Guide

**Meta** now publishes to your own sovereign communities — not just corporate platforms.

## 🎯 Overview

| Channel | Type | Best For | Setup Time |
|---------|------|----------|------------|
| **Reddit** | Community aggregator | Subreddit engagement | 5 min |
| **Discourse** | Self-hosted forum | Long-form discussions, moderation | 30 min (Docker) |
| **Lemmy** | Federated community | Sovereignty + federation | 30 min (Docker) |

All channels support:
- ✅ AI-generated platform-specific copies
- ✅ Canonical URLs with UTM tracking
- ✅ Dry-run testing
- ✅ Google Sheets scheduler integration

---

## 📢 Reddit Integration

### Quick Setup

1. **Create Reddit App**
   - Go to https://www.reddit.com/prefs/apps
   - Click "create another app..."
   - Select "installed app"
   - Note: `client_id` (under app name), `client_secret`

2. **Configure Environment**
   ```bash
   export CHANNEL_REDDIT=1
   export REDDIT_SUB="vaultmesh"                    # your subreddit name
   export REDDIT_CLIENT_ID="abc123xyz"
   export REDDIT_CLIENT_SECRET="secret-here"
   export REDDIT_USERNAME="your-reddit-username"
   export REDDIT_PASSWORD="your-reddit-password"
   ```

3. **Test**
   ```bash
   pnpm meta drafts/demo.md dry-run
   # [reddit] dry-run → r/vaultmesh: Your Post Title
   
   pnpm meta drafts/demo.md push
   # [reddit] posted → https://reddit.com/r/vaultmesh/comments/...
   ```

### Reddit Best Practices

- **Rate Limits:** Reddit enforces strict rate limits. Space posts 10+ minutes apart.
- **Subreddit Rules:** Check if your target subreddit allows self-posts and self-promotion.
- **Format:** Meta uses self-posts (text posts) with canonical link at bottom.
- **Moderation:** Consider messaging mods first if posting frequently.

**Generated Post Format:**
```
Title: Your Blog Post Title
Body: AI-generated description from your draft

Read: https://blog.vaultmesh.org/posts/slug?utm_source=reddit&utm_campaign=slug
```

---

## 🗣️ Discourse (Self-Hosted Forum)

### Why Discourse?

- **Battle-tested:** Powers thousands of communities (Discourse.org, Docker, Rust)
- **Modern UX:** Fast, responsive, mobile-friendly
- **Moderation:** Built-in spam detection, flags, user trust levels
- **SEO:** Excellent search engine visibility
- **Integrations:** SSO, webhooks, API-first design

### Quick Setup (Docker)

1. **Install via Docker (Ubuntu/Debian)**
   ```bash
   # Install Docker
   wget -qO- https://get.docker.com/ | sh
   
   # Clone Discourse Docker
   git clone https://github.com/discourse/discourse_docker.git /var/discourse
   cd /var/discourse
   
   # Configure
   ./discourse-setup
   # Follow prompts: domain, admin email, SMTP settings
   
   # Launch (5-10 minutes)
   ./launcher start app
   ```

2. **Create API Key**
   - Visit: https://community.vaultmesh.org/admin/api/keys
   - Click "New API Key"
   - Description: "Meta Publisher"
   - User Level: Select admin user (e.g., `system`)
   - Scope: Global key
   - Copy the generated key

3. **Get Category ID**
   - Visit: https://community.vaultmesh.org/admin/customize/site_texts
   - Navigate to Categories section
   - Note numeric ID from URL: `/c/general/1` → ID is `1`

4. **Configure Environment**
   ```bash
   export CHANNEL_DISCOURSE=1
   export DISC_BASE="https://community.vaultmesh.org"
   export DISC_API_KEY="your-global-api-key"
   export DISC_API_USER="system"                    # or your admin username
   export DISC_CATEGORY_ID="1"                      # numeric category ID
   ```

5. **Test**
   ```bash
   pnpm meta drafts/demo.md dry-run
   # [discourse] dry-run → https://community.vaultmesh.org category 1: Your Title
   
   pnpm meta drafts/demo.md push
   # [discourse] posted → https://community.vaultmesh.org/t/your-title/123
   ```

### Discourse Best Practices

- **Categories:** Create dedicated category for blog announcements
- **Markdown:** Discourse supports full Markdown + BBCode
- **Notifications:** Set up webhooks to alert on replies
- **Backup:** Enable automatic S3 backups in Admin → Backups

**Generated Post Format:**
```markdown
**Your Blog Post Title**

AI-generated LinkedIn or Facebook copy with emojis and context

Read: https://blog.vaultmesh.org/posts/slug?utm_source=discourse&utm_campaign=slug
```

### Production Checklist

- [ ] TLS via Let's Encrypt (handled by discourse-setup)
- [ ] SMTP for email notifications
- [ ] S3 backups enabled
- [ ] CDN for uploads (optional)
- [ ] SSO integration (optional)

---

## 🌐 Lemmy (Federated Community)

### Why Lemmy?

- **Sovereignty:** Self-host your own instance
- **Federation:** Users from other Lemmy/ActivityPub instances can participate
- **Reddit-like:** Familiar UX for Reddit users
- **Open Source:** MIT licensed, AGPLv3 backend
- **Privacy:** No corporate tracking

### Quick Setup (Docker Compose)

1. **Install Lemmy**
   ```bash
   # Create directory
   mkdir -p /opt/lemmy && cd /opt/lemmy
   
   # Download docker-compose
   wget https://raw.githubusercontent.com/LemmyNet/lemmy/main/docker/docker-compose.yml
   wget https://raw.githubusercontent.com/LemmyNet/lemmy/main/docker/lemmy.hjson -O lemmy.hjson
   
   # Edit lemmy.hjson
   nano lemmy.hjson
   # Set: hostname, database password, admin email
   
   # Launch
   docker-compose up -d
   ```

2. **Create Community**
   - Visit: https://lemmy.vaultmesh.org
   - Create admin account
   - Click "Create Community"
   - Name: "VaultMesh Blog" or "Cybersecurity"
   - Note the community ID from URL: `/c/vaultmesh/2` → ID is `2`

3. **Configure Environment**
   ```bash
   export CHANNEL_LEMMY=1
   export LEMMY_BASE="https://lemmy.vaultmesh.org"
   export LEMMY_COMMUNITY_ID="2"                    # numeric community ID
   export LEMMY_USER="sovereign"                    # your admin username
   export LEMMY_PASS="your-password"
   ```

4. **Test**
   ```bash
   pnpm meta drafts/demo.md dry-run
   # [lemmy] dry-run → https://lemmy.vaultmesh.org community 2: Your Title
   
   pnpm meta drafts/demo.md push
   # [lemmy] posted → https://lemmy.vaultmesh.org/post/123
   ```

### Lemmy Best Practices

- **Federation:** Allow federation in config to reach broader audience
- **Moderation:** Assign moderators to community
- **Rules:** Set community rules and sidebar description
- **Captcha:** Enable captcha to prevent spam registrations

**Generated Post Format:**
```
Title: Your Blog Post Title
Body: AI-generated description

Read: https://blog.vaultmesh.org/posts/slug?utm_source=lemmy&utm_campaign=slug
```

### Production Checklist

- [ ] Reverse proxy (Nginx/Caddy) with TLS
- [ ] PostgreSQL backups
- [ ] Pictrs (image hosting) configured
- [ ] Email SMTP for notifications
- [ ] Rate limiting enabled
- [ ] Federation configured (if desired)

---

## 🔀 Multi-Channel Publishing

### Publish Everywhere at Once

```bash
# Enable all community channels
export CHANNEL_X=1
export CHANNEL_LI=1
export CHANNEL_REDDIT=1
export CHANNEL_DISCOURSE=1
export CHANNEL_LEMMY=1

# One command, six platforms
pnpm meta drafts/chrome-141.md push --google
```

**Result:**
- ✅ GitHub blog PR opened
- ✅ X (Twitter) with OG image
- ✅ LinkedIn professional post
- ✅ Reddit self-post in r/vaultmesh
- ✅ Discourse topic in community forum
- ✅ Lemmy post in federated community

### Google Sheets Scheduler

Extend your content calendar with channel toggles:

| Title | Slug | Date | Publish | X | LI | Reddit | Discourse | Lemmy |
|-------|------|------|---------|---|----|----|-----------|-------|
| Chrome CVE Alert | chrome-141 | 2025-10-03 | ✅ | ✅ | ✅ | ✅ | ✅ | |

The scheduler reads these columns and sets environment variables before publishing.

---

## 🛡️ Security Considerations

### API Keys
- Store in `.env` (never commit)
- Use separate keys for dev/prod
- Rotate keys quarterly

### Rate Limits
- Reddit: 60 requests/minute (use `dry-run` first)
- Discourse: No hard limits (self-hosted)
- Lemmy: No hard limits (self-hosted)

### Content Moderation
- Monitor community responses
- Enable auto-mod rules
- Have abuse reporting flow

### Federation (Lemmy Only)
- Consider privacy implications
- Set appropriate content policies
- Monitor federated moderators

---

## 📊 Analytics & UTM Tracking

All community posts include UTM parameters:

```
?utm_source=reddit&utm_campaign=chrome-141
?utm_source=discourse&utm_campaign=chrome-141
?utm_source=lemmy&utm_campaign=chrome-141
```

Track in Google Analytics:
- **utm_source:** Which platform drove traffic
- **utm_campaign:** Which post/slug
- **utm_medium:** organic (default)

---

## 🚀 Quick Test Commands

```bash
# Test Reddit only
CHANNEL_REDDIT=1 pnpm meta drafts/demo.md dry-run

# Test Discourse only
CHANNEL_DISCOURSE=1 pnpm meta drafts/demo.md dry-run

# Test Lemmy only
CHANNEL_LEMMY=1 pnpm meta drafts/demo.md dry-run

# Test all community channels
CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 CHANNEL_LEMMY=1 \
pnpm meta drafts/demo.md dry-run
```

---

## 🎯 Recommendation

**Choose your sovereignty level:**

1. **Maximum Control:** Discourse
   - Best moderation tools
   - SEO optimized
   - Enterprise-grade
   - No federation complexity

2. **Maximum Reach:** Reddit
   - Existing large communities
   - Instant audience
   - Simple setup
   - Corporate platform trade-offs

3. **Maximum Sovereignty + Federation:** Lemmy
   - Full control + federation
   - ActivityPub compatible
   - Growing ecosystem
   - More technical setup

**Best Strategy:** Run both Discourse (your primary community) and Lemmy (federated reach). Use Reddit for targeted subreddit engagement.

---

## 🐳 Docker Compose (Bonus)

Want a one-command setup? Here's a combined stack:

```bash
# Coming soon: ./meta-community-stack.sh
# Launches: Discourse + Lemmy + Nginx + PostgreSQL + Redis
```

Say the word and I'll generate the full Docker Compose + Nginx config.

---

**Fourth Gate Unlocked:** Your own sovereign community, federated reach, Reddit engagement — all from one `meta` command. ⚔️
