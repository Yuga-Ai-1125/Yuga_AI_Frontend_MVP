import React from 'react';
import { Shield, FileText, Users, AlertTriangle, Scale, Globe } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export const TermsOfService: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <FileText className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing and using YUGA AI services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Continued use of our services after such modifications constitutes acceptance of the updated terms.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 13 years old to use our services. If you are under 18, you must have parental consent. By using our services, you represent that you meet these age requirements.'
        }
      ]
    },
    {
      title: 'User Accounts and Responsibilities',
      icon: <Users className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Account Creation',
          text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.'
        },
        {
          subtitle: 'Prohibited Uses',
          text: 'You may not use our services for any illegal purposes, to transmit harmful content, to violate intellectual property rights, or to interfere with the proper functioning of our platform.'
        },
        {
          subtitle: 'Content Guidelines',
          text: 'Any content you submit must be appropriate, legal, and not infringe on others\' rights. We reserve the right to remove content that violates these guidelines without notice.'
        }
      ]
    },
    {
      title: 'Service Availability and Limitations',
      icon: <Globe className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain high availability of our services but cannot guarantee uninterrupted access. We may temporarily suspend services for maintenance, updates, or due to circumstances beyond our control.'
        },
        {
          subtitle: 'AI Limitations',
          text: 'Our AI tutors and educational content are designed to assist learning but should not be considered a replacement for professional education or advice. AI responses may contain errors or inaccuracies.'
        },
        {
          subtitle: 'Geographic Restrictions',
          text: 'Our services may not be available in all countries or regions due to legal or technical restrictions. We reserve the right to limit access based on geographic location.'
        }
      ]
    },
    {
      title: 'Intellectual Property Rights',
      icon: <Shield className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Our Content',
          text: 'All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by YUGA AI and are protected by copyright, trademark, and other intellectual property laws.'
        },
        {
          subtitle: 'User Content',
          text: 'You retain ownership of content you create, but grant us a license to use, modify, and distribute your content as necessary to provide our services. You are responsible for ensuring you have the right to share any content you upload.'
        },
        {
          subtitle: 'Third-Party Content',
          text: 'Our platform may include content from third parties. We respect intellectual property rights and will respond to valid copyright infringement claims in accordance with applicable law.'
        }
      ]
    },
    {
      title: 'Payment and Subscription Terms',
      icon: <Scale className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Subscription Plans',
          text: 'We offer various subscription plans with different features and pricing. Subscription fees are billed in advance and are non-refundable except as required by law or as specified in our refund policy.'
        },
        {
          subtitle: 'Auto-Renewal',
          text: 'Subscriptions automatically renew unless cancelled before the renewal date. You can cancel your subscription at any time through your account settings or by contacting our support team.'
        },
        {
          subtitle: 'Price Changes',
          text: 'We may change subscription prices with at least 30 days\' notice. Price changes will not affect your current billing cycle but will apply to subsequent renewals unless you cancel your subscription.'
        }
      ]
    },
    {
      title: 'Limitation of Liability',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Service Disclaimer',
          text: 'Our services are provided "as is" without warranties of any kind. We do not guarantee that our services will meet your specific requirements or that they will be error-free or uninterrupted.'
        },
        {
          subtitle: 'Limitation of Damages',
          text: 'To the maximum extent permitted by law, YUGA AI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.'
        },
        {
          subtitle: 'Maximum Liability',
          text: 'Our total liability to you for any claims arising from these terms or your use of our services shall not exceed the amount you paid us in the 12 months preceding the claim.'
        }
      ]
    }
  ];

  return (
    <PageLayout 
      title="Terms of Service" 
      subtitle="Legal terms and conditions governing your use of YUGA AI services"
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
            <Scale className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These Terms of Service govern your use of YUGA AI's educational platform and services. 
              Please read these terms carefully before using our services.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Welcome to YUGA AI. These Terms of Service ("Terms") govern your use of our website, 
              mobile applications, and AI-powered educational services (collectively, the "Services") 
              operated by YUGA AI Inc. ("we," "us," or "our").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you disagree 
              with any part of these terms, then you may not access the Services.
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

      {/* Governing Law */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Dispute Resolution</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Governing Law</h3>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                without regard to its conflict of law provisions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Dispute Resolution</h3>
              <p className="text-gray-600 leading-relaxed">
                Any disputes arising from these Terms or your use of our Services will be resolved through binding 
                arbitration in accordance with the rules of the American Arbitration Association, except where 
                prohibited by law.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Severability</h3>
              <p className="text-gray-600 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be 
                limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in 
                full force and effect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              If you have any questions about these Terms of Service, please contact our legal team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-2">Legal Department</h3>
                <p className="text-purple-200">legal@yugaai.com</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Mailing Address</h3>
                <p className="text-purple-200">
                  YUGA AI Inc.<br />
                  123 Innovation Drive<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};