#!/usr/bin/env bash
# Builds the PDFs.
# - pdf/resume.pdf, pdf/portfolio.pdf: public copies served by the site's download button (no phone number)
# - 이영주_이력서.pdf, 이영주_포트폴리오.pdf: private copies with the phone number from private.js (gitignored)
set -euo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
ROOT="$(cygpath -m "$PWD" 2>/dev/null || pwd)"

print_pdf() { # $1 = html file, $2 = output pdf
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$ROOT/$2" "file:///$ROOT/$1" 2>/dev/null
  echo "$2: $(grep -a -o '/Count [0-9]*' "$2" | awk '{print $2}' | sort -n | tail -1) pages"
}

# Private copies (phone number filled in by private.js, if present)
print_pdf index.html 이영주_이력서.pdf
print_pdf portfolio.html 이영주_포트폴리오.pdf

# Public copies: hide private.js so the phone number is never rendered
mkdir -p pdf
if [ -f private.js ]; then mv private.js private.js.off; trap 'mv private.js.off private.js' EXIT; fi
print_pdf index.html pdf/resume.pdf
print_pdf portfolio.html pdf/portfolio.pdf
