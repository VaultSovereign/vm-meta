#!/bin/bash
# Meta Forge - Quick Setup Script
# Run this after cloning to get started immediately

set -e

echo "🜄 Meta Forge Setup"
echo "=================="

# 1. Install pnpm if needed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    export PNPM_HOME="$HOME/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
fi

# 2. Install dependencies
echo "📚 Installing dependencies..."
pnpm install

# 3. Build TypeScript
echo "🔨 Building TypeScript..."
pnpm run build

# 4. Set up environment template
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local template..."
    cat > .env.local <<'EOF'
# Blog Configuration
export SITE_REPO="VaultSovereign/blog"
export CANONICAL_BASE="https://blog.vaultmesh.org"
export SITE_POSTS_DIR="posts"
export SITE_OG_DIR="public/og"

# Google Cloud (Vertex AI - ADC mode)
export GOOGLE_CLOUD_PROJECT="your-gcp-project"
export GCP_LOCATION="us-central1"

# Google Cloud (API Key fallback - optional)
# export GOOGLE_API_KEY="AIza..."

# Social Channels (optional - only set when posting)
# export CHANNEL_X=1
# export CHANNEL_LI=1
# export X_APP_KEY="..."
# export X_APP_SECRET="..."
# export X_ACCESS_TOKEN="..."
# export X_ACCESS_SECRET="..."
# export LI_TOKEN="..."
# export LI_AUTHOR_URN="urn:li:person:..."

# Blogger (optional)
# export BLOGGER_ID="..."
EOF
    echo "✅ Created .env.local - edit with your values"
fi

# 5. Test with demo
echo "🧪 Testing with demo draft..."
export CANONICAL_BASE="https://blog.vaultmesh.org"
pnpm dev drafts/demo.md dry-run

# 6. Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your config"
echo "  2. Source it: source .env.local"
echo "  3. Test: pnpm dev drafts/demo.md dry-run"
echo "  4. Publish: pnpm dev drafts/your-post.md push"
echo ""
echo "Documentation:"
echo "  - QUICKSTART.md  (quick reference)"
echo "  - VALIDATION.md  (test results)"
echo "  - README.md      (full guide)"
echo ""
echo "⚔️ Meta Forge is ready!"
