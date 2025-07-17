import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  X,
} from "lucide-react";
import { PageLayout } from "../../components/layout/PageLayout";
import { ChatInterface } from "../../components/ChatInterface";

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
    priority: "normal",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a network request delay (e.g., sending data to backend)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show personalized alert message with name and subject
    alert(
      `Thank you, ${formData.name}! Your message regarding "${formData.subject}" has been received. We will get back to you within 24 hours.`
    );

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "general",
      message: "",
      priority: "normal",
    });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@yugaai.com",
      response: "Within 24 hours",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 24/7",
      response: "Instant response",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak with an expert",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri, 9AM-6PM PST",
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Innovation Drive, Suite 400",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      type: "Headquarters",
    },
    {
      city: "New York",
      address: "456 Tech Avenue, Floor 15",
      zipCode: "New York, NY 10001",
      phone: "+1 (555) 123-4568",
      type: "East Coast Office",
    },
    {
      city: "London",
      address: "789 Education Street",
      zipCode: "London, UK EC1A 1BB",
      phone: "+44 20 1234 5678",
      type: "European Office",
    },
  ];

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "We aim to respond to all inquiries within 24 hours during business days. For urgent issues, please use our live chat feature.",
    },
    {
      question: "What information should I include in my message?",
      answer:
        "Please include your account email, a detailed description of your issue, and any relevant screenshots or error messages.",
    },
    {
      question: "Do you offer phone support?",
      answer:
        "Yes, phone support is available Monday through Friday, 9 AM to 6 PM PST. You can reach us at +1 (555) 123-4567.",
    },
  ];

  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with our team - we're here to help you succeed"
    >
      {/* Contact Methods */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-3">{method.description}</p>
              <p className="font-medium text-purple-600 mb-1">
                {method.contact}
              </p>
              <p className="text-sm text-gray-500">{method.response}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            {/* form omitted for brevity, already functional */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Account</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-gray-600 mb-4">
                For urgent technical issues or account problems, use our live
                chat feature for instant assistance.
              </p>
              <button
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => setIsChatOpen(true)}
              >
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Our Offices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {office.city}
                  </h3>
                  <p className="text-purple-600 text-sm">{office.type}</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>{office.address}</p>
                <p>{office.zipCode}</p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {office.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business Hours */}
      <section>
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <Clock className="w-16 h-16 mx-auto mb-6 text-purple-200" />
          <h2 className="text-3xl font-bold mb-4">Business Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-bold mb-2">Support Team</h3>
              <p className="text-purple-200">
                Monday - Friday: 9 AM - 6 PM PST
              </p>
              <p className="text-purple-200">
                Saturday - Sunday: 10 AM - 4 PM PST
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-purple-200">Available 24/7</p>
              <p className="text-purple-200">Instant response</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Phone Support</h3>
              <p className="text-purple-200">
                Monday - Friday: 9 AM - 6 PM PST
              </p>
              <p className="text-purple-200">Emergency line available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
          <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <ChatInterface
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
};
