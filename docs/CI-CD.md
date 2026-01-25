# CI/CD Pipeline Documentation

Complete guide to the continuous integration and deployment pipeline for THC Plus.

## Overview

The CI/CD pipeline ensures code quality, catches bugs early, and automates deployment. It runs automatically on every push and pull request.

**Pipeline Components:**
1. **GitHub Actions** - Automated workflows for testing, linting, and building
2. **Husky** - Git hooks for pre-commit and pre-push checks
3. **Lint-Staged** - Run linters only on staged files (faster commits)
4. **Lighthouse CI** - Automated performance audits

---

## GitHub Actions Workflows

### 1. Main CI Pipeline (.github/workflows/ci.yml)

**Triggers:** Push to `main` or `develop`, Pull Requests to `main` or `develop`

**Jobs:**
- **Lint and Type Check**
  - Run ESLint to catch code quality issues
  - Run TypeScript type checker (`tsc --noEmit`)
  - Fails if any linting or type errors

- **Unit Tests**
  - Run Vitest test suite
  - Generate coverage report
  - Enforce 85% coverage threshold
  - Upload coverage to Codecov (optional)

- **Build**
  - Build Next.js application
  - Verify no build errors
  - Check bundle sizes (TODO: add bundle analyzer)

**Duration:** ~3-5 minutes

**Example Output:**
```
✓ Lint and Type Check (45s)
✓ Unit Tests (1m 30s)
✓ Build (2m 15s)
All Checks Passed ✅
```

---

### 2. Playwright E2E Tests (.github/workflows/playwright.yml)

**Triggers:** Push to `main` or `develop`, Pull Requests to `main` or `develop`

**Jobs:**
- Install Playwright browsers (Chromium, Firefox, WebKit)
- Run E2E tests across all browsers
- Upload test reports on failure for debugging

**Duration:** ~2-3 minutes

**Artifacts:**
- Playwright HTML report (on failure)
- Test result screenshots and videos (on failure)

---

### 3. Lighthouse CI (.github/workflows/lighthouse.yml)

**Triggers:** Push to `main` or `develop`, Pull Requests to `main` or `develop`

**Jobs:**
- Build application in production mode
- Start Next.js server
- Run Lighthouse audits on key pages
- Fail if performance scores drop below thresholds

**Performance Budgets:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 95+
- LCP: < 2.5s
- CLS: < 0.1

**Duration:** ~4-5 minutes

---

## Git Hooks (Husky)

### Pre-Commit Hook (.husky/pre-commit)

**Triggers:** Before every `git commit`

**Actions:**
- Run lint-staged on staged files
- Format code with Prettier
- Lint with ESLint (auto-fix)
- Type check TypeScript files

**Duration:** 5-30 seconds (depends on number of staged files)

**Example:**
```bash
$ git commit -m "Add new feature"
✔ Preparing lint-staged...
✔ Running tasks for staged files...
  ✔ Running tasks for *.{ts,tsx,js,jsx}
    ✔ prettier --write
    ✔ eslint --fix
    ✔ tsc --noEmit
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main abc1234] Add new feature
```

---

### Pre-Push Hook (.husky/pre-push)

**Triggers:** Before every `git push`

**Actions:**
- Run full test suite (unit + E2E)
- Run type checking on entire codebase

**Duration:** 1-2 minutes

**Why?**
- Prevents pushing broken code to remote
- Ensures all tests pass before code review
- Catches integration issues early

---

## Lint-Staged Configuration (.lintstagedrc.js)

Optimizes pre-commit checks by only linting staged files.

**File Type Handlers:**

| File Types | Actions |
|------------|---------|
| `*.{ts,tsx,js,jsx}` | Prettier → ESLint → Type Check |
| `*.{json,md,yml,yaml}` | Prettier |
| `*.{css,scss}` | Prettier |
| `*.prisma` | Prisma Format |

**Benefits:**
- ✅ Faster commits (only checks changed files)
- ✅ Prevents committing unformatted code
- ✅ Catches type errors before commit
- ✅ Auto-fixes linting issues

---

## Lighthouse CI Configuration (lighthouserc.js)

**Audited Pages:**
- Homepage (`/`)
- Visit Us page (`/visit-us`)

**Performance Assertions:**
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 300ms
- Speed Index: < 3s

**Results Storage:**
- Uploaded to temporary public storage
- Accessible for 30 days
- Reports available as GitHub artifacts

---

## NPM Scripts

### Development Scripts
```bash
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
```

### Code Quality Scripts
```bash
npm run lint               # Run ESLint
npm run lint:fix           # Run ESLint with auto-fix
npm run format             # Format all files with Prettier
npm run format:check       # Check formatting without changing files
npm run type-check         # Run TypeScript type checker
```

### Testing Scripts
```bash
npm run test               # Run unit tests (watch mode)
npm run test:ui            # Open Vitest UI
npm run test:coverage      # Run tests with coverage report
npm run test:e2e           # Run Playwright E2E tests
npm run test:e2e:ui        # Open Playwright UI
npm run test:e2e:debug     # Debug E2E tests
```

### Database Scripts
```bash
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema changes to database
npm run db:studio          # Open Prisma Studio
```

### CI Scripts (used in GitHub Actions)
```bash
npm run ci:lint            # Lint + Type Check
npm run ci:test            # Coverage + E2E tests
npm run ci:build           # Production build
```

