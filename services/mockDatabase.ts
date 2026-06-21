
import { User } from '../types';

// Extended Types for Database
export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  lastVisit: string;
  lastUpdated: string; // ISO Date string for notification tracking
  status: 'Stable' | 'Critical' | 'Recovering';
  avatar: string;
  vitals: {
    bp: string;
    heartRate: string;
    spO2: string;
    temp: string;
  };
  history: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isDoctor: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  specialization: string;
  keywords: string[];
  avatar: string;
}

// Mock Doctors Directory
const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: 'doc_cardio',
    name: 'Dr. Anjali Gupta',
    specialization: 'Cardiologist',
    keywords: ['heart', 'chest', 'bp', 'pressure', 'cardiac', 'pulse', 'hypertension', 'angina'],
    avatar: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'doc_neuro',
    name: 'Dr. Vikram Rao',
    specialization: 'Neurologist',
    keywords: ['headache', 'migraine', 'dizzy', 'seizure', 'nerve', 'brain', 'numbness'],
    avatar: 'https://picsum.photos/200/200?random=5'
  },
  {
    id: 'doc_ortho',
    name: 'Dr. Suresh Patel',
    specialization: 'Orthopedic',
    keywords: ['bone', 'joint', 'fracture', 'knee', 'back', 'spine', 'arthritis', 'pain'],
    avatar: 'https://picsum.photos/200/200?random=6'
  },
  {
    id: 'doc_gen',
    name: 'Dr. Meera Singh',
    specialization: 'General Physician',
    keywords: ['fever', 'flu', 'cold', 'stomach', 'general', 'weakness'],
    avatar: 'https://picsum.photos/200/200?random=7'
  }
];

// Mock Data Store
const MOCK_PATIENTS: PatientData[] = [
  {
    id: 'p1',
    name: 'Rahul Sharma',
    age: 45,
    gender: 'Male',
    condition: 'Type 2 Diabetes',
    lastVisit: '2 days ago',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Updated 2 days ago
    status: 'Stable',
    avatar: 'https://picsum.photos/seed/rahul/200',
    vitals: { bp: '130/85', heartRate: '78', spO2: '98%', temp: '98.6°F' },
    history: ['Diagnosed 2019', 'Metformin 500mg prescribed', 'Reported dizziness on 12/10']
  },
  {
    id: 'p2',
    name: 'Sarah Khan',
    age: 32,
    gender: 'Female',
    condition: 'Chronic Migraine',
    lastVisit: 'Today',
    lastUpdated: new Date().toISOString(), // Updated today
    status: 'Recovering',
    avatar: 'https://picsum.photos/seed/sarah/200',
    vitals: { bp: '110/70', heartRate: '72', spO2: '99%', temp: '98.4°F' },
    history: ['MRI Clear', 'Ayurvedic Nasya therapy started', 'Trigger: Stress']
  },
  {
    id: 'p3',
    name: 'Amit Verma',
    age: 58,
    gender: 'Male',
    condition: 'Hypertension',
    lastVisit: '1 week ago',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // Updated 8 days ago (Should trigger alert)
    status: 'Critical',
    avatar: 'https://picsum.photos/seed/amit/200',
    vitals: { bp: '160/100', heartRate: '88', spO2: '96%', temp: '99.1°F' },
    history: ['Emergency admit Aug 2023', 'Family history of cardiac issues']
  },
  {
    id: 'p4',
    name: 'Priya Patel',
    age: 28,
    gender: 'Female',
    condition: 'PCOS',
    lastVisit: '3 days ago',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // Updated 3 days ago
    status: 'Stable',
    avatar: 'https://picsum.photos/seed/priya/200',
    vitals: { bp: '118/76', heartRate: '74', spO2: '99%', temp: '98.6°F' },
    history: ['Lifestyle modification plan', 'Yoga therapy adherence: High']
  }
];

const MOCK_CHATS: Record<string, ChatMessage[]> = {
  'p1': [
    { id: 'c1', senderId: 'p1', text: 'Doctor, I am feeling a bit dizzy today.', timestamp: new Date(Date.now() - 86400000), isDoctor: false },
    { id: 'c2', senderId: 'd1', text: 'Have you checked your blood sugar levels this morning?', timestamp: new Date(Date.now() - 86000000), isDoctor: true },
    { id: 'c3', senderId: 'p1', text: 'Yes, it was 145 mg/dL.', timestamp: new Date(Date.now() - 85000000), isDoctor: false }
  ],
  'p2': [
    { id: 'c1', senderId: 'p2', text: 'The new medication is working well. Headaches are less frequent.', timestamp: new Date(Date.now() - 172800000), isDoctor: false },
    { id: 'c2', senderId: 'd1', text: 'That is great news, Sarah. Continue the course for another week.', timestamp: new Date(Date.now() - 172000000), isDoctor: true }
  ]
};

// Simulated Storage Service for File Uploads
export const StorageService = {
  uploadImage: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please upload an image.'));
        return;
      }
      
      // Simulate network latency (1s to 2.5s)
      const delay = 1000 + Math.random() * 1500;
      
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result); // Return Base64 string acting as storage URL
          } else {
            reject(new Error('Failed to process image.'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file.'));
        reader.readAsDataURL(file);
      }, delay);
    });
  }
};

// Database Methods
export const MockDatabase = {
  updateDoctorProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
    // In a real app, this would update Firestore
    return { ...data, id: userId } as User;
  },

  getPatientsForDoctor: async (doctorId: string): Promise<PatientData[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_PATIENTS;
  },

  updatePatientRecord: async (patientId: string, updates: Partial<PatientData>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_PATIENTS.findIndex(p => p.id === patientId);
    if (index !== -1) {
      MOCK_PATIENTS[index] = {
        ...MOCK_PATIENTS[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  getChatHistory: async (patientId: string): Promise<ChatMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CHATS[patientId] || [];
  },

  sendChatMessage: async (patientId: string, text: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'd1', // Current Doctor
      text,
      timestamp: new Date(),
      isDoctor: true
    };
    if (!MOCK_CHATS[patientId]) MOCK_CHATS[patientId] = [];
    MOCK_CHATS[patientId].push(newMsg);
    return newMsg;
  },

  bookAppointment: async (bookingData: { name: string; age: string; weight: string; disease: string; symptoms: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time

    const searchText = (bookingData.disease + " " + bookingData.symptoms).toLowerCase();
    
    // Find matching specialist
    let assignedDoctor = MOCK_SPECIALISTS.find(doc => 
      doc.keywords.some(keyword => searchText.includes(keyword))
    );

    // Default to General Physician if no match
    if (!assignedDoctor) {
      assignedDoctor = MOCK_SPECIALISTS.find(doc => doc.id === 'doc_gen');
    }

    return {
      success: true,
      appointmentId: `APT-${Date.now()}`,
      assignedDoctor: assignedDoctor || MOCK_SPECIALISTS[0],
      date: new Date(Date.now() + 86400000).toLocaleDateString() // Tomorrow
    };
  }
};
