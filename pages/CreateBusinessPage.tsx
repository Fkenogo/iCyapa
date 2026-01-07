
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Upload, ArrowRight, Building, Plus, 
  ShieldCheck, Loader2, Info, Camera, Clock, MapPin, Phone, 
  Mail, Navigation, Search, X, MapPin as MapPinIcon, Copy,
  ChevronDown, ChevronUp, Trash2, Calendar, PlusCircle, 
  Facebook, Instagram, Twitter, Sparkles
} from 'lucide-react';
import { db } from '../services/db';
import { CATEGORY_GROUPS, PREDEFINED_CATEGORIES } from '../constants';

interface TimeSlot {
  open: string;
  close: string;
}

interface DayHours {
  isOpen: boolean;
  slots: TimeSlot[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateBusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Building Search State
  const [buildingQuery, setBuildingQuery] = useState('');
  const [buildingSuggestions, setBuildingSuggestions] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [showAddBuildingForm, setShowAddBuildingForm] = useState(false);
  const [newBuildingData, setNewBuildingData] = useState({ name: '', address: '' });

  // Category Selection & Suggestion State
  const [categoryInput, setCategoryInput] = useState('');
  const [filteredCategorySuggestions, setFilteredCategorySuggestions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Retail & Consumer Service']);

  // Photos State
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);

  // Structured Hours State with Multiple Slots support
  const [hours, setHours] = useState<Record<string, DayHours>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { 
        isOpen: day !== 'Sunday', 
        slots: [{ open: '08:00', close: '18:00' }]
      }
    }), {})
  );

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    businessName: '',
    buildingId: '',
    floorNumber: '',
    unitNumber: '',
    categories: [] as string[],
    suggestedCategory: '',
    phone: '',
    email: '',
    description: '',
    navigation: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    if (buildingQuery.length > 0 && !selectedBuilding) {
      const results = db.search(buildingQuery);
      setBuildingSuggestions(results.buildings);
    } else {
      setBuildingSuggestions([]);
    }
  }, [buildingQuery, selectedBuilding]);

  useEffect(() => {
    if (categoryInput.length > 0) {
      const allCats = PREDEFINED_CATEGORIES.map(c => c.name);
      const filtered = allCats.filter(c => 
        c.toLowerCase().includes(categoryInput.toLowerCase()) && 
        !formData.categories.includes(c)
      );
      setFilteredCategorySuggestions(filtered);
    } else {
      setFilteredCategorySuggestions([]);
    }
  }, [categoryInput, formData.categories]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : prev.categories.length < 5 ? [...prev.categories, cat] : prev.categories
    }));
    setCategoryInput('');
  };

  const handleSuggestCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      suggestedCategory: cat
    }));
    setCategoryInput('');
  };

  const toggleDay = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const handleSlotChange = (day: string, slotIndex: number, field: keyof TimeSlot, value: string) => {
    setHours(prev => {
      const newSlots = [...prev[day].slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
      return {
        ...prev,
        [day]: { ...prev[day], slots: newSlots }
      };
    });
  };

  const addSlot = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { 
        ...prev[day], 
        slots: [...prev[day].slots, { open: '13:00', close: '17:00' }] 
      }
    }));
  };

  const removeSlot = (day: string, slotIndex: number) => {
    setHours(prev => {
      const newSlots = prev[day].slots.filter((_, i) => i !== slotIndex);
      return {
        ...prev,
        [day]: { ...prev[day], slots: newSlots.length > 0 ? newSlots : [{ open: '08:00', close: '18:00' }] }
      };
    });
  };

  const copyToAll = (sourceDay: string) => {
    const source = hours[sourceDay];
    setHours(prev => {
      const next = { ...prev };
      DAYS.forEach(day => {
        next[day] = { ...next[day], slots: source.slots.map(s => ({ ...s })) }; 
      });
      return next;
    });
  };

  const formatHoursString = () => {
    return DAYS.map(day => {
      const h = hours[day];
      if (!h.isOpen) return `${day.substring(0, 3)}: Closed`;
      const slotsText = h.slots.map(s => `${s.open}-${s.close}`).join(', ');
      return `${day.substring(0, 3)}: ${slotsText}`;
    }).join('\n');
  };

  const handleAddBuilding = () => {
    const building = db.addBuilding({
      building_id: 'temp-' + Date.now(),
      building_name: newBuildingData.name,
      building_address: newBuildingData.address,
      street_zone_id: 'zone-1',
      latitude: 0,
      longitude: 0,
      qr_code_url: '',
      total_floors: 1,
      slug: newBuildingData.name.toLowerCase().replace(/\s+/g, '-'),
      is_user_suggested: true
    });
    setSelectedBuilding(building);
    setFormData(prev => ({ ...prev, buildingId: building.building_id }));
    setShowAddBuildingForm(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPreviewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.ownerName || !formData.ownerPhone || !formData.ownerEmail)) return;
    if (step === 2 && (!formData.businessName || !formData.buildingId || !formData.floorNumber || !formData.unitNumber || !formData.phone || !formData.email || (formData.categories.length === 0 && !formData.suggestedCategory))) return;
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    const finalHours = formatHoursString();
    const finalCategories = [...formData.categories];
    if (formData.suggestedCategory) finalCategories.push(formData.suggestedCategory);

    const newBusiness = {
      ...formData,
      categories: finalCategories,
      business_id: 'biz-' + Date.now(),
      business_hours: finalHours,
      is_claimed: true,
      is_verified: false,
      photos: previewPhotos.length > 0 ? previewPhotos : [],
      social_links: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
      }
    };

    await new Promise(resolve => setTimeout(resolve, 2000));
    db.addBusiness(newBusiness as any);
    
    setIsSubmitting(false);
    setStep(5);
  };

  if (step === 5) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[80vh] animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-100">
          <CheckCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="text-gray-500 leading-relaxed text-sm">
            Thank you, <strong>{formData.ownerName}</strong>! Your listing for <strong>{formData.businessName}</strong> is under review. 
            We'll notify you at <strong>{formData.ownerEmail}</strong> once it's verified.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-xs py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-400 bg-white min-h-screen">
      <div className="px-4 py-6 border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">New Listing • Step {step} of 4</div>
            <h1 className="text-xl font-bold text-gray-900">List your business</h1>
          </div>
        </div>
        <div className="mt-4 flex gap-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      <div className="px-6 pb-40 space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-3 border border-blue-100">
              <ShieldCheck size={24} className="text-blue-600 shrink-0" />
              <p className="text-xs font-semibold text-blue-900 leading-tight">Ownership details for verification.</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Owner Name</label>
                <input 
                  type="text" required autoFocus
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" 
                  placeholder="Full Name" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Owner Phone</label>
                <input 
                  type="tel" required
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" 
                  placeholder="+250..." 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Owner Email</label>
                <input 
                  type="email" required
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" 
                  placeholder="Email" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Info size={18} className="text-blue-600" /> Business Details</h3>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name</label>
                <input 
                  type="text" required
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" 
                  placeholder="Official Name" 
                />
              </div>

              {/* Building Search */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Location / Building</label>
                {selectedBuilding ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Building size={20} className="text-blue-600" />
                      <div>
                        <div className="text-sm font-bold text-blue-900">{selectedBuilding.building_name}</div>
                        <div className="text-[10px] text-blue-500 uppercase">{selectedBuilding.building_address}</div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedBuilding(null); setFormData({...formData, buildingId: ''}); setBuildingQuery(''); }} className="p-1 text-blue-400 hover:text-blue-600">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        value={buildingQuery}
                        onChange={(e) => setBuildingQuery(e.target.value)}
                        className="w-full p-4 pl-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" 
                        placeholder="Search for building..."
                      />
                    </div>
                    {buildingQuery.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">
                        {buildingSuggestions.length > 0 ? (
                          buildingSuggestions.map(b => (
                            <button
                              key={b.building_id}
                              type="button"
                              onClick={() => { setSelectedBuilding(b); setFormData({...formData, buildingId: b.building_id}); setBuildingQuery(''); }}
                              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left border-b last:border-0"
                            >
                              <Building size={16} className="text-gray-400" />
                              <div>
                                <div className="text-sm font-bold text-gray-900">{b.building_name}</div>
                                <div className="text-[10px] text-gray-500 uppercase">{b.building_address}</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center space-y-3">
                            <p className="text-xs text-gray-500">Building not found? Suggest it.</p>
                            <button 
                              type="button"
                              onClick={() => setShowAddBuildingForm(true)}
                              className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <Plus size={16} /> Add Building
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Enhanced Category Selector with Suggestions & New Suggestions */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 block">Categories</label>
                
                <div className="relative">
                  <input 
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="Search or suggest category..."
                    className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                  {(filteredCategorySuggestions.length > 0 || (categoryInput.trim() !== '' && !PREDEFINED_CATEGORIES.some(c => c.name.toLowerCase() === categoryInput.trim().toLowerCase()))) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {filteredCategorySuggestions.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className="w-full p-4 text-left text-sm hover:bg-gray-50 border-b last:border-0 font-medium text-gray-700"
                        >
                          {cat}
                        </button>
                      ))}
                      {categoryInput.trim() !== '' && !PREDEFINED_CATEGORIES.some(c => c.name.toLowerCase() === categoryInput.trim().toLowerCase()) && (
                        <button
                          type="button"
                          onClick={() => handleSuggestCategory(categoryInput.trim())}
                          className="w-full p-4 text-left text-sm bg-orange-50 hover:bg-orange-100 text-orange-700 font-black flex items-center gap-2 border-b last:border-0"
                        >
                          <PlusCircle size={16} /> Suggest "{categoryInput.trim()}" as new category
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Categories List */}
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      {cat} <X size={12} />
                    </button>
                  ))}
                  {formData.suggestedCategory && (
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, suggestedCategory: ''})}
                      className="px-3 py-1.5 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Sparkles size={12} /> {formData.suggestedCategory} (Suggested) <X size={12} />
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar border rounded-[2rem] p-1.5 bg-gray-50/30">
                  <div className="px-3 py-1 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Browse Segments</div>
                  {CATEGORY_GROUPS.map(group => {
                    const isExpanded = expandedGroups.includes(group.name);
                    return (
                      <div key={group.name} className="bg-white rounded-2xl overflow-hidden mb-1.5 border border-gray-100 last:mb-0 shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.name)}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-blue-500 p-1.5 bg-blue-50 rounded-lg">{group.icon}</div>
                            <span className="text-[11px] font-black uppercase tracking-tight text-gray-600">{group.name}</span>
                          </div>
                          {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 animate-in slide-in-from-top duration-200">
                            {group.categories.map(cat => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryToggle(cat)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                                  formData.categories.includes(cat) 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                    : 'bg-white border-gray-200 text-gray-500 active:bg-gray-100'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Floor</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Ground"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({...formData, floorNumber: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Unit / Shop #</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Shop 5"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone</label>
                  <input 
                    type="tel" required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Social Media Profiles</label>
                <div className="space-y-3">
                  <div className="relative">
                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                    <input 
                      type="url"
                      value={formData.facebook}
                      onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                      placeholder="Facebook Profile URL"
                      className="w-full p-4 pl-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                    <input 
                      type="url"
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      placeholder="Instagram Profile URL"
                      className="w-full p-4 pl-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-pink-600 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                    <input 
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      placeholder="Twitter / X Profile URL"
                      className="w-full p-4 pl-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Operating Hours Picker */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> Operating Hours (24h)
                  </label>
                </div>
                
                <div className="bg-gray-50 rounded-[2.5rem] p-5 space-y-6 border border-gray-100 shadow-inner">
                  {DAYS.map((day) => (
                    <div key={day} className="space-y-3 pb-5 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id={`check-${day}`}
                            checked={hours[day].isOpen} 
                            onChange={() => toggleDay(day)}
                            className="w-6 h-6 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`check-${day}`} className={`text-sm font-black transition-colors ${hours[day].isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                            {day}
                          </label>
                        </div>
                        {hours[day].isOpen && (
                          <button 
                            type="button" 
                            onClick={() => copyToAll(day)}
                            className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-100 rounded-full hover:bg-blue-50 shadow-sm"
                            title="Sync all days"
                          >
                            <Copy size={12} /> Sync
                          </button>
                        )}
                      </div>
                      
                      {hours[day].isOpen && (
                        <div className="space-y-3 pl-9 animate-in slide-in-from-top duration-300">
                          {hours[day].slots.map((slot, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-3">
                              <div className="flex flex-1 items-center gap-2">
                                <div className="flex-1 space-y-1">
                                  <label className="text-[8px] font-black text-gray-400 uppercase px-1 text-center block">Opens</label>
                                  <input 
                                    type="time" 
                                    value={slot.open} 
                                    onChange={(e) => handleSlotChange(day, sIdx, 'open', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 text-center shadow-sm"
                                  />
                                </div>
                                <span className="text-gray-300 font-black self-end pb-4">—</span>
                                <div className="flex-1 space-y-1">
                                  <label className="text-[8px] font-black text-gray-400 uppercase px-1 text-center block">Closes</label>
                                  <input 
                                    type="time" 
                                    value={slot.close} 
                                    onChange={(e) => handleSlotChange(day, sIdx, 'close', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 text-center shadow-sm"
                                  />
                                </div>
                              </div>
                              <div className="self-end pb-1.5">
                                {hours[day].slots.length > 1 && (
                                  <button 
                                    type="button"
                                    onClick={() => removeSlot(day, sIdx)} 
                                    className="p-3 text-red-500 hover:text-red-600 bg-white border border-red-50 rounded-xl shadow-sm"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => addSlot(day)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-2xl border border-blue-100 shadow-sm transition-all"
                          >
                            <PlusCircle size={16} /> Add Split Shift
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">About Us</label>
                <textarea 
                  required rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                  placeholder="Describe your services..." 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Navigation Instructions</label>
                <textarea 
                  required rows={2}
                  value={formData.navigation}
                  onChange={(e) => setFormData({...formData, navigation: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium italic" 
                  placeholder="e.g. Near the main elevator..." 
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Step 3: Photos</h3>
              <p className="text-sm text-gray-500 px-4 leading-relaxed">Showcase your business. Upload or capture photos of your storefront and interior.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors group"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Camera size={28} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Add Photo</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                multiple 
                accept="image/*" 
                capture="environment"
                onChange={handlePhotoUpload} 
                className="hidden" 
              />

              {previewPhotos.map((photo, idx) => (
                <div key={idx} className="aspect-square rounded-[2.5rem] overflow-hidden relative group">
                  <img src={photo} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {previewPhotos.length === 0 && (
              <p className="text-xs text-gray-400 italic pt-4">No photos added yet. You can still proceed without them.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-gray-900">Final Step: Review</h3>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-6 space-y-6 overflow-hidden relative border-t-4 border-t-blue-500">
               <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Listing Preview</h4>
                    <p className="text-2xl font-black text-gray-900 leading-tight">{formData.businessName}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {formData.categories.map(c => <span key={c} className="px-2 py-0.5 bg-gray-100 rounded-md text-[8px] font-bold text-gray-500 uppercase">{c}</span>)}
                      {formData.suggestedCategory && <span className="px-2 py-0.5 bg-orange-50 rounded-md text-[8px] font-bold text-orange-600 uppercase italic">Suggest: {formData.suggestedCategory}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex gap-2">
                       <MapPinIcon size={16} className="text-gray-400 shrink-0" />
                       <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                         <p className="text-xs font-bold text-gray-800">{selectedBuilding?.building_name}</p>
                         <p className="text-[10px] text-gray-500">Floor {formData.floorNumber} • {formData.unitNumber}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Clock size={16} className="text-gray-400 shrink-0" />
                       <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hours</p>
                         <p className="text-[9px] font-bold text-gray-800 whitespace-pre-wrap leading-tight pt-1">
                            {formatHoursString()}
                         </p>
                       </div>
                    </div>
                  </div>

                  {previewPhotos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
                       {previewPhotos.map((p, i) => (
                         <img key={i} src={p} className="w-16 h-16 rounded-xl object-cover shrink-0 border" />
                       ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {formData.facebook && <Facebook size={16} className="text-blue-600" />}
                    {formData.instagram && <Instagram size={16} className="text-pink-600" />}
                    {formData.twitter && <Twitter size={16} className="text-blue-400" />}
                  </div>
               </div>

               <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</p>
                    <p className="text-xs font-bold text-gray-900">{formData.ownerName}</p>
                    <p className="text-[10px] text-gray-500">{formData.ownerEmail} • {formData.ownerPhone}</p>
                  </div>
               </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer border border-transparent hover:border-blue-200 transition-colors">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm" />
              <span className="text-xs font-bold text-gray-600 leading-relaxed italic">I confirm all information is correct.</span>
            </label>
          </div>
        )}

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t p-6 pb-10 z-[100] shadow-2xl">
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => step < 4 ? nextStep() : handleSubmit({} as any)}
            className={`w-full py-5 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-white ${
              step === 4 ? 'bg-green-600 shadow-green-200' : 'bg-blue-600 shadow-blue-200'
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (step === 4 ? 'Confirm & List Business' : 'Continue')}
            {step < 4 && !isSubmitting && <ArrowRight size={20} />}
          </button>
        </div>
      </div>

      {/* Add New Building Modal */}
      {showAddBuildingForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Suggest Building</h3>
              <button onClick={() => setShowAddBuildingForm(false)} className="p-2 bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Building Name</label>
                <input 
                  type="text"
                  value={newBuildingData.name}
                  onChange={(e) => setNewBuildingData({...newBuildingData, name: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl font-medium text-sm" 
                  placeholder="e.g. Skyline Towers"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Address</label>
                <input 
                  type="text"
                  value={newBuildingData.address}
                  onChange={(e) => setNewBuildingData({...newBuildingData, address: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-xl font-medium text-sm" 
                  placeholder="e.g. KN 5 Road"
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddBuilding}
                disabled={!newBuildingData.name || !newBuildingData.address}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
              >
                Add Building
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBusinessPage;
