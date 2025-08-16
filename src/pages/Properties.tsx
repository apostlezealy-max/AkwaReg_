import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Property, SearchFilters } from '../types';
import { mockProperties } from '../data/mockData';

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load properties (only approved ones for public view)
    const approvedProperties = mockProperties.filter(p => p.status === 'approved');
    setProperties(approvedProperties);
    setFilteredProperties(approvedProperties);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply search and filters
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.lga.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Property type filter
    if (filters.property_type) {
      filtered = filtered.filter(property => property.property_type === filters.property_type);
    }

    // LGA filter
    if (filters.lga) {
      filtered = filtered.filter(property => property.lga === filters.lga);
    }

    // Price filters
    if (filters.min_price) {
      filtered = filtered.filter(property => 
        property.price && property.price >= filters.min_price!
      );
    }
    if (filters.max_price) {
      filtered = filtered.filter(property => 
        property.price && property.price <= filters.max_price!
      );
    }

    // Sale/Lease filters
    if (filters.is_for_sale !== undefined) {
      filtered = filtered.filter(property => property.is_for_sale === filters.is_for_sale);
    }
    if (filters.is_for_lease !== undefined) {
      filtered = filtered.filter(property => property.is_for_lease === filters.is_for_lease);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, filters, properties]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getPropertyTypeIcon = (type: string) => {
    return <Building2 className="h-5 w-5" />;
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
          Browse Properties
        </h1>
        <p className="text-gray-600">
          Discover verified properties across Akwa Ibom State
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, address, or LGA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={filters.property_type || ''}
                  onChange={(e) => handleFilterChange('property_type', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="building">Building</option>
                </select>
              </div>

              {/* LGA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Government Area
                </label>
                <select
                  value={filters.lga || ''}
                  onChange={(e) => handleFilterChange('lga', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All LGAs</option>
                  <option value="Uyo">Uyo</option>
                  <option value="Ikot Abasi">Ikot Abasi</option>
                  <option value="Eket">Eket</option>
                  <option value="Oron">Oron</option>
                  <option value="Ikot Ekpene">Ikot Ekpene</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Availability Filters */}
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_for_sale === true}
                  onChange={(e) => handleFilterChange('is_for_sale', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">For Sale</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_for_lease === true}
                  onChange={(e) => handleFilterChange('is_for_lease', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">For Lease</span>
              </label>
            </div>

            {/* Clear Filters */}
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Total Value: ₦{(filteredProperties.filter(p => p.price).reduce((sum, p) => sum + (p.price || 0), 0) / 1000000000).toFixed(1)}B</span>
            <span>•</span>
            <span>Avg. Price: ₦{filteredProperties.filter(p => p.price).length > 0 ? (filteredProperties.filter(p => p.price).reduce((sum, p) => sum + (p.price || 0), 0) / filteredProperties.filter(p => p.price).length / 1000000).toFixed(1) : 0}M</span>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            {/* Property Image */}
            <div className="h-48 relative overflow-hidden bg-gray-100">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                  {getPropertyTypeIcon(property.property_type)}
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {property.property_type}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                {property.is_for_sale && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Sale</span>
                )}
                {property.is_for_lease && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Lease</span>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    +{property.images.length - 1} more
                  </span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.address}, {property.lga}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4 flex-1">
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.size_sqm.toLocaleString()} sqm</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="font-medium">{property.owner?.full_name}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 mt-auto">
                {property.is_for_sale && (
                  <p className="text-xl font-bold text-emerald-600">
                    {formatPrice(property.price!)}
                  </p>
                )}
                {property.is_for_lease && (
                  <p className="text-lg font-semibold text-purple-600">
                    {formatPrice(property.lease_price_annual!)}/year
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <Link
                  to={`/property/${property.id}`}
                  className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={clearFilters}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}