
export interface Building {
  building_id: string;
  building_name: string;
  building_address: string;
  street_zone_id: string;
  latitude: number;
  longitude: number;
  qr_code_url: string;
  total_floors: number;
  slug: string;
  is_user_suggested?: boolean;
}

export interface BuildingComment {
  id: string;
  building_id: string;
  user_name: string;
  comment: string;
  type: 'general' | 'correction' | 'compliment';
  created_at: string;
}

export interface StreetZone {
  zone_id: string;
  zone_name: string;
  zone_description: string;
  qr_code_url: string;
  slug: string;
}

export interface Business {
  business_id: string;
  business_name: string;
  building_id: string;
  floor_number: string;
  unit_number: string;
  categories: string[];
  phone: string;
  email: string;
  business_hours: string;
  description: string;
  navigation_instructions: string;
  is_claimed: boolean;
  is_verified: boolean;
  owner_email?: string;
  owner_phone?: string;
  photos: string[];
  website?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Category {
  category_id: string;
  category_name: string;
  category_icon: string;
}

export interface Ad {
  ad_id: string;
  advertiser_business_id: string;
  ad_type: 'Featured' | 'Search Top' | 'Banner' | 'Popup';
  ad_content: {
    imageUrl: string;
    text: string;
    cta: string;
  };
  target_location?: string;
  target_category?: string;
  is_active: boolean;
}
