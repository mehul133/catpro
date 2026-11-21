import type { Complaint } from '../types';

const STORAGE_KEY = 'cropcare_complaints_v1';

// Preset sample photos for demo and easy user testing
export const SAMPLE_CROP_PHOTOS = [
  {
    id: 'sample-p1',
    name: 'wheat_yellow_rust_leaf.jpg',
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    size: '1.4 MB',
    uploadedAt: 'Today',
  },
  {
    id: 'sample-p2',
    name: 'paddy_leaf_blight_symptom.jpg',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    size: '2.1 MB',
    uploadedAt: 'Today',
  },
  {
    id: 'sample-p3',
    name: 'cotton_pest_foliage_damage.jpg',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    size: '1.8 MB',
    uploadedAt: 'Today',
  },
];

export const INITIAL_DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-demo-001',
    trackingId: 'CC-2026-8921',
    isDemo: true,
    submissionDate: '2026-11-18T09:30:00Z',
    status: 'advisory_issued',
    severity: 'critical',
    farmerId: 'usr-fmr-001',
    farmerName: 'Ramesh Patel',
    kisanId: 'KISAN-ID: PB-LDH-4089',
    phone: '+91 98765 43210',
    state: 'Punjab',
    district: 'Ludhiana',
    subDistrict: 'Ludhiana East',
    village: 'Sahnewal',
    farmParcelName: 'North Canal Parcel 02',
    totalLandArea: '6.5 Acres',
    crop: 'Wheat',
    variety: 'HD-2967 (Sharbati)',
    sowingDate: '2026-10-25',
    cropStage: 'Vegetative / Early Tillering',
    irrigationSource: 'Tube-well + Canal',
    soilType: 'Alluvial Loamy Soil',
    issueType: 'disease',
    symptoms: [
      'Yellow linear stripes on upper leaf surface',
      'Powdery yellow fungal spores dusting fingers',
      'Chlorosis and leaf tip dry back',
    ],
    affectedArea: '2.2 Acres (approx. 35% of parcel)',
    firstObservedDate: '2026-11-15',
    description:
      'Noticed distinct golden-yellow stripes running parallel along the leaf blades in the morning. Spreading fast across low-lying moist sections near canal bank after unseasonal cold dew.',
    pastTreatments: 'Sprayed zinc sulphate 2 weeks ago; no fungicide applied yet.',
    photos: [
      {
        id: 'ph-01',
        name: 'wheat_stripe_rust_macro.jpg',
        url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        size: '1.2 MB',
        uploadedAt: '18 Nov 2026',
      },
    ],
    assignedOfficer: {
      name: 'Dr. Ananya Sharma',
      designation: 'Senior Block Agricultural Officer',
      contact: '+91 94123 78901',
      assignedDate: '2026-11-18T11:00:00Z',
    },
    fieldInspectionDate: '2026-11-19T10:15:00Z',
    fieldNotes:
      'Field inspection confirmed severe Puccinia striiformis (Yellow Rust) infestation. Favorable weather (14-18°C with high humidity) is accelerating spore propagation. Case immediately escalated to ICAR Research Directorate.',
    advisory: {
      advisoryId: 'ADV-ICAR-2026-441',
      diagnosis: 'Severe Yellow / Stripe Rust (Puccinia striiformis f. sp. tritici)',
      causativeAgent: 'Obligate biotrophic fungal pathogen (Urediniospores)',
      expertName: 'Prof. K. Venkatesh',
      expertDesignation: 'Principal Scientist (Plant Pathology)',
      expertInstitute: 'Central Agricultural Research Directorate (ICAR)',
      issuedAt: '2026-11-20T14:30:00Z',
      immediateActions: [
        'Halt immediate overhead sprinkling or flood irrigation to decrease micro-climate humidity.',
        'Do not apply excessive urea or nitrogenous fertilizers until fungal spread halts.',
      ],
      chemicalControl: [
        {
          pesticideName: 'Propiconazole 25% EC (Tilt)',
          dosage: '1.0 ml per liter of water (200 ml in 200 liters water/acre)',
          applicationMethod: 'Foliar spray with hollow cone nozzle during clear morning hours',
          waitingPeriodDays: 30,
        },
        {
          pesticideName: 'Tebuconazole 25.9% EC (Folicur)',
          dosage: '1.0 ml per liter (alternate spray after 15 days if symptoms persist)',
          applicationMethod: 'Even canopy coverage',
          waitingPeriodDays: 28,
        },
      ],
      organicRemedy: [
        'Spray cow urine distillate (10%) fermented with neem seed kernel extract (NSKE 5%) as prophylactic barrier on surrounding unaffected boundary borders.',
      ],
      preventiveGuidelines: [
        'Adopt resistant varieties such as PBW-824 or DBW-303 in subsequent rabi crop rotations.',
        'Report any yellow spore pockets to village Kisan Seva Kendra within 24 hours.',
      ],
    },
    timeline: [
      {
        step: 1,
        status: 'submitted',
        title: 'Crop Complaint Registered',
        description: 'Complaint submitted with geotagged farm coordinates & symptom photos.',
        actor: 'Farmer (Ramesh Patel)',
        timestamp: '18 Nov 2026, 09:30 AM',
        completed: true,
      },
      {
        step: 2,
        status: 'under_review',
        title: 'Jurisdictional Officer Allotted',
        description: 'Sub-division Ludhiana East extension queue triaged ticket as High Severity.',
        actor: 'Officer (Dr. Ananya Sharma)',
        timestamp: '18 Nov 2026, 11:00 AM',
        completed: true,
      },
      {
        step: 3,
        status: 'investigating',
        title: 'Physical Field Inspection Completed',
        description: 'On-farm foliar verification conducted. Fungal smear sample escalated to lab.',
        actor: 'Officer (Dr. Ananya Sharma)',
        timestamp: '19 Nov 2026, 10:15 AM',
        completed: true,
      },
      {
        step: 4,
        status: 'advisory_issued',
        title: 'Official Expert Advisory Published',
        description: 'Certified chemical & organic prescription formulated by ICAR Pathologist.',
        actor: 'Scientist (Prof. K. Venkatesh)',
        timestamp: '20 Nov 2026, 02:30 PM',
        completed: true,
      },
      {
        step: 5,
        status: 'resolved',
        title: 'Treatment Execution & Case Closure',
        description: 'Awaiting farmer treatment application confirmation & follow-up recovery report.',
        actor: 'Farmer & Block Officer',
        timestamp: 'Pending Spray Application',
        completed: false,
      },
    ],
  },
  {
    id: 'cmp-demo-002',
    trackingId: 'CC-2026-6419',
    isDemo: true,
    submissionDate: '2026-11-19T14:10:00Z',
    status: 'under_review',
    severity: 'high',
    farmerId: 'usr-fmr-001',
    farmerName: 'Ramesh Patel',
    kisanId: 'KISAN-ID: PB-LDH-4089',
    phone: '+91 98765 43210',
    state: 'Punjab',
    district: 'Ludhiana',
    subDistrict: 'Ludhiana East',
    village: 'Sahnewal',
    farmParcelName: 'South Tube-well Khasra 14',
    totalLandArea: '4.0 Acres',
    crop: 'Paddy / Rice',
    variety: 'PR-126 (Basmati)',
    sowingDate: '2026-07-10',
    cropStage: 'Milking / Grain Filling',
    irrigationSource: 'Tube-well Bore',
    soilType: 'Heavy Clay Loam',
    issueType: 'disease',
    symptoms: [
      'Water-soaked translucent lesions on leaf margins',
      'Wavy bacterial ooze crust dried on leaf surfaces',
      'Rapid yellow-orange blighting of flag leaves',
    ],
    affectedArea: '1.0 Acre',
    firstObservedDate: '2026-11-17',
    description:
      'Lesions started at leaf tips and advanced down the outer edges. Water droplets in the morning appear milky turbid.',
    pastTreatments: 'None applied yet.',
    photos: [
      {
        id: 'ph-02',
        name: 'rice_blight_sample.jpg',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        size: '1.8 MB',
        uploadedAt: '19 Nov 2026',
      },
    ],
    assignedOfficer: {
      name: 'Dr. Ananya Sharma',
      designation: 'Senior Block Agricultural Officer',
      contact: '+91 94123 78901',
      assignedDate: '2026-11-20T09:00:00Z',
    },
    timeline: [
      {
        step: 1,
        status: 'submitted',
        title: 'Crop Complaint Registered',
        description: 'Bacterial leaf symptom ticket logged by farmer.',
        actor: 'Farmer (Ramesh Patel)',
        timestamp: '19 Nov 2026, 02:10 PM',
        completed: true,
      },
      {
        step: 2,
        status: 'under_review',
        title: 'Officer Review & Field Schedule',
        description: 'Officer Sharma reviewing photos. On-site visit scheduled for tomorrow morning.',
        actor: 'Officer (Dr. Ananya Sharma)',
        timestamp: '20 Nov 2026, 09:00 AM',
        completed: true,
      },
      {
        step: 3,
        status: 'investigating',
        title: 'Field Verification & Pathogen Isolation',
        description: 'Pending field inspection to differentiate Bacterial Blight vs Bacterial Leaf Streak.',
        actor: 'Field Extension Officer',
        timestamp: 'Scheduled',
        completed: false,
      },
      {
        step: 4,
        status: 'advisory_issued',
        title: 'Expert Advisory Formulation',
        description: 'Agricultural Scientist will formulate bactericide prescription post inspection.',
        actor: 'ICAR Scientist',
        timestamp: 'Queued',
        completed: false,
      },
      {
        step: 5,
        status: 'resolved',
        title: 'Case Resolution',
        description: 'Follow-up and resolution sign-off.',
        actor: 'Pending',
        timestamp: 'Queued',
        completed: false,
      },
    ],
  },
  {
    id: 'cmp-demo-003',
    trackingId: 'CC-2026-3105',
    isDemo: true,
    submissionDate: '2026-11-20T11:45:00Z',
    status: 'investigating',
    severity: 'medium',
    farmerId: 'usr-fmr-001',
    farmerName: 'Ramesh Patel',
    kisanId: 'KISAN-ID: PB-LDH-4089',
    phone: '+91 98765 43210',
    state: 'Punjab',
    district: 'Ludhiana',
    subDistrict: 'Ludhiana East',
    village: 'Sahnewal',
    farmParcelName: 'West Boundary Parcel 03',
    totalLandArea: '3.0 Acres',
    crop: 'Cotton',
    variety: 'BT Cotton RCH-659',
    sowingDate: '2026-05-15',
    cropStage: 'Boll Development',
    irrigationSource: 'Drip Irrigation',
    soilType: 'Sandy Loam',
    issueType: 'pest',
    symptoms: [
      'Tiny white winged insects fluttering when plants shaken',
      'Sticky honeydew secretions attracting black sooty mold',
      'Yellow mosaic patterns on vegetative leaves',
    ],
    affectedArea: '0.8 Acre',
    firstObservedDate: '2026-11-18',
    description:
      'Whitefly count exceeds 8-10 insects per leaf under canopy. Honey-dew residue visible on upper leaves.',
    pastTreatments: 'Installed 5 yellow sticky traps last week.',
    photos: [
      {
        id: 'ph-03',
        name: 'cotton_whitefly_foliage.jpg',
        url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
        size: '1.5 MB',
        uploadedAt: '20 Nov 2026',
      },
    ],
    assignedOfficer: {
      name: 'Dr. Ananya Sharma',
      designation: 'Senior Block Agricultural Officer',
      contact: '+91 94123 78901',
      assignedDate: '2026-11-20T12:30:00Z',
    },
    fieldInspectionDate: '2026-11-21T09:30:00Z',
    fieldNotes: 'Field visit performed. Whitefly nymph count observed above economic threshold level (ETL). Case being sent to Entomologist.',
    timeline: [
      {
        step: 1,
        status: 'submitted',
        title: 'Complaint Logged',
        description: 'Whitefly infestation reported by cultivator.',
        actor: 'Farmer (Ramesh Patel)',
        timestamp: '20 Nov 2026, 11:45 AM',
        completed: true,
      },
      {
        step: 2,
        status: 'under_review',
        title: 'Officer Assigned',
        description: 'Case allotted to Block Agricultural Extension team.',
        actor: 'Officer (Dr. Ananya Sharma)',
        timestamp: '20 Nov 2026, 12:30 PM',
        completed: true,
      },
      {
        step: 3,
        status: 'investigating',
        title: 'Field Verification Completed',
        description: 'ETL threshold verified. Forwarded to Entomology Division.',
        actor: 'Officer (Dr. Ananya Sharma)',
        timestamp: '21 Nov 2026, 09:30 AM',
        completed: true,
      },
      {
        step: 4,
        status: 'advisory_issued',
        title: 'Entomologist Advisory Pending',
        description: 'Awaiting expert recommendation on bio-rational insect growth regulator.',
        actor: 'ICAR Entomologist',
        timestamp: 'Under Review',
        completed: false,
      },
      {
        step: 5,
        status: 'resolved',
        title: 'Spray Execution & Verification',
        description: 'Farmer application and follow up.',
        actor: 'Pending',
        timestamp: 'Queued',
        completed: false,
      },
    ],
  },
];

