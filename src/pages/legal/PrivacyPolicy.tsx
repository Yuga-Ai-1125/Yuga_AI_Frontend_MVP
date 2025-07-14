import React from 'react';
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      title: 'Information We Collect',
      icon: <Database className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support. This includes your name, email address, profile information, and learning preferences.'
        },
        {
          subtitle: 'Learning Data',
          text: 'We collect data about your learning activities, including course progress, quiz results, time spent on lessons, and interactions with our AI avatars to personalize your learning experience.'
        },
        {
          subtitle: 'Technical Information',
          text: 'We automatically collect certain technical information when you use our services, including your IP address, browser type, device information, and usage patterns.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Eye className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Personalized Learning',
          text: 'We use your information to customize your learning experience, recommend relevant courses, and adapt our AI tutors to your learning style and pace.'
        },
        {
          subtitle: 'Service Improvement',
          text: 'We analyze usage patterns and feedback to improve our platform, develop new features, and enhance the overall learning experience.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send you important updates about your account, courses, and new features. You can opt out of marketing communications at any time.'
        }
      ]
    },
    {
      title: 'Information Sharing',
      icon: <Users className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with trusted third-party service providers who help us operate our platform, such as cloud hosting providers and analytics services.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of YUGA AI, our users, or others.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to appropriate confidentiality protections.'
        }
      ]
    },
    {
      title: 'Data Security',
      icon: <Lock className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Encryption',
          text: 'We use industry-standard encryption to protect your data both in transit and at rest. All sensitive information is encrypted using advanced cryptographic protocols.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict access controls to ensure that only authorized personnel can access your personal information, and only when necessary for legitimate business purposes.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We conduct regular security audits and assessments to identify and address potential vulnerabilities in our systems and processes.'
        }
      ]
    },
    {
      title: 'Your Rights',
      icon: <Shield className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting our support team.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You can request a copy of your personal data in a structured, machine-readable format, allowing you to transfer your information to another service if desired.'
        },
        {
          subtitle: 'Deletion',
          text: 'You can request deletion of your personal information, subject to certain legal and operational requirements. We will delete your data within 30 days of a valid request.'
        }
      ]
    },
    {
      title: 'International Transfers',
      icon: <Globe className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Global Operations',
          text: 'YUGA AI operates globally, and your information may be transferred to and processed in countries other than your country of residence, including the United States.'
        },
        {
          subtitle: 'Adequate Protection',
          text: 'We ensure that any international transfers of personal data are subject to appropriate safeguards, such as standard contractual clauses or adequacy decisions.'
        },
        {
          subtitle: 'Compliance',
          text: 'We comply with applicable data protection laws, including GDPR for European users and CCPA for California residents.'
        }
      ]
    }
  ];

  return (
    <PageLayout 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your personal information"
    >
      {/* Last Updated */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-800">
          <strong>Last Updated:</strong> {lastUpdated}
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At YUGA AI, we are committed to protecting your privacy and being transparent about how we collect, 
              use, and share your information. This Privacy Policy explains our practices and your rights regarding your personal data.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              This Privacy Policy applies to all services offered by YUGA AI, including our website, mobile applications, 
              and AI-powered educational platform. By using our services, you agree to the collection and use of information 
              in accordance with this policy.
            </p>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy 
              periodically for any changes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      {sections.map((section, index) => (
        <section key={index} className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white mr-4">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            </div>
            
            <div className="space-y-6">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.subtitle}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Contact Information */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact our Privacy Team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-purple-200">privacy@yugaai.com</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Data Protection Officer</h3>
                <p className="text-purple-200">dpo@yugaai.com</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Mailing Address</h3>
                <p className="text-purple-200">123 Innovation Drive<br />San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Privacy Principles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">We are clear about what data we collect and how we use it</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Security</h3>
              <p className="text-gray-600 text-sm">We protect your data with industry-leading security measures</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Control</h3>
              <p className="text-gray-600 text-sm">You have control over your personal information and privacy settings</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};