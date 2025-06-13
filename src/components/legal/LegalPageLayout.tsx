
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  tableOfContents?: Array<{
    id: string;
    title: string;
    subsections?: Array<{ id: string; title: string }>;
  }>;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  lastUpdated,
  children,
  tableOfContents = []
}) => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 border-gray-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <div className="flex items-center text-slate-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last updated: {lastUpdated}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border border-gray-700 p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
                <nav className="space-y-2">
                  {tableOfContents.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className="block text-left text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        {section.title}
                      </button>
                      {section.subsections && (
                        <div className="ml-4 mt-1 space-y-1">
                          {section.subsections.map((subsection) => (
                            <button
                              key={subsection.id}
                              onClick={() => scrollToSection(subsection.id)}
                              className="block text-left text-xs text-slate-400 hover:text-slate-300 transition-colors duration-200"
                            >
                              {subsection.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={tableOfContents.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}>
            <Card className="bg-slate-800 border border-gray-700 p-8">
              <div className="prose prose-invert max-w-none">
                {children}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-800 border border-gray-700 p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-cyan-400 mb-2">Legal Inquiries</h4>
                  <div className="flex items-center text-slate-300 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    legal@playscenario.ai
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-cyan-400 mb-2">Privacy & Data Protection</h4>
                  <div className="flex items-center text-slate-300 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    privacy@playscenario.ai
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-cyan-400 mb-2">General Support</h4>
                  <div className="flex items-center text-slate-300 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    support@playscenario.ai
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-cyan-400 mb-2">Security Issues</h4>
                  <div className="flex items-center text-slate-300 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    security@playscenario.ai
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;