export const complaintService = {
  // Retrieve all complaints (persisted in localStorage, fallback to demo data)
  getComplaints(): Complaint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load complaints from localStorage', err);
    }
    // Initialize with demo complaints
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
    return INITIAL_DEMO_COMPLAINTS;
  },

  // Retrieve single complaint by tracking ID or ID
  getComplaintByTrackingId(trackingId: string): Complaint | undefined {
    const list = this.getComplaints();
    return list.find(
      (c) => c.trackingId.toLowerCase() === trackingId.toLowerCase() || c.id === trackingId
    );
  },

  // Create a brand new farmer complaint
  createComplaint(
    data: Omit<Complaint, 'id' | 'trackingId' | 'isDemo' | 'submissionDate' | 'status' | 'timeline'>
  ): Complaint {
    const list = this.getComplaints();

    // Generate unique Tracking ID: CC-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `CC-2026-${randomSuffix}`;
    const id = `cmp-user-${Date.now()}`;
    const nowISO = new Date().toISOString();
    const nowFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newComplaint: Complaint = {
      ...data,
      id,
      trackingId,
      isDemo: false, // Mark clearly as submitted by user
      submissionDate: nowISO,
      status: 'submitted',
      assignedOfficer: {
        name: 'Dr. Ananya Sharma',
        designation: 'Senior Block Agricultural Officer',
        contact: '+91 94123 78901',
        assignedDate: nowISO,
      },
      timeline: [
        {
          step: 1,
          status: 'submitted',
          title: 'Crop Complaint Registered',
          description: `Complaint successfully registered with Tracking ID ${trackingId}. Geotagged symptoms recorded.`,
          actor: `Farmer (${data.farmerName})`,
          timestamp: nowFormatted,
          completed: true,
        },
        {
          step: 2,
          status: 'under_review',
          title: 'Assigned to Block Agriculture Officer',
          description: 'Case allotted to Sub-Division Ludhiana East extension queue for preliminary triage.',
          actor: 'Officer (Dr. Ananya Sharma)',
          timestamp: 'Queued (SLA: Within 24 Hours)',
          completed: false,
        },
        {
          step: 3,
          status: 'investigating',
          title: 'Field Verification / Sample Inspection',
          description: 'Officer will visit farm parcel or conduct video consultation if required.',
          actor: 'Field Extension Officer',
          timestamp: 'Pending Field Visit',
          completed: false,
        },
        {
          step: 4,
          status: 'advisory_issued',
          title: 'Expert Diagnostic Formulation',
          description: 'Agricultural Scientist will analyze pathogen and issue certified spray protocol.',
          actor: 'Agricultural Research Expert',
          timestamp: 'Pending Expert Diagnosis',
          completed: false,
        },
        {
          step: 5,
          status: 'resolved',
          title: 'Advisory Delivered & Resolved',
          description: 'Prescription sent to farmer via SMS & CropCare portal. Case resolved.',
          actor: 'CropCare System',
          timestamp: 'Pending Completion',
          completed: false,
        },
      ],
    };

    // Prepend so newest appears first
    const updated = [newComplaint, ...list];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save complaint to localStorage', err);
    }
    return newComplaint;
  },

  // Delete a complaint
  deleteComplaint(id: string): void {
    const list = this.getComplaints();
    const updated = list.filter((c) => c.id !== id && c.trackingId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // Reset to original demo complaints
  resetToDemoData(): Complaint[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
    return INITIAL_DEMO_COMPLAINTS;
  },
};
