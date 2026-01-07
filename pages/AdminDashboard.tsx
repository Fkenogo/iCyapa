
import React, { useState } from 'react';
import { db } from '../services/db';
import { 
  Settings, Plus, LayoutDashboard, Building2, MapPin, 
  Briefcase, QrCode, Search, Check, X, MoreVertical, 
  Download, Trash2, Edit2, ExternalLink, Loader2, 
  MessageCircle, ArrowRightLeft, Tag, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('verifications');
  const [feedbackSubTab, setFeedbackSubTab] = useState<'comments' | 'suggestions'>('comments');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Building Management State
  const [mergingBuilding, setMergingBuilding] = useState<string | null>(null);

  const buildings = db.getBuildings().filter(b => b.building_name.toLowerCase().includes(searchTerm.toLowerCase()));
  const zones = db.getZones().filter(z => z.zone_name.toLowerCase().includes(searchTerm.toLowerCase()));
  const businesses = db.getBusinesses().filter(b => b.business_name.toLowerCase().includes(searchTerm.toLowerCase()));
  const comments = db.getAllComments();
  
  // Simulated pending claims
  const pendingBusinesses = businesses.filter(b => !b.is_verified);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await new Promise(r => setTimeout(r, 800));
    db.updateBusiness(id, { is_verified: true, is_claimed: true });
    setProcessingId(null);
  };

  const handleMerge = (sourceId: string, targetId: string) => {
    db.mergeBuildings(sourceId, targetId);
    setMergingBuilding(null);
  };

  const tabs = [
    { id: 'verifications', label: 'Verifications', icon: <LayoutDashboard size={18} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageCircle size={18} /> },
    { id: 'buildings', label: 'Buildings', icon: <Building2 size={18} /> },
    { id: 'zones', label: 'Zones', icon: <MapPin size={18} /> },
    { id: 'businesses', label: 'Businesses', icon: <Briefcase size={18} /> },
    { id: 'qr', label: 'QR Assets', icon: <QrCode size={18} /> },
  ];

  const ActionButtons = ({ buildingId }: { buildingId?: string }) => (
    <div className="flex gap-2">
      {buildingId && (
        <button 
          onClick={() => setMergingBuilding(buildingId)}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Merge Building"
        >
          <ArrowRightLeft size={16} />
        </button>
      )}
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        <Edit2 size={16} />
      </button>
      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-in fade-in duration-500 pb-20">
      <div className="bg-white px-4 py-6 border-b shadow-sm space-y-4 sticky top-0 z-[100]">
        <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {activeTab === 'feedback' && (
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
             <button 
                onClick={() => setFeedbackSubTab('comments')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${feedbackSubTab === 'comments' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
             >
                Comments
             </button>
             <button 
                onClick={() => setFeedbackSubTab('suggestions')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${feedbackSubTab === 'suggestions' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
             >
                User Suggestions
             </button>
          </div>
        )}

        {activeTab !== 'verifications' && activeTab !== 'feedback' && activeTab !== 'qr' && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-9 pr-4 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
              />
            </div>
            <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all">
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-gray-900">Pending Claims</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg">{pendingBusinesses.length} Items</span>
            </div>
            
            <div className="space-y-3">
              {pendingBusinesses.map(biz => (
                <div key={biz.business_id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{biz.business_name}</h3>
                        <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-bold uppercase rounded">Review Required</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Floor {biz.floor_number} • {db.getBuildingById(biz.building_id)?.building_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => handleApprove(biz.business_id)}
                      disabled={processingId === biz.business_id}
                      className="flex-1 py-3 bg-green-50 text-green-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      {processingId === biz.business_id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} Approve
                    </button>
                    <button className="flex-1 py-3 bg-red-50 text-red-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors">
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {feedbackSubTab === 'comments' ? (
              <>
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-bold text-gray-900">Building Adjustments</h2>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-lg">{comments.length} Reports</span>
                </div>
                <div className="space-y-3">
                  {comments.map(c => {
                    const b = db.getBuildingById(c.building_id);
                    return (
                      <div key={c.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${c.type === 'correction' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            <span className="text-xs font-bold text-gray-900">{c.user_name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Building</span>
                          <div className="text-xs font-bold text-gray-900">{b?.building_name}</div>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl italic">"{c.comment}"</p>
                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                            <Edit2 size={14} /> Resolve Adjustment
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {comments.length === 0 && <div className="py-20 text-center text-gray-400 italic">No feedback submitted yet.</div>}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                 <h2 className="text-lg font-bold text-gray-900">User Suggestions</h2>
                 <div className="space-y-3">
                    {/* Mock Building Suggestions */}
                    {db.getBuildings().filter(b => b.is_user_suggested).map(b => (
                      <div key={b.building_id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                             <Building2 size={20} />
                           </div>
                           <div>
                             <div className="text-xs font-black text-orange-400 uppercase tracking-widest">Suggested Building</div>
                             <div className="font-bold text-gray-900">{b.building_name}</div>
                             <div className="text-[10px] text-gray-500">{b.building_address}</div>
                           </div>
                         </div>
                         <button className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                            <Check size={18} />
                         </button>
                      </div>
                    ))}
                    
                    {/* Placeholder for Suggested Categories */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3 border-l-4 border-l-orange-400">
                       <div className="flex items-center gap-3">
                         <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                           <Sparkles size={20} />
                         </div>
                         <div>
                            <div className="text-xs font-black text-orange-400 uppercase tracking-widest">New Category Idea</div>
                            <div className="font-bold text-gray-900">Custom Metal Fabrication</div>
                            <p className="text-[10px] text-gray-500">Suggested by: Biz #402</p>
                         </div>
                       </div>
                       <div className="flex gap-2 pt-2">
                          <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all">Add to Directory</button>
                          <button className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors"><X size={16}/></button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'buildings' && (
          <div className="grid gap-3">
            {buildings.map(b => (
              <div key={b.building_id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between animate-in slide-in-from-left duration-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${b.is_user_suggested ? 'bg-orange-50 text-orange-400' : 'bg-gray-50 text-gray-400'}`}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {b.building_name}
                      {b.is_user_suggested && <span className="px-1 py-0.5 bg-orange-100 text-orange-700 text-[6px] font-black uppercase rounded">Suggested</span>}
                    </div>
                    <div className="text-xs text-gray-500">{db.getBusinessesInBuilding(b.building_id).length} businesses</div>
                  </div>
                </div>
                <ActionButtons buildingId={b.building_id} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'zones' && (
          <div className="grid gap-3">
            {zones.map(z => (
              <div key={z.zone_id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between animate-in slide-in-from-left duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{z.zone_name}</div>
                    <div className="text-xs text-gray-500">#{z.slug}</div>
                  </div>
                </div>
                <ActionButtons />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className="grid gap-3">
            {businesses.map(b => (
              <div key={b.business_id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between animate-in slide-in-from-left duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{b.business_name}</div>
                    <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                      {db.getBuildingById(b.building_id)?.building_name}
                      {b.is_verified && <Check size={12} className="text-green-500" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/business/${b.business_id}`} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg">
                    <ExternalLink size={16} />
                  </Link>
                  <ActionButtons />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <QrCode size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">QR Generation Hub</h3>
                  <p className="text-xs text-gray-500">Create print-ready assets.</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Resource</label>
                  <select className="w-full p-4 bg-gray-50 border-0 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 transition-all">
                    <optgroup label="Buildings">
                      {buildings.map(b => <option key={b.building_id} value={`building:${b.building_id}`}>{b.building_name}</option>)}
                    </optgroup>
                    <optgroup label="Zones">
                      {zones.map(z => <option key={z.zone_id} value={`zone:${z.zone_id}`}>{z.zone_name}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm active:scale-95 transition-all">
                    <Download size={18} /> PNG
                  </button>
                  <button className="py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm active:scale-95 transition-all">
                    <Download size={18} /> PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Merge Building Modal */}
      {mergingBuilding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Merge Building</h3>
              <button onClick={() => setMergingBuilding(null)} className="p-2 bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Merge <strong>{db.getBuildingById(mergingBuilding)?.building_name}</strong> into another building. 
              This will move all businesses and then delete the current record.
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Merge into Target Building</label>
                <select className="w-full p-4 bg-gray-50 border-0 rounded-xl font-semibold text-sm">
                  <option value="">Select Target...</option>
                  {buildings.filter(b => b.building_id !== mergingBuilding).map(b => (
                    <option key={b.building_id} value={b.building_id}>{b.building_name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => {
                  const targetId = (document.querySelector('select') as HTMLSelectElement).value;
                  if (targetId) handleMerge(mergingBuilding, targetId);
                }}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100"
              >
                Confirm Merge & Delete Duplicate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
