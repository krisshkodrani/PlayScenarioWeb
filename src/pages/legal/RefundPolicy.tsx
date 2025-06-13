
import React from 'react';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

const RefundPolicy: React.FC = () => {
  const tableOfContents = [
    {
      id: 'overview',
      title: '1. Overview',
    },
    {
      id: 'refund-eligibility',
      title: '2. Refund Eligibility',
    },
    {
      id: 'consumer-rights',
      title: '3. Consumer Rights',
    },
    {
      id: 'refund-process',
      title: '4. Refund Process',
    },
    {
      id: 'processing-times',
      title: '5. Processing Times',
    },
    {
      id: 'exceptions',
      title: '6. Exceptions',
    },
    {
      id: 'disputes',
      title: '7. Dispute Resolution',
    }
  ];

  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="December 13, 2024"
      tableOfContents={tableOfContents}
    >
      <LegalSection id="overview" title="1. Overview">
        <p>
          This Refund Policy explains when and how you can request refunds for credit purchases 
          on PlayScenarioAI. We are committed to providing fair refund procedures that comply 
          with consumer protection laws.
        </p>
        <p>
          <strong>Key Principles:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Fair and transparent refund procedures</li>
          <li>Compliance with EU consumer protection directives</li>
          <li>Protection for technical issues and service failures</li>
          <li>Clear timelines and expectations</li>
        </ul>
      </LegalSection>

      <LegalSection id="refund-eligibility" title="2. Refund Eligibility">
        <p>
          You may be eligible for a refund in the following circumstances:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-emerald-400">Automatic Refund Situations</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li><strong>Platform Technical Failures:</strong> Credits lost due to server issues or platform bugs</li>
              <li><strong>Payment Processing Errors:</strong> Duplicate charges or incorrect amounts</li>
              <li><strong>Service Unavailability:</strong> Extended service outages preventing credit use</li>
              <li><strong>Account Compromise:</strong> Unauthorized purchases on compromised accounts</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-emerald-400">Discretionary Refund Situations</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li><strong>Unused Credits:</strong> Refunds for genuinely unused credits upon account closure</li>
              <li><strong>Service Dissatisfaction:</strong> Case-by-case review for legitimate service concerns</li>
              <li><strong>Accidental Purchases:</strong> Purchases made in error, reported promptly</li>
              <li><strong>Feature Changes:</strong> Significant changes that affect purchased credit value</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400">Non-Refundable Situations</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li><strong>Used Credits:</strong> Credits that have been used for AI interactions</li>
              <li><strong>Policy Violations:</strong> Account suspension or termination for guideline violations</li>
              <li><strong>Buyer's Remorse:</strong> Simple change of mind after using the service</li>
              <li><strong>Expired Periods:</strong> Requests made after applicable refund periods</li>
            </ul>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="consumer-rights" title="3. Consumer Rights">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400">EU Consumer Rights (Directive 2011/83/EU)</h4>
            <p>
              <strong>14-Day Cooling-Off Period:</strong> EU consumers have 14 days from purchase 
              to request a refund for unused credits without needing to justify the decision.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Applies to all credit purchases by EU consumers</li>
              <li>No reason required for refund request</li>
              <li>Refund limited to unused credits only</li>
              <li>Request must be made within 14 days of purchase</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400">Austrian Consumer Protection</h4>
            <p>
              Austrian consumers benefit from additional protections under national consumer law:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Protection against unfair contract terms</li>
              <li>Right to clear information about services</li>
              <li>Access to alternative dispute resolution</li>
              <li>Protection for payment processing errors</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400">General Consumer Protections</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>Protection from technical service failures</li>
              <li>Fair treatment in refund processing</li>
              <li>Clear communication about refund status</li>
              <li>Escalation procedures for disputes</li>
            </ul>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="refund-process" title="4. Refund Process">
        <p>
          <strong>Step 1: Submit Refund Request</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Email support@playscenario.ai with your refund request</li>
          <li>Include your account email and purchase details</li>
          <li>Specify the reason for your refund request</li>
          <li>Provide any relevant transaction IDs or order numbers</li>
        </ul>

        <p className="mt-4">
          <strong>Step 2: Request Review</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>We review your request within 2-3 business days</li>
          <li>We may request additional information or clarification</li>
          <li>Account usage and credit history are verified</li>
          <li>Eligibility is determined based on our refund criteria</li>
        </ul>

        <p className="mt-4">
          <strong>Step 3: Decision Communication</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>You receive email notification of our decision</li>
          <li>Approved refunds include processing timeline</li>
          <li>Denied requests include explanation and appeal options</li>
          <li>Partial refunds clearly specify the refunded amount</li>
        </ul>

        <p className="mt-4">
          <strong>Step 4: Refund Processing</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Approved refunds are processed to original payment method</li>
          <li>Credit balance is adjusted immediately</li>
          <li>Transaction confirmation is sent via email</li>
          <li>Follow-up if refund doesn't appear within expected timeframe</li>
        </ul>
      </LegalSection>

      <LegalSection id="processing-times" title="5. Processing Times">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-600 rounded-lg">
            <thead className="bg-slate-700">
              <tr>
                <th className="border border-gray-600 p-3 text-left">Refund Type</th>
                <th className="border border-gray-600 p-3 text-left">Review Time</th>
                <th className="border border-gray-600 p-3 text-left">Processing Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-600 p-3">Technical Failure</td>
                <td className="border border-gray-600 p-3">24-48 hours</td>
                <td className="border border-gray-600 p-3">1-2 business days</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">EU Consumer Rights</td>
                <td className="border border-gray-600 p-3">2-3 business days</td>
                <td className="border border-gray-600 p-3">3-5 business days</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">Payment Error</td>
                <td className="border border-gray-600 p-3">1-2 business days</td>
                <td className="border border-gray-600 p-3">2-3 business days</td>
              </tr>
              <tr>
                <td className="border border-gray-600 p-3">Discretionary Review</td>
                <td className="border border-gray-600 p-3">3-5 business days</td>
                <td className="border border-gray-600 p-3">5-7 business days</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          <strong>Payment Method Processing Times:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>Credit/Debit Cards:</strong> 3-5 business days</li>
          <li><strong>PayPal:</strong> 1-2 business days</li>
          <li><strong>Bank Transfer:</strong> 5-7 business days</li>
          <li><strong>Digital Wallets:</strong> 1-3 business days</li>
        </ul>
      </LegalSection>

      <LegalSection id="exceptions" title="6. Exceptions and Special Cases">
        <p>
          <strong>Promotional Credits:</strong> Credits received through promotions, bonuses, or 
          referral programs are generally non-refundable and may have different terms.
        </p>

        <p>
          <strong>Gift Credits:</strong> Credits received as gifts may be refunded to the gift 
          purchaser upon request, subject to verification.
        </p>

        <p>
          <strong>Bulk Purchases:</strong> Large credit purchases may have extended review periods 
          and may require additional verification procedures.
        </p>

        <p>
          <strong>Account Closures:</strong> Users closing accounts may receive partial refunds 
          for unused credits, calculated based on usage patterns and remaining balance.
        </p>

        <p>
          <strong>Currency Fluctuations:</strong> Refunds are processed in the original purchase 
          currency. Currency conversion differences are not compensated.
        </p>
      </LegalSection>

      <LegalSection id="disputes" title="7. Dispute Resolution">
        <p>
          If you disagree with a refund decision, you have several options:
        </p>

        <p>
          <strong>Internal Appeal Process:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Email appeals to support@playscenario.ai within 30 days</li>
          <li>Provide additional evidence or clarification</li>
          <li>Appeals are reviewed by senior support staff</li>
          <li>Appeal decisions are provided within 5-7 business days</li>
        </ul>

        <p className="mt-4">
          <strong>External Dispute Resolution:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><strong>EU Consumers:</strong> Access EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr</li>
          <li><strong>Austrian Consumers:</strong> Contact Austrian Consumer Protection Agency</li>
          <li><strong>Payment Disputes:</strong> Contact your payment provider for chargeback procedures</li>
          <li><strong>Legal Action:</strong> Court proceedings as a last resort option</li>
        </ul>

        <p className="mt-4">
          <strong>Chargeback Policy:</strong> While we prefer to resolve disputes directly, we 
          understand your right to pursue chargebacks. However, chargebacks may result in 
          account suspension pending resolution.
        </p>
      </LegalSection>

      <div className="mt-8 space-y-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
          <p className="text-emerald-400 font-medium">
            <strong>Fair Refund Commitment:</strong> We're committed to fair and transparent 
            refund procedures. When in doubt, we err on the side of customer satisfaction 
            while maintaining sustainable business practices.
          </p>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg border border-gray-600">
          <p className="text-sm text-slate-300">
            <strong>Questions?</strong> Contact our support team at support@playscenario.ai 
            for any questions about refunds or to discuss specific situations not covered 
            in this policy.
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default RefundPolicy;
