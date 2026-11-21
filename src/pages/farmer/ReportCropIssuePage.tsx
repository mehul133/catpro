import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  User,
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Trash2,
  Plus,
  Sparkles,
  Copy,
  ArrowRight
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useRole } from '../../context/RoleContext';
import { complaintService, SAMPLE_CROP_PHOTOS } from '../../services/complaintService';
import type { CropPhoto, IssueCategory, SeverityLevel, Complaint } from '../../types';

// Predefined crops & varieties
const CROP_OPTIONS = [
  { name: 'Wheat', varieties: ['HD-2967 (Sharbati)', 'PBW-824', 'DBW-303 (Karan Vaishnavi)', 'WH-1105'] },
  { name: 'Paddy / Rice', varieties: ['PR-126 (Basmati)', 'Pusa 1121', 'PB-1509', 'IR-64'] },
  { name: 'Cotton', varieties: ['BT Cotton RCH-659', 'Bollgard II', 'F-846', 'Suraj'] },
  { name: 'Tomato', varieties: ['Pusa Ruby', 'Arka Rakshak (F1 Hybrid)', 'Abhinav', 'Himsona'] },
  { name: 'Potato', varieties: ['Kufri Jyoti', 'Kufri Pukhraj', 'Kufri Chipsona', 'Kufri Badshah'] },
  { name: 'Maize', varieties: ['Pioneer 3396', 'DeKalb 9108', 'Ganga Safed-2', 'African Tall'] },
  { name: 'Mustard', varieties: ['Pusa Bold', 'Giriraj', 'Varuna (T-59)', 'Pusa Vijay'] },
  { name: 'Sugarcane', varieties: ['Co-0238 (Karan-4)', 'Co-86032', 'CoLk-94184', 'CoJ-64'] },
];

const COMMON_SYMPTOMS: Record<IssueCategory, string[]> = {
  disease: [
    'Yellow linear stripes along leaf veins',
    'Water-soaked circular brown spots / blast lesions',
    'White powdery fungal coating on leaves',
    'Stem wilting and vascular browning',
    'Bacterial ooze drying into yellowish crust',
    'Leaf curl and mosaic pattern',
  ],
  pest: [
    'Fluttering whitefly insects under foliage',
    'Stem borer holes with frass ejection',
    'Aphid colonies sucking tender sap',
    'Chewed leaf margins and caterpillar droppings',
    'Sticky honeydew with sooty mold growth',
    'Root knot galls and stunted vigor',
  ],
  nutrient_deficiency: [
    'Interveinal chlorosis on young leaves (Iron/Zinc)',
    'Purple/reddish discoloration on stem/leaves (Phosphorus)',
    'Marginal leaf scorch / firing on older leaves (Potassium)',
    'Uniform pale yellowing of entire plant canopy (Nitrogen)',
    'Crinkling and cupping of terminal shoots (Boron)',
  ],
  other: [
    'Sun scorch and heat drying',
    'Water-logging root suffocation',
    'Hailstone mechanical leaf tearing',
    'Chemical / weedicide drift burn spots',
  ],
};

