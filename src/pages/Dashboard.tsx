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
  Shield,
  Search
} from 'lucide-react';
import { Property, Message } from '../types';
import { mockProperties, mockMessages, mockStats } from '../data/mockData';

export function Dashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'registered' | 'listed'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0,
    registered: 0,
    listed: 0,
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
    }, { total: 0, pending: 0, approved: 0, rejected: 0, under_review: 0, registered: 0, listed: 0 });
    
    // Calculate registered vs listed
    userStats.registered = userProperties.filter(p => !p.is_for_sale && !p.is_for_lease).length;
    userStats.listed = userProperties.filter(p => p.is_for_sale || p.is_for_lease).length;
    
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

  const getRegisteredProperties = () => {
    return properties.filter(p => !p.is_for_sale && !p.is_for_lease);
  };

  const getListedProperties = () => {
    return properties.filter(p => p.is_for_sale || p.is_for_lease);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
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
              <p className="text-sm font-medium text-gray-600">Registered Only</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.registered}
                </p>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Not for sale/lease
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Listed Properties</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.listed}
                </p>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  For sale/lease
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

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registered'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registered Properties ({stats.registered})
            </button>
            <button
              onClick={() => setActiveTab('listed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listed'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Listed Properties ({stats.listed})
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
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
                          <div className="flex items-center space-x-2 mt-1">
                            {!property.is_for_sale && !property.is_for_lease && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Registered Only
                              </span>
                            )}
                            {property.is_for_sale && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                For Sale: ₦{property.price?.toLocaleString()}
                              </span>
                            )}
                            {property.is_for_lease && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                For Lease: ₦{property.lease_price_annual?.toLocaleString()}/year
                              </span>
                            )}
                          </div>
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
        </div>
      )}

      {/* Registered Properties Tab */}
      {activeTab === 'registered' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your registered properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Registered Properties</h2>
                <span className="text-sm text-gray-600">
                  {getRegisteredProperties().length} properties registered (not for sale/lease)
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRegisteredProperties()
                  .filter(property => 
                    !searchTerm || 
                    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.address.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((property) => (
                    <div
                      key={property.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <Building2 className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                            {property.status.replace('_', ' ')}
                          </span>
                        </div>
                        <Link
                          to={`/property/${property.id}`}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{property.address}, {property.lga}</p>
                        <p>{property.size_sqm.toLocaleString()} sqm • {property.property_type}</p>
                        <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mt-2">
                          Registered Only
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              {getRegisteredProperties().length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No registered properties found</p>
                  <p className="text-sm text-gray-500">Properties that are not listed for sale or lease will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listed Properties Tab */}
      {activeTab === 'listed' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your listed properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Listed Properties</h2>
                <span className="text-sm text-gray-600">
                  {getListedProperties().length} properties listed for sale/lease
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getListedProperties()
                  .filter(property => 
                    !searchTerm || 
                    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.address.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((property) => (
                    <div
                      key={property.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <Building2 className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="flex space-x-1">
                            {property.is_for_sale && (
                              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Sale</span>
                            )}
                            {property.is_for_lease && (
                              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Lease</span>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/property/${property.id}`}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>{property.address}, {property.lga}</p>
                        <p>{property.size_sqm.toLocaleString()} sqm • {property.property_type}</p>
                      </div>
                      <div className="space-y-1">
                        {property.is_for_sale && property.price && (
                          <p className="text-lg font-bold text-emerald-600">
                            {formatPrice(property.price)}
                          </p>
                        )}
                        {property.is_for_lease && property.lease_price_annual && (
                          <p className="text-md font-semibold text-purple-600">
                            {formatPrice(property.lease_price_annual)}/year
                          </p>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                          {property.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              {getListedProperties().length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No listed properties found</p>
                  <p className="text-sm text-gray-500">Properties marked for sale or lease will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages - Only show in overview */}
      {activeTab === 'overview' && messages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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

      {/* Admin Section for Officials - Only show in overview */}
      {activeTab === 'overview' && (user?.role === 'government_official' || user?.role === 'admin') && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
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