
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building as BuildingIcon, ArrowRight, Briefcase, Zap, X } from 'lucide-react';
import { db } from '../services/db';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search businesses (e.g. MTN, Bank)...", 
  initialValue = "",
  className = "" 
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const results = db.search(query);
      const combined = [
        ...results.businesses.slice(0, 5).map(b => ({ ...b, type: 'business' })),
        ...results.buildings.slice(0, 2).map(b => ({ ...b, type: 'building' })),
        ...results.zones.slice(0, 1).map(z => ({ ...z, type: 'zone' })),
      ];
      setSuggestions(combined);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-400'}`}>
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white border-2 rounded-[1.5rem] py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
            isFocused ? 'border-blue-500 shadow-blue-100 ring-4 ring-blue-50' : 'border-gray-100 group-hover:border-blue-200'
          }`}
        />
        {query && (
           <button 
             type="button" 
             onClick={() => { setQuery(''); setSuggestions([]); }}
             className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-colors"
           >
             <X size={14} />
           </button>
        )}
      </form>

      {isFocused && (suggestions.length > 0 || query.length > 1) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const building = item.type === 'business' ? db.getBuildingById(item.building_id) : null;
                return (
                  <button
                    key={`${item.type}-${idx}`}
                    onClick={() => {
                      if (item.type === 'business') navigate(`/business/${item.business_id}`);
                      else if (item.type === 'building') navigate(`/building/${item.slug}`);
                      else navigate(`/zone/${item.slug}`);
                      setIsFocused(false);
                      setQuery('');
                    }}
                    className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        item.type === 'business' ? 'bg-blue-50 text-blue-500' : 
                        item.type === 'building' ? 'bg-green-50 text-green-500' : 
                        'bg-orange-50 text-orange-500'
                      }`}>
                        {item.type === 'business' ? <Briefcase size={18} /> : 
                         item.type === 'building' ? <BuildingIcon size={18} /> :
                         <MapPin size={18} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5">
                          {item.type === 'business' ? item.business_name : 
                           item.type === 'building' ? item.building_name : item.zone_name}
                          {item.is_verified && <Zap size={10} className="text-blue-500 fill-blue-500" />}
                        </div>
                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest truncate">
                          {item.type === 'business' ? (
                            <span>{building?.building_name} • Floor {item.floor_number}</span>
                          ) : item.type === 'building' ? (
                            item.building_address
                          ) : 'Street Zone Area'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm font-bold text-gray-400">No instant business matches</p>
                <button 
                   onClick={handleSearchSubmit}
                   className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}
          </div>
          {query.length > 0 && (
            <button
              onClick={handleSearchSubmit}
              className="w-full py-4 bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-center border-t border-gray-100"
            >
              Full Search Results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
