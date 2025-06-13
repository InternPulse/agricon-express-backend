# Contributing Guidelines

```bash
# Clone the repository
git clone https://github.com/InternPulse/agricon-express-backend.git
cd agricon-express-backend

# Pull the latest changes
git pull origin dev

# Install dependencies
npm install

```

###  Create Feature Branch
```bash
# For new features
git checkout -b feat/your-feature-name

# For bug fixes
git checkout -b fix/issue-description

# For documentation updates
git checkout -b docs/update-description

```

## Before Every Push - Quality Checks
```bash
npm run lint
npm run build
npm run test
```

# Staying in Sync
### Before pushing your changes, always sync with the latest dev branch:
```bash
git checkout dev
git pull origin dev
git checkout feat/your-feature-name
git merge dev
```

## Push your feature branch
```bash
git push origin feat/your-feature-name
```

# Branch Protection Rules
### NEVER push directly to dev branch
### NEVER push directly to main/master branch
### All changes must go through Pull Requests
### Pull requests require admin approval before merging


