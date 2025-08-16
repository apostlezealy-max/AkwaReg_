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
  X,
  Image as ImageIcon,
  Star
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

const amenitiesList = [
  'Swimming Pool', 'Gym/Fitness Center', 'Parking Space', 'Security System',
  'Generator/Backup Power', 'Air Conditioning', 'Furnished', 'Garden/Landscaping',
  'Elevator', 'Balcony/Terrace', 'Storage Room', 'Laundry Room',
  'Internet/WiFi', 'Water Supply', 'Waste Management', 'CCTV Surveillance'
];

export function RegisterProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{
    certificate_of_occupancy: File | null;
    deed_of_assignment: File | null;
    survey_plan: File | null;
    building_approval: File | null;
    other: File[];
  }>({
    certificate_of_occupancy: null,
    deed_of_assignment: null,
    survey_plan: null,
    building_approval: null,
    other: []
  });

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
  const showAmenities = watchIsForSale || watchIsForLease;

  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      // Simulate property registration
      const allDocuments = [];
      
      // Add specific document types
      if (documents.certificate_of_occupancy) {
        allDocuments.push({
          id: `${Date.now()}-coo`,
          property_id: Date.now().toString(),
          document_type: 'certificate_of_occupancy',
          file_name: documents.certificate_of_occupancy.name,
          file_url: `/documents/${documents.certificate_of_occupancy.name}`,
          uploaded_at: new Date().toISOString(),
        });
      }
      
      if (documents.deed_of_assignment) {
        allDocuments.push({
          id: `${Date.now()}-deed`,
          property_id: Date.now().toString(),
          document_type: 'deed_of_assignment',
          file_name: documents.deed_of_assignment.name,
          file_url: `/documents/${documents.deed_of_assignment.name}`,
          uploaded_at: new Date().toISOString(),
        });
      }
      
      if (documents.survey_plan) {
        allDocuments.push({
          id: `${Date.now()}-survey`,
          property_id: Date.now().toString(),
          document_type: 'survey_plan',
          file_name: documents.survey_plan.name,
          file_url: `/documents/${documents.survey_plan.name}`,
          uploaded_at: new Date().toISOString(),
        });
      }
      
      if (documents.building_approval) {
        allDocuments.push({
          id: `${Date.now()}-building`,
          property_id: Date.now().toString(),
          document_type: 'building_approval',
          file_name: documents.building_approval.name,
          file_url: `/documents/${documents.building_approval.name}`,
          uploaded_at: new Date().toISOString(),
        });
      }
      
      // Add other documents
      documents.other.forEach((file, index) => {
        allDocuments.push({
          id: `${Date.now()}-other-${index}`,
          property_id: Date.now().toString(),
          document_type: 'other',
          file_name: file.name,
          file_url: `/documents/${file.name}`,
          uploaded_at: new Date().toISOString(),
        });
      });

      const newProperty = {
        id: Date.now().toString(),
        ...data,
        owner_id: user!.id,
        owner: user,
        status: 'pending',
        state: 'Akwa Ibom',
        images: propertyImages.map(file => URL.createObjectURL(file)),
        documents: allDocuments,
        amenities: selectedAmenities,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPropertyImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setPropertyImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = (documentType: keyof typeof documents, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (documentType === 'other') {
        setDocuments(prev => ({
          ...prev,
          other: [...prev.other, file]
        }));
      } else {
        setDocuments(prev => ({
          ...prev,
          [documentType]: file
        }));
      }
    }
  };

  const removeDocument = (documentType: keyof typeof documents, index?: number) => {
    if (documentType === 'other' && index !== undefined) {
      setDocuments(prev => ({
        ...prev,
        other: prev.other.filter((_, i) => i !== index)
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [documentType]: null
      }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Register New Property
        </h1>
        <p className="text-gray-600 text-sm">
          Submit your property details for verification and registration.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Column 1: Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-200 pb-3">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span>Basic Information</span>
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title
                </label>
                <input
                  {...form.register('title')}
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Modern 4-Bedroom Duplex"
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  {...form.register('property_type')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="building">Building</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (Square Meters)
                </label>
                <input
                  {...form.register('size_sqm')}
                  type="number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 450"
                />
                {form.formState.errors.size_sqm && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.size_sqm.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...form.register('description')}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your property..."
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Location Section */}
              <h3 className="text-md font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-200 pb-3 mt-8">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Location</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  {...form.register('address')}
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 15 Udo Udoma Avenue"
                />
                {form.formState.errors.address && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local Government Area
                </label>
                <select
                  {...form.register('lga')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value="Akwa Ibom"
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {/* Column 2: Images, Pricing & Amenities */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-200 pb-3">
                <ImageIcon className="h-4 w-4 text-emerald-600" />
                <span>Images & Pricing</span>
              </h2>

              {/* Property Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                  <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-2">Upload images (JPG, PNG)</p>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-emerald-600 text-white px-3 py-1 rounded text-xs hover:bg-emerald-700 transition-colors cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Choose Images</span>
                  </label>
                </div>

                {propertyImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {propertyImages.slice(0, 6).map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability & Pricing */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-200 pb-3">
                  <Square className="h-4 w-4 text-emerald-600" />
                  <span>Availability & Pricing</span>
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </h3>
                
                <div className="space-y-4 mt-4">
                  <div className="flex flex-col space-y-3">
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

                  {watchIsForSale && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price (₦)
                      </label>
                      <input
                        {...form.register('price')}
                        type="number"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., 85000000"
                      />
                      {form.formState.errors.price && (
                        <p className="mt-1 text-xs text-red-600">
                          {form.formState.errors.price.message}
                        </p>
                      )}
                    </div>
                  )}

                  {watchIsForLease && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Lease Price (₦)
                      </label>
                      <input
                        {...form.register('lease_price_annual')}
                        type="number"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., 3600000"
                      />
                      {form.formState.errors.lease_price_annual && (
                        <p className="mt-1 text-xs text-red-600">
                          {form.formState.errors.lease_price_annual.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {showAmenities && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-200 pb-3">
                    <Star className="h-4 w-4 text-emerald-600" />
                    <span>Amenities</span>
                    <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3 mt-4 max-h-48 overflow-y-auto">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-xs text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {selectedAmenities.length > 0 && (
                    <p className="text-xs text-emerald-600 mt-2">
                      {selectedAmenities.length} amenities selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Column 3: Documents */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-200 pb-3">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span>Property Documents</span>
              </h2>

              {/* Certificate of Occupancy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate of Occupancy
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  {documents.certificate_of_occupancy ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs text-gray-700 truncate">{documents.certificate_of_occupancy.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument('certificate_of_occupancy')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload('certificate_of_occupancy', e)}
                        className="hidden"
                        id="coo-upload"
                      />
                      <label
                        htmlFor="coo-upload"
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload C of O</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Deed of Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deed of Assignment
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  {documents.deed_of_assignment ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs text-gray-700 truncate">{documents.deed_of_assignment.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument('deed_of_assignment')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload('deed_of_assignment', e)}
                        className="hidden"
                        id="deed-upload"
                      />
                      <label
                        htmlFor="deed-upload"
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Deed</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Survey Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Plan
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  {documents.survey_plan ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs text-gray-700 truncate">{documents.survey_plan.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument('survey_plan')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload('survey_plan', e)}
                        className="hidden"
                        id="survey-upload"
                      />
                      <label
                        htmlFor="survey-upload"
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Survey</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Building Approval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Approval
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  {documents.building_approval ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs text-gray-700 truncate">{documents.building_approval.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument('building_approval')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload('building_approval', e)}
                        className="hidden"
                        id="building-upload"
                      />
                      <label
                        htmlFor="building-upload"
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Approval</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  <div className="text-center mb-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload('other', e)}
                      className="hidden"
                      id="other-upload"
                    />
                    <label
                      htmlFor="other-upload"
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload Other</span>
                    </label>
                  </div>

                  {documents.other.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {documents.other.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-emerald-600" />
                            <span className="text-xs text-gray-700 truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument('other', index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Registering...' : 'Register Property'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}