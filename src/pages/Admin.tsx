import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Building2, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  FileText,
  MessageCircle,
  TrendingUp,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Square,
  AlertTriangle,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Property, User as UserType } from '../types';
import { mockProperties, mockUsers, mockStats } from '../data/mockData';
import toast from 'react-hot-toast';

export function Admin() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users' | 'registered' | 'listed' | 'updates'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);
  const [selectedUpdateRequest, setSelectedUpdateRequest] = useState<Property | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showUpdateRequestModal, setShowUpdateRequestModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProperties(mockProperties);
    setUsers(mockUsers);
    setLoading(false);
  };

  const handlePropertyAction = (propertyId: string, action: 'approve' | 'reject', notes?: string) => {
    setProperties(prev => prev.map(property => {
      if (property.id === propertyId) {
        return {
          ...property,
          status: action === 'approve' ? 'approved' : 'rejected',
          verification_notes: notes || (action === 'approve' ? 'Property approved by government official' : 'Property rejected'),
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return property;
    }));
    
    toast.success(`Property ${action}d successfully`);
    setSelectedProperty(null);
  };

  const handleUpdateRequest = (propertyId: string, action: 'approve' | 'reject', adminNotes?: string) => {
    setProperties(prev => prev.map(property => {
      if (property.id === propertyId && property.update_request) {
        const updatedProperty = { ...property };
        
        if (action === 'approve') {
          updatedProperty.availability_status = property.update_request.new_status;
          if (property.update_request.new_status === 'sold') {
            updatedProperty.sold_at = new Date().toISOString();
            if (property.update_request.sold_price) {
              updatedProperty.sold_price = property.update_request.sold_price;
            }
          }
        }
        
        updatedProperty.update_request = {
          ...property.update_request,
          admin_approved: action === 'approve',
          admin_notes: adminNotes || `Update request ${action}d by admin`,
        };
        
        return updatedProperty;
      }
      return property;
    }));
    
    toast.success(`Update request ${action}d successfully`);
    setSelectedUpdateRequest(null);
  };

  const handleContactOwner = () => {
    if (!contactMessage.trim() || !selectedUpdateRequest) return;
    
    // In a real app, this would send a message to the property owner
    toast.success('Message sent to property owner successfully');
    setContactMessage('');
    setShowContactModal(false);
  };

  const nextImage = () => {
    if (selectedProperty?.images && selectedProperty.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProperty.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty?.images && selectedProperty.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.images!.length - 1 : prev - 1
      );
    }
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

  const getPropertiesWithUpdateRequests = () => {
    return properties.filter(p => p.update_request && !p.update_request.admin_approved);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const getOwnerImage = (userId: string) => {
    // Generate a placeholder avatar based on user ID
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const colorIndex = parseInt(userId) % colors.length;
    return colors[colorIndex];
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user?.role !== 'government_official' && user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administrative Panel
        </h1>
        <p className="text-gray-600">
          Manage property verifications and system oversight.
        </p>
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
              onClick={() => setActiveTab('properties')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'properties'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registered'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registered Properties
            </button>
            <button
              onClick={() => setActiveTab('listed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listed'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Listed Properties
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === 'updates'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Update Requests
              {getPropertiesWithUpdateRequests().length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPropertiesWithUpdateRequests().length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{mockStats.totalProperties}</p>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      +{mockStats.monthlyGrowth.properties}%
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
                    <p className="text-2xl font-bold text-gray-900">{mockStats.approvedProperties}</p>
                    <span className="text-xs text-green-600">
                      {Math.round((mockStats.approvedProperties / mockStats.totalProperties) * 100)}% rate
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
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{mockStats.pendingProperties + mockStats.underReviewProperties}</p>
                    <span className="text-xs text-yellow-600">
                      Avg. 4.2 days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Update Requests</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{getPropertiesWithUpdateRequests().length}</p>
                    <span className="text-xs text-red-600">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Distribution</h3>
              <div className="space-y-3">
                {Object.entries(mockStats.propertyTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${(count / mockStats.totalProperties) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">LGA Coverage</h3>
              <div className="space-y-3">
                {Object.entries(mockStats.lgaStats).slice(0, 5).map(([lga, count]) => (
                  <div key={lga} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{lga}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / mockStats.totalProperties) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-green-600">{mockStats.systemHealth.uptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-gray-900">{mockStats.systemHealth.responseTime}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Transactions</span>
                  <span className="text-sm font-medium text-gray-900">{mockStats.systemHealth.dailyTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className="text-sm font-medium text-emerald-600">+{mockStats.monthlyGrowth.transactions}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Properties Needing Review */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Properties Needing Review</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {properties.filter(p => p.status === 'pending' || p.status === 'under_review').slice(0, 5).map((property) => (
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
                        <p className="text-xs text-gray-500">Owner: {property.owner?.full_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(property.status)}
                          <span className="capitalize">{property.status.replace('_', ' ')}</span>
                        </div>
                      </span>
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">All Properties</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-600">{property.address}, {property.lga}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{property.owner?.full_name}</p>
                      <p className="text-sm text-gray-600">{property.owner?.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(property.status)}
                          <span className="capitalize">{property.status.replace('_', ' ')}</span>
                        </div>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(property.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setCurrentImageIndex(0);
                          setShowPropertyModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                placeholder="Search registered properties by title, address, or owner..."
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
                    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.owner?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <button
                          onClick={() => setSelectedPropertyForInquiry(property)}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{property.address}, {property.lga}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Square className="h-3 w-3" />
                          <span>{property.size_sqm.toLocaleString()} sqm</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Owner: {property.owner?.full_name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {getRegisteredProperties().length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No registered properties found</p>
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
                placeholder="Search listed properties by title, address, or owner..."
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
                    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.owner?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <button
                          onClick={() => setSelectedPropertyForInquiry(property)}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{property.address}, {property.lga}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Square className="h-3 w-3" />
                          <span>{property.size_sqm.toLocaleString()} sqm</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Owner: {property.owner?.full_name}</span>
                        </div>
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
                    </div>
                  ))}
              </div>
              {getListedProperties().length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No listed properties found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Requests Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Property Update Requests</h2>
                <span className="text-sm text-gray-600">
                  {getPropertiesWithUpdateRequests().length} pending requests
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {getPropertiesWithUpdateRequests().map((property) => (
                  <div
                    key={property.id}
                    className="border border-orange-200 bg-orange-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-600">{property.address}, {property.lga}</p>
                          <p className="text-xs text-gray-500">Owner: {property.owner?.full_name}</p>
                        </div>
                      </div>
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Update Request
                      </span>
                    </div>
                    
                    {property.update_request && (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Requested Status</p>
                            <p className="text-gray-900 capitalize font-semibold">
                              {property.update_request.new_status}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Requested Date</p>
                            <p className="text-gray-900">
                              {new Date(property.update_request.requested_at).toLocaleDateString()}
                            </p>
                          </div>
                          {property.update_request.sold_price && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Sale Price</p>
                              <p className="text-gray-900 font-semibold">
                                {formatPrice(property.update_request.sold_price)}
                              </p>
                            </div>
                          )}
                          {property.update_request.reason && (
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-700">Reason</p>
                              <p className="text-gray-900">{property.update_request.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedUpdateRequest(property);
                            setCurrentImageIndex(0);
                            setShowUpdateRequestModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUpdateRequest(property);
                            setShowContactModal(true);
                          }}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Contact Owner</span>
                        </button>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleUpdateRequest(property.id, 'reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(property.id, 'approve')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {getPropertiesWithUpdateRequests().length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending update requests</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
                <button
                  onClick={() => {
                    setShowPropertyModal(false);
                    setSelectedProperty(null);
                    setCurrentImageIndex(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Property Images</h4>
                  
                  {/* Main Image Display */}
                  <div className="relative h-64 md:h-80 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedProperty.images[currentImageIndex]}
                      alt={`${selectedProperty.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {selectedProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {selectedProperty.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {selectedProperty.images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {selectedProperty.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity ${
                            index === currentImageIndex ? 'ring-2 ring-emerald-500' : ''
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedProperty.title} - Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Property Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-xl">{selectedProperty.title}</h4>
                  <p className="text-gray-600">{selectedProperty.address}, {selectedProperty.lga}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner</p>
                  <p className="text-gray-900">{selectedProperty.owner?.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedProperty.owner?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-gray-900">{selectedProperty.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Type</p>
                    <p className="text-gray-900 capitalize">{selectedProperty.property_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Size</p>
                    <p className="text-gray-900">{selectedProperty.size_sqm.toLocaleString()} sqm</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
                  <div className="space-y-2">
                    {selectedProperty.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-gray-700 capitalize">
                          {doc.document_type.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedProperty.status === 'pending' || selectedProperty.status === 'under_review' ? (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handlePropertyAction(selectedProperty.id, 'reject')}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handlePropertyAction(selectedProperty.id, 'approve')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    This property has already been {selectedProperty.status}.
                  </p>
                  {selectedProperty.verification_notes && (
                    <p className="text-sm text-gray-500 mt-2">
                      Notes: {selectedProperty.verification_notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Request Details Modal */}
      {showUpdateRequestModal && selectedUpdateRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Update Request Details</h3>
                <button
                  onClick={() => {
                    setShowUpdateRequestModal(false);
                    setSelectedUpdateRequest(null);
                    setCurrentImageIndex(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Property Images */}
              {selectedUpdateRequest.images && selectedUpdateRequest.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Property Images</h4>
                  
                  {/* Main Image Display */}
                  <div className="relative h-64 md:h-80 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedUpdateRequest.images[currentImageIndex]}
                      alt={`${selectedUpdateRequest.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {selectedUpdateRequest.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {selectedUpdateRequest.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {selectedUpdateRequest.images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {selectedUpdateRequest.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity ${
                            index === currentImageIndex ? 'ring-2 ring-emerald-500' : ''
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedUpdateRequest.title} - Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Property and Request Details */}
              <div className="space-y-6">
                {/* Property Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 text-xl mb-2">{selectedUpdateRequest.title}</h4>
                  <p className="text-gray-600 mb-4">{selectedUpdateRequest.address}, {selectedUpdateRequest.lga}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Owner</p>
                      <p className="text-gray-900">{selectedUpdateRequest.owner?.full_name}</p>
                      <p className="text-sm text-gray-600">{selectedUpdateRequest.owner?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Property Type</p>
                      <p className="text-gray-900 capitalize">{selectedUpdateRequest.property_type}</p>
                    </div>
                  </div>
                </div>
                
                {/* Update Request Information */}
                {selectedUpdateRequest.update_request && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Update Request Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Requested Status</p>
                        <p className="text-gray-900 capitalize font-semibold">
                          {selectedUpdateRequest.update_request.new_status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Request Date</p>
                        <p className="text-gray-900">
                          {new Date(selectedUpdateRequest.update_request.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedUpdateRequest.update_request.sold_price && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Sale Price</p>
                          <p className="text-gray-900 font-semibold">
                            {formatPrice(selectedUpdateRequest.update_request.sold_price)}
                          </p>
                        </div>
                      )}
                      {selectedUpdateRequest.update_request.reason && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-700">Reason</p>
                          <p className="text-gray-900">{selectedUpdateRequest.update_request.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateRequest(selectedUpdateRequest.id, 'reject')}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(selectedUpdateRequest.id, 'approve')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Review Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Property: {selectedProperty.title}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-gray-900">{selectedProperty.address}, {selectedProperty.lga}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner</p>
                  <p className="text-gray-900">{selectedProperty.owner?.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedProperty.owner?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-gray-900">{selectedProperty.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Type</p>
                    <p className="text-gray-900 capitalize">{selectedProperty.property_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Size</p>
                    <p className="text-gray-900">{selectedProperty.size_sqm.toLocaleString()} sqm</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
                  <div className="space-y-2">
                    {selectedProperty.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-gray-700 capitalize">
                          {doc.document_type.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedProperty.status === 'pending' || selectedProperty.status === 'under_review' ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePropertyAction(selectedProperty.id, 'reject')}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handlePropertyAction(selectedProperty.id, 'approve')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    This property has already been {selectedProperty.status}.
                  </p>
                  {selectedProperty.verification_notes && (
                    <p className="text-sm text-gray-500 mt-2">
                      Notes: {selectedProperty.verification_notes}
                    </p>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setSelectedProperty(null)}
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Inquiry Modal */}
      {selectedPropertyForInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Property Information & Owner Details
              </h3>
              
              {/* Property Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Property Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Title</p>
                    <p className="text-gray-900">{selectedPropertyForInquiry.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Type</p>
                    <p className="text-gray-900 capitalize">{selectedPropertyForInquiry.property_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">{selectedPropertyForInquiry.address}, {selectedPropertyForInquiry.lga}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Size</p>
                    <p className="text-gray-900">{selectedPropertyForInquiry.size_sqm.toLocaleString()} sqm</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedPropertyForInquiry.status)}`}>
                      {selectedPropertyForInquiry.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Availability</p>
                    <div className="flex space-x-2">
                      {selectedPropertyForInquiry.is_for_sale && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">For Sale</span>
                      )}
                      {selectedPropertyForInquiry.is_for_lease && (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">For Lease</span>
                      )}
                      {!selectedPropertyForInquiry.is_for_sale && !selectedPropertyForInquiry.is_for_lease && (
                        <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">Registered Only</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                {(selectedPropertyForInquiry.is_for_sale || selectedPropertyForInquiry.is_for_lease) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Pricing</h5>
                    <div className="space-y-2">
                      {selectedPropertyForInquiry.is_for_sale && selectedPropertyForInquiry.price && (
                        <p className="text-lg font-bold text-emerald-600">
                          Sale Price: {formatPrice(selectedPropertyForInquiry.price)}
                        </p>
                      )}
                      {selectedPropertyForInquiry.is_for_lease && selectedPropertyForInquiry.lease_price_annual && (
                        <p className="text-lg font-bold text-purple-600">
                          Annual Lease: {formatPrice(selectedPropertyForInquiry.lease_price_annual)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Owner Details */}
              <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Property Owner Information</h4>
                <div className="flex items-start space-x-4">
                  {/* Owner Avatar */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getOwnerImage(selectedPropertyForInquiry.owner_id)}`}>
                    {selectedPropertyForInquiry.owner?.full_name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Full Name</p>
                        <p className="text-gray-900 font-semibold">{selectedPropertyForInquiry.owner?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Role</p>
                        <p className="text-gray-900 capitalize">{selectedPropertyForInquiry.owner?.role.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <p className="text-gray-900">{selectedPropertyForInquiry.owner?.email}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phone</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <p className="text-gray-900">{selectedPropertyForInquiry.owner?.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Verification Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedPropertyForInquiry.owner?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedPropertyForInquiry.owner?.is_verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Member Since</p>
                        <p className="text-gray-900">
                          {selectedPropertyForInquiry.owner?.created_at ? 
                            new Date(selectedPropertyForInquiry.owner.created_at).toLocaleDateString() : 
                            'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Property Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Property Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedPropertyForInquiry.description}</p>
              </div>
              
              {/* Documents */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Property Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPropertyForInquiry.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize text-sm">
                          {doc.document_type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-600">{doc.file_name}</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedPropertyForInquiry(null)}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Owner Modal */}
      {showContactModal && selectedUpdateRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Property Owner
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Send a message to {selectedUpdateRequest.owner?.full_name} regarding their update request for "{selectedUpdateRequest.title}".
              </p>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactOwner}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}