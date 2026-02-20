const { chromium } = require('playwright');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

/**
 * Comprehensive Performance Testing Script
 * Tests Core Web Vitals, performance metrics, and optimization opportunities
 */

async function performanceTest() {
  console.log('🚀 Starting Performance Battle Testing...\n');

  const results = {
    lighthouse: null,
    coreWebVitals: {},
    pageSpeed: {},
    webPageTest: {},
    issues: [],
    recommendations: []
  };

  try {
    // 1. Lighthouse Performance Audit
    console.log('📊 Running Lighthouse Performance Audit...');
    const lighthouseResult = await runLighthouse();
    results.lighthouse = lighthouseResult.lhr;
    
    // Extract Core Web Vitals
    const vitals = lighthouseResult.lhr.audits;
    results.coreWebVitals = {
      lcp: vitals['largest-contentful-paint']?.numericValue,
      fid: vitals['max-potential-fid']?.numericValue,
      cls: vitals['cumulative-layout-shift']?.numericValue,
      fcp: vitals['first-contentful-paint']?.numericValue,
      ttfb: vitals['server-response-time']?.numericValue
    };

    // 2. Core Web Vitals Assessment
    console.log('🎯 Assessing Core Web Vitals...');
    assessCoreWebVitals(results.coreWebVitals, results);

    // 3. Performance Budget Analysis
    console.log('💰 Analyzing Performance Budget...');
    analyzePerformanceBudget(lighthouseResult.lhr, results);

    // 4. Resource Loading Analysis
    console.log('📦 Analyzing Resource Loading...');
    analyzeResourceLoading(lighthouseResult.lhr, results);

    // 5. Cross-browser Performance Test
    console.log('🌐 Testing Cross-browser Performance...');
    await testCrossBrowserPerformance(results);

    // 6. Mobile Performance Test
    console.log('📱 Testing Mobile Performance...');
    await testMobilePerformance(results);

    // Generate Report
    generatePerformanceReport(results);

  } catch (error) {
    console.error('❌ Performance test failed:', error);
    results.issues.push(`Performance test error: ${error.message}`);
  }

  return results;
}

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
    settings: {
      emulatedFormFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      }
    }
  };

  try {
    const runnerResult = await lighthouse('http://localhost:3000', options);
    await chrome.kill();
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

function assessCoreWebVitals(vitals, results) {
  const thresholds = {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 }
  };

  Object.entries(vitals).forEach(([metric, value]) => {
    if (!value) return;
    
    const threshold = thresholds[metric];
    let status = 'GOOD';
    
    if (value > threshold.needsImprovement) {
      status = 'POOR';
      results.issues.push(`${metric.toUpperCase()} is ${value.toFixed(0)}ms - Needs improvement (target: <${threshold.needsImprovement}ms)`);
      results.recommendations.push(`Optimize ${metric} - consider lazy loading, code splitting, or server optimization`);
    } else if (value > threshold.good) {
      status = 'NEEDS_IMPROVEMENT';
      results.recommendations.push(`Consider optimizing ${metric} for better user experience`);
    }
    
    console.log(`   ${metric.toUpperCase()}: ${value.toFixed(0)}ms [${status}]`);
  });
}

