
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, Clock, MapPin, Navigation, 
  Globe, Verified, AlertTriangle, ChevronLeft, 
  ChevronRight, X, Send, Info, ExternalLink, Map as MapIcon,
  CheckCircle, Facebook, Instagram, Twitter
} from 'lucide-react';
import { db } from '../services/db';

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = db.getBusinessById(id || '');
  const building = business ? db.getBuildingById(business.building_id) : null;

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!business || !building) {
    return <div className="p-8 text-center">Business not found.</div>;
  }

  const photos = business.photos && business.photos.length > 0 
    ? business.photos 
    : ['https://picsum.photos/seed/biz/800/400'];

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Report submitted for business:', business.business_id, 'Content:', reportText);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportText('');
    }, 2000);
  };

  return (
    <div className="flex flex-col animate-in slide-in-from-right duration-400 bg-white min-h-screen relative pb-10">
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
      `}</style>

      {/* Header & Back Button */}
      <div className="sticky top-0 z-[60] px-4 py-3 bg-white/80 backdrop-blur-md flex items-center justify-between border-b">
         <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-gray-600 active:scale-90 transition-all">
            <ArrowLeft size={20} />
         </button>
         <div className="text-center flex-1">
            <h1 className="text-sm font-bold text-gray-900 truncate px-4">{business.business_name}</h1>
         </div>
         <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Photo Gallery Header */}
      <div className="relative h-72 w-full bg-gray-900 group">
        <img 
          src={photos[currentPhotoIndex]} 
          alt={`${business.business_name} view ${currentPhotoIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {photos.length > 1 && (
          <>
            <button 
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${i === currentPhotoIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5 z-10 pb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight">{business.business_name}</h1>
            {business.is_verified && <Verified size={24} className="text-green-400 fill-green-400/10 shrink-0" />}
          </div>
          <div className="flex gap-2 flex-wrap">
            {business.categories.map(cat => (
              <span key={cat} className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-10 space-y-6 pb-12">
        {/* Key Info Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-50 space-y-6">
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 border border-blue-100">
                <MapPin size={22} />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</div>
                <div className="text-sm font-bold text-gray-900 leading-tight">
                  {building.building_name}
                </div>
                <div className="text-xs text-gray-500 font-medium">Floor {business.floor_number} • Unit {business.unit_number}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                  <Clock size={18} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hours</div>
                  <div className="text-[11px] font-bold text-gray-900 leading-tight whitespace-pre-wrap">
                    {business.business_hours}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                  <Phone size={18} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Call</div>
                  <a href={`tel:${business.phone}`} className="text-[11px] font-bold text-blue-600 leading-tight">
                    {business.phone}
                  </a>
                </div>
              </div>
            </div>

            {business.email && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                  <Mail size={18} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email</div>
                  <a href={`mailto:${business.email}`} className="text-[11px] font-bold text-blue-600 leading-tight">
                    {business.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
            <a 
              href={`tel:${business.phone}`} 
              className="flex flex-col items-center justify-center gap-2 p-5 bg-blue-600 text-white rounded-3xl active:scale-95 transition-all shadow-lg shadow-blue-100"
            >
              <Phone size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Call Now</span>
            </a>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(building.building_address + ' ' + building.building_name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-5 bg-green-600 text-white rounded-3xl active:scale-95 transition-all shadow-lg shadow-green-100"
            >
              <Navigation size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Directions</span>
            </a>
        </div>

        {/* Social Links Section */}
        {(business.social_links?.facebook || business.social_links?.instagram || business.social_links?.twitter) && (
          <div className="flex justify-center gap-6 py-2">
            {business.social_links?.facebook && (
              <a href={business.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all">
                <Facebook size={24} />
              </a>
            )}
            {business.social_links?.instagram && (
              <a href={business.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-all">
                <Instagram size={24} />
              </a>
            )}
            {business.social_links?.twitter && (
              <a href={business.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-sky-50 text-sky-400 rounded-full hover:bg-sky-100 transition-all">
                <Twitter size={24} />
              </a>
            )}
          </div>
        )}

        {/* Navigation Instructions */}
        <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Navigation size={18} />
            </div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">How to find us</h2>
          </div>
          
          <div className="space-y-4">
            <div className="w-full h-44 bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-200 shadow-inner">
               <div className="absolute inset-0 bg-white/60" style={{ 
                 backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
               }} />
               <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-10 bg-gray-100 border-y border-gray-300" />
               <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gray-100 border-x border-gray-300" />
               <div className="absolute bottom-4 right-4 w-16 h-16 bg-blue-50 border-2 border-blue-400 rounded-xl flex flex-col items-center justify-center text-blue-600 shadow-lg shadow-blue-100/50 animate-pulse">
                  <span className="text-[10px] font-black uppercase tracking-tighter">{business.unit_number}</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
               </div>
               <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 176">
                  <path d="M 200 160 Q 200 100 240 88 T 340 100" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dash 1.5s linear infinite' }} />
                  <circle cx="200" cy="160" r="5" fill="#3b82f6" />
                  <circle cx="340" cy="100" r="5" fill="#ef4444" />
               </svg>
               <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                  <MapIcon size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Floor {business.floor_number} Map</span>
               </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Navigation size={64} className="rotate-45" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium relative z-10">
                {business.navigation_instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Photos Grid/Grid Preview if more than 1 */}
        {photos.length > 1 && (
          <div className="space-y-3">
             <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gallery</h2>
             <div className="grid grid-cols-3 gap-2">
                {photos.map((p, i) => (
                  <button key={i} onClick={() => setCurrentPhotoIndex(i)} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === currentPhotoIndex ? 'border-blue-500 shadow-md scale-105' : 'border-transparent'}`}>
                    <img src={p} className="w-full h-full object-cover" />
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-3 px-2">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">About {business.business_name}</h2>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {business.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-gray-100 space-y-4">
          {business.website && (
            <a 
              href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
              target="_blank" rel="noopener noreferrer"
              className="w-full py-5 bg-blue-50 text-blue-600 rounded-3xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-blue-100 transition-all border border-blue-100"
            >
              <Globe size={18} /> Visit Official Website <ExternalLink size={14} />
            </a>
          )}
          
          <div className="space-y-3">
             <button 
                onClick={() => setShowReportModal(true)}
                className="w-full py-5 bg-red-50 text-red-500 rounded-3xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 active:bg-red-100 transition-all border border-red-100 shadow-sm"
              >
                <AlertTriangle size={18} /> Report an issue with this listing
              </button>
              <button 
                onClick={() => navigate(`/business/${business.business_id}/claim`)}
                className="w-full py-5 bg-gray-50 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 active:bg-gray-100 transition-all border border-gray-200"
              >
                <Verified size={18} /> Claim this Business
              </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative animate-in slide-in-from-bottom duration-400">
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {reportSubmitted ? (
              <div className="py-12 text-center space-y-5 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-100">
                  <CheckCircle size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Report Received</h3>
                  <p className="text-sm text-gray-500 font-medium">Thank you for helping us keep iCyapa accurate for everyone in Nyamata.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Report an Issue</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Is the information for <strong className="text-gray-900">{business.business_name}</strong> incorrect? Tell us what needs fixing.</p>
                </div>

                <form onSubmit={handleReportSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Describe the problem</label>
                    <textarea 
                      required autoFocus
                      rows={5}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="e.g. This business has moved to the 3rd floor, the phone number is wrong, or the business is permanently closed..."
                      className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium placeholder-gray-300"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-red-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.1em] shadow-xl shadow-red-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Send size={18} /> Send Report
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetailPage;
