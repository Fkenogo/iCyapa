
import { Building, StreetZone, Business, Ad } from '../types';

export const MOCK_ZONES: StreetZone[] = [
  {
    zone_id: 'zone-1',
    zone_name: 'KN 5 Road - Zone A',
    zone_description: 'Main commercial corridor in Nyamata Town.',
    qr_code_url: 'https://ngaho.rw/zone/kn-5-road-zone-a',
    slug: 'kn-5-road-zone-a'
  },
  {
    zone_id: 'zone-2',
    zone_name: 'Nyamata Market District',
    zone_description: 'High traffic retail and local commerce area.',
    qr_code_url: 'https://ngaho.rw/zone/market-district',
    slug: 'market-district'
  }
];

export const MOCK_BUILDINGS: Building[] = [
  {
    building_id: 'b-1',
    building_name: 'Centenary House',
    building_address: 'KN 5 Road, Nyamata',
    street_zone_id: 'zone-1',
    latitude: -2.1528,
    longitude: 30.0931,
    qr_code_url: 'https://ngaho.rw/building/centenary-house',
    total_floors: 5,
    slug: 'centenary-house'
  },
  {
    building_id: 'b-2',
    building_name: 'Palm Plaza',
    building_address: 'Central Avenue, Nyamata',
    street_zone_id: 'zone-1',
    latitude: -2.1535,
    longitude: 30.0945,
    qr_code_url: 'https://ngaho.rw/building/palm-plaza',
    total_floors: 3,
    slug: 'palm-plaza'
  }
];

export const MOCK_BUSINESSES: Business[] = [
  {
    business_id: 'biz-1',
    business_name: 'MTN Service Center',
    building_id: 'b-1',
    floor_number: 'Ground Floor',
    unit_number: 'Shop G1',
    categories: ['Tech & Telecom'],
    phone: '+250 788 123 456',
    email: 'contact@mtn.rw',
    business_hours: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm',
    description: 'Premier telecommunications services including SIM cards, device sales, and mobile money support.',
    navigation_instructions: 'Located immediately to the left of the main building entrance on the ground floor.',
    is_claimed: true,
    is_verified: true,
    photos: ['https://picsum.photos/seed/mtn/800/400'],
    website: 'https://mtn.rw'
  },
  {
    business_id: 'biz-2',
    business_name: 'ABC Law Firm',
    building_id: 'b-1',
    floor_number: '2',
    unit_number: 'Suite 203',
    categories: ['Professional Services'],
    phone: '+250 781 111 222',
    email: 'info@abclaw.rw',
    business_hours: 'Mon-Fri: 9am-5pm',
    description: 'Expert legal consulting for commercial, civil, and criminal cases.',
    navigation_instructions: 'Take the elevator to the 2nd floor. Turn right. We are the third door on your left.',
    is_claimed: false,
    is_verified: false,
    photos: ['https://picsum.photos/seed/law/800/400']
  },
  {
    business_id: 'biz-3',
    business_name: 'Java Cafe',
    building_id: 'b-2',
    floor_number: 'Ground Floor',
    unit_number: 'Shop 05',
    categories: ['Restaurants & Cafes'],
    phone: '+250 782 333 444',
    email: 'hello@javacafe.rw',
    business_hours: 'Daily: 7am-10pm',
    description: 'Freshly brewed Rwandan coffee and delicious pastries in a cozy atmosphere.',
    navigation_instructions: 'Enter via the street-side terrace. We are located near the water fountain.',
    is_claimed: true,
    is_verified: true,
    photos: ['https://picsum.photos/seed/cafe/800/400']
  }
];

export const MOCK_ADS: Ad[] = [
  {
    ad_id: 'ad-1',
    advertiser_business_id: 'biz-1',
    ad_type: 'Featured',
    ad_content: {
      imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1000&auto=format&fit=crop',
      text: 'Experience 5G speed at MTN Nyamata!',
      cta: 'Visit Now'
    },
    target_location: 'KN 5 Road',
    is_active: true
  },
  {
    ad_id: 'ad-2',
    advertiser_business_id: 'biz-3',
    ad_type: 'Banner',
    ad_content: {
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
      text: 'Fresh Pastries at Java Cafe',
      cta: 'Claim Offer'
    },
    target_category: 'Food & Dining',
    is_active: true
  },
  {
    ad_id: 'ad-3',
    advertiser_business_id: 'biz-2',
    ad_type: 'Featured',
    ad_content: {
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop',
      text: 'Expert Legal Advice for Your Business',
      cta: 'Learn More'
    },
    is_active: true
  }
];
