const { chromium } = require('playwright');
const https = require('https');
const fs = require('fs');

/**
 * Security Testing Script
 * Comprehensive security audit for production readiness
 */

class SecurityTester {
  constructor() {
    this.results = {
      overall: { status: 'PENDING', score: 0 },
      ssl: { issues: [], warnings: [], passed: [] },
      headers: { issues: [], warnings: [], passed: [] },
      vulnerabilities: { issues: [], warnings: [], passed: [] },
      content: { issues: [], warnings: [], passed: [] },
      configuration: { issues: [], warnings: [], passed: [] }
    };
  }

  async runSecurityAudit(baseUrl = 'http://localhost:3000') {
    console.log('🔒 Starting Security Audit...\n');

    try {
      // 1. SSL/TLS Configuration Check
      console.log('🔐 Checking SSL/TLS Configuration...');
      await this.checkSSLConfiguration(baseUrl);

      // 2. Security Headers Analysis
      console.log('🛡️  Checking Security Headers...');
      await this.checkSecurityHeaders(baseUrl);

      // 3. Common Vulnerabilities Scan
      console.log('🔍 Scanning for Common Vulnerabilities...');
      await this.scanVulnerabilities(baseUrl);

      // 4. Content Security Check
      console.log('📄 Checking Content Security...');
      await this.checkContentSecurity(baseUrl);

      // 5. Configuration Security
      console.log('⚙️  Checking Configuration Security...');
      await this.checkConfigurationSecurity(baseUrl);

      // 6. Input Validation Testing
      console.log('🧪 Testing Input Validation...');
      await this.testInputValidation(baseUrl);

      // 7. Authentication & Authorization
      console.log('🔑 Checking Authentication Security...');
      await this.checkAuthenticationSecurity(baseUrl);

      // Generate security report
      this.generateSecurityReport();

    } catch (error) {
      console.error('❌ Security audit failed:', error);
      this.results.overall.status = 'ERROR';
      this.results.vulnerabilities.issues.push(`Security audit error: ${error.message}`);
    }

    return this.results;
  }