function analyzePerformanceBudget(lhr, results) {
  const resourceSummary = lhr.audits['resource-summary'];
  const totalSize = resourceSummary?.details?.items?.reduce((sum, item) => sum + item.size, 0) || 0;
  
  console.log(`   Total Page Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalSize > 3 * 1024 * 1024) { // 3MB
    results.issues.push(`Page size ${(totalSize / 1024 / 1024).toFixed(2)}MB exceeds recommended 3MB`);
    results.recommendations.push('Optimize images, enable compression, and implement lazy loading');
  } else if (totalSize > 1.5 * 1024 * 1024) { // 1.5MB
    results.recommendations.push('Consider optimizing page size for better performance');
  }

  // Analyze resource types
  const resources = resourceSummary?.details?.items || [];
  const resourceTypes = {};
  
  resources.forEach(resource => {
    if (!resourceTypes[resource.resourceType]) {
      resourceTypes[resource.resourceType] = { count: 0, size: 0 };
    }
    resourceTypes[resource.resourceType].count++;
    resourceTypes[resource.resourceType].size += resource.size;
  });

  Object.entries(resourceTypes).forEach(([type, data]) => {
    const sizeMB = (data.size / 1024 / 1024).toFixed(2);
    console.log(`   ${type}: ${data.count} files, ${sizeMB} MB`);
    
    if (type === 'image' && data.size > 1024 * 1024) { // 1MB images
      results.recommendations.push('Optimize images - consider WebP format and compression');
    }
    
    if (type === 'script' && data.count > 10) {
      results.recommendations.push('Consider bundling JavaScript files to reduce HTTP requests');
    }
  });
}

function analyzeResourceLoading(lhr, results) {
  const networkRequests = lhr.audits['network-requests']?.details?.items || [];
  
  // Check for slow resources
  const slowResources = networkRequests.filter(req => 
    req.finished && req.finished > 2000 // 2 seconds
  );
  
  if (slowResources.length > 0) {
    results.issues.push(`${slowResources.length} resources take >2s to load`);
    slowResources.forEach(req => {
      console.log(`   Slow resource: ${req.url} (${req.finished.toFixed(0)}ms)`);
    });
  }

  // Check for large resources
  const largeResources = networkRequests.filter(req => 
    req.resourceSize && req.resourceSize > 1024 * 1024 // 1MB
  );
  
  if (largeResources.length > 0) {
    results.issues.push(`${largeResources.length} resources are >1MB`);
    largeResources.forEach(req => {
      console.log(`   Large resource: ${req.url} (${(req.resourceSize / 1024 / 1024).toFixed(2)}MB)`);
    });
  }

  // Check for render-blocking resources
  const renderBlockingResources = networkRequests.filter(req => 
    req.renderBlocking
  );
  
  if (renderBlockingResources.length > 0) {
    results.recommendations.push(`${renderBlockingResources.length} render-blocking resources found - consider async/defer loading`);
  }
}

async function testCrossBrowserPerformance(results) {
  const browsers = ['chromium', 'firefox', 'webkit'];
  const browserResults = {};
  
  for (const browserType of browsers) {
    try {
      console.log(`   Testing ${browserType}...`);
      const browser = await chromium[browserType]().launch();
      const page = await browser.newPage();
      
      const startTime = Date.now();
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      browserResults[browserType] = { loadTime, success: true };
      console.log(`     ${browserType}: ${loadTime}ms`);
      
      await browser.close();
    } catch (error) {
      browserResults[browserType] = { loadTime: null, success: false, error: error.message };
      console.log(`     ${browserType}: FAILED - ${error.message}`);
    }
  }
  
  results.crossBrowser = browserResults;
}

async function testMobilePerformance(results) {
  try {
    console.log('   Testing mobile viewport...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }, // iPhone 8
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    const page = await context.newPage();
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const mobileLoadTime = Date.now() - startTime;
    
    // Check mobile-specific issues
    const horizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    if (horizontalScroll) {
      results.issues.push('Horizontal scroll detected on mobile - fix responsive design');
    }
    
    results.mobile = { loadTime: mobileLoadTime, horizontalScroll };
    console.log(`   Mobile load time: ${mobileLoadTime}ms`);
    console.log(`   Horizontal scroll: ${horizontalScroll ? 'YES ❌' : 'NO ✅'}`);
    
    await browser.close();
  } catch (error) {
    results.mobile = { loadTime: null, error: error.message };
    console.log(`   Mobile test failed: ${error.message}`);
  }
}

function generatePerformanceReport(results) {
  console.log('\n📋 PERFORMANCE TEST REPORT');
  console.log('='.repeat(50));
  
  // Core Web Vitals Summary
  console.log('\n🎯 Core Web Vitals:');
  Object.entries(results.coreWebVitals).forEach(([metric, value]) => {
    if (value) {
      const status = getVitalStatus(metric, value);
      console.log(`   ${metric.toUpperCase()}: ${value.toFixed(0)}ms ${status}`);
    }
  });
  
  // Issues Summary
  if (results.issues.length > 0) {
    console.log('\n❌ Issues Found:');
    results.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  } else {
    console.log('\n✅ No critical issues found!');
  }
  
  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    results.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  // Overall Score
  const performanceScore = results.lighthouse?.categories?.performance?.score * 100 || 0;
  console.log(`\n📊 Overall Performance Score: ${performanceScore.toFixed(0)}/100`);
  
  if (performanceScore >= 90) {
    console.log('🟢 EXCELLENT - Ready for production!');
  } else if (performanceScore >= 70) {
    console.log('🟡 GOOD - Consider optimizations for better score');
  } else {
    console.log('🔴 NEEDS IMPROVEMENT - Address issues before production');
  }
  
  // Save detailed report
  const reportData = {
    timestamp: new Date().toISOString(),
    performanceScore,
    coreWebVitals: results.coreWebVitals,
    issues: results.issues,
    recommendations: results.recommendations,
    crossBrowser: results.crossBrowser,
    mobile: results.mobile
  };
  
  require('fs').writeFileSync(
    'performance-test-results.json',
    JSON.stringify(reportData, null, 2)
  );
  
  console.log('\n📄 Detailed report saved to: performance-test-results.json');
}

function getVitalStatus(metric, value) {
  const thresholds = {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 }
  };
  
  const threshold = thresholds[metric];
  if (value <= threshold.good) return '✅ GOOD';
  if (value <= threshold.needsImprovement) return '⚠️ NEEDS IMPROVEMENT';
  return '❌ POOR';
}

// Run the test
if (require.main === module) {
  performanceTest()
    .then(() => {
      console.log('\n🎉 Performance testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Performance testing failed:', error);
      process.exit(1);
    });
}

module.exports = { performanceTest };
