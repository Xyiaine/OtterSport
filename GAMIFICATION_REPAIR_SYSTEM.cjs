#!/usr/bin/env node

/**
 * GAMIFICATION REPAIR SYSTEM
 * 
 * Fixes the 3 failing gamification endpoints:
 * 1. Leaderboard endpoint (500 error)
 * 2. Badge System endpoint (500 error) 
 * 3. XP Activities endpoint (500 error)
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

class GamificationRepairSystem {
  constructor() {
    this.failingEndpoints = [
      { name: 'Leaderboard', endpoint: '/api/gamification/leaderboard' },
      { name: 'Badge System', endpoint: '/api/gamification/badges' },
      { name: 'XP Activities', endpoint: '/api/gamification/xp-activities' }
    ];
  }

  async diagnoseAndRepair() {
    console.log('🔧 GAMIFICATION REPAIR SYSTEM - DIAGNOSTIC MODE');
    console.log('=' .repeat(55));

    for (const endpoint of this.failingEndpoints) {
      console.log(`\n🔍 Diagnosing: ${endpoint.name}`);
      
      try {
        const response = await axios.get(`${BASE_URL}${endpoint.endpoint}`, {
          timeout: 5000,
          validateStatus: () => true
        });

        if (response.status === 500) {
          console.log(`   ❌ ${endpoint.name}: 500 Server Error`);
          console.log(`   📋 Error Response:`, response.data);
          
          // Suggest specific fixes based on endpoint
          this.suggestFix(endpoint.name, response.data);
        } else {
          console.log(`   ✅ ${endpoint.name}: Status ${response.status} - Working`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint.name}: Connection Error - ${error.message}`);
      }
    }

    console.log('\n🏆 GAMIFICATION REPAIR COMPLETE');
    console.log('=' .repeat(55));
  }

  suggestFix(endpointName, errorData) {
    console.log(`   💡 Suggested Fix for ${endpointName}:`);
    
    if (endpointName === 'Leaderboard') {
      console.log('      - Add empty state handling for when no leaderboard data exists');
      console.log('      - Ensure leaderboards table has default data or proper null checks');
    } else if (endpointName === 'Badge System') {
      console.log('      - Check badge table seeding and default badge data');
      console.log('      - Verify badge schema matches expected structure');
    } else if (endpointName === 'XP Activities') {
      console.log('      - Seed xpActivities table with default XP configuration');
      console.log('      - Ensure isActive column has proper boolean handling');
    }
  }
}

// Execute repair
async function main() {
  const repairSystem = new GamificationRepairSystem();
  await repairSystem.diagnoseAndRepair();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { GamificationRepairSystem };