const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Google AdSense Compliance Checker
 * Ensures the site meets all AdSense policies and requirements
 */

class AdSenseComplianceChecker {
  constructor() {
    this.results = {
      overall: { status: 'PENDING', score: 0 },
      content: { issues: [], warnings: [], passed: [] },
      technical: { issues: [], warnings: [], passed: [] },
      policy: { issues: [], warnings: [], passed: [] },
      accessibility: { issues: [], warnings: [], passed: [] },
      seo: { issues: [], warnings: [], passed: [] }
    };
  }

  async runFullComplianceCheck(baseUrl = 'http://localhost:3000') {
    console.log('🔍 Starting AdSense Compliance Check...\n');

    try {
      // 1. Technical Requirements Check
      console.log('⚙️  Checking Technical Requirements...');
      await this.checkTechnicalRequirements(baseUrl);

      // 2. Content Policy Check
      console.log('📝 Checking Content Policies...');
      await this.checkContentPolicies(baseUrl);

      // 3. Accessibility Compliance
      console.log('♿ Checking Accessibility Compliance...');
      await this.checkAccessibility(baseUrl);

      // 4. SEO & Site Structure
      console.log('🔍 Checking SEO & Site Structure...');
      await this.checkSEO(baseUrl);

      // 5. Mobile Friendliness
      console.log('📱 Checking Mobile Friendliness...');
      await this.checkMobileFriendliness(baseUrl);

      // 6. Site Speed & Performance
      console.log('⚡ Checking Site Speed...');
      await this.checkSiteSpeed(baseUrl);

      // 7. Privacy Policy & Legal Pages
      console.log('📄 Checking Legal Requirements...');
      await this.checkLegalRequirements(baseUrl);

      // 8. Navigation & User Experience
      console.log('🧭 Checking Navigation & UX...');
      await this.checkNavigationAndUX(baseUrl);

      // Generate final report
      this.generateComplianceReport();

    } catch (error) {
      console.error('❌ Compliance check failed:', error);
      this.results.overall.status = 'ERROR';
      this.results.technical.issues.push(`Compliance check error: ${error.message}`);
    }

    return this.results;
  }

  async checkTechnicalRequirements(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);
      
      // Check SSL Certificate
      const url = new URL(baseUrl);
      if (url.protocol === 'https:') {
        this.results.technical.passed.push('✅ HTTPS/SSL certificate properly configured');
      } else {
        this.results.technical.issues.push('❌ Site must use HTTPS for AdSense approval');
      }

      // Check for required meta tags
      const title = await page.title();
      if (title && title.length > 10) {
        this.results.technical.passed.push('✅ Page title is present and descriptive');
      } else {
        this.results.technical.issues.push('❌ Page title is missing or too short');
      }

      const description = await page.getAttribute('meta[name="description"]', 'content');
      if (description && description.length > 50) {
        this.results.technical.passed.push('✅ Meta description is present and adequate');
      } else {
        this.results.technical.warnings.push('⚠️  Meta description could be improved');
      }

      // Check for viewport meta tag
      const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
      if (viewport) {
        this.results.technical.passed.push('✅ Viewport meta tag is present');
      } else {
        this.results.technical.issues.push('❌ Viewport meta tag is missing (required for mobile)');
      }

