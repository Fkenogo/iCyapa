
import React from 'react';
import { 
  Utensils, Stethoscope, Briefcase, Landmark, ShoppingBag, 
  Sparkles, Coffee, GraduationCap, Wrench, Smartphone, 
  Music, Home, Gavel, Users, Hotel, Beer, Dumbbell, Pill,
  Car, Hammer, Scissors, Zap, BookOpen, HeartPulse, HardHat,
  Plane, Globe, Church, Shirt, Activity
} from 'lucide-react';

export const THEME_COLORS = {
  primary: '#00A1DE', // Rwanda Blue
  secondary: '#00B050', // Verified Green
  accent: '#F97316', // Orange
  background: '#F9FAFB'
};

export const CATEGORY_GROUPS = [
  {
    name: 'Retail & Consumer Service',
    icon: <ShoppingBag size={18} />,
    categories: ['Grocery Store', 'Supermarket', 'Electronics Store', 'Hardware Store', 'Pharmacy', 'Stationery', 'Mobile Phone Shop', 'Furniture Store', 'Bookstore', 'Toy Store', 'Florist', 'Jewelry Store']
  },
  {
    name: 'Health & Medical Services',
    icon: <HeartPulse size={18} />,
    categories: ['Clinic', 'General Hospital', 'Dental Clinic', 'Eye Center', 'Pharmacy', 'Medical Laboratory', 'Physiotherapy', 'Psychology Clinic', 'Veterinary Clinic', 'Diagnostic Center']
  },
  {
    name: 'Education & Training',
    icon: <BookOpen size={18} />,
    categories: ['Primary School', 'Secondary School', 'University', 'Vocational Training Center', 'Nursery / Daycare', 'Language School', 'Driving School', 'Music School', 'IT Training Center']
  },
  {
    name: 'Food & Dining',
    icon: <Utensils size={18} />,
    categories: ['Local Cuisine Restaurant', 'Italian Restaurant', 'Bakery', 'Pizza Restaurant', 'Cafe', 'Fast Food', 'Bar & Grill', 'Ice Cream Shop', 'Pub', 'Catering Service']
  },
  {
    name: 'Professional Services',
    icon: <Briefcase size={18} />,
    categories: ['Law Firm', 'Accounting Firm', 'Consulting Agency', 'IT Support', 'Real Estate Agency', 'Marketing Agency', 'Translation Services', 'Architectural Firm', 'Design Studio']
  },
  {
    name: 'Government & Public Service',
    icon: <Gavel size={18} />,
    categories: ['Police Station', 'Post Office', 'District Office', 'Sector Office', 'Local Government', 'NGO Office', 'Courthouse', 'Library', 'Community Center']
  },
  {
    name: 'Automotive & Transportation',
    icon: <Car size={18} />,
    categories: ['Auto Repair Shop', 'Car Wash', 'Gas Station', 'Taxi Stand', 'Bus Station', 'Car Rental', 'Spare Parts Shop', 'Driving School', 'Tire Repair']
  },
  {
    name: 'Manufacturing & Industrial',
    icon: <HardHat size={18} />,
    categories: ['Factory', 'Warehouse', 'Carpentry Workshop', 'Metal Fabrication', 'Textile Mill', 'Food Processing', 'Printing Press', 'Construction Company']
  },
  {
    name: 'Arts, Entertainment & Recreation',
    icon: <Music size={18} />,
    categories: ['Cinema', 'Art Gallery', 'Nightclub', 'Museum', 'Event Space', 'Music Studio', 'Theater', 'Park', 'Game Center']
  },
  {
    name: 'Hospitality & Tourism',
    icon: <Hotel size={18} />,
    categories: ['Hotel', 'Guest House', 'Lodge', 'Travel Agency', 'Tour Operator', 'Resort', 'Hostel', 'Apartment Hotel']
  },
  {
    name: 'Financial Services',
    icon: <Landmark size={18} />,
    categories: ['Bank', 'Forex Bureau', 'Insurance Company', 'Microfinance', 'SACCO', 'Mobile Money Agent', 'Accounting Service']
  },
  {
    name: 'Agriculture & Natural Resources',
    icon: <Zap size={18} />,
    categories: ['Agro-Processing', 'Farm Supply Store', 'Irrigation Services', 'Forestry', 'Poultry Farm', 'Veterinary Services', 'Horticulture']
  },
  {
    name: 'Aviation',
    icon: <Plane size={18} />,
    categories: ['Airport Services', 'Airline Office', 'Cargo Services', 'Hangar', 'Flight Training']
  },
  {
    name: 'Religious places',
    icon: <Church size={18} />,
    categories: ['Church', 'Mosque', 'Temple', 'Prayer Room', 'Religious Center']
  },
  {
    name: 'Fashion & lifestyle',
    icon: <Shirt size={18} />,
    categories: ['Clothing Store', 'Tailor Shop', 'Boutique', 'Shoe Store', 'Beauty Salon', 'Barber Shop', 'Spa', 'Gym & Fitness Center']
  },
  {
    name: 'Real estate & construction',
    icon: <Home size={18} />,
    categories: ['Property Management', 'Architect', 'Contractor', 'Civil Engineering', 'Interior Design', 'Land Surveying']
  },
  {
    name: 'Sports',
    icon: <Activity size={18} />,
    categories: ['Football Pitch', 'Basketball Court', 'Gym', 'Sports Club', 'Swimming Pool', 'Stadium', 'Yoga Studio']
  }
];

export const PREDEFINED_CATEGORIES = CATEGORY_GROUPS.flatMap(group => 
  group.categories.map(cat => ({
    name: cat,
    group: group.name,
    icon: group.icon
  }))
);
