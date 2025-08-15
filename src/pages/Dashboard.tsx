import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Shield
} from 'lucide-react';
import { Property, Message } from '../types';
import { mockProperties, mockMessages, mockStats } from '../data/mockData';

export function Dashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    // Filter properties for current user
    const userProperties = mockProperties.filter(p => p.owner_id === user?.id);
    setProperties(userProperties);
    
    // Calculate user stats
    const userStats = userProperties.reduce((acc, property) => {
      acc.total++;
      acc[property.status as keyof typeof acc]++;
      return acc;
    }, { total: 0, pending: 0, approved: 0, rejected: 0, under_review: 0 });
    
    setStats(userStats);
    
    // Filter messages for current user
    const userMessages = mockMessages.filter(
      m => m.sender_id === user?.id || m.receiver_id === user?.id
    );
    setMessages(userMessages);
    
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      under_review: AlertCircle,
      approved: CheckCircle,
      rejected: AlertCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}
        </h1>
        <p className="text-gray-600">
          Manage your properties and track their verification status.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  +{mockStats.propertiesThisMonth} this month
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <span className="text-xs text-yellow-600">
                  Avg. 3-5 days
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +{mockStats.verificationsThisWeek} this week
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">
                  ₦{((properties.filter(p => p.price).reduce((sum, p) => sum + (p.price || 0), 0)) / 1000000).toFixed(0)}M
                </p>
                <span className="text-xs text-blue-600">
                  +15.2%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/register-property"
          className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-6 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 group"
        >
          <div className="flex items-center">
            <Plus className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Register Property</h3>
              <p className="text-emerald-100">Add a new property to the registry</p>
            </div>
          </div>
        </Link>

        <Link
          to="/properties"
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group"
        >
          <div className="flex items-center">
            <Building2 className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Browse Properties</h3>
              <p className="text-blue-100">Search verified properties</p>
            </div>
          </div>
        </Link>

        <Link
          to="/messages"
          className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-6 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 group"
        >
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Messages</h3>
              <p className="text-purple-100">Check your messages</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
            <Link
              to="/my-properties"
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.slice(0, 5).map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.title}</h3>
                      <p className="text-sm text-gray-600">{property.address}, {property.lga}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {property.is_for_sale && `₦${property.price?.toLocaleString()}`}
                        {property.is_for_sale && property.is_for_lease && ' • '}
                        {property.is_for_lease && `₦${property.lease_price_annual?.toLocaleString()}/year`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(property.status)}
                        <span className="capitalize">{property.status.replace('_', ' ')}</span>
                      </div>
                    </span>
                    <Link
                      to={`/property/${property.id}`}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-6">Start by registering your first property.</p>
              <Link
                to="/register-property"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Register Property</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Messages */}
      {messages.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
              <Link
                to="/messages"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {messages.slice(0, 3).map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    !message.is_read && message.receiver_id === user?.id
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-gray-900">
                          {message.sender_id === user?.id ? 'You' : message.sender?.full_name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{message.content}</p>
                    </div>
                    {!message.is_read && message.receiver_id === user?.id && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Section for Officials */}
      {(user?.role === 'government_official' || user?.role === 'admin') && (
        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-slate-700 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Administrative Tools</h2>
              <p className="text-slate-300">Manage property verifications and system oversight</p>
            </div>
          </div>
          <Link
            to="/admin"
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            <Shield className="h-5 w-5" />
            <span>Access Admin Panel</span>
          </Link>
        </div>
      )}
    </div>
  );
}