import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockStats, mockProperties, mockUsers } from '../data/mockData';
import { 
  BarChart3, 
  Home, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Square, 
  User, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Property } from '../types';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'sold' | 'unavailable'>('sold');
  const [updateReason, setUpdateReason] = useState('');
  const [soldPrice, setSoldPrice] = useState('');

  const getDashboardStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case 'sold':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRegisteredProperties = () => {
    return mockProperties.filter(p => p.owner_id === user?.id && !p.is_for_sale && !p.is_for_lease);
  };

  const getListedProperties = () => {
    return mockProperties.filter(p => p.owner_id === user?.id && (p.is_for_sale || p.is_for_lease));
  };

  const getSoldProperties = () => {
    return mockProperties.filter(p => p.owner_id === user?.id && p.availability_status === 'sold');
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const handleUpdateProperty = () => {
    if (!selectedProperty) return;
    
    // Create update request
    const updateRequest = {
      new_status: updateStatus,
      reason: updateReason,
      requested_at: new Date().toISOString(),
      admin_approved: false,
      ...(updateStatus === 'sold' && soldPrice ? { sold_price: Number(soldPrice) } : {})
    };
    
    // In a real app, this would send to backend
    console.log('Update request:', updateRequest);
    alert('Update request submitted for admin review!');
    
    setShowUpdateModal(false);
    setSelectedProperty(null);
    setUpdateReason('');
    setSoldPrice('');
  };

  const stats = [
    {
      title: 'Total Properties',
      value: mockProperties.filter(p => p.owner_id === user?.id).length,
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      title: 'Sold Properties',
      value: getSoldProperties().length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Active Listings',
      value: getListedProperties().length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: formatPrice(mockStats.totalRevenue),
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Property Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registered Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Registered Properties</h2>
              <span className="text-sm text-gray-600">
                {getRegisteredProperties().length} properties
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Properties registered but not listed for sale/lease</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getRegisteredProperties().slice(0, 3).map((property) => (
                <div key={property.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  {/* Property Image */}
                  <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-emerald-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDashboardStatusBadge(property.status)}`}>
                        {property.status.replace('_', ' ')}
                      </span>
                      {property.availability_status && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(property.availability_status)}`}>
                          {property.availability_status}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowUpdateModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
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
                  </div>
                </div>
              ))}
              {getRegisteredProperties().length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No registered properties</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listed Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Listed Properties</h2>
              <span className="text-sm text-gray-600">
                {getListedProperties().length} properties
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Properties listed for sale or lease</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getListedProperties().slice(0, 3).map((property) => (
                <div key={property.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  {/* Property Image */}
                  <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-emerald-600" />
                      </div>
                    )}
                  </div>
                  
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
                        {property.availability_status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(property.availability_status)}`}>
                            {property.availability_status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowUpdateModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
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
              {getListedProperties().length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No listed properties</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sold Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Sold Properties</h2>
              <span className="text-sm text-gray-600">
                {getSoldProperties().length} properties
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Properties that have been sold</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getSoldProperties().slice(0, 3).map((property) => (
                <div key={property.id} className="p-4 bg-gray-50 rounded-lg group">
                  {/* Property Image */}
                  <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-emerald-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Sold
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
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
                  </div>
                  <div className="space-y-1">
                    {property.sold_price && (
                      <p className="text-lg font-bold text-green-600">
                        Sold for {formatPrice(property.sold_price)}
                      </p>
                    )}
                    {property.sold_at && (
                      <p className="text-xs text-gray-500">
                        Sold on {new Date(property.sold_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {getSoldProperties().length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No sold properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedProperty && !showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {/* Property Image */}
              <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200">
                {selectedProperty.images && selectedProperty.images.length > 0 ? (
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-emerald-600" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-xl">{selectedProperty.title}</h4>
                  <p className="text-gray-600">{selectedProperty.address}, {selectedProperty.lga}</p>
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
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDashboardStatusBadge(selectedProperty.status)}`}>
                      {selectedProperty.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Availability</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(selectedProperty.availability_status || 'available')}`}>
                      {selectedProperty.availability_status || 'available'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-gray-900">{selectedProperty.description}</p>
                </div>
                
                {(selectedProperty.is_for_sale || selectedProperty.is_for_lease) && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pricing</p>
                    <div className="space-y-1">
                      {selectedProperty.is_for_sale && selectedProperty.price && (
                        <p className="text-lg font-bold text-emerald-600">
                          Sale: {formatPrice(selectedProperty.price)}
                        </p>
                      )}
                      {selectedProperty.is_for_lease && selectedProperty.lease_price_annual && (
                        <p className="text-lg font-bold text-purple-600">
                          Lease: {formatPrice(selectedProperty.lease_price_annual)}/year
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedProperty.sold_price && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Sale Information</p>
                    <p className="text-lg font-bold text-green-600">
                      Sold for {formatPrice(selectedProperty.sold_price)}
                    </p>
                    {selectedProperty.sold_at && (
                      <p className="text-sm text-gray-500">
                        Sold on {new Date(selectedProperty.sold_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Property Modal */}
      {showUpdateModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Property Status
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as 'sold' | 'unavailable')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="sold">Sold</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                
                {updateStatus === 'sold' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price (₦)
                    </label>
                    <input
                      type="number"
                      value={soldPrice}
                      onChange={(e) => setSoldPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter sale price"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Provide additional details..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedProperty(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProperty}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}