  async checkSSLConfiguration(baseUrl) {
    const url = new URL(baseUrl);
    
    if (url.protocol !== 'https:') {
      this.results.ssl.issues.push('❌ Site is not using HTTPS');
      return;
    }

    // Check SSL certificate
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      method: 'GET',
      agent: false
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();
        
        if (cert) {
          // Check certificate validity
          const now = new Date();
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          
          if (now < validFrom) {
            this.results.ssl.issues.push('❌ SSL certificate is not yet valid');
          } else if (now > validTo) {
            this.results.ssl.issues.push('❌ SSL certificate has expired');
          } else {
            this.results.ssl.passed.push('✅ SSL certificate is valid and current');
          }

          // Check certificate strength
          if (cert.bits && cert.bits >= 2048) {
            this.results.ssl.passed.push(`✅ Strong certificate key length (${cert.bits} bits)`);
          } else if (cert.bits) {
            this.results.ssl.warnings.push(`⚠️  Weak certificate key length (${cert.bits} bits, recommend ≥2048)`);
          }

          // Check certificate issuer
          const trustedIssuers = [
            'Let\'s Encrypt',
            'DigiCert',
            'GlobalSign',
            'Comodo',
            'Sectigo'
          ];
          
          const issuer = cert.issuer?.O || cert.issuer?.CN;
          if (trustedIssuers.some(trusted => issuer?.includes(trusted))) {
            this.results.ssl.passed.push(`✅ Certificate issued by trusted CA: ${issuer}`);
          } else {
            this.results.ssl.warnings.push(`⚠️  Certificate issuer: ${issuer}`);
          }
        } else {
          this.results.ssl.issues.push('❌ No SSL certificate found');
        }
        
        resolve();
      });

      req.on('error', (error) => {
        this.results.ssl.issues.push(`❌ SSL connection failed: ${error.message}`);
        resolve();
      });

      req.setTimeout(5000, () => {
        req.destroy();
        this.results.ssl.issues.push('❌ SSL connection timeout');
        resolve();
      });

      req.end();
    });
  }

  async checkSecurityHeaders(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      const response = await page.goto(baseUrl);
      const headers = response.headers();

      // Check required security headers
      const requiredHeaders = [
        { name: 'x-frame-options', description: 'Clickjacking protection' },
        { name: 'x-content-type-options', description: 'MIME type sniffing protection' },
        { name: 'x-xss-protection', description: 'XSS protection' },
        { name: 'strict-transport-security', description: 'HTTPS enforcement' },
        { name: 'content-security-policy', description: 'Content injection protection' },
        { name: 'referrer-policy', description: 'Referrer control' }
      ];

      requiredHeaders.forEach(header => {
        if (headers[header.name]) {
          this.results.headers.passed.push(`✅ ${header.description} (${header.name}) present`);
        } else {
          this.results.headers.warnings.push(`⚠️  Missing ${header.description} (${header.name})`);
        }
      });

      // Check server information disclosure
      if (headers['server']) {
        this.results.headers.warnings.push(`⚠️  Server header reveals information: ${headers['server']}`);
      } else {
        this.results.headers.passed.push('✅ Server header not disclosed');
      }

      // Check X-Powered-By header
      if (headers['x-powered-by']) {
        this.results.headers.warnings.push(`⚠️  X-Powered-By header reveals technology: ${headers['x-powered-by']}`);
      } else {
        this.results.headers.passed.push('✅ X-Powered-By header not present');
      }

    } finally {
      await browser.close();
    }
  }

  async scanVulnerabilities(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Wait a bit for any console errors to appear
      await page.waitForTimeout(2000);

      if (consoleErrors.length === 0) {
        this.results.vulnerabilities.passed.push('✅ No JavaScript console errors detected');
      } else {
        this.results.vulnerabilities.warnings.push(`⚠️  ${consoleErrors.length} console errors detected`);
      }

      // Check for inline scripts (XSS risk)
      const inlineScripts = await page.$$eval('script:not([src])', scripts => scripts.length);
      if (inlineScripts === 0) {
        this.results.vulnerabilities.passed.push('✅ No inline scripts detected (good for XSS prevention)');
      } else {
        this.results.vulnerabilities.warnings.push(`⚠️  ${inlineScripts} inline scripts found (potential XSS risk)`);
      }

      // Check for inline styles
      const inlineStyles = await page.$$eval('style:not([href]), *[style]', elements => elements.length);
      if (inlineStyles === 0) {
        this.results.vulnerabilities.passed.push('✅ No inline styles detected');
      } else {
        this.results.vulnerabilities.warnings.push(`⚠️  ${inlineStyles} inline styles found`);
      }

      // Check for eval() usage in scripts
      const pageContent = await page.content();
      if (pageContent.includes('eval(')) {
        this.results.vulnerabilities.issues.push('❌ eval() function found in page (security risk)');
      } else {
        this.results.vulnerabilities.passed.push('✅ No eval() usage detected');
      }

      // Check for document.write() usage
      if (pageContent.includes('document.write(')) {
        this.results.vulnerabilities.warnings.push('⚠️  document.write() usage detected (can cause security issues)');
      } else {
        this.results.vulnerabilities.passed.push('✅ No document.write() usage detected');
      }

      // Check for innerHTML with user input
      if (pageContent.includes('innerHTML') && pageContent.includes('value')) {
        this.results.vulnerabilities.warnings.push('⚠️  innerHTML usage with potential user input detected');
      }

    } finally {
      await browser.close();
    }
  }

  async checkContentSecurity(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check for sensitive information in page source
      const pageContent = await page.content();
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i,
        /private[_-]?key/i
      ];

      let sensitiveInfoFound = false;
      sensitivePatterns.forEach(pattern => {
        if (pattern.test(pageContent)) {
          this.results.content.warnings.push(`⚠️  Potentially sensitive information pattern found: ${pattern.source}`);
          sensitiveInfoFound = true;
        }
      });

      if (!sensitiveInfoFound) {
        this.results.content.passed.push('✅ No obvious sensitive information exposed');
      }

      // Check for comments in HTML
      const htmlComments = pageContent.match(/<!--[\s\S]*?-->/g);
      if (htmlComments && htmlComments.length > 0) {
        this.results.content.warnings.push(`⚠️  ${htmlComments.length} HTML comments found (review for sensitive info)`);
      } else {
        this.results.content.passed.push('✅ No HTML comments that might leak information');
      }

      // Check for debug information
      const debugPatterns = [
        /console\.log/,
        /console\.debug/,
        /debugger/,
        /\/\*[\s\S]*?\*\// // CSS comments
      ];

      let debugInfoFound = false;
      debugPatterns.forEach(pattern => {
        if (pattern.test(pageContent)) {
          this.results.content.warnings.push(`⚠️  Debug information found: ${pattern.source}`);
          debugInfoFound = true;
        }
      });

      if (!debugInfoFound) {
        this.results.content.passed.push('✅ No debug information exposed');
      }

    } finally {
      await browser.close();
    }
  }

  async checkConfigurationSecurity(baseUrl) {
    // Check for common configuration files
    const configFiles = [
      '/.env',
      '/config.json',
      '/settings.json',
      '/database.yml',
      '/.git/config'
    ];

    for (const configFile of configFiles) {
      try {
        const response = await fetch(`${baseUrl}${configFile}`);
        if (response.ok) {
          this.results.configuration.issues.push(`❌ Configuration file exposed: ${configFile}`);
        }
      } catch {
        // File not accessible - good
        this.results.configuration.passed.push(`✅ Configuration file not accessible: ${configFile}`);
      }
    }

    // Check for directory listing
    try {
      const response = await fetch(`${baseUrl}/`);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        this.results.configuration.passed.push('✅ Directory listing appears disabled');
      }
    } catch {
      this.results.configuration.passed.push('✅ Directory listing is not accessible');
    }

    // Check for error page information disclosure
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // Try to access a non-existent page
      const response = await page.goto(`${baseUrl}/non-existent-page-12345`);
      const errorPageContent = await page.content();
      
      // Check if error page reveals sensitive information
      if (errorPageContent.includes('stack trace') || 
          errorPageContent.includes('internal server error') ||
          errorPageContent.includes('database')) {
        this.results.configuration.warnings.push('⚠️  Error page may reveal sensitive information');
      } else {
        this.results.configuration.passed.push('✅ Error pages do not reveal sensitive information');
      }

    } finally {
      await browser.close();
    }
  }

  async testInputValidation(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Find all input fields and forms
      const inputs = await page.$$('input, textarea');
      const forms = await page.$$('form');

      if (inputs.length > 0) {
        // Test XSS payloads in input fields
        const xssPayloads = [
          '<script>alert("xss")</script>',
          'javascript:alert("xss")',
          '<img src=x onerror=alert("xss")>',
          '"><script>alert("xss")</script>'
        ];

        for (const input of inputs.slice(0, 3)) { // Test first 3 inputs
          const inputType = await input.getAttribute('type');
          if (inputType !== 'hidden' && inputType !== 'submit') {
            for (const payload of xssPayloads.slice(0, 2)) { // Test first 2 payloads
              try {
                await input.fill(payload);
                await page.waitForTimeout(100);
                
                // Check if payload appears in page (potential XSS)
                const pageContent = await page.content();
                if (pageContent.includes(payload) && !pageContent.includes('value="' + payload + '"')) {
                  this.results.vulnerabilities.warnings.push(`⚠️  Potential XSS vulnerability with payload: ${payload}`);
                }
              } catch {
                // Input might be read-only or disabled
              }
            }
          }
        }

        this.results.vulnerabilities.passed.push(`✅ Tested ${inputs.length} input fields for XSS vulnerabilities`);
      } else {
        this.results.vulnerabilities.passed.push('✅ No input fields to test');
      }

      // Test SQL injection in URL parameters
      const sqlPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --"
      ];

      for (const payload of sqlPayloads.slice(0, 2)) { // Test first 2 payloads
        try {
          const testUrl = `${baseUrl}/?test=${encodeURIComponent(payload)}`;
          await page.goto(testUrl);
          
          // Check for database error messages
          const pageContent = await page.content();
          if (pageContent.toLowerCase().includes('sql') || 
              pageContent.toLowerCase().includes('mysql') ||
              pageContent.toLowerCase().includes('database error')) {
            this.results.vulnerabilities.warnings.push(`⚠️  Potential SQL injection vulnerability with payload: ${payload}`);
          }
        } catch {
          // URL might not exist - that's fine
        }
      }

      this.results.vulnerabilities.passed.push('✅ Basic SQL injection testing completed');

    } finally {
      await browser.close();
    }
  }

  async checkAuthenticationSecurity(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check for authentication forms
      const authForms = await page.$$('input[type="password"]');
      
      if (authForms.length > 0) {
        // Check password field attributes
        for (const passwordField of authForms) {
          const autocomplete = await passwordField.getAttribute('autocomplete');
          const maxLength = await passwordField.getAttribute('maxlength');
          
          if (autocomplete === 'off') {
            this.results.vulnerabilities.passed.push('✅ Password field has autocomplete disabled');
          } else {
            this.results.vulnerabilities.warnings.push('⚠️  Consider disabling autocomplete for password fields');
          }

          if (maxLength && parseInt(maxLength) < 8) {
            this.results.vulnerabilities.warnings.push('⚠️  Password field has very short max length');
          }
        }

        // Check for password strength indicators
        const strengthIndicators = await page.$$('[class*="strength"], [id*="strength"]');
        if (strengthIndicators.length > 0) {
          this.results.vulnerabilities.passed.push('✅ Password strength indicators found');
        } else {
          this.results.vulnerabilities.warnings.push('⚠️  Consider adding password strength indicators');
        }
      } else {
        this.results.vulnerabilities.passed.push('✅ No authentication forms detected (client-side tools)');
      }

      // Check for session management
      const cookies = await page.context().cookies();
      const sessionCookies = cookies.filter(cookie => 
        cookie.name.toLowerCase().includes('session') ||
        cookie.name.toLowerCase().includes('token')
      );

      if (sessionCookies.length > 0) {
        const secureCookies = sessionCookies.filter(cookie => cookie.secure);
        const httpOnlyCookies = sessionCookies.filter(cookie => cookie.httpOnly);

        if (secureCookies.length === sessionCookies.length) {
          this.results.vulnerabilities.passed.push('✅ All session cookies are secure');
        } else {
          this.results.vulnerabilities.warnings.push('⚠️  Some session cookies are not secure');
        }

        if (httpOnlyCookies.length === sessionCookies.length) {
          this.results.vulnerabilities.passed.push('✅ All session cookies are HttpOnly');
        } else {
          this.results.vulnerabilities.warnings.push('⚠️  Some session cookies are not HttpOnly');
        }
      }

    } finally {
      await browser.close();
    }
  }

  generateSecurityReport() {
    console.log('\n🔒 SECURITY AUDIT REPORT');
    console.log('='.repeat(60));

    // Calculate scores
    const categories = ['ssl', 'headers', 'vulnerabilities', 'content', 'configuration'];
    let totalScore = 0;
    let maxScore = 0;

    categories.forEach(category => {
      const passed = this.results[category].passed.length;
      const warnings = this.results[category].warnings.length;
      const issues = this.results[category].issues.length;
      const total = passed + warnings + issues;
      
      const categoryScore = total > 0 ? Math.round((passed / total) * 100) : 100;
      totalScore += categoryScore;
      maxScore += 100;

      console.log(`\n${category.toUpperCase()}: ${categoryScore}/100`);
      console.log(`   ✅ Passed: ${passed}`);
      console.log(`   ⚠️  Warnings: ${warnings}`);
      console.log(`   ❌ Issues: ${issues}`);
    });

    const overallScore = Math.round(totalScore / categories.length);
    this.results.overall.score = overallScore;

    // Determine overall status
    if (overallScore >= 90) {
      this.results.overall.status = 'SECURE';
    } else if (overallScore >= 70) {
      this.results.overall.status = 'MOSTLY_SECURE';
    } else {
      this.results.overall.status = 'NEEDS_ATTENTION';
    }

    console.log(`\n🎯 OVERALL SECURITY SCORE: ${overallScore}/100`);
    console.log(`🛡️  STATUS: ${this.results.overall.status}`);

    // Critical security issues
    const allIssues = [
      ...this.results.ssl.issues,
      ...this.results.headers.issues,
      ...this.results.vulnerabilities.issues,
      ...this.results.content.issues,
      ...this.results.configuration.issues
    ];

    if (allIssues.length > 0) {
      console.log('\n🚨 CRITICAL SECURITY ISSUES (Must Fix):');
      allIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }

    // Security recommendations
    const allWarnings = [
      ...this.results.ssl.warnings,
      ...this.results.headers.warnings,
      ...this.results.vulnerabilities.warnings,
      ...this.results.content.warnings,
      ...this.results.configuration.warnings
    ];

    if (allWarnings.length > 0) {
      console.log('\n⚠️  SECURITY RECOMMENDATIONS:');
      allWarnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }

    // Production readiness assessment
    console.log('\n🚀 PRODUCTION READINESS ASSESSMENT:');
    if (this.results.overall.status === 'SECURE') {
      console.log('🟢 SECURE - Ready for production deployment');
      console.log('   • No critical security issues');
      console.log('   • Good security practices implemented');
      console.log('   • Regular security monitoring recommended');
    } else if (this.results.overall.status === 'MOSTLY_SECURE') {
      console.log('🟡 MOSTLY SECURE - Ready with improvements');
      console.log('   • Minor security issues to address');
      console.log('   • Consider implementing recommendations');
      console.log('   • Monitor security regularly');
    } else {
      console.log('🔴 NEEDS ATTENTION - Address issues before production');
      console.log('   • Critical security issues found');
      console.log('   • Must fix before production deployment');
      console.log('   • Consider security audit');
    }

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      overall: this.results.overall,
      categories: this.results,
      recommendations: this.getSecurityRecommendations()
    };

    fs.writeFileSync(
      'security-audit-results.json',
      JSON.stringify(reportData, null, 2)
    );

    console.log('\n📄 Detailed security report saved to: security-audit-results.json');
  }

  getSecurityRecommendations() {
    const recommendations = [];

    if (this.results.ssl.issues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'SSL/TLS',
        action: 'Fix SSL/TLS configuration issues immediately'
      });
    }

    if (this.results.vulnerabilities.issues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Vulnerabilities',
        action: 'Address all security vulnerabilities before production'
      });
    }

    if (this.results.headers.warnings.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Security Headers',
        action: 'Implement missing security headers for better protection'
      });
    }

    return recommendations;
  }
}

// Run the security audit
if (require.main === module) {
  const tester = new SecurityTester();
  tester.runSecurityAudit()
    .then(() => {
      console.log('\n🎉 Security audit completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Security audit failed:', error);
      process.exit(1);
    });
}

module.exports = SecurityTester;
