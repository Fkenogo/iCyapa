
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, ChevronRight, Verified, MessageSquare, Send, User } from 'lucide-react';
import { db } from '../services/db';
import { THEME_COLORS, PREDEFINED_CATEGORIES } from '../constants';

const BuildingPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const building = db.getBuildingBySlug(slug || '');
  const [search, setSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Comment state
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [commentType, setCommentType] = useState<'general' | 'correction'>('general');

  if (!building) {
    return <div className="p-8 text-center">Building not found.</div>;
  }

  const businesses = db.getBusinessesInBuilding(building.building_id);
  const comments = db.getCommentsForBuilding(building.building_id);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesSearch = b.business_name.toLowerCase().includes(search.toLowerCase());
      const matchesFloor = selectedFloor === 'All' || b.floor_number === selectedFloor;
      const matchesCategory = selectedCategory === 'All' || b.categories.includes(selectedCategory);
      return matchesSearch && matchesFloor && matchesCategory;
    });
  }, [businesses, search, selectedFloor, selectedCategory]);

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
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="px-4 py-4 sticky top-0 bg-white z-40 border-b space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">You're at</div>
            <h1 className="text-xl font-bold text-gray-900">{building.building_name}</h1>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search in this building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-10 pr-4 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <select 
            className="shrink-0 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold focus:outline-none border-none cursor-pointer"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
          >
            <option value="All">All Floors</option>
            {floors.slice(1).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select 
            className="shrink-0 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-bold focus:outline-none border-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {PREDEFINED_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map(biz => (
            <Link 
              key={biz.business_id} 
              to={`/business/${biz.business_id}`}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="p-4 flex justify-between items-start gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{biz.business_name}</h3>
                    {biz.is_verified && <Verified size={16} className="text-green-500 fill-green-50" />}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {biz.categories.map(cat => (
                      <span key={cat} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{cat}</span>
                    ))}
                  </div>
                  <div className="text-xs font-medium text-gray-500 pt-1">
                    {biz.floor_number}, {biz.unit_number}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center space-y-2">
            <div className="text-4xl text-gray-300">🔍</div>
            <div className="font-bold text-gray-900">No matching businesses</div>
            <div className="text-sm text-gray-500">Try adjusting your filters.</div>
          </div>
        )}
      </div>

      {/* Crowd-sourced Feedback Section */}
      <div className="px-4 py-8 bg-gray-50 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-500" />
            Directory Adjustments
          </h3>
          <button 
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="text-xs font-bold text-blue-600 px-3 py-1 bg-white border border-blue-100 rounded-full shadow-sm"
          >
            {showCommentForm ? 'Cancel' : 'Suggest Correction'}
          </button>
        </div>

        {showCommentForm && (
          <form onSubmit={handleCommentSubmit} className="bg-white p-5 rounded-2xl shadow-xl space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setCommentType('general')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${commentType === 'general' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-100 text-gray-400'}`}
              >
                Comment
              </button>
              <button 
                type="button" 
                onClick={() => setCommentType('correction')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${commentType === 'correction' ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-100 text-gray-400'}`}
              >
                Correction
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Your name (optional)" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <textarea 
              required
              rows={3}
              placeholder={commentType === 'correction' ? "What's wrong? (e.g. wrong floor, building name is different)" : "Add a note about this building..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-100">
              <Send size={14} /> Submit Feedback
            </button>
          </form>
        )}

        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map(c => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <User size={12} />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{c.user_name}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${c.type === 'correction' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {c.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">"{c.comment}"</p>
                <div className="text-[8px] text-gray-400 font-bold uppercase">Submitted on {new Date(c.created_at).toLocaleDateString()}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-[10px] text-gray-400 uppercase font-black tracking-widest py-8">No feedback yet. Be the first to refine this directory!</p>
          )}
        </div>
      </div>

      <div className="mt-4 p-6 bg-gray-100 rounded-t-[2.5rem] space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Building Info</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg text-gray-400">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{building.building_name}</div>
              <div className="text-xs text-gray-500">{building.building_address}</div>
            </div>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(building.building_address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-white border border-gray-200 rounded-2xl text-center font-bold text-blue-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Get Directions to Building
          </a>
        </div>
      </div>
    </div>
  );
};

export default BuildingPage;
