#!/bin/bash

# Complete OtterSport Application Test Suite
# Tests all functionality including API endpoints, database operations, and game mechanics

set -e

echo "🧪 Starting Complete OtterSport Application Test Suite"
echo "======================================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0

# Function to log test results
log_test() {
    local test_name="$1"
    local passed="$2"
    local details="$3"
    
    if [ "$passed" = "true" ]; then
        echo -e "${GREEN}[PASS]${NC} $test_name${details:+ - $details}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}[FAIL]${NC} $test_name${details:+ - $details}"
        ((TESTS_FAILED++))
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint="$1"
    local expected_status="$2"
    local test_name="$3"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        log_test "$test_name" "true" "HTTP $response"
    else
        log_test "$test_name" "false" "Expected $expected_status, got $response"
    fi
}

echo -e "\n${BLUE}🔍 TESTING API ENDPOINTS${NC}"
echo "=========================="

# Test basic endpoints
test_api "/api/exercises" "200" "Get All Exercises"
test_api "/api/decks" "200" "Get All Decks"
test_api "/api/decks/1" "200" "Get Deck with Exercises"
test_api "/api/decks/999" "404" "Get Non-existent Deck"
test_api "/api/auth/user" "401" "Get User (Unauthorized)"
test_api "/api/user/stats" "401" "Get User Stats (Unauthorized)"

echo -e "\n${BLUE}📊 TESTING DATA INTEGRITY${NC}"
echo "=========================="

