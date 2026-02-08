#!/bin/bash
# Install LENS Workbench - Non-Interactive Script
# Usage: ./install-lens-work.sh [options]
# 
# Examples:
#   ./install-lens-work.sh                    # Interactive
#   ./install-lens-work.sh --auto             # Non-interactive with defaults
#   ./install-lens-work.sh --team "Dev Team"  # Non-interactive, custom team name
#   ./install-lens-work.sh --help             # Show help

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
INTERACTIVE=true
DIRECTORY="."
USER_NAME="${USER:-Development Team}"
LANGUAGE="English"
OUTPUT_FOLDER="_bmad-output"
TOOLS="none"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --auto)
      INTERACTIVE=false
      shift
      ;;
    --team)
      USER_NAME="$2"
      INTERACTIVE=false
      shift 2
      ;;
    --directory)
      DIRECTORY="$2"
      shift 2
      ;;
    --language)
      LANGUAGE="$2"
      shift 2
      ;;
    --output)
      OUTPUT_FOLDER="$2"
      shift 2
      ;;
    --tools)
      TOOLS="$2"
      shift 2
      ;;
    --help|-h)
      cat << EOF
Install LENS Workbench (lens-work) module for BMAD

Usage: ./install-lens-work.sh [options]

Options:
  --auto              Run non-interactive installation with defaults
  --team NAME         Team name for agent communication (implies --auto)
  --directory PATH    Installation directory (default: current directory)
  --language LANG     Communication language (default: English)
  --output PATH       Output folder path (default: _bmad-output)
  --tools TOOLS       Tool/IDE integration: none, claude-code, cursor, vscode
                      (default: none)
  --help, -h          Show this help message

Examples:
  # Interactive mode (default)
  ./install-lens-work.sh

  # Non-interactive with defaults
  ./install-lens-work.sh --auto

  # Non-interactive with team name
  ./install-lens-work.sh --team "Development Team"

  # Custom directory
  ./install-lens-work.sh --directory ~/projects/myapp --auto

  # With IDE integration
  ./install-lens-work.sh --auto --tools claude-code

EOF
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Verify prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check if directory exists
if [ ! -d "$DIRECTORY" ]; then
  echo -e "${RED}❌ Directory not found: $DIRECTORY${NC}"
  exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found. Please install Node.js v18+${NC}"
  exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm not found. Please install npm v9+${NC}"
  exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm ${NPM_VERSION}${NC}"

# Check for git
if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ Git not found. Please install Git${NC}"
  exit 1
fi

GIT_VERSION=$(git --version)
echo -e "${GREEN}✅ ${GIT_VERSION}${NC}"

# Check for BMAD
cd "$DIRECTORY"
if [ ! -d "_bmad" ]; then
  echo -e "${YELLOW}⚠️  BMAD directory not found. This may be a fresh installation.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites verified${NC}"
echo ""

# Build installation command
INSTALL_CMD="npx bmad-method install"
INSTALL_CMD="$INSTALL_CMD --directory $DIRECTORY"
INSTALL_CMD="$INSTALL_CMD --modules bmm,lens-work"
INSTALL_CMD="$INSTALL_CMD --tools $TOOLS"
INSTALL_CMD="$INSTALL_CMD --user-name \"$USER_NAME\""
INSTALL_CMD="$INSTALL_CMD --communication-language $LANGUAGE"
INSTALL_CMD="$INSTALL_CMD --document-output-language $LANGUAGE"
INSTALL_CMD="$INSTALL_CMD --output-folder $OUTPUT_FOLDER"

if [ "$INTERACTIVE" = false ]; then
  INSTALL_CMD="$INSTALL_CMD --yes"
fi

# Display installation plan
echo -e "${BLUE}📋 Installation Plan${NC}"
echo "────────────────────────────────────────"
echo -e "Directory:        ${YELLOW}$DIRECTORY${NC}"
echo -e "Modules:          ${YELLOW}bmm, lens-work${NC}"
echo -e "Team Name:        ${YELLOW}$USER_NAME${NC}"
echo -e "Tools:            ${YELLOW}$TOOLS${NC}"
echo -e "Language:         ${YELLOW}$LANGUAGE${NC}"
echo -e "Output Folder:    ${YELLOW}$OUTPUT_FOLDER${NC}"
echo -e "Mode:             ${YELLOW}$([ "$INTERACTIVE" = true ] && echo 'Interactive' || echo 'Non-Interactive')${NC}"
echo "────────────────────────────────────────"
echo ""

# Confirm installation (unless auto mode)
if [ "$INTERACTIVE" = true ]; then
  echo -e "${BLUE}Ready to begin installation?${NC}"
  read -p "Press Enter to proceed (Ctrl+C to cancel)..."
fi

echo ""
echo -e "${BLUE}🚀 Starting LENS Workbench installation...${NC}"
echo ""

# Run installation
eval "$INSTALL_CMD"

INSTALL_EXIT=$?

if [ $INSTALL_EXIT -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ LENS Workbench installation completed!${NC}"
  echo ""
  echo -e "${BLUE}📝 Next Steps:${NC}"
  echo "────────────────────────────────────────"
  echo "1. Verify installation:"
  echo -e "   ${YELLOW}ls _bmad/lens-work/${NC}"
  echo ""
  echo "2. Start using LENS (in VS Code Copilot Chat):"
  echo -e "   ${YELLOW}@compass help${NC}"
  echo ""
  echo "3. Create your first initiative:"
  echo -e "   ${YELLOW}#new-domain \"Your Domain Name\"${NC}"
  echo ""
  echo "4. Run bootstrap:"
  echo -e "   ${YELLOW}bootstrap${NC}"
  echo ""
  echo -e "For more info: ${YELLOW}cat _bmad/lens-work/README.md${NC}"
  echo "────────────────────────────────────────"
else
  echo ""
  echo -e "${RED}❌ Installation failed with exit code ${INSTALL_EXIT}${NC}"
  echo "Run installation with --debug flag for more details:"
  echo -e "   ${YELLOW}npx bmad-method install --debug${NC}"
  exit $INSTALL_EXIT
fi
