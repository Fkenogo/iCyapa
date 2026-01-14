
import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building as BuildingIcon, MapPin, Search, ChevronRight, Verified, X } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { db } from '../services/db';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const results = db.search(query);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get unique categories from the initial business results
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    results.businesses.forEach(biz => {
      biz.categories.forEach(cat => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [results.businesses]);

  // Filter businesses based on selected categories
  const filteredBusinesses = useMemo(() => {
    if (selectedCategories.length === 0) return results.businesses;
    return results.businesses.filter(biz => 
      biz.categories.some(cat => selectedCategories.includes(cat))
    );
  }, [results.businesses, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const totalResultsCount = filteredBusinesses.length + results.buildings.length + results.zones.length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="px-4 pt-4 sticky top-0 bg-white z-40 space-y-4 pb-2 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <SearchBar initialValue={query} />
          </div>
        </div>

        <div className="space-y-3 px-2">
          <div className="text-sm font-medium text-gray-500">
            {totalResultsCount > 0 ? (
              <span>Showing {totalResultsCount} results for "<strong className="text-gray-900">{query}</strong>"</span>
            ) : (
              <span>No results found for "<strong className="text-gray-900">{query}</strong>"</span>
            )}
          </div>

          {availableCategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {availableCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                    }`}
                  >
                    {cat}
                    {isSelected && <X size={12} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-8 pb-20">
        {filteredBusinesses.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Businesses</h2>
            <div className="grid gap-3">
              {filteredBusinesses.map(biz => (
                <Link 
                  key={biz.business_id} 
                  to={`/business/${biz.business_id}`}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="font-bold text-gray-900">{biz.business_name}</div>
                      {biz.is_verified && <Verified size={14} className="text-green-500" />}
                    </div>
                    <div className="text-xs text-gray-500">
                      {db.getBuildingById(biz.building_id)?.building_name}, Floor {biz.floor_number}
                    </div>
                    <div className="flex gap-1 flex-wrap pt-1">
                      {biz.categories.map(c => (
                        <span key={c} className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-bold text-gray-400 uppercase">{c}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Note: Buildings and Zones are not filtered by category in this implementation as they don't have categories in the schema */}
        {results.buildings.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Buildings</h2>
            <div className="grid gap-3">
              {results.buildings.map(b => (
                <Link 
                  key={b.building_id} 
                  to={`/building/${b.slug}`}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-[0.98] transition-all"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <BuildingIcon size={20} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="font-bold text-gray-900">{b.building_name}</div>
                    <div className="text-xs text-gray-500">{b.building_address}</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.zones.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Zones</h2>
            <div className="grid gap-3">
              {results.zones.map(z => (
                <Link 
                  key={z.zone_id} 
                  to={`/zone/${z.slug}`}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-[0.98] transition-all"
                >
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="font-bold text-gray-900">{z.zone_name}</div>
                    <div className="text-xs text-gray-500">{z.zone_description}</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {totalResultsCount === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="text-5xl">🔭</div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">No matches found</h3>
              <p className="text-sm text-gray-500">Try searching for a building name, business name, or a category like "Law" or "Coffee".</p>
            </div>
            <Link to="/" className="inline-block py-3 px-6 bg-blue-600 text-white rounded-xl font-bold">Back to Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
