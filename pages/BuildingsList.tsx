
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building as BuildingIcon, MapPin, ChevronRight, Search } from 'lucide-react';
import { db } from '../services/db';

const BuildingsList: React.FC = () => {
  const navigate = useNavigate();
  const buildings = db.getBuildings();

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="px-4 py-6 bg-white border-b sticky top-0 z-40 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Explore Buildings</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by building name or address..."
            className="w-full py-3 pl-10 pr-4 bg-white border border-gray-100 rounded-xl text-sm shadow-sm"
          />
        </div>

        <div className="grid gap-4">
          {buildings.map(b => (
            <Link 
              key={b.building_id}
              to={`/building/${b.slug}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all active:scale-[0.98] group"
            >
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                <BuildingIcon size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{b.building_name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  {b.building_address}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                  {db.getBusinessesInBuilding(b.building_id).length} Businesses • {b.total_floors} Floors
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingsList;
