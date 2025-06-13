
import React from 'react';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

const CommunityGuidelines: React.FC = () => {
  const tableOfContents = [
    {
      id: 'overview',
      title: '1. Overview',
    },
    {
      id: 'community-values',
      title: '2. Community Values',
    },
    {
      id: 'prohibited-content',
      title: '3. Prohibited Content',
    },
    {
      id: 'scenario-guidelines',
      title: '4. Scenario Creation Guidelines',
    },
    {
      id: 'character-guidelines',
      title: '5. Character Creation Guidelines',
    },
    {
      id: 'reporting',
      title: '6. Reporting Violations',
    },
    {
      id: 'enforcement',
      title: '7. Enforcement Actions',
    },
    {
      id: 'appeals',
      title: '8. Appeals Process',
    }
  ];

  return (
    <LegalPageLayout
      title="Community Guidelines"
      lastUpdated="December 13, 2024"
      tableOfContents={tableOfContents}
    >
      <LegalSection id="overview" title="1. Overview">
        <p>
          PlayScenarioAI is committed to maintaining a safe, inclusive, and educational environment 
          for all users. These Community Guidelines outline our expectations for user behavior and 
          content creation on our platform.
        </p>
        <p>
          By using PlayScenarioAI, you agree to follow these guidelines and help us create a 
          positive learning environment for everyone.
        </p>
      </LegalSection>

      <LegalSection id="community-values" title="2. Community Values">
        <p>
          Our community is built on these core values:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Educational Focus:</strong> All content should contribute to learning and skill development</li>
          <li><strong>Respect:</strong> Treat all community members with dignity and respect</li>
          <li><strong>Inclusivity:</strong> Welcome users from all backgrounds and experience levels</li>
          <li><strong>Safety:</strong> Maintain a safe environment free from harassment and harm</li>
          <li><strong>Authenticity:</strong> Create original, honest content that adds value</li>
          <li><strong>Collaboration:</strong> Support and learn from other community members</li>
        </ul>
      </LegalSection>

      <LegalSection id="prohibited-content" title="3. Prohibited Content">
        <p>
          The following types of content are strictly prohibited on PlayScenarioAI:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-red-400">Illegal Activities</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Scenarios depicting or encouraging illegal activities</li>
              <li>Content that violates local, national, or international laws</li>
              <li>Instructions for illegal actions or harmful activities</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400">Hate Speech and Discrimination</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Content that attacks or demeans individuals based on protected characteristics</li>
              <li>Scenarios that promote discrimination or prejudice</li>
              <li>Hate speech or symbols targeting any group</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400">Sexual or Inappropriate Content</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Sexually explicit scenarios or characters</li>
              <li>Content that sexualizes minors</li>
              <li>Inappropriate romantic or sexual role-playing scenarios</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400">Harassment and Bullying</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Content designed to harass, threaten, or intimidate</li>
              <li>Scenarios that normalize or encourage bullying behavior</li>
              <li>Personal attacks or targeted harassment</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400">Privacy Violations</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Sharing personal information without consent</li>
              <li>Creating scenarios based on real individuals without permission</li>
              <li>Content that violates someone's privacy or confidentiality</li>
            </ul>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="scenario-guidelines" title="4. Scenario Creation Guidelines">
        <p>
          <strong>Educational Value:</strong> Scenarios should have clear learning objectives and 
          provide meaningful skill development opportunities.
        </p>

        <p>
          <strong>Best Practices for Scenarios:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Include clear objectives and success criteria</li>
          <li>Provide realistic but appropriate challenges</li>
          <li>Use professional, educational language</li>
          <li>Include diverse perspectives and inclusive scenarios</li>
          <li>Test scenarios thoroughly before publishing</li>
          <li>Provide helpful context and background information</li>
        </ul>

        <p>
          <strong>Scenario Categories to Encourage:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Professional skill development (communication, leadership, problem-solving)</li>
          <li>Crisis management and emergency response training</li>
          <li>Customer service and conflict resolution</li>
          <li>Interview preparation and career development</li>
          <li>Educational simulations for academic subjects</li>
          <li>Cultural competency and diversity training</li>
        </ul>
      </LegalSection>

      <LegalSection id="character-guidelines" title="5. Character Creation Guidelines">
        <p>
          <strong>Original Characters:</strong> Create original characters that don't infringe on 
          copyrights or trademarks. Avoid recreating fictional characters from media.
        </p>

        <p>
          <strong>Character Design Best Practices:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Create diverse, inclusive character representations</li>
          <li>Avoid stereotypes and harmful generalizations</li>
          <li>Provide clear character motivations and backgrounds</li>
          <li>Ensure characters serve educational purposes</li>
          <li>Use respectful and professional character descriptions</li>
          <li>Include appropriate expertise and knowledge areas</li>
        </ul>

        <p>
          <strong>Professional Character Types:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Industry experts and professionals</li>
          <li>Mentors and coaches</li>
          <li>Clients and customers in various scenarios</li>
          <li>Team members and colleagues</li>
          <li>Students and learners</li>
          <li>Authority figures and decision-makers</li>
        </ul>
      </LegalSection>

      <LegalSection id="reporting" title="6. Reporting Violations">
        <p>
          Help us maintain a safe community by reporting content that violates these guidelines:
        </p>

        <p>
          <strong>How to Report:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Use the "Report" button on any scenario or character</li>
          <li>Email detailed reports to support@playscenario.ai</li>
          <li>Provide specific information about the violation</li>
          <li>Include screenshots or links when helpful</li>
        </ul>

        <p>
          <strong>What to Include in Reports:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Link to the violating content</li>
          <li>Specific guideline or rule violated</li>
          <li>Description of why the content is problematic</li>
          <li>Any additional context that might be helpful</li>
        </ul>

        <p>
          <strong>Report Response Time:</strong> We review all reports within 24-48 hours and will 
          take appropriate action based on our investigation.
        </p>
      </LegalSection>

      <LegalSection id="enforcement" title="7. Enforcement Actions">
        <p>
          When community guidelines are violated, we may take the following actions:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-amber-400">Content Removal</h4>
            <p>Violating content will be removed from the platform and may not be restored.</p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400">Warning</h4>
            <p>First-time or minor violations may result in a warning and guidance on our guidelines.</p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400">Temporary Suspension</h4>
            <p>Repeated violations or more serious offenses may result in temporary account suspension.</p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400">Permanent Ban</h4>
            <p>Severe violations or repeated offenses after suspension may result in permanent account termination.</p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400">Feature Restrictions</h4>
            <p>Certain privileges (creating public content, commenting) may be temporarily restricted.</p>
          </div>
        </div>

        <p>
          <strong>Enforcement Principles:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Actions are proportional to the violation severity</li>
          <li>Context and intent are considered in all decisions</li>
          <li>Users receive clear explanation of actions taken</li>
          <li>Repeat offenses result in escalated consequences</li>
        </ul>
      </LegalSection>

      <LegalSection id="appeals" title="8. Appeals Process">
        <p>
          If you believe enforcement action was taken in error, you may appeal the decision:
        </p>

        <p>
          <strong>How to Appeal:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Email appeals to support@playscenario.ai within 30 days</li>
          <li>Include your account information and reference number</li>
          <li>Provide a clear explanation of why you believe the action was incorrect</li>
          <li>Include any additional evidence or context</li>
        </ul>

        <p>
          <strong>Appeal Review Process:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Appeals are reviewed by a different moderator than the original decision</li>
          <li>We provide a response within 5-7 business days</li>
          <li>Decisions may be upheld, modified, or reversed based on review</li>
          <li>Appeal decisions are final and additional appeals will not be considered</li>
        </ul>
      </LegalSection>

      <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-lg">
        <p className="text-cyan-400 font-medium">
          <strong>Building Together:</strong> These guidelines help us create a positive learning 
          environment for everyone. Thank you for helping make PlayScenarioAI a welcoming and 
          educational community.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default CommunityGuidelines;
