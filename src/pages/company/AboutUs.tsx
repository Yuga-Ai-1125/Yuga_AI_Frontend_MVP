import React from "react";
import { Link } from "react-router-dom";
import { Users, Target, Award, Globe, Heart, Lightbulb } from "lucide-react";
import { PageLayout } from "../../components/layout/PageLayout";
import { AIAvatar } from "../../components/AIAvatar";

export const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: "Praveen R",
      role: "CEO & Co-Founder",
      image:
        "https://media.licdn.com/dms/image/v2/C5103AQE3xgPE8VwDPw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1556798324368?e=1758153600&v=beta&t=QbMvoO4e0jhMi2xf5yNKBCsMhllVqK5ogLNJFFK7dMY",
      bio: "Former AI researcher at Stanford with 15+ years in educational technology.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      image:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Ex-Google engineer specializing in machine learning and natural language processing.",
    },
    {
      name: "Abhishek U",
      role: "Head of AI Research",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQG9K-frsV50wQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720320721666?e=1758153600&v=beta&t=wLzl0DKzvXCAUCIVlrbmYOpwhbicW0t28tFC14G56Xg",
      bio: "PhD in Cognitive Science, expert in adaptive learning algorithms.",
    },
    {
      name: "Ayshath Afeefa",
      role: "Head of Product",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQGRn91TM-PQcQ/profile-displayphoto-shrink_400_400/B56ZdK5KsMHEAk-/0/1749308199408?e=1758153600&v=beta&t=JyWklUl0Yzts7B0tzm3UeVeLilM6NCcSKKbbqE4bMBw",
      bio: "Former product lead at Coursera, passionate about user-centered design.",
    },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Empathy-Driven",
      description:
        "We understand that every learner is unique and deserves personalized attention.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description:
        "We constantly push the boundaries of what's possible in AI-powered education.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Impact",
      description:
        "Making quality education accessible to learners worldwide, regardless of location.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description:
        "We maintain the highest standards in everything we do, from AI models to user experience.",
    },
  ];

  return (
    <PageLayout
      title="About YUGA AI"
      subtitle="Revolutionizing education through artificial intelligence and human-centered design"
    >
      {/* Our Story */}
      <section className="mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  At YUGA AI (Navodhan Ed. Tech. Pvt. Ltd.), our AI tutor brings
                  a new era of personalized education. It adapts to every
                  student’s capabilities and affinities—combining erudition,
                  patience, and compassion in any subject, in any language.
                </p>
                <p className="mb-4">
                  Our AI teacher isn’t just interactive—it’s globally capable of
                  teaching any academic field with depth and empathy, truly
                  transforming how learning happens.
                </p>
                <p>
                  Founded in 2024 and headquartered in Thiruvananthapuram,
                  Kerala, we're a small but passionate team (2–10 employees)
                  dedicated to building innovative EdTech solutions powered by
                  AI, LLMs, AR/VR, smart-class devices, and OCR.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <AIAvatar size="xl" emotion="teaching" isActive />
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These principles guide everything we do, from developing AI
            algorithms to designing user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Leadership Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the visionaries and experts driving YUGA AI's mission to
            democratize education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-purple-100">
              Real results from our AI-powered education platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-purple-100">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5M+</div>
              <div className="text-purple-100">Lessons Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-purple-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're a learner, educator, or innovator, there's a place
            for you in the YUGA AI community. Together, we're building the
            future of education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium">
                Start Learning Today
              </button>
            </Link>

            <Link to="/careers">
              <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium">
                Explore Careers
              </button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