export const ReportCropIssuePage: React.FC = () => {
  const { currentUser } = useRole();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Farmer & Farm Details
  const [farmerName, setFarmerName] = useState(currentUser?.name || 'Ramesh Patel');
  const [kisanId, setKisanId] = useState(currentUser?.badgeId || 'KISAN-ID: PB-LDH-4089');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [subDistrict, setSubDistrict] = useState('Ludhiana East');
  const [village, setVillage] = useState('Sahnewal');
  const [farmParcelName, setFarmParcelName] = useState('North Canal Parcel 02');
  const [totalLandArea, setTotalLandArea] = useState('5.5 Acres');

  // Step 2: Crop Details
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedVariety, setSelectedVariety] = useState<string>('HD-2967 (Sharbati)');
  const [sowingDate, setSowingDate] = useState<string>('2026-10-25');
  const [cropStage, setCropStage] = useState<string>('Vegetative / Tillering');
  const [irrigationSource, setIrrigationSource] = useState<string>('Tube-well + Canal');
  const [soilType, setSoilType] = useState<string>('Alluvial Loamy Soil');

  // Step 3: Problem Details
  const [issueType, setIssueType] = useState<IssueCategory>('disease');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Yellow linear stripes along leaf veins',
  ]);
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [affectedArea, setAffectedArea] = useState<string>('1.8 Acres (approx. 30% of field)');
  const [firstObservedDate, setFirstObservedDate] = useState<string>(
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>(
    'Yellow stripe patterns observed advancing rapidly along the upper leaves after morning cold fog. Leaves are turning brittle with yellowish powdery dusting.'
  );
  const [pastTreatments, setPastTreatments] = useState<string>(
    'Applied zinc sulfate 20 days ago; no chemical fungicide applied yet.'
  );

  // Step 4: Photos
  const [photos, setPhotos] = useState<CropPhoto[]>([
    {
      id: 'photo-default-1',
      name: 'crop_yellow_rust_sample.jpg',
      url: SAMPLE_CROP_PHOTOS[0].url,
      size: '1.4 MB',
      uploadedAt: 'Today',
    },
  ]);

  // Step 5: Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(true);

  // Handle Crop Selection & variety reset
  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    const found = CROP_OPTIONS.find((c) => c.name === crop);
    if (found && found.varieties.length > 0) {
      setSelectedVariety(found.varieties[0]);
    } else {
      setSelectedVariety('Local High Yielding');
    }
  };

  // Toggle Symptom chip
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  // Handle Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: CropPhoto = {
            id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            url: event.target.result as string,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedAt: 'Just now',
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Preset sample photo
  const addSamplePhoto = (sampleIdx: number) => {
    const sample = SAMPLE_CROP_PHOTOS[sampleIdx % SAMPLE_CROP_PHOTOS.length];
    const newPhoto: CropPhoto = {
      id: `sample-${Date.now()}`,
      name: sample.name,
      url: sample.url,
      size: sample.size,
      uploadedAt: 'Sample Preset',
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!farmerName.trim()) newErrors.farmerName = 'Farmer Name is required';
      if (!phone.trim()) newErrors.phone = 'Mobile contact is required';
      if (!village.trim()) newErrors.village = 'Village name is required';
      if (!farmParcelName.trim()) newErrors.farmParcelName = 'Farm parcel is required';
    } else if (step === 2) {
      if (!selectedCrop.trim()) newErrors.selectedCrop = 'Crop is required';
      if (!sowingDate) newErrors.sowingDate = 'Sowing date is required';
    } else if (step === 3) {
      if (selectedSymptoms.length === 0) newErrors.symptoms = 'Please select at least 1 observed symptom';
      if (!description.trim() || description.trim().length < 15) {
        newErrors.description = 'Please provide a detailed symptom description (min 15 characters)';
      }
      if (!affectedArea.trim()) newErrors.affectedArea = 'Affected area is required';
    } else if (step === 4) {
      if (photos.length === 0) {
        newErrors.photos = 'Please attach at least 1 photo of the affected crop';
      }
    } else if (step === 5) {
      if (!declarationAccepted) {
        newErrors.declaration = 'You must accept the farmer verification declaration to submit';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Complaint
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    const newComplaint = complaintService.createComplaint({
      farmerId: currentUser?.id || 'usr-fmr-001',
      farmerName,
      kisanId,
      phone,
      state,
      district,
      subDistrict,
      village,
      farmParcelName,
      totalLandArea,
      crop: selectedCrop,
      variety: selectedVariety,
      sowingDate,
      cropStage,
      irrigationSource,
      soilType,
      issueType,
      symptoms: selectedSymptoms,
      severity,
      affectedArea,
      firstObservedDate,
      description,
      pastTreatments,
      photos,
    });

    setSubmittedComplaint(newComplaint);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyId = () => {
    if (submittedComplaint) {
      navigator.clipboard.writeText(submittedComplaint.trackingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Farmer & Farm', icon: User },
    { num: 2, label: 'Crop Details', icon: Sprout },
    { num: 3, label: 'Issue & Severity', icon: AlertTriangle },
    { num: 4, label: 'Crop Photos', icon: Camera },
    { num: 5, label: 'Review & Submit', icon: CheckCircle2 },
  ];

  // If complaint just submitted successfully, show Confirmation Screen
  if (submittedComplaint) {
    return (
      <PageContainer
        title="Crop Issue Registered"
        subtitle="Your complaint has been successfully dispatched to the Block Agriculture Extension Queue."
        badge="Registration Confirmed"
        badgeColor="bg-emerald-100 text-emerald-800 border-emerald-300"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center ring-8 ring-emerald-50 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Official Case Ticket Generated
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Complaint Successfully Lodged!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Your case has been logged into the CropCare Central Agricultural Registry. A field extension officer has been assigned to conduct preliminary triage.
              </p>
            </div>

            {/* Tracking ID Badge Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto">
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Complaint Tracking ID
                </span>
                <p className="text-2xl font-mono font-black text-emerald-900">
                  {submittedComplaint.trackingId}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>

            {/* SLA Alert Box */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-left text-xs text-emerald-900 space-y-1.5 max-w-lg mx-auto">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Assigned Officer & Turnaround Guarantee:</span>
              </div>
              <p>• <strong>Assigned Officer:</strong> Dr. Ananya Sharma (Senior Block Agricultural Officer)</p>
              <p>• <strong>Resolution Target:</strong> Initial triage within 24 Hours; advisory delivery within 48 Hours.</p>
              <p>• <strong>SMS Broadcast:</strong> Confirmation delivered to cultivator phone {submittedComplaint.phone}.</p>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/farmer/my-complaints')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Track in My Complaints</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedComplaint(null);
                  setCurrentStep(1);
                  setPhotos([]);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors cursor-pointer"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Report Crop Issue"
      subtitle="Complete the 5-step form to notify block agriculture officers and research pathologists of crop damage."
      badge="Kisan Advisory Form"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Multi-Step Horizontal Progress Stepper */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between relative">
            {stepsHeader.map((step) => {
              const StepIcon = step.icon;
              const isDone = currentStep > step.num;
              const isActive = currentStep === step.num;

              return (
                <div key={step.num} className="flex-1 flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.num < currentStep) {
                        setCurrentStep(step.num);
                      }
                    }}
                    disabled={step.num > currentStep}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-700 text-white shadow-sm ring-4 ring-emerald-50 cursor-pointer'
                        : isActive
                        ? 'bg-emerald-800 text-white shadow-md ring-4 ring-emerald-100'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold mt-2 text-center hidden md:block ${
                      isActive ? 'text-emerald-900 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Step {step.num}: {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar line */}
          <div className="mt-4 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-700 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* STEP 1: Farmer & Farm Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <User className="w-4 h-4" />
                  <span>Step 1 of 5: Farmer & Farm Parcel Details</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Verify Cultivator & Location Information
                </h3>
                <p className="text-xs text-slate-500">
                  Information is pre-populated from your Kisan registry profile. Ensure the parcel name matches the affected field.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Farmer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Farmer Full Name *</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                    placeholder="Enter full name"
                  />
                  {errors.farmerName && <p className="text-[11px] text-rose-600 font-medium">{errors.farmerName}</p>}
                </div>

                {/* Kisan ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kisan ID / Aadhar Reference</label>
                  <input
                    type="text"
                    value={kisanId}
                    onChange={(e) => setKisanId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Contact Number (For SMS Advisories) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600 font-medium">{errors.phone}</p>}
                </div>

                {/* Farm Parcel */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Farm Parcel / Survey No. *</label>
                  <input
                    type="text"
                    value={farmParcelName}
                    onChange={(e) => setFarmParcelName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    placeholder="e.g. North Canal Parcel 02"
                  />
                  {errors.farmParcelName && <p className="text-[11px] text-rose-600 font-medium">{errors.farmParcelName}</p>}
                </div>

                {/* Village */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Village *</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  {errors.village && <p className="text-[11px] text-rose-600 font-medium">{errors.village}</p>}
                </div>

                {/* Block / Sub-District */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Block / Sub-District</label>
                  <input
                    type="text"
                    value={subDistrict}
                    onChange={(e) => setSubDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                {/* Total Land Area */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Parcel Acreage</label>
                  <input
                    type="text"
                    value={totalLandArea}
                    onChange={(e) => setTotalLandArea(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                    placeholder="e.g. 5.5 Acres"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Crop & Cultivation Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Sprout className="w-4 h-4" />
                  <span>Step 2 of 5: Crop, Variety & Agronomy</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Specify Affected Crop & Agronomic Stage
                </h3>
                <p className="text-xs text-slate-500">
                  Selecting the precise crop stage helps pathologists determine economic injury levels and suitable pesticide dosages.
                </p>
              </div>

              {/* Crop Grid Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Select Cultivated Crop *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CROP_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleCropChange(c.name)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        selectedCrop === c.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Sprout className={`w-5 h-5 ${selectedCrop === c.name ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
                {errors.selectedCrop && <p className="text-[11px] text-rose-600 font-medium">{errors.selectedCrop}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Variety */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Crop Variety / Hybrid *</label>
                  <select
                    value={selectedVariety}
                    onChange={(e) => setSelectedVariety(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    {CROP_OPTIONS.find((c) => c.name === selectedCrop)?.varieties.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                    <option value="Other Local Variety">Other / Indigenous Strain</option>
                  </select>
                </div>

                {/* Sowing Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sowing / Transplanting Date *</label>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                  {errors.sowingDate && <p className="text-[11px] text-rose-600 font-medium">{errors.sowingDate}</p>}
                </div>

                {/* Crop Growth Stage */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Growth Stage *</label>
                  <select
                    value={cropStage}
                    onChange={(e) => setCropStage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Germination / Seedling">Germination / Seedling Stage</option>
                    <option value="Vegetative / Tillering">Vegetative / Tillering Stage</option>
                    <option value="Flowering / Tasseling">Flowering / Tasseling Stage</option>
                    <option value="Fruiting / Grain Filling">Fruiting / Grain Filling Stage</option>
                    <option value="Maturity / Pre-harvest">Maturity / Pre-harvest Stage</option>
                  </select>
                </div>

                {/* Irrigation Source */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Primary Irrigation Source</label>
                  <select
                    value={irrigationSource}
                    onChange={(e) => setIrrigationSource(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Tube-well + Canal">Tube-well + Canal Water</option>
                    <option value="Deep Borewell Only">Deep Borewell Only</option>
                    <option value="Canal Command System">Canal Command System</option>
                    <option value="Rainfed (Barani)">Rainfed (Barani)</option>
                    <option value="Drip / Micro Irrigation">Drip / Micro Irrigation</option>
                  </select>
                </div>

                {/* Soil Type */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Field Soil Classification</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Alluvial Loamy Soil">Alluvial Loamy Soil (Fertile River Plains)</option>
                    <option value="Clay Loam / Heavy Soil">Clay Loam / Heavy Soil</option>
                    <option value="Sandy Loam">Sandy Loam (Light well-drained)</option>
                    <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                    <option value="Alkaline / Saline Soil">Alkaline / Saline Affected Soil</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Issue Type, Symptoms & Severity */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Step 3 of 5: Problem Type, Symptoms & Severity</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Describe the Symptoms & Urgency
                </h3>
                <p className="text-xs text-slate-500">
                  Provide detailed information regarding the appearance of lesions, pests, and rate of spread.
                </p>
              </div>

              {/* Issue Category Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Issue Classification *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'disease', label: 'Plant Disease', desc: 'Fungal / Bacterial / Viral' },
                    { id: 'pest', label: 'Insect / Pest', desc: 'Caterpillar / Whitefly / Borer' },
                    { id: 'nutrient_deficiency', label: 'Nutrient Deficiency', desc: 'Zinc / Iron / Nitrogen / Potash' },
                    { id: 'other', label: 'Weather / Other', desc: 'Frost / Hail / Chemical Scorch' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setIssueType(cat.id as IssueCategory);
                        // Reset to first symptom of that category
                        setSelectedSymptoms([COMMON_SYMPTOMS[cat.id as IssueCategory][0]]);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        issueType === cat.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{cat.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Assessed Severity Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { level: 'low', label: 'Low', desc: 'Sporadic leaves / minor', color: 'border-slate-300 text-slate-800 hover:bg-slate-50' },
                    { level: 'medium', label: 'Medium', desc: 'Noticeable spread (10-25%)', color: 'border-amber-300 text-amber-900 hover:bg-amber-50' },
                    { level: 'high', label: 'High', desc: 'Rapid spread (25-50%)', color: 'border-orange-300 text-orange-900 hover:bg-orange-50' },
                    { level: 'critical', label: 'Critical', desc: 'Emergency loss (>50%)', color: 'border-rose-400 text-rose-900 hover:bg-rose-50' },
                  ].map((sev) => (
                    <button
                      key={sev.level}
                      type="button"
                      onClick={() => setSeverity(sev.level as SeverityLevel)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        severity === sev.level
                          ? 'ring-2 ring-emerald-600 bg-emerald-50/60 border-emerald-600'
                          : sev.color
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{sev.label}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{sev.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Chips Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Select Observed Symptoms * ({selectedSymptoms.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS[issueType].map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Symptom */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Add other observed symptom..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSymptom();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSymptom}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {errors.symptoms && <p className="text-[11px] text-rose-600 font-medium">{errors.symptoms}</p>}
              </div>

              {/* Affected Area & First Observed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Affected Crop Acreage *</label>
                  <input
                    type="text"
                    value={affectedArea}
                    onChange={(e) => setAffectedArea(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                    placeholder="e.g. 1.5 Acres (approx 30%)"
                  />
                  {errors.affectedArea && <p className="text-[11px] text-rose-600 font-medium">{errors.affectedArea}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">First Observed On</label>
                  <input
                    type="date"
                    value={firstObservedDate}
                    onChange={(e) => setFirstObservedDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Detailed Symptom Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="Describe color changes, pattern of spread, and affected plant parts..."
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Helpful: Mention time of day, weather triggers, or localized spots.</span>
                  <span>{description.length} chars</span>
                </div>
                {errors.description && <p className="text-[11px] text-rose-600 font-medium">{errors.description}</p>}
              </div>

              {/* Past Treatments */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Past Chemical / Spray Treatments Applied (If Any)</label>
                <input
                  type="text"
                  value={pastTreatments}
                  onChange={(e) => setPastTreatments(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  placeholder="e.g. Sprayed neem oil 10 days ago"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Photo Evidence Upload */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Camera className="w-4 h-4" />
                  <span>Step 4 of 5: Upload Crop Photos</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Upload Visual Evidence of Affected Foliage
                </h3>
                <p className="text-xs text-slate-500">
                  Photographs enable computer vision triage and allow research scientists to inspect lesion borders without delay.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/30 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Click to browse or drop crop photographs here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP files up to 10MB each
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Upload From Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Sample Photos Button for easy demo testing */}
                  <button
                    type="button"
                    onClick={() => addSamplePhoto(photos.length)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attach Test Sample Photo</span>
                  </button>
                </div>
              </div>

              {errors.photos && <p className="text-xs text-rose-600 font-bold">{errors.photos}</p>}

              {/* Photo Preview Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Attached Evidence Photos ({photos.length})
                  </label>
                  {photos.length > 0 && (
                    <span className="text-[11px] text-slate-500">Previews saved locally</span>
                  )}
                </div>

                {photos.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                    No crop photos attached yet. Please upload at least one image or click "Attach Test Sample Photo".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs flex flex-col"
                      >
                        <div className="aspect-video w-full overflow-hidden bg-slate-900/10">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between">
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate">{photo.name}</p>
                            <p className="text-[10px] text-slate-400">{photo.size} • {photo.uploadedAt}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Step 5 of 5: Review & Confirm Submission</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Final Case Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Carefully review all parameters before issuing this official advisory ticket to the agricultural department.
                </p>
              </div>

              {/* Review Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Farmer & Location Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      Farmer & Farm Parcel
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-emerald-700 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p><strong>Farmer:</strong> {farmerName} ({kisanId})</p>
                  <p><strong>Contact:</strong> {phone}</p>
                  <p><strong>Parcel:</strong> {farmParcelName} ({totalLandArea})</p>
                  <p><strong>Location:</strong> Village {village}, {subDistrict}, {district}, {state}</p>
                </div>

                {/* Crop Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                      Crop & Agronomy
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-emerald-700 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p><strong>Crop & Variety:</strong> {selectedCrop} ({selectedVariety})</p>
                  <p><strong>Sowing Date:</strong> {sowingDate}</p>
                  <p><strong>Growth Stage:</strong> {cropStage}</p>
                  <p><strong>Irrigation:</strong> {irrigationSource} | {soilType}</p>
                </div>
              </div>

              {/* Problem & Symptoms Review Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-1">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Problem Symptoms & Severity
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-emerald-700 hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold uppercase text-[10px]">
                    {issueType}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    severity === 'critical'
                      ? 'bg-rose-100 text-rose-800'
                      : severity === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {severity} Severity
                  </span>
                  <span className="text-slate-500">• Affected: {affectedArea}</span>
                  <span className="text-slate-500">• Observed: {firstObservedDate}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedSymptoms.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 italic mt-1">
                  "{description}"
                </p>
              </div>

              {/* Photo Evidence Count */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span><strong>{photos.length} photo(s)</strong> attached as evidence.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-emerald-700 hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  Manage Photos
                </button>
              </div>

              {/* Farmer Declaration Checkbox */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs text-emerald-950 font-medium leading-relaxed">
                    I solemnly verify that the above crop symptoms, field acreage, and photos belong to my registered farm parcel and are accurate to the best of my knowledge. I request an official agricultural advisory.
                  </span>
                </label>
                {errors.declaration && <p className="text-xs text-rose-600 font-bold">{errors.declaration}</p>}
              </div>
            </div>
          )}

          {/* Form Navigation Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-3 text-xs font-black text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Complaint</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
