
import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building as BuildingIcon, MapPin, Search, ChevronRight, Verified } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { db } from '../services/db';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const results = db.search(query);

  const totalResults = results.businesses.length + results.buildings.length + results.zones.length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="px-4 pt-4 sticky top-0 bg-white z-40 space-y-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <SearchBar initialValue={query} />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-500 px-2">
          {totalResults > 0 ? (
            <span>Showing {totalResults} results for "<strong className="text-gray-900">{query}</strong>"</span>
          ) : (
            <span>No results found for "<strong className="text-gray-900">{query}</strong>"</span>
          )}
        </div>
      </div>

      <div className="px-4 space-y-8 pb-20">
        {results.businesses.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Businesses</h2>
            <div className="grid gap-3">
              {results.businesses.map(biz => (
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
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

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

        {totalResults === 0 && (
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
