
import React from 'react';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

const TermsOfService: React.FC = () => {
  const tableOfContents = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
    },
    {
      id: 'platform-definition',
      title: '2. Platform Definition',
    },
    {
      id: 'age-restrictions',
      title: '3. Age Restrictions',
      subsections: [
        { id: 'eu-requirements', title: 'EU Requirements' },
        { id: 'us-coppa', title: 'US COPPA Compliance' }
      ]
    },
    {
      id: 'user-accounts',
      title: '4. User Accounts',
    },
    {
      id: 'credit-system',
      title: '5. Credit System',
      subsections: [
        { id: 'credit-purchase', title: 'Credit Purchase & Usage' },
        { id: 'refunds', title: 'Refunds' }
      ]
    },
    {
      id: 'content-ownership',
      title: '6. Content & Intellectual Property',
      subsections: [
        { id: 'ai-content', title: 'AI-Generated Content' },
        { id: 'user-content', title: 'User-Generated Content' }
      ]
    },
    {
      id: 'community-standards',
      title: '7. Community Standards',
    },
    {
      id: 'liability',
      title: '8. Limitation of Liability',
    },
    {
      id: 'termination',
      title: '9. Account Termination',
    },
    {
      id: 'changes',
      title: '10. Changes to Terms',
    },
    {
      id: 'governing-law',
      title: '11. Governing Law',
    }
  ];

  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated="December 13, 2024"
      tableOfContents={tableOfContents}
    >
      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p>
          By creating an account, accessing, or using PlayScenarioAI ("the Platform", "our Service"), 
          you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these 
          Terms, you may not use our Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and PlayScenarioAI, 
          operated as a sole proprietorship under Austrian law.
        </p>
      </LegalSection>

      <LegalSection id="platform-definition" title="2. Platform Definition and Scope">
        <p>
          PlayScenarioAI is an <strong>educational technology platform</strong> that provides 
          AI-powered interactive scenario training for professional development, crisis management, 
          and skill building through multi-agent AI conversation systems.
        </p>
        <p>
          Our Service enables users to:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Create and participate in interactive AI-powered scenarios</li>
          <li>Engage with multiple AI characters in educational conversations</li>
          <li>Practice real-world skills in a safe, controlled environment</li>
          <li>Access community-created educational content</li>
          <li>Track learning progress and achievements</li>
        </ul>
        <p>
          <strong>Educational Purpose Disclaimer:</strong> This platform is designed for educational 
          and training purposes. AI responses are generated for learning scenarios and should not be 
          considered professional advice in real-world situations.
        </p>
      </LegalSection>

      <LegalSection id="age-restrictions" title="3. Age Restrictions and Parental Consent">
        <LegalSection id="eu-requirements" title="EU Requirements (GDPR Article 8)" level={2}>
          <p>
            For users in the European Union:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Users under 16</strong> require verified parental consent</li>
            <li>Parents have the right to access, modify, or delete their child's data</li>
            <li>Parental consent must be obtained before account activation</li>
            <li>We may request additional verification for age confirmation</li>
          </ul>
        </LegalSection>

        <LegalSection id="us-coppa" title="US COPPA Compliance" level={2}>
          <p>
            For users in the United States:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Users under 13</strong> are prohibited without verified parental consent</li>
            <li>Limited data collection applies to verified minors</li>
            <li>Parents may request access to and deletion of their child's information</li>
            <li>Clear notice will be provided to parents about our data practices</li>
          </ul>
        </LegalSection>

        <p>
          <strong>Age Verification:</strong> We may request age verification at any time. 
          Providing false age information is grounds for immediate account termination.
        </p>
      </LegalSection>

      <LegalSection id="user-accounts" title="4. User Accounts and Registration">
        <p>
          To access our Service, you must create an account with accurate information:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Email address</strong> (required): Used for account authentication, security, and platform communication</li>
          <li><strong>Username</strong> (optional): For personalization and community interaction</li>
          <li><strong>Password</strong>: Must meet security requirements (minimum 8 characters, including uppercase, lowercase, number, and special character)</li>
        </ul>
        
        <p>
          <strong>Account Security:</strong> You are responsible for maintaining the confidentiality 
          of your account credentials. Notify us immediately of any unauthorized access.
        </p>
        
        <p>
          <strong>Account Accuracy:</strong> You must provide accurate and complete information. 
          False information may result in account suspension or termination.
        </p>
      </LegalSection>

      <LegalSection id="credit-system" title="5. Credit System and Virtual Currency">
        <LegalSection id="credit-purchase" title="Credit Purchase and Usage" level={2}>
          <p>
            Credits are virtual currency used to access AI interactions on our platform:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Credits are required for AI conversation interactions</li>
            <li>Approximate conversion: 1 credit = 3-5 AI responses</li>
            <li>Credits are non-transferable between accounts</li>
            <li>Credits do not expire unless account is inactive for 2+ years</li>
            <li>Credit purchases are processed through secure payment providers</li>
          </ul>
        </LegalSection>

        <LegalSection id="refunds" title="Refund Policy" level={2}>
          <p>
            <strong>EU Consumer Rights:</strong> EU consumers have a 14-day cooling-off period 
            for credit purchases, during which refunds may be requested for unused credits.
          </p>
          <p>
            <strong>Technical Issues:</strong> Full refunds are provided for credits lost due to 
            platform technical failures or service interruptions.
          </p>
          <p>
            <strong>Partial Refunds:</strong> Unused credits may be refunded on a case-by-case 
            basis for account closures or service dissatisfaction.
          </p>
          <p>
            Refund requests should be submitted to support@playscenario.ai with account details 
            and reason for the request.
          </p>
        </LegalSection>
      </LegalSection>

      <LegalSection id="content-ownership" title="6. Content and Intellectual Property">
        <LegalSection id="ai-content" title="AI-Generated Content" level={2}>
          <p>
            <strong>Ownership:</strong> PlayScenarioAI owns all AI-generated responses and content 
            created by our AI systems.
          </p>
          <p>
            <strong>Usage Rights:</strong> You receive a non-exclusive license to use AI-generated 
            content for educational and personal purposes.
          </p>
          <p>
            <strong>No Warranty:</strong> AI responses are provided "as-is" without warranty of 
            accuracy, completeness, or applicability to real-world situations.
          </p>
        </LegalSection>

        <LegalSection id="user-content" title="User-Generated Content" level={2}>
          <p>
            <strong>Your Content:</strong> You retain ownership of original scenarios, characters, 
            and other content you create.
          </p>
          <p>
            <strong>Platform License:</strong> By uploading content, you grant us a worldwide, 
            non-exclusive license to use, display, and distribute your content for platform operation.
          </p>
          <p>
            <strong>Content Responsibility:</strong> You are responsible for ensuring your content 
            does not infringe copyrights, trademarks, or other intellectual property rights.
          </p>
          <p>
            <strong>Prohibited Content:</strong> Recreation of copyrighted characters or scenarios 
            without permission is strictly prohibited.
          </p>
        </LegalSection>
      </LegalSection>

      <LegalSection id="community-standards" title="7. Community Standards and Content Moderation">
        <p>
          Our platform maintains a safe educational environment through automated and human moderation:
        </p>
        
        <p>
          <strong>Prohibited Content includes:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Simulation of illegal activities or violence</li>
          <li>Hate speech, discrimination, or harassment scenarios</li>
          <li>Sexual or inappropriate content</li>
          <li>Privacy violations or personal information sharing</li>
          <li>Spam, advertising, or commercial solicitation</li>
        </ul>

        <p>
          <strong>Content Safety Systems:</strong> We use Azure AI Content Safety and human 
          reviewers to monitor content. Users may appeal moderation decisions through our 
          support system.
        </p>

        <p>
          <strong>Community Guidelines:</strong> Detailed community guidelines are available 
          separately and are incorporated by reference into these Terms.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="8. Limitation of Liability and Disclaimers">
        <p>
          <strong>Educational Platform Disclaimers:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>AI responses are for educational purposes only</li>
          <li>No guarantee of real-world applicability or outcomes</li>
          <li>Users are responsible for applying learning appropriately</li>
          <li>Platform does not provide professional advice</li>
        </ul>

        <p>
          <strong>Service Limitations:</strong> We provide our service on a "best effort" basis. 
          We do not guarantee uninterrupted service availability or AI response quality.
        </p>

        <p>
          <strong>Liability Limitation:</strong> To the maximum extent permitted by law, our 
          liability is limited to the amount paid for credits in the 12 months preceding any claim.
        </p>

        <p>
          <strong>Austrian/EU Consumer Rights:</strong> Nothing in these Terms limits consumer 
          rights under mandatory Austrian or EU consumer protection law.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="9. Account Termination">
        <p>
          <strong>Termination by You:</strong> You may terminate your account at any time through 
          account settings or by contacting support.
        </p>
        
        <p>
          <strong>Termination by Us:</strong> We may suspend or terminate accounts for violations 
          of these Terms, illegal activity, or extended inactivity.
        </p>
        
        <p>
          <strong>Effect of Termination:</strong> Upon termination, your access to the platform 
          ceases, and unused credits may be refunded according to our refund policy.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes to Terms">
        <p>
          We may update these Terms to reflect changes in our services or legal requirements. 
          Material changes will be communicated via:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Email notification to registered users</li>
          <li>Prominent platform notices</li>
          <li>Updated "last modified" date on this page</li>
        </ul>
        
        <p>
          Continued use of the platform after changes constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="11. Governing Law and Jurisdiction">
        <p>
          These Terms are governed by Austrian law. Disputes will be resolved in Austrian courts, 
          except where EU consumer protection law provides for resolution in the consumer's home country.
        </p>
        
        <p>
          <strong>Alternative Dispute Resolution:</strong> EU consumers may access the European 
          Commission's Online Dispute Resolution platform at ec.europa.eu/consumers/odr.
        </p>
      </LegalSection>

      <div className="mt-8 p-4 bg-slate-700 rounded-lg border border-gray-600">
        <p className="text-sm text-slate-300">
          <strong>Document Information:</strong> These Terms of Service are effective as of 
          December 13, 2024. For questions about these Terms, contact legal@playscenario.ai.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfService;
