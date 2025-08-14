import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  MapPin, 
  Square, 
  FileText, 
  Upload,
  Plus,
  X
} from 'lucide-react';
import { mockProperties } from '../data/mockData';
import toast from 'react-hot-toast';

const schema = yup.object({
  title: yup.string().required('Property title is required'),
  description: yup.string().required('Description is required'),
  property_type: yup.string().oneOf(['land', 'building', 'commercial', 'residential']).required('Property type is required'),
  address: yup.string().required('Address is required'),
  lga: yup.string().required('Local Government Area is required'),
  size_sqm: yup.number().positive('Size must be positive').required('Size is required'),
  is_for_sale: yup.boolean(),
  is_for_lease: yup.boolean(),
  price: yup.number().positive('Price must be positive').nullable(),
  lease_price_annual: yup.number().positive('Lease price must be positive').nullable(),
});

export function RegisterProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      property_type: 'residential',
      is_for_sale: false,
      is_for_lease: false,
      lga: 'Uyo',
    },
  });

  const watchIsForSale = form.watch('is_for_sale');
  const watchIsForLease = form.watch('is_for_lease');

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      // Simulate property registration
      const newProperty = {
        id: Date.now().toString(),
        ...data,
        owner_id: user!.id,
        owner: user,
        status: 'pending',
        state: 'Akwa Ibom',
        documents: documents.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          property_id: Date.now().toString(),
          document_type: 'other',
          file_name: file.name,
          file_url: `/documents/${file.name}`,
          uploaded_at: new Date().toISOString(),
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock data
      mockProperties.push(newProperty);
      
      toast.success('Property registered successfully! It will be reviewed by government officials.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to register property');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Register New Property
        </h1>
        <p className="text-gray-600">
          Submit your property details for verification and registration.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                {...form.register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Modern 4-Bedroom Duplex in GRA"
              />
              {form.formState.errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                {...form.register('property_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="building">Building</option>
              </select>
              {form.formState.errors.property_type && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.property_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (Square Meters)
              </label>
              <input
                {...form.register('size_sqm')}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 450"
              />
              {form.formState.errors.size_sqm && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.size_sqm.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...form.register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe your property in detail..."
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <span>Location</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                {...form.register('address')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 15 Udo Udoma Avenue"
              />
              {form.formState.errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local Government Area
              </label>
              <select
                {...form.register('lga')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Uyo">Uyo</option>
                <option value="Ikot Abasi">Ikot Abasi</option>
                <option value="Eket">Eket</option>
                <option value="Oron">Oron</option>
                <option value="Ikot Ekpene">Ikot Ekpene</option>
                <option value="Abak">Abak</option>
                <option value="Etinan">Etinan</option>
                <option value="Essien Udim">Essien Udim</option>
              </select>
              {form.formState.errors.lga && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.lga.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value="Akwa Ibom"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Availability & Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Square className="h-5 w-5 text-emerald-600" />
            <span>Availability & Pricing</span>
          </h2>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center">
                <input
                  {...form.register('is_for_sale')}
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available for Sale</span>
              </label>
              <label className="flex items-center">
                <input
                  {...form.register('is_for_lease')}
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available for Lease</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {watchIsForSale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (₦)
                  </label>
                  <input
                    {...form.register('price')}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 85000000"
                  />
                  {form.formState.errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
              )}

              {watchIsForLease && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Lease Price (₦)
                  </label>
                  <input
                    {...form.register('lease_price_annual')}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 3600000"
                  />
                  {form.formState.errors.lease_price_annual && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.lease_price_annual.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <span>Property Documents</span>
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload property documents (Certificate of Occupancy, Survey Plan, etc.)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Choose Files</span>
              </label>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Documents:</p>
                {documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Property'}
          </button>
        </div>
      </form>
    </div>
  );
}