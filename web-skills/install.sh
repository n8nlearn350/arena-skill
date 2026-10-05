#!/usr/bin/env bash
# Install the web-building skill stack.
#
#   ./install.sh              install into ./.claude/skills  (this project)
#   ./install.sh --global     install into ~/.claude/skills  (every project)
#   ./install.sh --refresh    re-download the vendored skills from GitHub
#
# The vendored skills in ./skills are already complete and need no network.
# --refresh re-fetches them from upstream so you get the latest rules.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=".claude/skills"
REFRESH=0

for arg in "$@"; do
  case "$arg" in
    --global)  TARGET="$HOME/.claude/skills" ;;
    --refresh) REFRESH=1 ;;
    -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

if [ "$REFRESH" = "1" ]; then
  echo "Refreshing skills from upstream..."
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT

  git clone --depth 1 -q https://github.com/anthropics/skills.git          "$TMP/anthropic"
  git clone --depth 1 -q https://github.com/vercel-labs/agent-skills.git   "$TMP/vercel"
  git clone --depth 1 -q https://github.com/obra/superpowers.git           "$TMP/superpowers"
  git clone --depth 1 -q https://github.com/secondsky/claude-skills.git    "$TMP/secondsky"

  rm -rf "$HERE/skills"
  mkdir -p "$HERE/skills"

  cp -r "$TMP/anthropic/skills/frontend-design"       "$HERE/skills/"
  cp -r "$TMP/anthropic/skills/brand-guidelines"      "$HERE/skills/"
  cp -r "$TMP/anthropic/skills/web-artifacts-builder" "$HERE/skills/"
  cp -r "$TMP/vercel/skills/react-best-practices"     "$HERE/skills/vercel-react-best-practices"
  cp -r "$TMP/vercel/skills/web-design-guidelines"    "$HERE/skills/"
  cp -r "$TMP/vercel/skills/composition-patterns"     "$HERE/skills/"
  cp -r "$TMP/superpowers/skills/brainstorming"                  "$HERE/skills/"
  cp -r "$TMP/superpowers/skills/writing-plans"                  "$HERE/skills/"
  cp -r "$TMP/superpowers/skills/systematic-debugging"           "$HERE/skills/"
  cp -r "$TMP/superpowers/skills/verification-before-completion" "$HERE/skills/"

  for s in tailwind-v4-shadcn design-review design-system-creation \
           responsive-web-design mobile-first-design seo-optimizer interaction-design; do
    cp -r "$TMP/secondsky/plugins/$s/skills/$s" "$HERE/skills/" 2>/dev/null \
      || echo "  ! secondsky/$s not found upstream, skipped"
  done

  echo "Refreshed $(find "$HERE/skills" -name SKILL.md | wc -l) skills."
fi

mkdir -p "$TARGET"
count=0
for dir in "$HERE"/skills/*/; do
  name="$(basename "$dir")"
  # Don't overwrite a skill the user already has with the same name.
  if [ -e "$TARGET/$name" ]; then
    echo "  = $name (already installed, left alone)"
    continue
  fi
  cp -r "$dir" "$TARGET/$name"
  count=$((count + 1))
done

echo
echo "Installed $count skills into $TARGET"
echo "Restart Claude Code (or run /skills) to pick them up."
