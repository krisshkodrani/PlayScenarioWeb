
import React from 'react';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

const PrivacyPolicy: React.FC = () => {
  const tableOfContents = [
    {
      id: 'overview',
      title: '1. Overview',
    },
    {
      id: 'data-controller',
      title: '2. Data Controller Information',
    },
    {
      id: 'data-collection',
      title: '3. Data We Collect',
      subsections: [
        { id: 'account-data', title: 'Account & Authentication Data' },
        { id: 'usage-data', title: 'Platform Usage Data' },
        { id: 'technical-data', title: 'Technical & Safety Data' }
      ]
    },
    {
      id: 'legal-basis',
      title: '4. Legal Basis for Processing',
    },
    {
      id: 'data-use',
      title: '5. How We Use Your Data',
    },
    {
      id: 'third-party',
      title: '6. Third-Party Services',
      subsections: [
        { id: 'openai', title: 'OpenAI Integration' },
        { id: 'azure', title: 'Azure AI Content Safety' },
        { id: 'supabase', title: 'Supabase Data Storage' }
      ]
    },
    {
      id: 'data-sharing',
      title: '7. Data Sharing',
    },
    {
      id: 'user-rights',
      title: '8. Your Rights',
    },
    {
      id: 'data-retention',
      title: '9. Data Retention',
    },
    {
      id: 'international-transfers',
      title: '10. International Transfers',
    },
    {
      id: 'security',
      title: '11. Data Security',
    },
    {
      id: 'children',
      title: '12. Children\'s Privacy',
    },
    {
      id: 'changes',
      title: '13. Changes to Privacy Policy',
    },
    {
      id: 'contact',
      title: '14. Contact Information',
    }
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="December 13, 2024"
      tableOfContents={tableOfContents}
    >
      <LegalSection id="overview" title="1. Overview">
        <p>
          This Privacy Policy explains how PlayScenarioAI ("we", "our", or "us") collects, uses, 
          and protects your personal information when you use our educational AI platform.
        </p>
        <p>
          We are committed to protecting your privacy and complying with the General Data Protection 
          Regulation (GDPR), Austrian data protection law, and other applicable privacy regulations.
        </p>
        <p>
          <strong>Key Points:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>We collect minimal data necessary for platform functionality</li>
          <li>Your conversation data helps improve AI responses</li>
          <li>You have full control over your data and can delete it at any time</li>
          <li>We use industry-standard security measures to protect your information</li>
        </ul>
      </LegalSection>

      <LegalSection id="data-controller" title="2. Data Controller Information">
        <div className="bg-slate-700 p-4 rounded-lg border border-gray-600">
          <p><strong>Data Controller:</strong> PlayScenarioAI</p>
          <p><strong>Business Type:</strong> Sole Proprietorship (Austrian law)</p>
          <p><strong>Contact:</strong> privacy@playscenario.ai</p>
          <p><strong>Data Protection Officer:</strong> privacy@playscenario.ai</p>
        </div>
        
        <p className="mt-4">
          <strong>EU Representative:</strong> As required under GDPR Article 27, we have appointed 
          an EU representative for data protection matters. Contact details are available upon request.
        </p>
        
        <p>
          <strong>Supervisory Authority:</strong> Austrian Data Protection Authority (Datenschutzbehörde)<br />
          Address: Barichgasse 40-42, 1030 Wien, Austria<br />
          Website: https://www.dsb.gv.at/
        </p>
      </LegalSection>

      <LegalSection id="data-collection" title="3. Data We Collect">
        <LegalSection id="account-data" title="Account & Authentication Data" level={2}>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg">
              <thead className="bg-slate-700">
                <tr>
                  <th className="border border-gray-600 p-3 text-left">Data Type</th>
                  <th className="border border-gray-600 p-3 text-left">Purpose</th>
                  <th className="border border-gray-600 p-3 text-left">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 p-3">Email address</td>
                  <td className="border border-gray-600 p-3">Account creation, authentication, communication</td>
                  <td className="border border-gray-600 p-3">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Username</td>
                  <td className="border border-gray-600 p-3">Platform personalization and display</td>
                  <td className="border border-gray-600 p-3">Optional</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Password hash</td>
                  <td className="border border-gray-600 p-3">Account security (never stored in plain text)</td>
                  <td className="border border-gray-600 p-3">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Account creation date</td>
                  <td className="border border-gray-600 p-3">Service provision and analytics</td>
                  <td className="border border-gray-600 p-3">Automatic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection id="usage-data" title="Platform Usage Data" level={2}>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg">
              <thead className="bg-slate-700">
                <tr>
                  <th className="border border-gray-600 p-3 text-left">Data Type</th>
                  <th className="border border-gray-600 p-3 text-left">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 p-3">User messages in AI conversations</td>
                  <td className="border border-gray-600 p-3">Service delivery and AI improvement</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">AI character responses</td>
                  <td className="border border-gray-600 p-3">Platform functionality and quality assessment</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Scenario creation content</td>
                  <td className="border border-gray-600 p-3">Service provision and community features</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Character creation data</td>
                  <td className="border border-gray-600 p-3">Platform functionality and user portfolio</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Credit transaction history</td>
                  <td className="border border-gray-600 p-3">Billing and refund processing</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-3">Usage analytics</td>
                  <td className="border border-gray-600 p-3">Platform improvement and business analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection id="technical-data" title="Technical & Safety Data" level={2}>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>IP address:</strong> Security, fraud prevention, geographic compliance</li>
            <li><strong>Device information:</strong> Technical support and platform optimization</li>
            <li><strong>Session data:</strong> Authentication and security</li>
            <li><strong>Content moderation logs:</strong> Safety compliance and appeal processing</li>
            <li><strong>Error logs:</strong> Technical troubleshooting and platform improvement</li>
          </ul>
        </LegalSection>
      </LegalSection>

      <LegalSection id="legal-basis" title="4. Legal Basis for Processing (GDPR Article 6)">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400">Contract Performance (Article 6(1)(b))</h4>
            <p>Processing necessary for service delivery, account management, and AI interactions.</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Legitimate Interest (Article 6(1)(f))</h4>
            <p>Platform improvement, fraud prevention, security measures, and business analytics.</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Consent (Article 6(1)(a))</h4>
            <p>Marketing communications, optional features, and enhanced personalization.</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Legal Obligation (Article 6(1)(c))</h4>
            <p>Compliance with safety regulations, tax requirements, and data retention laws.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="data-use" title="5. How We Use Your Data">
        <p>
          We use your personal data for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Service Provision:</strong> Delivering AI conversations, scenario management, and platform features</li>
          <li><strong>Account Management:</strong> Authentication, user support, and account security</li>
          <li><strong>AI Improvement:</strong> Training and enhancing AI response quality and accuracy</li>
          <li><strong>Safety & Moderation:</strong> Content filtering, abuse prevention, and community safety</li>
          <li><strong>Payment Processing:</strong> Credit transactions, billing, and refund management</li>
          <li><strong>Communication:</strong> Service updates, support responses, and account notifications</li>
          <li><strong>Analytics:</strong> Platform usage analysis and feature development insights</li>
        </ul>
      </LegalSection>

      <LegalSection id="third-party" title="6. Third-Party Services and Data Processors">
        <LegalSection id="openai" title="OpenAI Integration" level={2}>
          <p>
            <strong>Purpose:</strong> AI response generation for platform conversations
          </p>
          <p>
            <strong>Data Shared:</strong> User messages and conversation context (without personal identifiers)
          </p>
          <p>
            <strong>Data Processing Agreement:</strong> We have a Data Processing Agreement with OpenAI 
            ensuring GDPR compliance
          </p>
          <p>
            <strong>Retention:</strong> OpenAI processes data according to their enterprise privacy policy
          </p>
          <p>
            <strong>User Control:</strong> You can request exclusion from AI training through your account settings
          </p>
        </LegalSection>

        <LegalSection id="azure" title="Azure AI Content Safety" level={2}>
          <p>
            <strong>Purpose:</strong> Automated content moderation and safety compliance
          </p>
          <p>
            <strong>Data Shared:</strong> User messages and created content for safety scanning
          </p>
          <p>
            <strong>Processing:</strong> Real-time content analysis with immediate deletion after classification
          </p>
          <p>
            <strong>Retention:</strong> No data retention by Azure AI Content Safety
          </p>
        </LegalSection>

        <LegalSection id="supabase" title="Supabase Data Storage" level={2}>
          <p>
            <strong>Purpose:</strong> Database hosting, authentication, and data management
          </p>
          <p>
            <strong>Data Stored:</strong> All platform data including accounts, conversations, and user content
          </p>
          <p>
            <strong>Location:</strong> EU data centers ensuring GDPR compliance
          </p>
          <p>
            <strong>Security:</strong> Enterprise-grade encryption and security measures
          </p>
        </LegalSection>
      </LegalSection>

      <LegalSection id="data-sharing" title="7. Data Sharing and Disclosure">
        <p>
          We do not sell, rent, or trade your personal data. We may share your information only in these limited circumstances:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Service Providers:</strong> Trusted partners who process data on our behalf under strict agreements</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our legal rights</li>
          <li><strong>Safety & Security:</strong> To prevent fraud, abuse, or protect user safety</li>
          <li><strong>Business Transfer:</strong> In case of merger, acquisition, or business transfer (with notice to users)</li>
          <li><strong>Consent:</strong> When you explicitly consent to sharing with third parties</li>
        </ul>
      </LegalSection>

      <LegalSection id="user-rights" title="8. Your Rights Under GDPR">
        <p>
          You have the following rights regarding your personal data:
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400">Right of Access (Article 15)</h4>
            <p>Request a copy of all personal data we hold about you</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Right to Rectification (Article 16)</h4>
            <p>Correct any inaccurate or incomplete personal data</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Right to Erasure (Article 17)</h4>
            <p>Request deletion of your personal data ("right to be forgotten")</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Right to Restrict Processing (Article 18)</h4>
            <p>Limit how we process your data in certain circumstances</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Right to Data Portability (Article 20)</h4>
            <p>Receive your data in a machine-readable format</p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400">Right to Object (Article 21)</h4>
            <p>Object to processing based on legitimate interests</p>
          </div>
        </div>

        <p className="mt-4">
          <strong>How to Exercise Your Rights:</strong> Contact privacy@playscenario.ai with your 
          request. We will respond within 30 days and may request identity verification.
        </p>
      </LegalSection>

      <LegalSection id="data-retention" title="9. Data Retention">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-600 rounded-lg">
            <thead className="bg-slate-700">
              <tr>
                <th className="border border-gray-600 p-3 text-left">Data Type</th>
                <th className="border border-gray-600 p-3 text-left">Retention Period</th>
                <th className="border border-gray-600 p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-600 p-3">Account data</td>
                <td className="border border-gray-600 p-3">Until account deletion + 30 days</td>
                <td className="border border-gray-600 p-3">Account recovery and security</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">Conversation history</td>
                <td className="border border-gray-600 p-3">User-controlled deletion</td>
                <td className="border border-gray-600 p-3">Service provision and AI improvement</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">Transaction records</td>
                <td className="border border-gray-600 p-3">7 years</td>
                <td className="border border-gray-600 p-3">Legal and tax requirements</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">Safety/moderation logs</td>
                <td className="border border-gray-600 p-3">2 years</td>
                <td className="border border-gray-600 p-3">Compliance and appeal processing</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">Analytics data</td>
                <td className="border border-gray-600 p-3">3 years (anonymized)</td>
                <td className="border border-gray-600 p-3">Platform improvement</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="international-transfers" title="10. International Data Transfers">
        <p>
          Your data may be transferred outside the EU for processing by our service providers:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Standard Contractual Clauses:</strong> We use EU-approved Standard Contractual Clauses for transfers</li>
          <li><strong>Adequacy Decisions:</strong> We transfer data only to countries with adequate protection as determined by the EU</li>
          <li><strong>Additional Safeguards:</strong> Technical and organizational measures ensure equivalent protection</li>
          <li><strong>Transfer Impact Assessments:</strong> We conduct assessments to ensure transfer safety</li>
        </ul>
      </LegalSection>

      <LegalSection id="security" title="11. Data Security">
        <p>
          We implement comprehensive security measures to protect your data:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Encryption:</strong> Data encrypted in transit (TLS) and at rest (AES-256)</li>
          <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
          <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
          <li><strong>Incident Response:</strong> Monitored systems with breach notification procedures</li>
          <li><strong>Data Minimization:</strong> Collection limited to necessary data only</li>
          <li><strong>Staff Training:</strong> Regular privacy and security training for all personnel</li>
        </ul>
        
        <p>
          <strong>Data Breach Notification:</strong> In case of a data breach affecting your personal data, 
          we will notify you within 72 hours as required by GDPR Article 34.
        </p>
      </LegalSection>

      <LegalSection id="children" title="12. Children's Privacy">
        <p>
          We take special care to protect children's privacy:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Age Verification:</strong> We verify user age during registration</li>
          <li><strong>Parental Consent:</strong> Required for users under 16 (EU) or 13 (US)</li>
          <li><strong>Limited Data Collection:</strong> Minimal data collection for verified minors</li>
          <li><strong>Parental Rights:</strong> Parents can access, modify, or delete their child's data</li>
          <li><strong>Educational Focus:</strong> Content and interactions designed for educational purposes</li>
        </ul>
      </LegalSection>

      <LegalSection id="changes" title="13. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
          We will notify you of material changes through:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Email notification to your registered email address</li>
          <li>Prominent notice on our platform</li>
          <li>Updated "last modified" date at the top of this policy</li>
        </ul>
        <p>
          We encourage you to review this Privacy Policy periodically to stay informed about our privacy practices.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="14. Contact Information">
        <p>
          For privacy-related questions, requests, or concerns, please contact us:
        </p>
        <div className="bg-slate-700 p-4 rounded-lg border border-gray-600">
          <p><strong>Privacy Contact:</strong> privacy@playscenario.ai</p>
          <p><strong>Data Subject Rights:</strong> privacy@playscenario.ai</p>
          <p><strong>Security Issues:</strong> security@playscenario.ai</p>
          <p><strong>General Support:</strong> support@playscenario.ai</p>
        </div>
      </LegalSection>

      <div className="mt-8 p-4 bg-slate-700 rounded-lg border border-gray-600">
        <p className="text-sm text-slate-300">
          <strong>Document Information:</strong> This Privacy Policy is effective as of 
          December 13, 2024 and applies to all users of the PlayScenarioAI platform.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
