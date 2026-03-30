export const mockUsers = {
  student: { 
    id: 's1', 
    name: 'Kothakapu Vishnu Kiran', 
    role: 'student', 
    program: 'IMG', 
    batch: '2023',
    year: '2nd Year',
    hostel: 'BH-1',
    room: '102',
    fatherName: 'Mr. Shiva',
    mobile: '+91 9876543210',
    fatherMobile: '+91 9988776655'
  },
  warden: { id: 'w1', name: 'Sanjay Sharma', role: 'warden', hostel: 'Block A' },
  security: { id: 'g1', name: 'Security', role: 'security', gate: 'Main Gate' }
};

export const initialOutpasses = [
  {
    id: 'OUT-1234',
    studentId: 's1',
    studentName: 'Kothakapu Vishnu Kiran',
    studentProgram: 'IMG',
    studentBatch: '2023',
    reason: 'Going home for weekend',
    dateOut: '2026-04-01T10:00',
    dateIn: '2026-04-03T18:00',
    status: 'approved',
    appliedAt: '2026-03-29T14:30',
    qrData: 'eyJpZCI6Ik9VVC0xMjM0In0=' // mock token
  },
  {
    id: 'OUT-1235',
    studentId: 's1',
    studentName: 'Kothakapu Vishnu Kiran',
    studentProgram: 'IMG',
    studentBatch: '2023',
    reason: 'Doctor appointment',
    dateOut: '2026-04-05T09:00',
    dateIn: '2026-04-05T13:00',
    status: 'pending',
    appliedAt: '2026-03-30T09:15'
  },
  {
    id: 'OUT-1236',
    studentId: 's2',
    studentName: 'Rahul Sharma',
    studentProgram: 'BCS',
    studentBatch: '2022',
    reason: 'Attending family function',
    dateOut: '2026-04-10T08:00',
    dateIn: '2026-04-12T20:00',
    status: 'pending',
    appliedAt: '2026-03-30T10:00'
  },
  {
    id: 'OUT-1237',
    studentId: 's3',
    studentName: 'Priya Patel',
    studentProgram: 'IMT',
    studentBatch: '2024',
    reason: 'Medical checkup',
    dateOut: '2026-03-31T14:00',
    dateIn: '2026-03-31T19:00',
    status: 'approved',
    appliedAt: '2026-03-28T11:20',
    qrData: 'eyJpZCI6Ik9VVC0xMjM3In0='
  },
  {
    id: 'OUT-1238',
    studentId: 's4',
    studentName: 'Amit Kumar',
    studentProgram: 'BEE',
    studentBatch: '2021',
    reason: 'Project meeting out of campus',
    dateOut: '2026-04-02T10:00',
    dateIn: '2026-04-02T16:00',
    status: 'rejected',
    appliedAt: '2026-03-27T09:15'
  },
  {
    id: 'OUT-1239',
    studentId: 's5',
    studentName: 'Neha Gupta',
    studentProgram: 'BMS',
    studentBatch: '2023',
    reason: 'Festival celebrations at home',
    dateOut: '2026-04-15T06:00',
    dateIn: '2026-04-18T22:00',
    status: 'pending',
    appliedAt: '2026-03-30T11:45'
  },
  {
    id: 'OUT-1240',
    studentId: 's6',
    studentName: 'Vikram Singh',
    studentProgram: 'IMG',
    studentBatch: '2022',
    reason: 'Local shopping',
    dateOut: '2026-03-31T17:00',
    dateIn: '2026-03-31T21:00',
    status: 'completed',
    appliedAt: '2026-03-25T14:30'
  },
  {
    id: 'OUT-1241',
    studentId: 's7',
    studentName: 'Ananya Desai',
    studentProgram: 'BCS',
    studentBatch: '2025',
    reason: 'Visiting relative',
    dateOut: '2026-04-05T10:00',
    dateIn: '2026-04-06T18:00',
    status: 'pending',
    appliedAt: '2026-03-30T12:10'
  },
  {
    id: 'OUT-1242',
    studentId: 's8',
    studentName: 'Rohan Verma',
    studentProgram: 'IMT',
    studentBatch: '2023',
    reason: 'Hackathon participation',
    dateOut: '2026-04-20T08:00',
    dateIn: '2026-04-22T20:00',
    status: 'approved',
    appliedAt: '2026-03-29T16:40',
    qrData: 'eyJpZCI6Ik9VVC0xMjQyIn0='
  },
  {
    id: 'OUT-1243',
    studentId: 's9',
    studentName: 'Sneha Reddy',
    studentProgram: 'BEE',
    studentBatch: '2024',
    reason: 'Dentist appointment',
    dateOut: '2026-04-01T15:00',
    dateIn: '2026-04-01T19:00',
    status: 'pending',
    appliedAt: '2026-03-30T13:05'
  },
  {
    id: 'OUT-1244',
    studentId: 's10',
    studentName: 'Aditya Mishra',
    studentProgram: 'BMS',
    studentBatch: '2022',
    reason: 'Movie with friends',
    dateOut: '2026-04-02T16:00',
    dateIn: '2026-04-02T21:30',
    status: 'rejected',
    appliedAt: '2026-03-28T18:20'
  },
  {
    id: 'OUT-1245',
    studentId: 's11',
    studentName: 'Kavya Pillai',
    studentProgram: 'IMG',
    studentBatch: '2025',
    reason: 'Going to railway station to drop parents',
    dateOut: '2026-04-03T09:00',
    dateIn: '2026-04-03T12:00',
    status: 'approved',
    appliedAt: '2026-03-29T19:15',
    qrData: 'eyJpZCI6Ik9VVC0xMjQ1In0='
  },
  {
    id: 'OUT-1246',
    studentId: 's12',
    studentName: 'Aryan Kapoor',
    studentProgram: 'BCS',
    studentBatch: '2021',
    reason: 'Internship interview',
    dateOut: '2026-04-08T08:00',
    dateIn: '2026-04-08T18:00',
    status: 'pending',
    appliedAt: '2026-03-30T14:30'
  },
  {
    id: 'OUT-1247',
    studentId: 's13',
    studentName: 'Meghna Roy',
    studentProgram: 'IMT',
    studentBatch: '2024',
    reason: 'Weekend trip',
    dateOut: '2026-04-10T14:00',
    dateIn: '2026-04-12T19:00',
    status: 'pending',
    appliedAt: '2026-03-30T15:00'
  },
  {
    id: 'OUT-1248',
    studentId: 's14',
    studentName: 'Sanjay Das',
    studentProgram: 'BEE',
    studentBatch: '2023',
    reason: 'Buying electronics from market',
    dateOut: '2026-04-04T11:00',
    dateIn: '2026-04-04T16:00',
    status: 'completed',
    appliedAt: '2026-03-26T10:10'
  }
];

export const mockLogs = [];