---

## Workflow Examples

### Making a Code Change

```bash
# 1. Create feature branch
git checkout -b feature/add-analytics

# 2. Make changes to code
# ...edit files...

# 3. Stage changes
git add src/lib/analytics.ts

# 4. Commit (triggers pre-commit hook)
git commit -m "Add analytics tracking"
# → Prettier formats code
# → ESLint checks for issues
# → TypeScript validates types
# ✅ Commit succeeds

# 5. Push (triggers pre-push hook)
git push origin feature/add-analytics
# → Runs all tests
# → Verifies type checking
# ✅ Push succeeds

# 6. Create Pull Request
# → GitHub Actions run automatically
# → CI pipeline validates changes
# → Lighthouse checks performance
# ✅ PR ready for review
```

---

### Debugging Failed CI

**If ESLint Fails:**
```bash
# Run ESLint locally
npm run lint

# Auto-fix issues
npm run lint:fix

# Commit fixes
git add .
git commit -m "Fix linting issues"
```

**If Type Check Fails:**
```bash
# Run type checker locally
npm run type-check

# Fix type errors in editor
# Commit fixes
git add .
git commit -m "Fix type errors"
```

**If Tests Fail:**
```bash
# Run tests locally
npm run test:coverage

# Debug specific test
npm run test:ui

# Fix failing tests
# Commit fixes
git add .
git commit -m "Fix failing tests"
```

**If Lighthouse Fails:**
```bash
# Run Lighthouse locally
npx lighthouse http://localhost:3000 --view

# Identify performance issues
# Optimize code (lazy loading, code splitting, etc.)
# Commit optimizations
git add .
git commit -m "Optimize performance"
```

---

## Bypassing Hooks (Emergency Only)

**Skip pre-commit hook:**
```bash
git commit --no-verify -m "Emergency fix"
```

**Skip pre-push hook:**
```bash
git push --no-verify
```

⚠️ **WARNING:** Only use `--no-verify` in emergencies. Bypassing hooks can introduce bugs and break CI.

---

## CI Environment Variables

GitHub Actions workflows use dummy environment variables for testing. Real credentials are not needed in CI for:
- Database connections (mocked)
- Email sending (not tested in CI)
- External APIs (stubbed)

**Required Secrets (optional):**
- `CODECOV_TOKEN` - Upload coverage reports to Codecov
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI GitHub integration

**To Add Secrets:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret name and value
4. Secrets are encrypted and hidden in logs

---

## Troubleshooting

### Issue: Pre-commit hook doesn't run

**Solution:**
```bash
# Reinstall Husky hooks
npm run prepare

# Make hooks executable (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Issue: Lint-staged fails with "No staged files match"

**Cause:** No files staged for commit

**Solution:**
```bash
# Stage files first
git add .

# Then commit
git commit -m "Your message"
```

### Issue: GitHub Actions fails but local tests pass

**Possible Causes:**
1. Environment variable differences
2. Node version mismatch
3. Missing dependencies
4. Different file paths (case sensitivity on Linux)

**Solution:**
```bash
# Match Node version in CI (see .github/workflows/ci.yml)
nvm use 20

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run CI scripts locally
npm run ci:lint
npm run ci:test
npm run ci:build
```

### Issue: Lighthouse CI fails inconsistently

**Cause:** Performance can vary based on CI runner load

**Solution:**
- Lighthouse runs 3 times and takes median
- If scores are borderline, optimize further
- Can adjust thresholds in `lighthouserc.js` if needed

---

## Best Practices

### 1. Commit Often, Push After Tests Pass
```bash
# Good: Small, frequent commits
git commit -m "Add user validation"
git commit -m "Add tests for validation"
git commit -m "Update docs"

# Run tests before push
npm run test
git push
```

### 2. Fix CI Immediately
- Don't let broken builds pile up
- Fix broken main/develop branch ASAP
- Other developers depend on working CI

### 3. Keep Tests Fast
- Unit tests should run in < 2 minutes
- E2E tests should run in < 5 minutes
- Slow tests reduce developer productivity

### 4. Monitor Performance
- Check Lighthouse reports regularly
- Don't let performance degrade over time
- Optimize heavy dependencies

### 5. Update Dependencies Regularly
```bash
# Check for outdated packages
npm outdated

# Update non-breaking changes
npm update

# Test after updates
npm run ci:test
```

---

## GitHub Actions Status Badges

Add to README.md:

```markdown
![CI](https://github.com/your-username/thcplus/actions/workflows/ci.yml/badge.svg)
![E2E Tests](https://github.com/your-username/thcplus/actions/workflows/playwright.yml/badge.svg)
![Lighthouse](https://github.com/your-username/thcplus/actions/workflows/lighthouse.yml/badge.svg)
```

---

## Next Steps

1. ✅ GitHub Actions workflows configured
2. ✅ Husky pre-commit/pre-push hooks set up
3. ✅ Lint-staged configured
4. ✅ Lighthouse CI configured
5. ⏳ Initialize Git repository (if not already done)
6. ⏳ Make first commit to test hooks
7. ⏳ Push to GitHub to test CI workflows
8. ⏳ Add GitHub secrets for Codecov (optional)
9. ⏳ Add status badges to README

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-Staged Documentation](https://github.com/okonet/lint-staged)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

**Status:** ✅ CI/CD pipeline complete and ready for use
