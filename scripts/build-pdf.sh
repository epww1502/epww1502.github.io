#!/usr/bin/env bash
# Builds the site, then prints the downloads from it. Run with: npm run pdf
# - public/pdf/*: public copies served by the download buttons (no phone number, committed)
# - 이영주_*.pdf / .docx in the repo root: private copies with the phone number from
#   public/private.js (both gitignored)
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
ROOT="$(cygpath -m "$PWD" 2>/dev/null || pwd)"
PORT="${PORT:-4199}"

npm run build

python -m http.server "$PORT" -d out --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
until curl -s -o /dev/null "http://127.0.0.1:$PORT/index.html"; do sleep 0.3; done

# ?pdf makes the page point its internal links at the live site (see app/layout.tsx)
print_pdf() { # $1 = page under out/, $2 = output pdf
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
    --print-to-pdf="$ROOT/$2" "http://127.0.0.1:$PORT/$1?pdf" 2>/dev/null
  echo "$2: $(grep -a -o '/Count [0-9]*' "$2" | awk '{print $2}' | sort -n | tail -1) pages"
}

# Private copies: out/private.js (copied from public/ by the build, if present) fills in the phone number
print_pdf index.html 이영주_이력서.pdf
print_pdf portfolio/print.html 이영주_포트폴리오.pdf
print_pdf career.html 이영주_경력기술서.pdf
python scripts/build-docx.py 이영주_경력기술서.docx --phone

# Public copies: remove private.js from the build so the phone number is never rendered
rm -f out/private.js
mkdir -p public/pdf
print_pdf index.html public/pdf/resume.pdf
print_pdf portfolio/print.html public/pdf/portfolio.pdf
print_pdf career.html public/pdf/career.pdf
python scripts/build-docx.py public/pdf/career.docx
