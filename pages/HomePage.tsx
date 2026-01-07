
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, MapPin, Building as BuildingIcon, ArrowRight, Camera, X, Loader2, Check, Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { db } from '../services/db';
import { MOCK_ADS } from '../data/mockData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-slide logic for featured ads
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
      
      // Simulate finding a QR code after 2.5 seconds
      setTimeout(() => {
        const buildings = db.getBuildings();
        const mockTarget = buildings[0]; // Centenary House
        setScanResult(mockTarget);
      }, 2500);
    } catch (err) {
      console.error("Camera access denied", err);
      // Fallback
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

  const quickActions = [
    { 
      label: 'Scan QR Code', 
      icon: <QrCode size={24} />, 
      color: 'bg-blue-50 text-blue-600', 
      description: 'Find building info instantly',
      action: () => setShowQRModal(true)
    },
    { 
      label: 'Buildings', 
      icon: <BuildingIcon size={24} />, 
      color: 'bg-green-50 text-green-600', 
      description: 'Explore local premises',
      to: '/buildings'
    },
    { 
      label: 'Street Zones', 
      icon: <MapPin size={24} />, 
      color: 'bg-orange-50 text-orange-600', 
      description: 'Navigate by areas',
      to: '/zones'
    },
  ];

  return (
    <div className="flex flex-col gap-8 px-4 py-6 animate-in fade-in duration-500 bg-gray-50/50">
      <div className="space-y-2 text-center py-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
          Find Your Way. <br/>
          <span className="text-blue-600">Right to the door.</span>
        </h1>
        <p className="text-gray-500 text-lg">Premise-level navigation in Nyamata.</p>
      </div>

      {/* Featured Listings Carousel */}
      <div className="relative w-full h-56 group overflow-hidden rounded-[2.5rem] shadow-xl border border-white">
        <div 
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {MOCK_ADS.map((ad, idx) => (
            <div 
              key={ad.ad_id}
              onClick={() => navigate(`/business/${ad.advertiser_business_id}`)}
              className="min-w-full h-full relative cursor-pointer"
            >
              <img 
                src={ad.ad_content.imageUrl} 
                className="w-full h-full object-cover" 
                alt={ad.ad_content.text}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-orange-500 text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-lg">
                    <Sparkles size={8} fill="white" /> Featured
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight drop-shadow-md">
                  {ad.ad_content.text}
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg hover:bg-gray-100 transition-colors">
                  {ad.ad_content.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-4 right-6 flex gap-1.5">
          {MOCK_ADS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <SearchBar />

      <div className="grid grid-cols-1 gap-4">
        {quickActions.map((action, idx) => (
          action.to ? (
            <Link 
              key={idx} 
              to={action.to}
              className="group bg-white border border-gray-100 p-5 rounded-[2.2rem] flex items-center gap-5 hover:shadow-xl transition-all active:scale-[0.98] shadow-sm"
            >
              <div className={`p-4 rounded-2xl ${action.color} shadow-inner`}>{action.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">{action.label}</div>
                <div className="text-sm text-gray-500 leading-tight">{action.description}</div>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </Link>
          ) : (
            <button
              key={idx}
              onClick={action.action}
              className="text-left group bg-white border border-gray-100 p-5 rounded-[2.2rem] flex items-center gap-5 hover:shadow-xl transition-all active:scale-[0.98] shadow-sm"
            >
              <div className={`p-4 rounded-2xl ${action.color} shadow-inner`}>{action.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">{action.label}</div>
                <div className="text-sm text-gray-500 leading-tight">{action.description}</div>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </button>
          )
        ))}
      </div>

      <div className="mt-4 p-8 bg-gray-900 rounded-[3rem] text-center space-y-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-bold">Are you a business owner?</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Put your business on the map. Help customers find your exact suite or shop number inside any building.</p>
        </div>
        <button 
          onClick={() => navigate('/business/new')}
          className="w-full inline-flex items-center justify-center px-6 py-5 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-700 transition-all shadow-lg active:scale-95 relative z-10"
        >
          List Your Business Now
        </button>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden flex flex-col relative shadow-2xl">
            <button onClick={() => { stopScanner(); setShowQRModal(false); }} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full z-50"><X size={20}/></button>
            
            {!isScanning ? (
              <div className="p-10 flex flex-col items-center gap-8 text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                  <Camera size={40} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">Scan QR Code</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Point your camera at a building or zone sign to view the directory.</p>
                </div>
                <button onClick={startScanner} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">Launch Scanner</button>
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
                    {scanResult ? 'Code Detected!' : 'Scanning...'}
                  </div>
                </div>
                
                {scanResult && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BuildingIcon /></div>
                      <div>
                        <div className="font-bold text-gray-900">{scanResult.building_name}</div>
                        <div className="text-xs text-gray-500">{scanResult.building_address}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { stopScanner(); navigate(`/building/${scanResult.slug}`); }} 
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      Enter Directory <ArrowRight size={18} />
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
