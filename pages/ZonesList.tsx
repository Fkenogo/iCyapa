
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronRight, Building as BuildingIcon } from 'lucide-react';
import { db } from '../services/db';

const ZonesList: React.FC = () => {
  const navigate = useNavigate();
  const zones = db.getZones();

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="px-4 py-6 bg-white border-b sticky top-0 z-40 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Street Zones</h1>
      </div>

      <div className="p-4 space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed px-1">
          Browse Nyamata by neighborhood or street zones to discover businesses in those specific areas.
        </p>

        <div className="grid gap-4">
          {zones.map(z => {
            const buildingsInZone = db.getBuildings().filter(b => b.street_zone_id === z.zone_id);
            return (
              <div key={z.zone_id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                      <MapPin size={22} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{z.zone_name}</h2>
                  </div>
                  <p className="text-sm text-gray-500">{z.zone_description}</p>
                </div>
                
                <div className="bg-gray-50/50 p-2 space-y-1">
                  {buildingsInZone.map(b => (
                    <Link 
                      key={b.building_id} 
                      to={`/building/${b.slug}`}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <BuildingIcon size={18} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">{b.building_name}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ZonesList;
