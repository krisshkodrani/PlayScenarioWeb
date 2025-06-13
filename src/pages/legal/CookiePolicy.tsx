
import React from 'react';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

const CookiePolicy: React.FC = () => {
  const tableOfContents = [
    {
      id: 'overview',
      title: '1. Overview',
    },
    {
      id: 'what-are-cookies',
      title: '2. What Are Cookies',
    },
    {
      id: 'cookie-types',
      title: '3. Types of Cookies We Use',
      subsections: [
        { id: 'necessary-cookies', title: 'Strictly Necessary Cookies' },
        { id: 'functional-cookies', title: 'Functional Cookies' },
        { id: 'analytics-cookies', title: 'Analytics Cookies' },
        { id: 'performance-cookies', title: 'Performance Cookies' }
      ]
    },
    {
      id: 'cookie-consent',
      title: '4. Cookie Consent',
    },
    {
      id: 'managing-cookies',
      title: '5. Managing Cookies',
    },
    {
      id: 'third-party-cookies',
      title: '6. Third-Party Cookies',
    },
    {
      id: 'updates',
      title: '7. Policy Updates',
    }
  ];

  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="December 13, 2024"
      tableOfContents={tableOfContents}
    >
      <LegalSection id="overview" title="1. Overview">
        <p>
          This Cookie Policy explains how PlayScenarioAI uses cookies and similar tracking 
          technologies on our platform. This policy should be read alongside our Privacy Policy 
          and Terms of Service.
        </p>
        <p>
          We use cookies to enhance your experience, provide essential platform functionality, 
          and analyze how our service is used to make improvements.
        </p>
      </LegalSection>

      <LegalSection id="what-are-cookies" title="2. What Are Cookies">
        <p>
          Cookies are small text files that are stored on your device when you visit our platform. 
          They help us recognize your device and remember information about your visit.
        </p>
        <p>
          <strong>Types of Cookie Technologies:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>HTTP Cookies:</strong> Standard cookies stored by your browser</li>
          <li><strong>Local Storage:</strong> Browser storage for larger amounts of data</li>
          <li><strong>Session Storage:</strong> Temporary storage that expires when you close your browser</li>
          <li><strong>Web Beacons:</strong> Small transparent images used for analytics</li>
        </ul>
      </LegalSection>

      <LegalSection id="cookie-types" title="3. Types of Cookies We Use">
        <LegalSection id="necessary-cookies" title="Strictly Necessary Cookies" level={2}>
          <p>
            These cookies are essential for the platform to function properly. They cannot be 
            disabled without affecting core functionality.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg">
              <thead className="bg-slate-700">
                <tr>
                  <th className="border border-gray-600 p-3 text-left">Cookie Name</th>
                  <th className="border border-gray-600 p-3 text-left">Purpose</th>
                  <th className="border border-gray-600 p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 p-3">sb-access-token</td>
                  <td className="border border-gray-600 p-3">User authentication and session management</td>
                  <td className="border border-gray-600 p-3">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">sb-refresh-token</td>
                  <td className="border border-gray-600 p-3">Automatic login renewal</td>
                  <td className="border border-gray-600 p-3">30 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">csrf-token</td>
                  <td className="border border-gray-600 p-3">Security protection against attacks</td>
                  <td className="border border-gray-600 p-3">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">cookie-consent</td>
                  <td className="border border-gray-600 p-3">Remember your cookie preferences</td>
                  <td className="border border-gray-600 p-3">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection id="functional-cookies" title="Functional Cookies" level={2}>
          <p>
            These cookies enhance your experience by remembering your preferences and settings.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg">
              <thead className="bg-slate-700">
                <tr>
                  <th className="border border-gray-600 p-3 text-left">Cookie Name</th>
                  <th className="border border-gray-600 p-3 text-left">Purpose</th>
                  <th className="border border-gray-600 p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 p-3">theme-preference</td>
                  <td className="border border-gray-600 p-3">Remember your dark/light theme choice</td>
                  <td className="border border-gray-600 p-3">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">language-preference</td>
                  <td className="border border-gray-600 p-3">Remember your language selection</td>
                  <td className="border border-gray-600 p-3">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">view-mode</td>
                  <td className="border border-gray-600 p-3">Remember grid/list view preferences</td>
                  <td className="border border-gray-600 p-3">3 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection id="analytics-cookies" title="Analytics Cookies" level={2}>
          <p>
            These cookies help us understand how you use our platform so we can improve it.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg">
              <thead className="bg-slate-700">
                <tr>
                  <th className="border border-gray-600 p-3 text-left">Cookie Name</th>
                  <th className="border border-gray-600 p-3 text-left">Purpose</th>
                  <th className="border border-gray-600 p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 p-3">_psa_session</td>
                  <td className="border border-gray-600 p-3">Track user sessions and page views</td>
                  <td className="border border-gray-600 p-3">30 minutes</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">_psa_user</td>
                  <td className="border border-gray-600 p-3">Identify unique users (anonymized)</td>
                  <td className="border border-gray-600 p-3">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">feature-usage</td>
                  <td className="border border-gray-600 p-3">Track which features are most popular</td>
                  <td className="border border-gray-600 p-3">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection id="performance-cookies" title="Performance Cookies" level={2}>
          <p>
            These cookies help us monitor platform performance and identify technical issues.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg">
              <thead className="bg-slate-700">
                <tr>
                  <th className="border border-gray-600 p-3 text-left">Cookie Name</th>
                  <th className="border border-gray-600 p-3 text-left">Purpose</th>
                  <th className="border border-gray-600 p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 p-3">load-times</td>
                  <td className="border border-gray-600 p-3">Monitor page load performance</td>
                  <td className="border border-gray-600 p-3">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">error-tracking</td>
                  <td className="border border-gray-600 p-3">Capture and report technical errors</td>
                  <td className="border border-gray-600 p-3">7 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>
      </LegalSection>

      <LegalSection id="cookie-consent" title="4. Cookie Consent">
        <p>
          <strong>EU Cookie Consent Requirements:</strong> Under EU cookie law (ePrivacy Directive), 
          we must obtain your consent before placing non-essential cookies on your device.
        </p>
        
        <p>
          <strong>Consent Management:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>You'll see a cookie consent banner on your first visit</li>
          <li>You can choose which types of cookies to accept</li>
          <li>Strictly necessary cookies are automatically enabled</li>
          <li>You can change your preferences at any time</li>
          <li>Consent is stored locally and remembered for future visits</li>
        </ul>

        <p>
          <strong>Granular Consent Options:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Accept All:</strong> Enable all cookie types for the best experience</li>
          <li><strong>Necessary Only:</strong> Only essential cookies for basic functionality</li>
          <li><strong>Custom Settings:</strong> Choose specific cookie categories to enable</li>
          <li><strong>Reject All:</strong> Disable all non-essential cookies</li>
        </ul>
      </LegalSection>

      <LegalSection id="managing-cookies" title="5. Managing Your Cookie Preferences">
        <p>
          <strong>Platform Cookie Settings:</strong> You can manage your cookie preferences through 
          your account settings or by clicking the cookie preferences link in our footer.
        </p>

        <p>
          <strong>Browser Cookie Controls:</strong> You can also control cookies through your browser settings:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400">Chrome</h4>
            <p>Settings → Privacy and Security → Cookies and other site data</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Firefox</h4>
            <p>Settings → Privacy & Security → Cookies and Site Data</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Safari</h4>
            <p>Preferences → Privacy → Manage Website Data</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Edge</h4>
            <p>Settings → Cookies and site permissions → Cookies and site data</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-4 mt-4">
          <p className="text-amber-400 font-medium">
            <strong>Important:</strong> Disabling cookies may affect platform functionality. 
            Some features may not work properly without cookies enabled.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="third-party-cookies" title="6. Third-Party Cookies">
        <p>
          Some cookies are set by third-party services we use to provide our platform functionality:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400">Supabase (Database & Authentication)</h4>
            <p>
              <strong>Purpose:</strong> User authentication and data storage<br />
              <strong>Cookies:</strong> Session tokens and authentication state<br />
              <strong>Privacy Policy:</strong> https://supabase.com/privacy
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Content Delivery Networks</h4>
            <p>
              <strong>Purpose:</strong> Fast delivery of platform assets<br />
              <strong>Cookies:</strong> Performance optimization and caching<br />
              <strong>Duration:</strong> Session to 1 year
            </p>
          </div>
        </div>

        <p>
          <strong>Third-Party Consent:</strong> When you accept cookies on our platform, you also 
          consent to cookies from our trusted third-party service providers.
        </p>
      </LegalSection>

      <LegalSection id="updates" title="7. Cookie Policy Updates">
        <p>
          We may update this Cookie Policy to reflect changes in our cookie usage or legal requirements. 
          When we make material changes, we will:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Update the "last modified" date at the top of this policy</li>
          <li>Notify you through the platform or email for significant changes</li>
          <li>Request renewed consent for new cookie types when required</li>
          <li>Provide clear information about what has changed</li>
        </ul>

        <p>
          We recommend reviewing this Cookie Policy periodically to stay informed about our cookie practices.
        </p>
      </LegalSection>

      <div className="mt-8 p-4 bg-slate-700 rounded-lg border border-gray-600">
        <p className="text-sm text-slate-300">
          <strong>Questions About Cookies?</strong> Contact us at privacy@playscenario.ai for 
          any questions about our cookie practices or to exercise your rights regarding cookie data.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default CookiePolicy;
