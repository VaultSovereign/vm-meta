#!/usr/bin/env bash
set -euo pipefail
DOMAIN="vaultmesh.org"

pass() { printf "✅ %s\n" "$*"; }
fail() { printf "❌ %s\n" "$*" && exit 1; }

echo "— Checking NS is now Cloudflare —"
dig +short NS $DOMAIN | grep -qi "cloudflare" && pass "Nameservers on Cloudflare" || fail "Nameservers not on Cloudflare yet"

echo "— Checking A/AAAA root and www —"
dig +short A $DOMAIN         | grep -qx "91.98.124.11"        && pass "A @ ok"      || fail "A @ mismatch"
dig +short AAAA $DOMAIN      | grep -qx "2a01:4f8:1c1a:88e8::1" && pass "AAAA @ ok"  || fail "AAAA @ mismatch"
dig +short A www.$DOMAIN     | grep -qx "91.98.124.11"        && pass "A www ok"    || fail "A www mismatch"
dig +short AAAA www.$DOMAIN  | grep -qx "2a01:4f8:1c1a:88e8::1" && pass "AAAA www ok"|| fail "AAAA www mismatch"

echo "— Checking MX (Google) —"
MX="$(dig +short MX $DOMAIN | sort -n)"
echo "$MX" | grep -q "1 ASPMX.L.GOOGLE.COM"   || fail "MX priority 1 missing"
echo "$MX" | grep -q "5 ALT1.ASPMX.L.GOOGLE.COM" || fail "MX alt1 missing"
echo "$MX" | grep -q "5 ALT2.ASPMX.L.GOOGLE.COM" || fail "MX alt2 missing"
echo "$MX" | grep -q "10 ALT3.ASPMX.L.GOOGLE.COM" || fail "MX alt3 missing"
echo "$MX" | grep -q "10 ALT4.ASPMX.L.GOOGLE.COM" || fail "MX alt4 missing"
pass "MX records ok"

echo "— Checking SPF —"
dig +short TXT $DOMAIN | tr -d '"' | grep -q "v=spf1 include:_spf.google.com" && pass "SPF ok" || fail "SPF missing"

echo "— Checking DMARC —"
dig +short TXT _dmarc.$DOMAIN | tr -d '"' | grep -q "^v=DMARC1" && pass "DMARC ok" || fail "DMARC missing"

echo "— Checking DKIM (google._domainkey) —"
dig +short TXT google._domainkey.$DOMAIN >/dev/null 2>&1 && pass "DKIM record exists" || echo "⚠️ Add DKIM from Google Admin when ready"

echo "— Checking CAA (LE) —"
dig +short CAA $DOMAIN | grep -q "letsencrypt.org" && pass "CAA ok" || echo "⚠️ CAA for LE not found (optional)"

echo "All checks passed (or noted)."
