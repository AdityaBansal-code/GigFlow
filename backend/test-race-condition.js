import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

async function testRaceCondition() {
  console.log('🧪 Testing Race Condition Protection...\n');

  const gigId = 'your_gig_id_here';
  const bidId1 = 'your_bid_id_1_here';
  const bidId2 = 'your_bid_id_2_here';
  
  const cookie = 'your_jwt_cookie_here';

  try {
    console.log('⏰ Firing two hire requests simultaneously...');
    
    const [response1, response2] = await Promise.allSettled([
      axios.patch(`${BASE_URL}/bids/${bidId1}/hire`, {}, {
        headers: { Cookie: cookie },
        timeout: 5000
      }),
      axios.patch(`${BASE_URL}/bids/${bidId2}/hire`, {}, {
        headers: { Cookie: cookie },
        timeout: 5000
      })
    ]);

    console.log('\n📊 Results:');
    console.log('Request 1:', response1.status === 'fulfilled' ? '✅ SUCCESS' : '❌ FAILED');
    console.log('Request 2:', response2.status === 'fulfilled' ? '✅ SUCCESS' : '❌ FAILED');

    if (response1.status === 'fulfilled' && response2.status === 'fulfilled') {
      console.log('\n🚨 RACE CONDITION DETECTED!');
      console.log('Both requests succeeded - this should not happen!');
    } else {
      console.log('\n🛡️ RACE CONDITION PROTECTED!');
      console.log('Only one request succeeded - transactions working correctly!');
    }

    if (response1.status === 'fulfilled') {
      console.log('\nRequest 1 Response:', response1.value.data.message);
    } else {
      console.log('\nRequest 1 Error:', response1.reason.response?.data?.message || response1.reason.message);
    }

    if (response2.status === 'fulfilled') {
      console.log('Request 2 Response:', response2.value.data.message);
    } else {
      console.log('Request 2 Error:', response2.reason.response?.data?.message || response2.reason.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

console.log(`
🧪 RACE CONDITION TEST INSTRUCTIONS:

1. Start your backend server: npm run dev
2. Create a gig and get 2 bids on it
3. Update the IDs in this file:
   - gigId: The gig that has the bids
   - bidId1: First bid ID
   - bidId2: Second bid ID
   - cookie: Your JWT cookie (from browser dev tools)

4. Run this test: node test-race-condition.js

EXPECTED RESULTS:
- WITHOUT transactions: Both might succeed (bad!)
- WITH transactions: Only one succeeds (good!)

Current status: ${process.argv.includes('--run') ? 'RUNNING TEST...' : 'READY TO RUN'}
`);

if (process.argv.includes('--run')) {
  testRaceCondition();
}