
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, ChevronRight, Verified, MessageSquare, Send, User, Zap } from 'lucide-react';
import { db } from '../services/db';
// Fix: Import CATEGORY_GROUPS to resolve the reference on line 103
import { THEME_COLORS, PREDEFINED_CATEGORIES, CATEGORY_GROUPS } from '../constants';

const BuildingPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const building = db.getBuildingBySlug(slug || '');
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [commentType, setCommentType] = useState<'general' | 'correction'>('general');

  if (!building) {
    return <div className="p-8 text-center font-bold">Building not found.</div>;
  }

  const businesses = db.getBusinessesInBuilding(building.building_id);
  const comments = db.getCommentsForBuilding(building.building_id);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesSearch = b.business_name.toLowerCase().includes(internalSearch.toLowerCase());
      const matchesFloor = selectedFloor === 'All' || b.floor_number === selectedFloor;
      const matchesCategory = selectedCategory === 'All' || b.categories.includes(selectedCategory);
      return matchesSearch && matchesFloor && matchesCategory;
    });
  }, [businesses, internalSearch, selectedFloor, selectedCategory]);

  const floors = ['All', 'Ground Floor', ...Array.from({ length: building.total_floors }, (_, i) => (i + 1).toString())];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      db.addComment({
        building_id: building.building_id,
        user_name: userName || 'Anonymous User',
        comment: commentText,
        type: commentType
      });
      setCommentText('');
      setUserName('');
      setShowCommentForm(false);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500 bg-white min-h-screen">
      {/* Header Bar */}
      <div className="px-5 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b space-y-5 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2.5 bg-gray-100 rounded-full text-gray-600 active:scale-90 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <div className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">Building Directory</div>
            <h1 className="text-xl font-black text-gray-900 truncate leading-tight tracking-tight">{building.building_name}</h1>
          </div>
        </div>

        {/* Local Search in Building */}
        <div className="relative group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${internalSearch ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
          <input
            type="text"
            placeholder={`Search businesses in ${building.building_name}...`}
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            className="w-full py-4 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="relative shrink-0">
            <select 
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest focus:outline-none border-none cursor-pointer shadow-sm active:scale-95 transition-transform appearance-none pr-8"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="All">All Floors</option>
              {floors.slice(1).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
               <ChevronDown size={14} />
            </div>
          </div>

          <div className="relative shrink-0">
            <select 
              className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest focus:outline-none border-none cursor-pointer shadow-sm active:scale-95 transition-transform appearance-none pr-8"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORY_GROUPS.map(group => (
                <optgroup key={group.name} label={group.name}>
                  {group.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
               <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 pb-20">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map(biz => (
            <Link 
              key={biz.business_id} 
              to={`/business/${biz.business_id}`}
              className="group flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all active:scale-[0.98]"
            >
              <div className="p-5 flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{biz.business_name}</h3>
                    {biz.is_verified && <Zap size={16} className="text-blue-500 fill-blue-50 shrink-0" />}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {biz.categories.map(cat => (
                      <span key={cat} className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{cat}</span>
                    ))}
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pt-1">
                    Floor {biz.floor_number} • {biz.unit_number}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner shrink-0">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="text-5xl">🔎</div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">No businesses found</h3>
              <p className="text-sm text-gray-500 font-medium">Try changing your filters or searching.</p>
            </div>
          </div>
        )}
      </div>

      {/* Adjustments Section */}
      <div className="mx-5 mb-10 p-8 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
             <h3 className="text-lg font-black text-gray-900 tracking-tight">Report Error</h3>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Help us improve the directory</p>
          </div>
          <button 
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="text-[10px] font-black text-blue-600 px-4 py-2 bg-white border border-blue-100 rounded-full shadow-sm hover:shadow-md transition-all uppercase tracking-widest"
          >
            {showCommentForm ? 'Close' : 'Adjust Info'}
          </button>
        </div>

        {showCommentForm && (
          <form onSubmit={handleCommentSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-blue-50 space-y-4 animate-in slide-in-from-top duration-300">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Correction Type</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setCommentType('correction')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${commentType === 'correction' ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'border-gray-100 text-gray-400 bg-gray-50'}`}
                  >
                    Error Report
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCommentType('general')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${commentType === 'general' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-gray-100 text-gray-400 bg-gray-50'}`}
                  >
                    Note / Suggestion
                  </button>
                </div>
             </div>
             <div className="space-y-1.5">
                <textarea 
                  required
                  placeholder="Tell us what is wrong..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={4}
                />
             </div>
             <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
};

// Helper for select dropdowns
const ChevronDown = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default BuildingPage;
