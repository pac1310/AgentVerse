#!/bin/bash

echo "Preparing for Zeabur deployment..."

# Check if Git is installed
if ! command -v git &> /dev/null; then
  echo "Git is not installed. Please install Git before deploying."
  exit 1
fi

# Check if current directory is a Git repository
if [ ! -d .git ]; then
  echo "Current directory is not a Git repository. Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit for Zeabur deployment"
fi

# Check if we're on the main branch, create if not
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Not on main branch. Creating main branch..."
  git checkout -b main
  git add .
  git commit -m "Switch to main branch for Zeabur deployment"
fi

# Check if GitHub CLI is installed for repo creation
if command -v gh &> /dev/null; then
  echo "GitHub CLI detected. Do you want to create a GitHub repository? (y/n)"
  read -r create_repo
  if [ "$create_repo" = "y" ]; then
    echo "Enter GitHub repository name:"
    read -r repo_name
    gh repo create "$repo_name" --public --source=. --push
    echo "GitHub repository created and code pushed."
  fi
else
  echo "GitHub CLI not found. Please manually push your code to GitHub."
  echo "Instructions:"
  echo "1. Create a repository on GitHub"
  echo "2. Add the remote with: git remote add origin <repository-url>"
  echo "3. Push your code with: git push -u origin main"
fi

# Install Zeabur CLI if available
if command -v npm &> /dev/null; then
  echo "Do you want to install Zeabur CLI? (y/n)"
  read -r install_cli
  if [ "$install_cli" = "y" ]; then
    npm install -g @zeabur/cli
    echo "Zeabur CLI installed. You can now deploy using 'zeabur deploy'."
  fi
fi

echo "Deployment preparation complete!"
echo ""
echo "To deploy to Zeabur:"
echo "1. Visit https://zeabur.com and sign in"
echo "2. Create a new project"
echo "3. Click 'Deploy service' and select your GitHub repository"
echo "4. Zeabur will automatically detect and deploy your Vite application"
echo ""
echo "Your application is configured for Zeabur deployment with:"
echo "- Build command: npm run build"
echo "- Start command: npx serve -s dist"
echo "- Output directory: dist" 