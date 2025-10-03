# Google Cloud Setup Scripts

# Enable required APIs
enable-apis:
	gcloud services enable generativelanguage.googleapis.com
	gcloud services enable aiplatform.googleapis.com  
	gcloud services enable blogger.googleapis.com
	gcloud services enable drive.googleapis.com
	gcloud services enable docs.googleapis.com
	gcloud services enable sheets.googleapis.com

# Set up authentication
auth:
	gcloud auth application-default login

# Google Sheets scheduling
schedule-dev:
	META_SHEET_ID=$(META_SHEET_ID) CANONICAL_BASE=$(CANONICAL_BASE) pnpm schedule

schedule-prod:
	META_SHEET_ID=$(META_SHEET_ID) CANONICAL_BASE=$(CANONICAL_BASE) pnpm schedule:prod

# AI-enhanced workflows
build-google:
	GOOGLE_AI_ENABLED=1 pnpm run build

preview-ai:
	pnpm dev drafts/example.md dry-run --google

# Community channel tests
test-reddit:
	CHANNEL_REDDIT=1 pnpm dev drafts/demo.md dry-run

test-discourse:
	CHANNEL_DISCOURSE=1 pnpm dev drafts/demo.md dry-run

test-lemmy:
	CHANNEL_LEMMY=1 pnpm dev drafts/demo.md dry-run

test-all-channels:
	CHANNEL_X=1 CHANNEL_LI=1 CHANNEL_REDDIT=1 CHANNEL_DISCOURSE=1 CHANNEL_LEMMY=1 \
	pnpm dev drafts/demo.md dry-run

publish-google:
	pnpm dev drafts/example.md push --google

# Shortcut for custom draft (usage: make google D=demo.md M=push)
google:
	GOOGLE_CLOUD_PROJECT=$(GOOGLE_CLOUD_PROJECT) GCP_LOCATION=$(GCP_LOCATION) CANONICAL_BASE=$(CANONICAL_BASE) pnpm dev drafts/$(D) $(M) --google

# Original workflows
build:
	pnpm run build

preview:
	pnpm dev drafts/example.md dry-run

publish:
	pnpm dev drafts/example.md push

ci-publish:
	node dist/cli.js drafts/example.md push

ci-publish-google:
	node dist/cli.js drafts/example.md push --google

# Original workflows
build:
	pnpm run build

preview:
	pnpm dev drafts/example.md dry-run

publish:
	pnpm dev drafts/example.md push

ci-publish:
	node dist/cli.js drafts/example.md push

ci-publish-google:
	node dist/cli.js drafts/example.md push --google
