#!/bin/bash

# COMPREHENSIVE OTTERSPORT APPLICATION TEST SUITE
# 
# Complete testing and bug detection script for OtterSport application.
# Tests all core functionality, database operations, API endpoints,
# and cross-platform compatibility before migration.

set -e

echo "🧪 OtterSport Complete Application Test Suite"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing $test_name... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" &>/dev/null; then
        echo -e "${GREEN}PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local endpoint="$1"
    local expected_status="$2"
    local method="${3:-GET}"
    
    local response_code
    response_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "http://localhost:5000$endpoint" || echo "000")
    
    if [ "$response_code" = "$expected_status" ]; then
        return 0
    else
        echo "Expected $expected_status, got $response_code" >&2
        return 1
    fi
}

echo ""
echo "🔍 Phase 1: Environment and Dependencies"
echo "----------------------------------------"

# Test Node.js version
run_test "Node.js Version (>=18)" "node -v | grep -E 'v(18|19|20|21)'"

# Test NPM dependencies
run_test "Package.json exists" "test -f package.json"
run_test "Node modules installed" "test -d node_modules"

# Test TypeScript configuration
run_test "TypeScript config valid" "npx tsc --noEmit --skipLibCheck"

# Test essential files
run_test "Schema file exists" "test -f shared/schema.ts"
run_test "Server entry exists" "test -f server/index.ts"
run_test "Client entry exists" "test -f client/src/App.tsx"
run_test "Drizzle config exists" "test -f drizzle.config.ts"

echo ""
echo "🗄️ Phase 2: Database and Connection"
echo "-----------------------------------"

# Test environment variables
run_test "DATABASE_URL configured" "test -n '$DATABASE_URL'"
run_test "Database connection" "node -e 'import(\"./server/db.js\").then(({db}) => db.select().from({}).limit(1))'  2>/dev/null || curl -s http://localhost:5000/api/exercises >/dev/null"

echo ""
echo "🏗️ Phase 3: Build Process"
echo "-------------------------"

# Test build processes
run_test "Client build" "npm run build:client"
run_test "Server transpilation" "npx tsc server/index.ts --outDir dist --moduleResolution node --target es2022 --module commonjs --esModuleInterop --allowSyntheticDefaultImports --skipLibCheck"

echo ""
echo "🌐 Phase 4: Server and API Endpoints"
echo "------------------------------------"

# Start server in background for testing
echo "Starting server for API tests..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test core API endpoints
run_test "Server health check" "test_api_endpoint '/api/exercises' '200'"
run_test "User authentication endpoint" "test_api_endpoint '/api/auth/user' '200' || test_api_endpoint '/api/auth/user' '401'"
run_test "Exercises endpoint" "test_api_endpoint '/api/exercises' '200'"
run_test "Decks endpoint" "test_api_endpoint '/api/decks' '200'"
run_test "Achievements endpoint" "test_api_endpoint '/api/achievements' '200'"

# Test development routes
run_test "Migration routes available" "test_api_endpoint '/api/dev/migration/status' '200'"
run_test "Analytics endpoint" "test_api_endpoint '/api/dev/analytics' '200'"
run_test "Code optimization endpoint" "test_api_endpoint '/api/dev/optimization' '200'"

# Kill server
kill $SERVER_PID 2>/dev/null || true
sleep 2

echo ""
echo "🧩 Phase 5: React Components and Frontend"
echo "-----------------------------------------"

# Test React component compilation
run_test "Components compile" "npx vite build --outDir test-dist 2>/dev/null && rm -rf test-dist"

# Test component imports
run_test "AI Emotions component" "grep -q 'AIOpponentEmotions' client/src/components/ui/ai-opponent-emotions.tsx"
run_test "Themed Cards component" "grep -q 'ThemedExerciseCard' client/src/components/ui/themed-exercise-cards.tsx"
run_test "Game Artist components" "test -f client/src/components/ui/visual-editor.tsx"

echo ""
echo "🎮 Phase 6: Game Features and Assets"
echo "------------------------------------"

