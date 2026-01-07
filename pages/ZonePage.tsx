
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building as BuildingIcon, ChevronRight, MapPin, Search, Info } from 'lucide-react';
import { db } from '../services/db';

const ZonePage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const zone = db.getZoneBySlug(slug || '');
  const [searchQuery, setSearchQuery] = useState('');

  if (!zone) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-4xl">🏜️</div>
        <h2 className="text-xl font-bold text-gray-900">Zone Not Found</h2>
        <button onClick={() => navigate('/zones')} className="text-blue-600 font-bold underline">Back to Street Zones</button>
      </div>
    );
  }

  const buildingsInZone = db.getBuildings().filter(b => 
    b.street_zone_id === zone.zone_id &&
    (b.building_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     b.building_address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-right duration-500 bg-white min-h-screen">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-gray-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest truncate">Zone Details</h1>
      </div>

      {/* Zone Hero Info */}
      <div className="px-6 py-8 bg-gradient-to-br from-orange-50 to-white border-b border-orange-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
            <MapPin size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            {zone.zone_name}
          </h2>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
          <div className="flex gap-2 mb-1">
            <Info size={14} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">About this area</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {zone.zone_description}
          </p>
        </div>
      </div>

      {/* Building Directory */}
      <div className="px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Building Directory</h3>
            <p className="text-xs text-gray-500 font-medium">{buildingsInZone.length} Premises in this zone</p>
          </div>
        </div>

        {/* Search within zone */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search building name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-4 bg-gray-50 border-0 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="grid gap-4">
          {buildingsInZone.length > 0 ? (
            buildingsInZone.map(building => {
              const businessCount = db.getBusinessesInBuilding(building.building_id).length;
              return (
                <Link 
                  key={building.building_id}
                  to={`/building/${building.slug}`}
                  className="group bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-xl hover:border-blue-100 transition-all active:scale-[0.98]"
                >
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BuildingIcon size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">
                      {building.building_name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <MapPin size={12} className="text-gray-400" />
                      {building.building_address}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                        {businessCount} Businesses
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {building.total_floors} Floors
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </Link>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-400">No buildings match your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto p-10 bg-gray-50 text-center space-y-4">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">iCyapa Zone Intelligence</div>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">
          Helping you navigate Nyamata building by building.
        </p>
      </div>
    </div>
  );
};

export default ZonePage;
