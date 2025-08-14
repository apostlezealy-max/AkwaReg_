import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Square, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MessageCircle,
  FileText,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty || null);
      setLoading(false);
    }
  }, [id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the backend
    alert('Message sent successfully!');
    setMessage('');
    setShowContactForm(false);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getDocumentIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/properties"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Property Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* Property Image Placeholder */}
            <div className="h-64 md:h-80 bg-gradient-to-br from-emerald-100 to-emerald-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-emerald-600" />
              </div>
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {property.property_type}
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                {property.is_for_sale && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">For Sale</span>
                )}
                {property.is_for_lease && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">For Lease</span>
                )}
              </div>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.address}, {property.lga}, {property.state}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {property.is_for_sale && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Sale Price:</span>
                    <p className="text-3xl font-bold text-emerald-600">
                      {formatPrice(property.price!)}
                    </p>
                  </div>
                )}
                {property.is_for_lease && (
                  <div>
                    <span className="text-sm text-gray-600">Annual Lease:</span>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatPrice(property.lease_price_annual!)}/year
                    </p>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-semibold">{property.size_sqm.toLocaleString()} sqm</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold capitalize">{property.property_type}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">LGA</p>
                  <p className="font-semibold">{property.lga}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Listed</p>
                  <p className="font-semibold">
                    {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    {getDocumentIcon(doc.document_type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 capitalize">
                      {doc.document_type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{doc.file_name}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Owner Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Owner</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{property.owner?.full_name}</p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{property.owner?.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{property.owner?.email}</span>
              </div>
            </div>

            {user && user.id !== property.owner_id && (
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contact Owner</span>
              </button>
            )}
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Property Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Documents Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Owner Verified</span>
              </div>
            </div>
            
            {property.verification_notes && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">{property.verification_notes}</p>
              </div>
            )}
            
            {property.verified_at && (
              <p className="text-xs text-gray-500 mt-4">
                Verified on {new Date(property.verified_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Property Owner
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowContactForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}