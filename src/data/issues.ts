// Issue types and mock data for Upaya

export type IssueCategory = 'road' | 'garbage' | 'water' | 'electricity' | 'safety';
export type IssueStatus = 'pending' | 'review' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  status: IssueStatus;
  imageUrl?: string;
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const categoryConfig: Record<IssueCategory, { label: string; labelNp: string; icon: string; color: string }> = {
  road: { label: 'Road', labelNp: 'सडक', icon: '🛣️', color: 'orange' },
  garbage: { label: 'Garbage', labelNp: 'फोहोर', icon: '🗑️', color: 'emerald' },
  water: { label: 'Water', labelNp: 'पानी', icon: '💧', color: 'blue' },
  electricity: { label: 'Electricity', labelNp: 'बिजुली', icon: '⚡', color: 'yellow' },
  safety: { label: 'Safety', labelNp: 'सुरक्षा', icon: '🚨', color: 'red' },
};

export const statusConfig: Record<IssueStatus, { label: string; labelNp: string }> = {
  pending: { label: 'Pending', labelNp: 'विचाराधीन' },
  review: { label: 'In Review', labelNp: 'समीक्षामा' },
  resolved: { label: 'Resolved', labelNp: 'समाधान भयो' },
};

// Mock issues centered around Kathmandu, Nepal
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Ring Road',
    category: 'road',
    description: 'Dangerous pothole near Balkhu bridge causing accidents. Needs immediate attention.',
    location: 'Balkhu, Ring Road, Kathmandu',
    coordinates: [27.6858, 85.3021],
    status: 'pending',
    reportedBy: 'Anonymous Citizen',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'Garbage pile at Thamel junction',
    category: 'garbage',
    description: 'Uncollected garbage for over a week. Strong odor and health hazard.',
    location: 'Thamel, Kathmandu',
    coordinates: [27.7159, 85.3131],
    status: 'review',
    reportedBy: 'Local Shopkeeper',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    title: 'Water pipeline leakage',
    category: 'water',
    description: 'Major water leakage flooding the street. Wasting precious water resources.',
    location: 'New Baneshwor, Kathmandu',
    coordinates: [27.6933, 85.3424],
    status: 'resolved',
    reportedBy: 'Resident Association',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    title: 'Broken streetlight',
    category: 'electricity',
    description: 'Streetlight not working for 2 weeks. Safety concern at night.',
    location: 'Koteshwor, Kathmandu',
    coordinates: [27.6766, 85.3495],
    status: 'pending',
    reportedBy: 'Night Watchman',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    title: 'Missing manhole cover',
    category: 'safety',
    description: 'Open manhole without cover near school. Extremely dangerous for children.',
    location: 'Patan Dhoka, Lalitpur',
    coordinates: [27.6727, 85.3239],
    status: 'review',
    reportedBy: 'School Principal',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '6',
    title: 'Damaged road after monsoon',
    category: 'road',
    description: 'Road completely washed away. Vehicles cannot pass.',
    location: 'Budhanilkantha, Kathmandu',
    coordinates: [27.7634, 85.3640],
    status: 'pending',
    reportedBy: 'Local Driver',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '7',
    title: 'Clogged drainage system',
    category: 'water',
    description: 'Blocked drainage causing water logging during rain.',
    location: 'Kalanki, Kathmandu',
    coordinates: [27.6933, 85.2821],
    status: 'resolved',
    reportedBy: 'Shop Owner',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '8',
    title: 'Illegal garbage dumping',
    category: 'garbage',
    description: 'People dumping garbage in the river. Environmental hazard.',
    location: 'Bagmati River Bank, Thapathali',
    coordinates: [27.6939, 85.3179],
    status: 'pending',
    reportedBy: 'Environmental Activist',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
];

export const getStats = () => {
  const total = mockIssues.length;
  const pending = mockIssues.filter(i => i.status === 'pending').length;
  const inReview = mockIssues.filter(i => i.status === 'review').length;
  const resolved = mockIssues.filter(i => i.status === 'resolved').length;
  
  const byCategory = Object.keys(categoryConfig).reduce((acc, cat) => {
    acc[cat as IssueCategory] = mockIssues.filter(i => i.category === cat).length;
    return acc;
  }, {} as Record<IssueCategory, number>);

  return { total, pending, inReview, resolved, byCategory };
};
