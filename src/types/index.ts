export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'property_owner' | 'government_official' | 'admin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: 'land' | 'building' | 'commercial' | 'residential';
  address: string;
  lga: string; // Local Government Area
  state: string;
  size_sqm: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  owner_id: string;
  owner?: User;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  is_for_sale: boolean;
  is_for_lease: boolean;
  price?: number;
  lease_price_annual?: number;
  documents: PropertyDocument[];
  verification_notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyDocument {
  id: string;
  property_id: string;
  document_type: 'certificate_of_occupancy' | 'deed_of_assignment' | 'survey_plan' | 'building_approval' | 'other';
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface SearchFilters {
  property_type?: string;
  lga?: string;
  min_price?: number;
  max_price?: number;
  is_for_sale?: boolean;
  is_for_lease?: boolean;
  status?: string;
}