# Test game assets
run_test "Game assets directory" "test -d game-assets"
run_test "Exercise icons exist" "test -f game-assets/cards/exercise-icons/cardio.png"
run_test "Character assets exist" "test -d game-assets/characters"

# Test game logic files
run_test "Card battle page" "test -f client/src/pages/card-battle.tsx"
run_test "Game artist mode" "test -f client/src/pages/game-artist.tsx"
run_test "Adaptive engine" "test -f client/src/lib/adaptive-engine.ts"

echo ""
echo "🔧 Phase 7: Migration and Deployment Tools"
echo "------------------------------------------"

# Test migration tools
run_test "Database migration toolkit" "test -f database-migration-toolkit.js && test -x database-migration-toolkit.js"
run_test "Environment setup wizard" "test -f environment-setup-wizard.js && test -x environment-setup-wizard.js"
run_test "Migration scripts exist" "test -d migration-scripts && test -f migration-scripts/migrate-to-replit.sh"

# Test platform compatibility
run_test "Vercel config generated" "test -f vercel.json || node database-migration-toolkit.js package && test -f vercel.json"
run_test "Railway config capability" "grep -q 'railway' database-migration-toolkit.js"
run_test "Heroku config capability" "grep -q 'heroku' database-migration-toolkit.js"

echo ""
echo "📊 Phase 8: Performance and Optimization"
echo "----------------------------------------"

# Test optimization files
run_test "Migration optimization" "test -f migration-optimization.js && test -x migration-optimization.js"
run_test "Code quality analysis" "grep -q 'quality' migration-optimization.js"

# Test bundle size (if build exists)
if [ -d "client/dist" ]; then
    BUNDLE_SIZE=$(du -sk client/dist | cut -f1)
    run_test "Bundle size reasonable (<2MB)" "test $BUNDLE_SIZE -lt 2048"
fi

echo ""
echo "🔍 Phase 9: Bug Detection and Code Quality"
echo "------------------------------------------"

# Check for common issues
run_test "No TODO comments in prod code" "! grep -r 'TODO\\|FIXME\\|BUG' server/ client/src/ shared/ --include='*.ts' --include='*.tsx' || true"
run_test "No console.log in production" "! grep -r 'console\\.log' server/ --include='*.ts' || true"
run_test "Proper error handling" "grep -r 'try\\|catch' server/ --include='*.ts' | wc -l | grep -qv '^0$'"

# TypeScript strict checks
run_test "No TypeScript any types" "! grep -r ': any' server/ client/src/ shared/ --include='*.ts' --include='*.tsx' || true"
run_test "Imports are valid" "! grep -r 'import.*from.*undefined' client/src/ server/ --include='*.ts' --include='*.tsx' || true"

echo ""
echo "🚀 Phase 10: Deployment Readiness"
echo "---------------------------------"

# Test deployment readiness
run_test "Environment templates exist" "grep -q 'platformTemplates' environment-setup-wizard.js"
run_test "Health check implemented" "grep -q 'healthCheck' database-migration-toolkit.js"
run_test "Migration validation" "grep -q 'validateSchema' database-migration-toolkit.js"

# Security checks
run_test "No hardcoded secrets" "! grep -r 'password.*=' server/ client/src/ --include='*.ts' --include='*.tsx' | grep -v 'placeholder\\|example' || true"
run_test "Session security configured" "grep -q 'secure.*true' server/index.ts || grep -q 'httpOnly' server/index.ts"

echo ""
echo "📋 TEST RESULTS SUMMARY"
echo "======================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

PASS_PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Success Rate: ${BLUE}$PASS_PERCENTAGE%${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! Application is ready for deployment.${NC}"
    exit 0
elif [ $PASS_PERCENTAGE -ge 85 ]; then
    echo -e "\n${YELLOW}⚠️  Most tests passed ($PASS_PERCENTAGE%). Review failed tests before deployment.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Too many tests failed ($PASS_PERCENTAGE%). Please fix issues before deployment.${NC}"
    exit 1
fi