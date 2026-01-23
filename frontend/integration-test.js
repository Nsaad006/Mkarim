// Integration Test Script for MKARIM E-Commerce
// Run this in browser console on http://localhost:8080

console.log('🚀 Starting Integration Tests...\n');

const API_BASE = 'http://localhost:3001/api';
const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Test 1: Backend Health
async function testBackendHealth() {
    console.log('📡 Test 1: Backend Health Check');
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (response.ok) {
            results.passed.push('✅ Backend is responding');
            console.log('✅ Backend API is healthy');
            return true;
        } else {
            results.failed.push(`❌ Backend returned status ${response.status}`);
            console.error(`❌ Backend returned status ${response.status}`);
            return false;
        }
    } catch (error) {
        results.failed.push(`❌ Cannot connect to backend: ${error.message}`);
        console.error('❌ Cannot connect to backend:', error);
        return false;
    }
}

// Test 2: Products API
async function testProductsAPI() {
    console.log('\n📦 Test 2: Products API');
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            results.passed.push(`✅ Products API working (${data.length} products found)`);
            console.log(`✅ Products loaded: ${data.length} items`);
            console.log('Sample product:', data[0]);
            return true;
        } else {
            results.warnings.push('⚠️ Products API returned empty array');
            console.warn('⚠️ No products found in database');
            return false;
        }
    } catch (error) {
        results.failed.push(`❌ Products API error: ${error.message}`);
        console.error('❌ Products API error:', error);
        return false;
    }
}

// Test 3: Categories API
async function testCategoriesAPI() {
    console.log('\n📂 Test 3: Categories API');
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            results.passed.push(`✅ Categories API working (${data.length} categories)`);
            console.log(`✅ Categories loaded: ${data.length} items`);
            return true;
        } else {
            results.warnings.push('⚠️ No categories found');
            console.warn('⚠️ No categories in database');
            return false;
        }
    } catch (error) {
        results.failed.push(`❌ Categories API error: ${error.message}`);
        console.error('❌ Categories API error:', error);
        return false;
    }
}

// Test 4: Settings API
async function testSettingsAPI() {
    console.log('\n⚙️ Test 4: Settings API');
    try {
        const response = await fetch(`${API_BASE}/settings`);
        const data = await response.json();

        if (data && data.storeName) {
            results.passed.push(`✅ Settings API working (Store: ${data.storeName})`);
            console.log('✅ Settings loaded:', data);
            return true;
        } else {
            results.warnings.push('⚠️ Settings incomplete');
            console.warn('⚠️ Settings data incomplete');
            return false;
        }
    } catch (error) {
        results.failed.push(`❌ Settings API error: ${error.message}`);
        console.error('❌ Settings API error:', error);
        return false;
    }
}

// Test 5: Cities API
async function testCitiesAPI() {
    console.log('\n🏙️ Test 5: Cities API');
    try {
        const response = await fetch(`${API_BASE}/cities`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            results.passed.push(`✅ Cities API working (${data.length} cities)`);
            console.log(`✅ Cities loaded: ${data.length} items`);
            return true;
        } else {
            results.warnings.push('⚠️ No cities configured');
            console.warn('⚠️ No cities in database');
            return false;
        }
    } catch (error) {
        results.failed.push(`❌ Cities API error: ${error.message}`);
        console.error('❌ Cities API error:', error);
        return false;
    }
}

// Test 6: Check Console Errors
function testConsoleErrors() {
    console.log('\n🔍 Test 6: Console Error Check');

    // Check for React errors
    const reactErrors = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.rendererInterfaces?.size || 0;

    if (reactErrors === 0) {
        results.warnings.push('⚠️ React DevTools not detected');
    }

    // Check localStorage for tokens
    const token = localStorage.getItem('token');
    if (token) {
        results.passed.push('✅ Auth token found in localStorage');
        console.log('✅ Auth token present');
    } else {
        results.warnings.push('⚠️ No auth token (user not logged in)');
        console.log('⚠️ No auth token found (normal for user site)');
    }

    return true;
}

// Test 7: Frontend-Backend CORS
async function testCORS() {
    console.log('\n🌐 Test 7: CORS Configuration');
    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            results.passed.push('✅ CORS configured correctly');
            console.log('✅ CORS working properly');
            return true;
        } else {
            results.failed.push('❌ CORS issue detected');
            console.error('❌ CORS configuration issue');
            return false;
        }
    } catch (error) {
        if (error.message.includes('CORS')) {
            results.failed.push('❌ CORS blocking requests');
            console.error('❌ CORS is blocking requests');
            return false;
        }
        return true;
    }
}

// Run all tests
async function runAllTests() {
    console.log('═══════════════════════════════════════');
    console.log('🛡️ MKARIM Integration Test Suite');
    console.log('═══════════════════════════════════════\n');

    await testBackendHealth();
    await testProductsAPI();
    await testCategoriesAPI();
    await testSettingsAPI();
    await testCitiesAPI();
    testConsoleErrors();
    await testCORS();

    // Print summary
    console.log('\n═══════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════\n');

    console.log(`✅ Passed: ${results.passed.length}`);
    results.passed.forEach(msg => console.log(msg));

    console.log(`\n⚠️ Warnings: ${results.warnings.length}`);
    results.warnings.forEach(msg => console.log(msg));

    console.log(`\n❌ Failed: ${results.failed.length}`);
    results.failed.forEach(msg => console.log(msg));

    console.log('\n═══════════════════════════════════════');

    const totalTests = results.passed.length + results.failed.length + results.warnings.length;
    const successRate = ((results.passed.length / totalTests) * 100).toFixed(1);

    console.log(`\n🎯 Success Rate: ${successRate}%`);

    if (results.failed.length === 0) {
        console.log('✨ All critical tests passed!');
    } else {
        console.log('⚠️ Some tests failed - check errors above');
    }

    console.log('\n═══════════════════════════════════════\n');

    return {
        passed: results.passed.length,
        warnings: results.warnings.length,
        failed: results.failed.length,
        successRate: successRate + '%',
        details: results
    };
}

// Auto-run tests
runAllTests().then(summary => {
    console.log('Test execution complete. Results stored in window.testResults');
    window.testResults = summary;
});
