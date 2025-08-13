import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Search, MessageCircle, CheckCircle, Users } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Registration',
      description: 'Secure property registration with document verification and fraud prevention.',
    },
    {
      icon: Search,
      title: 'Easy Verification',
      description: 'Quick property search and ownership verification for buyers and stakeholders.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Secure messaging between property owners and interested parties.',
    },
    {
      icon: CheckCircle,
      title: 'Official Approval',
      description: 'Government official verification and approval workflow.',
    },
  ];

  const stats = [
    { label: 'Properties Registered', value: '2,847' },
    { label: 'Verified Owners', value: '1,923' },
    { label: 'Government Officials', value: '48' },
    { label: 'Successful Transactions', value: '1,205' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Akwa Ibom State
              <span className="block text-amber-300">Property Registry</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-10 leading-relaxed">
              Secure, transparent, and efficient property registration system for landowners,
              buyers, and government officials in Akwa Ibom State.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Register Your Property
              </Link>
              <Link
                to="/properties"
                className="bg-emerald-500/30 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AkwaReg?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform addresses the key challenges in Nigeria's property registration system
              with modern technology and secure processes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to register your property and gain official recognition
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Create Account & Submit Details
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Register as a property owner and submit your property details with supporting documents.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Government Verification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Government officials review and verify your property documents for authenticity.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Official Registration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Receive official approval and your property becomes part of the verified registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Register Your Property?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Join thousands of property owners who have secured their assets through our verified registry system.
          </p>
          <Link
            to="/auth"
            className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>Get Started Today</span>
          </Link>
        </div>
      </section>
    </div>
  );
}