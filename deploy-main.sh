#!/usr/bin/env bash
set -euo pipefail

# deploy-main.sh
# Clone the current changes from main into a temporary branch and merge dev into main.

REPO_DIR="$(pwd)"
MAIN_BRANCH="main"
DEV_BRANCH="dev"
TEMP_BRANCH="main-temp"

USE_COLOR=true
if [ ! -t 1 ] || ! command -v tput >/dev/null 2>&1; then
  USE_COLOR=false
fi

color() {
  if $USE_COLOR; then
    printf "\033[%sm" "$1"
  fi
}

reset_color() {
  if $USE_COLOR; then
    printf "\033[0m"
  fi
}

function echo_step {
  color "1;36"
  printf "\n==> %s\n" "$1"
  reset_color
}

function echo_info {
  color "1;34"
  printf "  %s\n" "$1"
  reset_color
}

function echo_success {
  color "1;32"
  printf "  %s\n" "$1"
  reset_color
}

function echo_warn {
  color "1;33"
  printf "  %s\n" "$1"
  reset_color
}

function ensure_branch_exists {
  local branch=$1
  if ! git show-ref --verify --quiet "refs/heads/$branch"; then
    echo_warn "Branch '$branch' does not exist locally. Fetching from origin..."
    git fetch origin "$branch":"$branch"
  fi
}

function sync_branch {
  local branch=$1
  echo_step "Checking out $branch and syncing with origin"
  ensure_branch_exists "$branch"
  git checkout "$branch"

  if [ -n "$(git status --porcelain)" ]; then
    echo_warn "Local changes detected on $branch; stashing before sync"
    git stash push -u -m "deploy-main auto-stash"
    echo_info "Local changes were stashed. Restore them with: git stash pop"
  else
    echo_info "No local changes on $branch."
  fi

  git reset --hard "origin/$branch"
  echo_success "$branch is now aligned with origin/$branch."
}

cd "$REPO_DIR"

echo_step "Fetching latest data from origin"
git fetch origin --prune

# Ensure main exists locally and is up to date.
sync_branch "$MAIN_BRANCH"

# Create or switch to the temporary branch for main.
if git show-ref --verify --quiet "refs/heads/$TEMP_BRANCH"; then
  echo "Temporary branch $TEMP_BRANCH already exists."
  git checkout "$TEMP_BRANCH"
else
  echo "Creating temporary branch $TEMP_BRANCH from $MAIN_BRANCH"
  git checkout -b "$TEMP_BRANCH"
fi

# Merge main into temp branch.
echo_step "Merging $MAIN_BRANCH into $TEMP_BRANCH"
git merge --no-ff "$MAIN_BRANCH" -m "Merge $MAIN_BRANCH into $TEMP_BRANCH for deployment prep"
echo_success "Temporary branch $TEMP_BRANCH now contains the latest main branch."

echo_step "Pushing $TEMP_BRANCH to origin"
git push origin "$TEMP_BRANCH" --force-with-lease
echo_success "Pushed $TEMP_BRANCH to origin with --force-with-lease."

# Ensure dev exists locally and is up to date.
sync_branch "$DEV_BRANCH"

# Merge dev into main branch.
echo_step "Merging $DEV_BRANCH into $MAIN_BRANCH"
git checkout "$MAIN_BRANCH"
git merge --no-ff -m "Merge dev into main" "$DEV_BRANCH"
echo_success "Merged $DEV_BRANCH into $MAIN_BRANCH."

# Push main branch to origin.
echo_step "Pushing $MAIN_BRANCH to origin"
git push origin "$MAIN_BRANCH"
echo_success "Pushed $MAIN_BRANCH to origin."

echo_step "Deployment preparation complete"
echo_success "main-temp contains the latest clone of main."
echo_success "main now includes merged changes from dev."
echo_info "Review the terminal output for any merge conflicts or stash notices."
