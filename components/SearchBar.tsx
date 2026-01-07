
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building as BuildingIcon, ArrowRight } from 'lucide-react';
import { db } from '../services/db';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search businesses, buildings, or zones...", initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const results = db.search(query);
      const combined = [
        ...results.businesses.slice(0, 3).map(b => ({ ...b, type: 'business' })),
        ...results.buildings.slice(0, 2).map(b => ({ ...b, type: 'building' })),
        ...results.zones.slice(0, 1).map(z => ({ ...z, type: 'zone' })),
      ];
      setSuggestions(combined);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[100]">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.type === 'business') navigate(`/business/${item.business_id}`);
                else if (item.type === 'building') navigate(`/building/${item.slug}`);
                else navigate(`/zone/${item.slug}`);
                setSuggestions([]);
                setQuery('');
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b last:border-0 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.type === 'business' ? <Search size={16} className="text-gray-400" /> : 
                 item.type === 'building' ? <BuildingIcon size={16} className="text-gray-400" /> :
                 <MapPin size={16} className="text-gray-400" />}
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {item.type === 'business' ? item.business_name : 
                     item.type === 'building' ? item.building_name : item.zone_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.type === 'business' ? item.unit_number : 
                     item.type === 'building' ? item.building_address : 'Street Zone'}
                  </div>
                </div>
              </div>
              <ArrowRight size={14} className="text-gray-300" />
            </button>
          ))}
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 bg-gray-50 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors text-center"
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
