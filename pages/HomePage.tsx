
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, MapPin, Building as BuildingIcon, ArrowRight, Camera, X, Loader2, Check, Sparkles, ChevronRight, Zap } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { db } from '../services/db';
import { MOCK_ADS } from '../data/mockData';
import { CATEGORY_GROUPS } from '../constants';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const trendingBusinesses = db.getTrendingBusinesses();

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MOCK_ADS.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const startScanner = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        const buildings = db.getBuildings();
        setScanResult(buildings[0]);
      }, 2500);
    } catch (err) {
      const buildings = db.getBuildings();
      setScanResult(buildings[0]);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setScanResult(null);
  };

  return (
    <div className="flex flex-col gap-10 px-5 py-8 animate-in fade-in duration-500 bg-gray-50/30">
      {/* Hero Header */}
      <div className="space-y-1">
        <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 px-1">Bugesera Digital Directory</div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-[0.95]">
          Find Your Way, <br/>
          <span className="text-blue-600">to the door.</span>
        </h1>
      </div>

      {/* Main Search Bar - The Omnibox */}
      <div className="z-[100] sticky top-3">
        <SearchBar />
      </div>

      {/* Promoted Section */}
      <div className="relative w-full h-52 group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white">
        <div className="flex transition-transform duration-700 ease-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {MOCK_ADS.map((ad, idx) => (
            <div key={ad.ad_id} onClick={() => navigate(`/business/${ad.advertiser_business_id}`)} className="min-w-full h-full relative cursor-pointer">
              <img src={ad.ad_content.imageUrl} className="w-full h-full object-cover" alt={ad.ad_content.text} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-orange-500 text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-lg">
                    <Sparkles size={8} fill="white" /> Featured
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight drop-shadow-md">{ad.ad_content.text}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by Category - These serve as active listing entry points */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Browse Categories</h2>
          <Link to="/search?q=" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">View All Categories <ChevronRight size={14}/></Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORY_GROUPS.slice(0, 4).map((group, idx) => (
            <Link 
              key={idx} 
              to={`/search?q=${encodeURIComponent(group.name)}`}
              className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all active:scale-95 group"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4 shadow-inner">
                {group.icon}
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-black text-gray-900 leading-tight truncate">{group.name}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Explore Directory</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Access QR */}
      <div className="grid grid-cols-1">
        <button
          onClick={() => setShowQRModal(true)}
          className="group bg-blue-600 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-blue-100 active:scale-[0.98] transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <QrCode size={120} />
          </div>
          <div className="p-4 bg-white/20 rounded-2xl text-white backdrop-blur-md shadow-inner">
            <QrCode size={28} />
          </div>
          <div className="flex-1 text-left">
            <div className="font-black text-white text-lg tracking-tight uppercase">Scan Building QR</div>
            <div className="text-blue-100 text-xs font-medium">Instantly open any floor directory</div>
          </div>
          <ArrowRight size={24} className="text-white/50 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Verified List - Displays actual businesses on Home View */}
      <div className="space-y-5">
        <div className="px-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Verified Businesses</h2>
            <p className="text-xs text-gray-500 font-medium">Trusted listings across Nyamata</p>
          </div>
        </div>
        <div className="space-y-3">
          {trendingBusinesses.map((biz) => {
            const building = db.getBuildingById(biz.building_id);
            return (
              <Link 
                key={biz.business_id}
                to={`/business/${biz.business_id}`}
                className="bg-white p-5 rounded-[2.2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all active:scale-[0.98] group"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                   <img src={biz.photos[0]} className="w-full h-full object-cover" alt={biz.business_name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{biz.business_name}</div>
                    {biz.is_verified && <Zap size={14} className="text-blue-500 fill-blue-500" />}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate font-medium">
                    <span className="font-bold text-gray-700">{building?.building_name}</span> • Floor {biz.floor_number}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Owner CTA */}
      <div className="mt-4 p-10 bg-gray-900 rounded-[3.5rem] text-center space-y-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-black tracking-tight leading-tight">Missing your <br/>business?</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">Put your shop or office on the map. Help customers find your exact floor and unit.</p>
        </div>
        <button 
          onClick={() => navigate('/business/new')}
          className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-blue-700 transition-all shadow-xl active:scale-95 relative z-10"
        >
          Add Your Listing Now
        </button>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden flex flex-col relative shadow-2xl">
            <button onClick={() => { stopScanner(); setShowQRModal(false); }} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full z-50"><X size={20}/></button>
            {!isScanning ? (
              <div className="p-10 flex flex-col items-center gap-8 text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner"><Camera size={40} /></div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Sign Scanner</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Point your camera at the iCyapa QR code on any building entrance.</p>
                </div>
                <button onClick={startScanner} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Start Camera</button>
              </div>
            ) : (
              <div className="relative aspect-[3/4] bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 border-2 border-blue-500 rounded-3xl relative">
                    <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                  </div>
                  <div className="mt-8 text-white font-bold bg-black/40 px-4 py-2 rounded-full flex items-center gap-2">
                    {scanResult ? <Check className="text-green-400" /> : <Loader2 className="animate-spin" size={16} />}
                    {scanResult ? 'Directory Located' : 'Searching for Signage...'}
                  </div>
                </div>
                {scanResult && (
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-white animate-in slide-in-from-bottom duration-300 border-t">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BuildingIcon /></div>
                      <div>
                        <div className="font-bold text-gray-900 leading-tight">{scanResult.building_name}</div>
                        <div className="text-xs text-gray-500">{scanResult.building_address}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { stopScanner(); navigate(`/building/${scanResult.slug}`); }} 
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                    >
                      View Floor Directory <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
