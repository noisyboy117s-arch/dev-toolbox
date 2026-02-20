const { performanceTest } = require('./performance-test');
const AdSenseComplianceChecker = require('./adsense-compliance-check');
const SecurityTester = require('./security-test');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Battle Testing Suite
 * Runs all tests and generates a unified report
 */

class BattleTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        overallStatus: 'PENDING',
        productionReady: false,
        adsenseReady: false,
        securityScore: 0,
        performanceScore: 0,
        complianceScore: 0
      },
      tests: {
        performance: null,
        security: null,
        adsense: null
      },
      recommendations: [],
      criticalIssues: [],
      blockers: []
    };
  }

  async runFullBattleTest(baseUrl = 'http://localhost:3000') {
    console.log('🚀 STARTING COMPREHENSIVE BATTLE TESTING');
    console.log('='.repeat(60));
    console.log(`📍 Testing URL: ${baseUrl}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);

    try {
      // 1. Performance Testing
      console.log('📊 PERFORMANCE TESTING');
      console.log('-'.repeat(30));
      this.results.tests.performance = await performanceTest();
      this.results.summary.performanceScore = this.results.tests.performance.lighthouse?.categories?.performance?.score * 100 || 0;

      // 2. Security Testing
      console.log('\n🔒 SECURITY TESTING');
      console.log('-'.repeat(30));
      const securityTester = new SecurityTester();
      this.results.tests.security = await securityTester.runSecurityAudit(baseUrl);
      this.results.summary.securityScore = this.results.tests.security.overall.score;

      // 3. AdSense Compliance Testing
      console.log('\n🎯 ADSENSE COMPLIANCE TESTING');
      console.log('-'.repeat(30));
      const adsenseChecker = new AdSenseComplianceChecker();
      this.results.tests.adsense = await adsenseChecker.runFullComplianceCheck(baseUrl);
      this.results.summary.complianceScore = this.results.tests.adsense.overall.score;

      // 4. Generate Unified Analysis
      console.log('\n🔍 ANALYZING RESULTS');
      console.log('-'.repeat(30));
      this.analyzeResults();

      // 5. Generate Final Report
      console.log('\n📋 GENERATING FINAL REPORT');
      console.log('-'.repeat(30));
      this.generateFinalReport();

      // 6. Save Comprehensive Report
      this.saveComprehensiveReport();

    } catch (error) {
      console.error('\n💥 Battle testing failed:', error);
      this.results.summary.overallStatus = 'ERROR';
      this.results.criticalIssues.push(`Battle testing error: ${error.message}`);
    }

    return this.results;
  }

  analyzeResults() {
    const perf = this.results.tests.performance;
    const sec = this.results.tests.security;
    const ads = this.results.tests.adsense;

    // Collect all critical issues
    this.results.criticalIssues = [
      ...(perf?.issues || []),
      ...(sec?.ssl?.issues || []),
      ...(sec?.vulnerabilities?.issues || []),
      ...(sec?.content?.issues || []),
      ...(ads?.content?.issues || []),
      ...(ads?.technical?.issues || []),
      ...(ads?.policy?.issues || [])
    ];

    // Collect all recommendations
    this.results.recommendations = [
      ...(perf?.recommendations || []),
      ...(sec?.ssl?.warnings || []),
      ...(sec?.headers?.warnings || []),
      ...(sec?.vulnerabilities?.warnings || []),
      ...(ads?.content?.warnings || []),
      ...(ads?.technical?.warnings || []),
      ...(ads?.accessibility?.warnings || []),
      ...(ads?.seo?.warnings || [])
    ];

    // Determine production readiness
    this.results.summary.productionReady = this.isProductionReady();
    this.results.summary.adsenseReady = this.isAdSenseReady();
    
    // Determine overall status
    if (this.results.summary.productionReady && this.results.summary.adsenseReady) {
      this.results.summary.overallStatus = 'READY';
    } else if (this.results.summary.productionReady) {
      this.results.summary.overallStatus = 'PRODUCTION_READY';
    } else if (this.results.criticalIssues.length === 0) {
      this.results.summary.overallStatus = 'NEEDS_IMPROVEMENTS';
    } else {
      this.results.summary.overallStatus = 'NOT_READY';
    }

    // Identify blockers
    this.results.blockers = this.results.criticalIssues.filter(issue => 
      issue.includes('❌') || 
      issue.includes('critical') || 
      issue.includes('security') ||
      issue.includes('SSL') ||
      issue.includes('HTTPS')
    );
  }

  isProductionReady() {
    const perfScore = this.results.summary.performanceScore;
    const secScore = this.results.summary.securityScore;
    const criticalIssues = this.results.criticalIssues.length;

    return (
      perfScore >= 70 && // Performance at least "Good"
      secScore >= 80 && // Security at least "Mostly Secure"
      criticalIssues === 0 // No critical issues
    );
  }

  isAdSenseReady() {
    const complianceScore = this.results.summary.complianceScore;
    const contentIssues = this.results.tests.adsense?.content?.issues?.length || 0;
    const policyIssues = this.results.tests.adsense?.policy?.issues?.length || 0;

    return (
      complianceScore >= 80 && // Compliance score at least 80%
      contentIssues === 0 && // No content issues
      policyIssues === 0 // No policy issues
    );
  }

  generateFinalReport() {
    console.log('\n🎯 BATTLE TEST RESULTS SUMMARY');
    console.log('='.repeat(60));

    // Overall Status
    console.log(`\n📊 OVERALL STATUS: ${this.results.summary.overallStatus}`);
    console.log(`🚀 Production Ready: ${this.results.summary.productionReady ? '✅ YES' : '❌ NO'}`);
    console.log(`🎯 AdSense Ready: ${this.results.summary.adsenseReady ? '✅ YES' : '❌ NO'}`);

    // Scores
    console.log('\n📈 PERFORMANCE SCORES:');
    console.log(`   Performance: ${this.results.summary.performanceScore.toFixed(0)}/100`);
    console.log(`   Security: ${this.results.summary.securityScore.toFixed(0)}/100`);
    console.log(`   AdSense Compliance: ${this.results.summary.complianceScore.toFixed(0)}/100`);

    // Critical Issues
    if (this.results.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Must Fix):');
      this.results.criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    } else {
      console.log('\n✅ NO CRITICAL ISSUES FOUND');
    }

    // Blockers
    if (this.results.blockers.length > 0) {
      console.log('\n🛑 PRODUCTION BLOCKERS:');
      this.results.blockers.forEach((blocker, index) => {
        console.log(`   ${index + 1}. ${blocker}`);
      });
    }

    // Top Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 TOP RECOMMENDATIONS:');
      this.results.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
      if (this.results.recommendations.length > 5) {
        console.log(`   ... and ${this.results.recommendations.length - 5} more recommendations`);
      }
    }

    // Production Readiness Assessment
    console.log('\n🚀 PRODUCTION READINESS ASSESSMENT:');
    if (this.results.summary.overallStatus === 'READY') {
      console.log('🟢 READY FOR PRODUCTION AND ADSENSE');
      console.log('   • All critical requirements met');
      console.log('   • Good performance and security');
      console.log('   • AdSense compliant');
    } else if (this.results.summary.overallStatus === 'PRODUCTION_READY') {
      console.log('🟡 READY FOR PRODUCTION (AdSense needs work)');
      console.log('   • Production deployment ready');
      console.log('   • Address AdSense requirements before applying');
    } else if (this.results.summary.overallStatus === 'NEEDS_IMPROVEMENTS') {
      console.log('🟠 NEEDS IMPROVEMENTS BEFORE PRODUCTION');
      console.log('   • Address recommendations first');
      console.log('   • Re-run tests after fixes');
    } else {
      console.log('🔴 NOT READY FOR PRODUCTION');
      console.log('   • Critical issues must be fixed');
      console.log('   • Security and performance need attention');
    }

    // Next Steps
    console.log('\n📋 RECOMMENDED NEXT STEPS:');
    if (this.results.blockers.length > 0) {
      console.log('1. Fix all critical blockers immediately');
    }
    if (this.results.criticalIssues.length > 0) {
      console.log('2. Address all critical issues');
    }
    if (this.results.summary.performanceScore < 80) {
      console.log('3. Optimize performance for better user experience');
    }
    if (this.results.summary.securityScore < 90) {
      console.log('4. Implement security recommendations');
    }
    if (!this.results.summary.adsenseReady) {
      console.log('5. Complete AdSense compliance requirements');
    }
    console.log('6. Re-run battle tests after fixes');
    console.log('7. Deploy to production when ready');
  }

  saveComprehensiveReport() {
    const reportData = {
      ...this.results,
      testDetails: {
        performance: {
          coreWebVitals: this.results.tests.performance?.coreWebVitals,
          issues: this.results.tests.performance?.issues,
          recommendations: this.results.tests.performance?.recommendations
        },
        security: {
          ssl: this.results.tests.security?.ssl,
          headers: this.results.tests.security?.headers,
          vulnerabilities: this.results.tests.security?.vulnerabilities
        },
        adsense: {
          content: this.results.tests.adsense?.content,
          technical: this.results.tests.adsense?.technical,
          policy: this.results.tests.adsense?.policy
        }
      },
      generatedAt: new Date().toISOString(),
      testVersion: '1.0.0'
    };

    // Save main report
    fs.writeFileSync(
      'battle-test-results.json',
      JSON.stringify(reportData, null, 2)
    );

    // Save human-readable report
    const readableReport = this.generateReadableReport(reportData);
    fs.writeFileSync(
      'battle-test-report.md',
      readableReport
    );

    console.log('\n📄 Reports saved:');
    console.log('   • battle-test-results.json (detailed data)');
    console.log('   • battle-test-report.md (human readable)');
  }

  generateReadableReport(data) {
    return `# DevToolbox Battle Test Report

**Generated:** ${new Date(data.timestamp).toLocaleString()}  
**Status:** ${data.summary.overallStatus}  
**Production Ready:** ${data.summary.productionReady ? '✅ Yes' : '❌ No'}  
**AdSense Ready:** ${data.summary.adsenseReady ? '✅ Yes' : '❌ No'}

## 📊 Scores Summary

| Metric | Score | Status |
|--------|-------|--------|
| Performance | ${data.summary.performanceScore.toFixed(0)}/100 | ${data.summary.performanceScore >= 90 ? '🟢 Excellent' : data.summary.performanceScore >= 70 ? '🟡 Good' : '🔴 Needs Work'} |
| Security | ${data.summary.securityScore.toFixed(0)}/100 | ${data.summary.securityScore >= 90 ? '🟢 Secure' : data.summary.securityScore >= 70 ? '🟡 Mostly Secure' : '🔴 Needs Attention'} |
| AdSense Compliance | ${data.summary.complianceScore.toFixed(0)}/100 | ${data.summary.complianceScore >= 90 ? '🟢 Ready' : data.summary.complianceScore >= 70 ? '🟡 Almost Ready' : '🔴 Not Ready'} |

## 🚨 Critical Issues

${data.criticalIssues.length > 0 ? data.criticalIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n') : '✅ No critical issues found!'}

## 💡 Recommendations

${data.recommendations.length > 0 ? data.recommendations.slice(0, 10).map((rec, i) => `${i + 1}. ${rec}`).join('\n') : '✅ No recommendations!'}

## 📈 Performance Details

**Core Web Vitals:**
- LCP: ${data.testDetails.performance?.coreWebVitals?.lcp?.toFixed(0) || 'N/A'}ms
- FID: ${data.testDetails.performance?.coreWebVitals?.fid?.toFixed(0) || 'N/A'}ms  
- CLS: ${data.testDetails.performance?.coreWebVitals?.cls?.toFixed(2) || 'N/A'}

## 🔒 Security Details

**SSL Configuration:** ${data.testDetails.security?.ssl?.passed?.length || 0} passed, ${data.testDetails.security?.ssl?.issues?.length || 0} issues

**Security Headers:** ${data.testDetails.security?.headers?.passed?.length || 0} implemented, ${data.testDetails.security?.headers?.warnings?.length || 0} missing

## 🎯 AdSense Compliance

**Content:** ${data.testDetails.adsense?.content?.passed?.length || 0} passed, ${data.testDetails.adsense?.content?.issues?.length || 0} issues

**Technical:** ${data.testDetails.adsense?.technical?.passed?.length || 0} passed, ${data.testDetails.adsense?.technical?.issues?.length || 0} issues

**Policy:** ${data.testDetails.adsense?.policy?.passed?.length || 0} passed, ${data.testDetails.adsense?.policy?.issues?.length || 0} issues

## 🚀 Next Steps

1. ${data.blockers.length > 0 ? 'Fix all critical blockers immediately' : 'No blockers to fix'}
2. ${data.criticalIssues.length > 0 ? 'Address all critical issues' : 'No critical issues to address'}
3. ${data.summary.performanceScore < 80 ? 'Optimize performance for better scores' : 'Performance is good'}
4. ${data.summary.securityScore < 90 ? 'Implement security recommendations' : 'Security is good'}
5. ${!data.summary.adsenseReady ? 'Complete AdSense compliance requirements' : 'AdSense requirements met'}
6. Re-run battle tests after fixes
7. Deploy to production when all checks pass

---

*This report was generated automatically by the DevToolbox Battle Testing Suite.*
`;
  }
}

// Run the complete battle test suite
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  
  const suite = new BattleTestSuite();
  suite.runFullBattleTest(baseUrl)
    .then(() => {
      console.log('\n🎉 Battle testing completed successfully!');
      console.log('📊 Check the generated reports for detailed analysis.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Battle testing failed:', error);
      process.exit(1);
    });
}

module.exports = BattleTestSuite;