# Test exercise data
EXERCISE_COUNT=$(curl -s http://localhost:5000/api/exercises | jq length)
if [ "$EXERCISE_COUNT" -gt 0 ]; then
    log_test "Exercise Data" "true" "$EXERCISE_COUNT exercises found"
else
    log_test "Exercise Data" "false" "No exercises found"
fi

# Test deck data
DECK_COUNT=$(curl -s http://localhost:5000/api/decks | jq length)
if [ "$DECK_COUNT" -gt 0 ]; then
    log_test "Deck Data" "true" "$DECK_COUNT decks found"
else
    log_test "Deck Data" "false" "No decks found"
fi

# Test deck-exercise relationships
DECK_WITH_EXERCISES=$(curl -s http://localhost:5000/api/decks/1 | jq '.exercises | length')
if [ "$DECK_WITH_EXERCISES" -gt 0 ]; then
    log_test "Deck-Exercise Relationships" "true" "$DECK_WITH_EXERCISES exercises in deck"
else
    log_test "Deck-Exercise Relationships" "false" "No exercises in deck"
fi

echo -e "\n${BLUE}⚡ TESTING PERFORMANCE${NC}"
echo "======================"

# Test response times
test_response_time() {
    local endpoint="$1"
    local test_name="$2"
    local max_time="$3"
    
    local start_time=$(date +%s%3N)
    curl -s "http://localhost:5000$endpoint" > /dev/null
    local end_time=$(date +%s%3N)
    local duration=$((end_time - start_time))
    
    if [ "$duration" -lt "$max_time" ]; then
        log_test "$test_name" "true" "${duration}ms"
    else
        log_test "$test_name" "false" "${duration}ms (exceeded ${max_time}ms limit)"
    fi
}

test_response_time "/api/exercises" "Get Exercises Performance" 500
test_response_time "/api/decks" "Get Decks Performance" 500
test_response_time "/api/decks/1" "Get Deck with Exercises Performance" 1000

echo -e "\n${BLUE}🎮 TESTING GAME MECHANICS${NC}"
echo "=========================="

# Test exercise categories
CATEGORIES=$(curl -s http://localhost:5000/api/exercises | jq -r '.[].category' | sort | uniq)
CATEGORY_COUNT=$(echo "$CATEGORIES" | wc -l)

if [ "$CATEGORY_COUNT" -ge 3 ]; then
    log_test "Exercise Categories" "true" "$CATEGORY_COUNT categories: $(echo $CATEGORIES | tr '\n' ', ')"
else
    log_test "Exercise Categories" "false" "Only $CATEGORY_COUNT categories found"
fi

# Test exercise difficulty levels
DIFFICULTIES=$(curl -s http://localhost:5000/api/exercises | jq -r '.[].difficulty' | sort | uniq)
DIFFICULTY_COUNT=$(echo "$DIFFICULTIES" | wc -l)

if [ "$DIFFICULTY_COUNT" -ge 3 ]; then
    log_test "Exercise Difficulty Levels" "true" "$DIFFICULTY_COUNT levels: $(echo $DIFFICULTIES | tr '\n' ', ')"
else
    log_test "Exercise Difficulty Levels" "false" "Only $DIFFICULTY_COUNT difficulty levels found"
fi

# Test card battle compatibility
FIRST_EXERCISE=$(curl -s http://localhost:5000/api/exercises | jq -r '.[0]')
HAS_REQUIRED_FIELDS=$(echo "$FIRST_EXERCISE" | jq 'has("name") and has("category") and has("difficulty")')

if [ "$HAS_REQUIRED_FIELDS" = "true" ]; then
    log_test "Card Battle Compatibility" "true" "Exercises have required fields"
else
    log_test "Card Battle Compatibility" "false" "Missing required fields"
fi

echo -e "\n${BLUE}🗄️ TESTING DATABASE OPTIMIZATION${NC}"
echo "================================="

# Test database push
if npm run db:push > /dev/null 2>&1; then
    log_test "Database Schema" "true" "Schema is up to date"
else
    log_test "Database Schema" "false" "Schema update failed"
fi

# Test environment variables
check_env_var() {
    local var_name="$1"
    if [ -n "${!var_name}" ]; then
        log_test "Environment Variable: $var_name" "true" "Set"
    else
        log_test "Environment Variable: $var_name" "false" "Not set"
    fi
}

check_env_var "DATABASE_URL"
check_env_var "PGHOST"
check_env_var "PGPORT"
check_env_var "PGUSER"
check_env_var "PGPASSWORD"
check_env_var "PGDATABASE"

echo -e "\n${BLUE}📱 TESTING FRONTEND COMPATIBILITY${NC}"
echo "==================================="

# Test static file serving
test_api "/" "200" "Frontend Index"
test_api "/src/main.tsx" "200" "Frontend Main Module"
test_api "/src/index.css" "200" "Frontend Styles"

# Test API route registration
API_ROUTES=$(curl -s http://localhost:5000/api/exercises | jq -r 'type')
if [ "$API_ROUTES" = "array" ]; then
    log_test "API Route Registration" "true" "Routes responding correctly"
else
    log_test "API Route Registration" "false" "Routes not responding as expected"
fi

echo -e "\n${BLUE}🚀 TESTING DEPLOYMENT READINESS${NC}"
echo "================================="

# Test production build compatibility
if [ -f "package.json" ]; then
    log_test "Package Configuration" "true" "package.json exists"
else
    log_test "Package Configuration" "false" "package.json missing"
fi

# Test TypeScript compilation
if npx tsc --noEmit > /dev/null 2>&1; then
    log_test "TypeScript Compilation" "true" "No type errors"
else
    log_test "TypeScript Compilation" "false" "Type errors found"
fi

# Test migration scripts
if [ -f "migrate-database.sh" ]; then
    log_test "Migration Scripts" "true" "Migration script available"
else
    log_test "Migration Scripts" "false" "Migration script missing"
fi

# Test environment template
if [ -f ".env.template" ]; then
    log_test "Environment Template" "true" "Environment template available"
else
    log_test "Environment Template" "false" "Environment template missing"
fi

echo -e "\n${BLUE}📊 TEST SUMMARY${NC}"
echo "================="

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
PASS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Pass Rate: ${GREEN}$PASS_RATE%${NC}"

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "\n${GREEN}✅ All tests passed! Application is ready for production deployment.${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Please review and fix issues before deployment.${NC}"
    exit 1
fi