      // Check for structured data
      const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts => 
        scripts.map(script => {
          try {
            return JSON.parse(script.textContent);
          } catch {
            return null;
          }
        }).filter(Boolean)
      );

      if (structuredData.length > 0) {
        this.results.technical.passed.push(`✅ Structured data found (${structuredData.length} schemas)`);
      } else {
        this.results.technical.warnings.push('⚠️  No structured data found (recommended for better SEO)');
      }

      // Check for robots.txt
      try {
        const robotsResponse = await page.goto(`${baseUrl}/robots.txt`);
        if (robotsResponse.ok()) {
          this.results.technical.passed.push('✅ robots.txt is accessible');
        }
      } catch {
        this.results.technical.warnings.push('⚠️  robots.txt not found');
      }

      // Check for sitemap.xml
      try {
        const sitemapResponse = await page.goto(`${baseUrl}/sitemap.xml`);
        if (sitemapResponse.ok()) {
          this.results.technical.passed.push('✅ sitemap.xml is accessible');
        }
      } catch {
        this.results.technical.warnings.push('⚠️  sitemap.xml not found');
      }

    } finally {
      await browser.close();
    }
  }

  async checkContentPolicies(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check for prohibited content indicators
      const pageContent = await page.textContent('body');
      const lowerContent = pageContent.toLowerCase();

      // Check for adult content keywords
      const adultKeywords = ['adult', 'porn', 'xxx', 'sex', 'nude'];
      const foundAdultKeywords = adultKeywords.filter(keyword => lowerContent.includes(keyword));
      
      if (foundAdultKeywords.length === 0) {
        this.results.content.passed.push('✅ No adult content indicators found');
      } else {
        this.results.content.issues.push(`❌ Potentially problematic content found: ${foundAdultKeywords.join(', ')}`);
      }

      // Check for copyrighted material indicators
      const copyrightIndicators = ['download', 'torrent', 'pirate', 'crack', 'serial'];
      const foundCopyrightIssues = copyrightIndicators.filter(keyword => lowerContent.includes(keyword));
      
      if (foundCopyrightIssues.length === 0) {
        this.results.content.passed.push('✅ No copyright infringement indicators found');
      } else {
        this.results.content.warnings.push(`⚠️  Review content for: ${foundCopyrightIssues.join(', ')}`);
      }

      // Check content quality
      const wordCount = pageContent.split(/\s+/).length;
      if (wordCount > 300) {
        this.results.content.passed.push(`✅ Adequate content length (${wordCount} words)`);
      } else {
        this.results.content.warnings.push(`⚠️  Content could be more substantial (${wordCount} words)`);
      }

      // Check for unique content indicators
      const hasOriginalContent = pageContent.includes('DevToolbox') || 
                                pageContent.includes('developer tools') ||
                                pageContent.includes('Base64');
      
      if (hasOriginalContent) {
        this.results.content.passed.push('✅ Original content detected');
      } else {
        this.results.content.issues.push('❌ Content appears to be generic or scraped');
      }

      // Check language and grammar
      const title = await page.title();
      if (title && title.match(/^[A-Za-z0-9\s\-_]+$/)) {
        this.results.content.passed.push('✅ Title uses appropriate characters');
      } else {
        this.results.content.warnings.push('⚠️  Title contains unusual characters');
      }

    } finally {
      await browser.close();
    }
  }

  async checkAccessibility(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check for alt text on images
      const imagesWithoutAlt = await page.$$eval('img:not([alt])', imgs => imgs.length);
      if (imagesWithoutAlt === 0) {
        this.results.accessibility.passed.push('✅ All images have alt text');
      } else {
        this.results.accessibility.warnings.push(`⚠️  ${imagesWithoutAlt} images missing alt text`);
      }

      // Check for heading structure
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headings => 
        headings.map(h => ({ tag: h.tagName, text: h.textContent.trim() }))
      );

      const hasH1 = headings.some(h => h.tag === 'H1');
      if (hasH1) {
        this.results.accessibility.passed.push('✅ Page has H1 heading');
      } else {
        this.results.accessibility.issues.push('❌ Missing H1 heading');
      }

      // Check heading hierarchy
      let previousLevel = 0;
      let hierarchyIssues = 0;
      
      for (const heading of headings) {
        const level = parseInt(heading.tag.substring(1));
        if (level > previousLevel + 1) {
          hierarchyIssues++;
        }
        previousLevel = level;
      }

      if (hierarchyIssues === 0) {
        this.results.accessibility.passed.push('✅ Proper heading hierarchy');
      } else {
        this.results.accessibility.warnings.push(`⚠️  ${hierarchyIssues} heading hierarchy issues found`);
      }

      // Check for form labels
      const inputsWithoutLabels = await page.$$eval('input:not([aria-label]):not([aria-labelledby])', inputs => 
        inputs.filter(input => {
          const id = input.id;
          return !id || !document.querySelector(`label[for="${id}"]`);
        }).length
      );

      if (inputsWithoutLabels === 0) {
        this.results.accessibility.passed.push('✅ All form inputs have labels');
      } else {
        this.results.accessibility.warnings.push(`⚠️  ${inputsWithoutLabels} form inputs missing labels`);
      }

      // Check color contrast (basic check)
      const hasDarkMode = await page.$('.dark') || await page.$('[class*="dark"]');
      if (hasDarkMode) {
        this.results.accessibility.passed.push('✅ Dark mode support detected');
      } else {
        this.results.accessibility.warnings.push('⚠️  Consider adding dark mode for better accessibility');
      }

    } finally {
      await browser.close();
    }
  }

  async checkSEO(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check title length
      const title = await page.title();
      if (title.length >= 30 && title.length <= 60) {
        this.results.seo.passed.push('✅ Title length is optimal (30-60 characters)');
      } else {
        this.results.seo.warnings.push(`⚠️  Title length ${title.length} characters (optimal: 30-60)`);
      }

      // Check meta description length
      const description = await page.getAttribute('meta[name="description"]', 'content');
      if (description && description.length >= 120 && description.length <= 160) {
        this.results.seo.passed.push('✅ Meta description length is optimal (120-160 characters)');
      } else if (description) {
        this.results.seo.warnings.push(`⚠️  Meta description length ${description.length} characters (optimal: 120-160)`);
      }

      // Check for internal links
      const internalLinks = await page.$$eval('a[href^="/"], a[href^="./"]', links => links.length);
      if (internalLinks > 5) {
        this.results.seo.passed.push(`✅ Good internal linking (${internalLinks} internal links)`);
      } else {
        this.results.seo.warnings.push(`⚠️  Consider adding more internal links (${internalLinks} found)`);
      }

      // Check for outbound links
      const outboundLinks = await page.$$eval('a[href^="http"]:not([href*="localhost"]):not([href*="devtoolbox.com"])', links => links.length);
      if (outboundLinks > 0) {
        this.results.seo.passed.push(`✅ External links found (${outboundLinks} links)`);
      } else {
        this.results.seo.warnings.push('⚠️  Consider adding relevant external links');
      }

      // Check for semantic HTML
      const semanticElements = await page.$$eval('header, nav, main, section, article, aside, footer', elements => elements.length);
      if (semanticElements > 0) {
        this.results.seo.passed.push(`✅ Semantic HTML elements used (${semanticElements} elements)`);
      } else {
        this.results.seo.warnings.push('⚠️  Consider using semantic HTML elements');
      }

    } finally {
      await browser.close();
    }
  }

  async checkMobileFriendliness(baseUrl) {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    const page = await context.newPage();

    try {
      await page.goto(baseUrl);

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      if (!hasHorizontalScroll) {
        this.results.technical.passed.push('✅ No horizontal scroll on mobile');
      } else {
        this.results.technical.issues.push('❌ Horizontal scroll detected on mobile');
      }

      // Check font sizes
      const smallTextElements = await page.$$eval('*', elements => 
        elements.filter(el => {
          const styles = window.getComputedStyle(el);
          return parseFloat(styles.fontSize) < 14 && el.textContent.trim().length > 10;
        }).length
      );

      if (smallTextElements === 0) {
        this.results.technical.passed.push('✅ Text is readable on mobile (≥14px)');
      } else {
        this.results.technical.warnings.push(`⚠️  ${smallTextElements} elements have small text (<14px)`);
      }

      // Check touch targets
      const smallTouchTargets = await page.$$eval('button, a, input, select, textarea', elements => 
        elements.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).length
      );

      if (smallTouchTargets === 0) {
        this.results.technical.passed.push('✅ Touch targets are adequate (≥44px)');
      } else {
        this.results.technical.warnings.push(`⚠️  ${smallTouchTargets} touch targets are too small (<44px)`);
      }

    } finally {
      await browser.close();
    }
  }

  async checkSiteSpeed(baseUrl) {
    // Simple speed check
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      const startTime = Date.now();
      await page.goto(baseUrl);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      if (loadTime < 3000) {
        this.results.technical.passed.push(`✅ Fast page load (${loadTime}ms)`);
      } else if (loadTime < 5000) {
        this.results.technical.warnings.push(`⚠️  Moderate page load time (${loadTime}ms)`);
      } else {
        this.results.technical.issues.push(`❌ Slow page load (${loadTime}ms - target: <3s)`);
      }

    } finally {
      await browser.close();
    }
  }

  async checkLegalRequirements(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // Check for Privacy Policy
      try {
        await page.goto(`${baseUrl}/privacy`);
        const privacyContent = await page.textContent('body');
        if (privacyContent && privacyContent.length > 500) {
          this.results.policy.passed.push('✅ Privacy Policy page exists and has content');
        } else {
          this.results.policy.warnings.push('⚠️  Privacy Policy page could be more comprehensive');
        }
      } catch {
        this.results.policy.issues.push('❌ Privacy Policy page not found');
      }

      // Check for Terms of Service
      try {
        await page.goto(`${baseUrl}/terms`);
        const termsContent = await page.textContent('body');
        if (termsContent && termsContent.length > 500) {
          this.results.policy.passed.push('✅ Terms of Service page exists and has content');
        } else {
          this.results.policy.warnings.push('⚠️  Terms of Service page could be more comprehensive');
        }
      } catch {
        this.results.policy.warnings.push('⚠️  Terms of Service page not found (recommended)');
      }

      // Check for Contact Information
      await page.goto(baseUrl);
      const contactInfo = await page.textContent('body');
      const hasContact = /contact|email|phone|address/i.test(contactInfo);
      
      if (hasContact) {
        this.results.policy.passed.push('✅ Contact information found');
      } else {
        this.results.policy.warnings.push('⚠️  Consider adding contact information');
      }

    } finally {
      await browser.close();
    }
  }

  async checkNavigationAndUX(baseUrl) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(baseUrl);

      // Check navigation structure
      const navElements = await page.$$('nav, [role="navigation"]');
      if (navElements.length > 0) {
        this.results.technical.passed.push('✅ Navigation structure found');
      } else {
        this.results.technical.warnings.push('⚠️  Consider adding proper navigation structure');
      }

      // Check for broken links
      const links = await page.$$eval('a[href]', links => 
        links.map(link => link.href).filter(href => href.startsWith('http'))
      );

      let brokenLinks = 0;
      for (const link of links.slice(0, 10)) { // Check first 10 links
        try {
          const response = await page.goto(link, { waitUntil: 'domcontentloaded' });
          if (!response.ok()) {
            brokenLinks++;
          }
        } catch {
          brokenLinks++;
        }
      }

      if (brokenLinks === 0) {
        this.results.technical.passed.push('✅ No broken links found (sample checked)');
      } else {
        this.results.technical.warnings.push(`⚠️  ${brokenLinks} potentially broken links found`);
      }

    } finally {
      await browser.close();
    }
  }

  generateComplianceReport() {
    console.log('\n📋 ADSENSE COMPLIANCE REPORT');
    console.log('='.repeat(60));

    // Calculate scores
    const categories = ['content', 'technical', 'policy', 'accessibility', 'seo'];
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
      this.results.overall.status = 'READY';
    } else if (overallScore >= 70) {
      this.results.overall.status = 'NEEDS_IMPROVEMENT';
    } else {
      this.results.overall.status = 'NOT_READY';
    }

    console.log(`\n🎯 OVERALL SCORE: ${overallScore}/100`);
    console.log(`📊 STATUS: ${this.results.overall.status}`);

    // Critical issues summary
    const allIssues = [
      ...this.results.content.issues,
      ...this.results.technical.issues,
      ...this.results.policy.issues,
      ...this.results.accessibility.issues,
      ...this.results.seo.issues
    ];

    if (allIssues.length > 0) {
      console.log('\n❌ CRITICAL ISSUES (Must Fix Before AdSense):');
      allIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }

    // Recommendations
    const allWarnings = [
      ...this.results.content.warnings,
      ...this.results.technical.warnings,
      ...this.results.policy.warnings,
      ...this.results.accessibility.warnings,
      ...this.results.seo.warnings
    ];

    if (allWarnings.length > 0) {
      console.log('\n⚠️  RECOMMENDATIONS (Improve for Better Approval Chances):');
      allWarnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }

    // AdSense readiness assessment
    console.log('\n🎯 ADSENSE READINESS ASSESSMENT:');
    if (this.results.overall.status === 'READY') {
      console.log('🟢 READY TO APPLY - Your site meets AdSense requirements!');
      console.log('   • All critical requirements met');
      console.log('   • Good technical foundation');
      console.log('   • Content appears compliant');
    } else if (this.results.overall.status === 'NEEDS_IMPROVEMENT') {
      console.log('🟡 ALMOST READY - Address warnings for better approval chances');
      console.log('   • Most requirements met');
      console.log('   • Some improvements recommended');
      console.log('   • Can apply but may face scrutiny');
    } else {
      console.log('🔴 NOT READY - Fix critical issues before applying');
      console.log('   • Critical issues must be addressed');
      console.log('   • Risk of rejection is high');
      console.log('   • Focus on fixing issues first');
    }

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      overall: this.results.overall,
      categories: this.results,
      recommendations: this.getRecommendations()
    };

    fs.writeFileSync(
      'adsense-compliance-results.json',
      JSON.stringify(reportData, null, 2)
    );

    console.log('\n📄 Detailed report saved to: adsense-compliance-results.json');
  }

  getRecommendations() {
    const recommendations = [];

    // Technical recommendations
    if (this.results.technical.issues.length > 0) {
      recommendations.push({
        category: 'Technical',
        priority: 'HIGH',
        action: 'Fix all technical issues before applying to AdSense'
      });
    }

    // Content recommendations
    if (this.results.content.issues.length > 0) {
      recommendations.push({
        category: 'Content',
        priority: 'HIGH',
        action: 'Review and revise content to comply with AdSense policies'
      });
    }

    // Legal recommendations
    if (this.results.policy.issues.length > 0) {
      recommendations.push({
        category: 'Legal',
        priority: 'HIGH',
        action: 'Add required legal pages (Privacy Policy, Terms of Service)'
      });
    }

    // Accessibility recommendations
    if (this.results.accessibility.warnings.length > 0) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'MEDIUM',
        action: 'Improve accessibility for better user experience and SEO'
      });
    }

    return recommendations;
  }
}

// Run the compliance check
if (require.main === module) {
  const checker = new AdSenseComplianceChecker();
  checker.runFullComplianceCheck()
    .then(() => {
      console.log('\n🎉 AdSense compliance check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Compliance check failed:', error);
      process.exit(1);
    });
}

module.exports = AdSenseComplianceChecker;
