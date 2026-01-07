
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Upload, ArrowRight, ShieldCheck, Loader2, Camera, Info } from 'lucide-react';
import { db } from '../services/db';
import { PREDEFINED_CATEGORIES } from '../constants';

const ClaimBusinessPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = db.getBusinessById(id || '');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    businessName: business?.business_name || '',
    categories: business?.categories || [],
    floorNumber: business?.floor_number || '',
    unitNumber: business?.unit_number || '',
    phone: business?.phone || '',
    email: business?.email || '',
    hours: business?.business_hours || '',
    description: business?.description || '',
    navigation: business?.navigation_instructions || '',
  });

  if (!business) return <div className="p-8 text-center">Business not found.</div>;

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : prev.categories.length < 3 ? [...prev.categories, cat] : prev.categories
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Final Submission:', formData);
    setIsSubmitting(false);
    setStep(5);
  };

  if (step === 5) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[70vh] animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
          <CheckCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Application Submitted</h2>
          <p className="text-gray-500 leading-relaxed">
            Thank you, <strong>{formData.ownerName}</strong>! Your claim for <strong>{formData.businessName}</strong> is under review. 
            We'll contact you at <strong>{formData.ownerEmail}</strong> within 2 business days.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-400">
      <div className="px-4 py-6 border-b bg-white sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => step === 1 ? navigate(-1) : prevStep()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Step {step} of 4</div>
            <h1 className="text-xl font-bold text-gray-900">Claim business</h1>
          </div>
        </div>
        <div className="mt-4 flex gap-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pb-24 space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><ShieldCheck className="text-blue-600" size={20} /> Step 1: Verify Ownership</h3>
              <div className="space-y-1.5 opacity-60">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name (Pre-filled)</label>
                <input type="text" disabled value={business.business_name} className="w-full p-4 bg-gray-100 border-0 rounded-xl font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Your Full Name</label>
                <input type="text" required value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Full Name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Your Phone</label>
                <input type="tel" required value={formData.ownerPhone} onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="+250..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Your Email</label>
                <input type="email" required value={formData.ownerEmail} onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Email" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Proof of Ownership</label>
                <label className="w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Upload Registration (Optional)</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Info className="text-blue-600" size={20} /> Step 2: Business Details</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name</label>
                <input type="text" required value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Categories (Up to 3)</label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_CATEGORIES.map(cat => (
                    <button type="button" key={cat.name} onClick={() => handleCategoryToggle(cat.name)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${formData.categories.includes(cat.name) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-600'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Floor</label>
                  <input type="text" value={formData.floorNumber} onChange={(e) => setFormData({...formData, floorNumber: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Unit #</label>
                  <input type="text" value={formData.unitNumber} onChange={(e) => setFormData({...formData, unitNumber: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Navigation Instructions</label>
                <textarea rows={3} value={formData.navigation} onChange={(e) => setFormData({...formData, navigation: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" placeholder="How do visitors find your exact door?" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Camera className="text-blue-600" size={20} /> Step 3: Photos (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload size={24} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Front Store</span>
                <input type="file" className="hidden" />
              </label>
              <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload size={24} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Inside</span>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="font-bold text-gray-900">Step 4: Review & Submit</h3>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 divide-y divide-gray-200">
              <div className="pb-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ownership</div>
                <div className="font-bold text-gray-900">{formData.ownerName}</div>
                <div className="text-xs text-gray-500">{formData.ownerPhone} • {formData.ownerEmail}</div>
              </div>
              <div className="py-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Name</div>
                <div className="font-bold text-gray-900">{formData.businessName}</div>
                <div className="text-xs text-gray-500">{formData.categories.join(', ')}</div>
              </div>
            </div>
            <label className="flex items-start gap-3 p-2 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-600 leading-snug">I confirm this information is accurate.</span>
            </label>
          </div>
        )}

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t p-6 z-50">
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
              Continue <ArrowRight size={20} />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Submit for Verification'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClaimBusinessPage;
