import axios from 'axios';

const API_BASE_URL = 'https://api.civicconnect.com'; // Mock URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  creatorName: string;
  creatorId: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  image?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  proposalId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Stats {
  totalProposals: number;
  totalVotes: number;
  totalUsers: number;
}

// Mock data
const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Plant 1000 Trees Initiative',
    description: 'A comprehensive tree planting program to increase urban green cover and combat climate change in our community.',
    category: 'Environment',
    creatorName: 'Sarah Green',
    creatorId: 'user1',
    votes: 245,
    upvotes: 245,
    downvotes: 12,
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '2',
    title: 'Free Community WiFi Zones',
    description: 'Establish free high-speed WiFi hotspots in public parks and community centers to bridge the digital divide.',
    category: 'Technology',
    creatorName: 'Mike Chen',
    creatorId: 'user2',
    votes: 189,
    upvotes: 189,
    downvotes: 8,
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '3',
    title: 'Monthly Community Cleanup Days',
    description: 'Organize monthly volunteer events where residents come together to clean streets, parks, and public spaces.',
    category: 'Community',
    creatorName: 'Emma Davis',
    creatorId: 'user3',
    votes: 167,
    upvotes: 167,
    downvotes: 5,
    status: 'approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '4',
    title: 'Extended Library Hours',
    description: 'Keep public libraries open until 10 PM on weekdays to serve working families and students better.',
    category: 'Education',
    creatorName: 'James Wilson',
    creatorId: 'user4',
    votes: 143,
    upvotes: 143,
    downvotes: 15,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '5',
    title: 'Bike Lane Expansion Project',
    description: 'Build protected bike lanes on major streets to promote cycling as a safe, eco-friendly transportation option.',
    category: 'Transportation',
    creatorName: 'Lisa Martinez',
    creatorId: 'user5',
    votes: 201,
    upvotes: 201,
    downvotes: 22,
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '6',
    title: 'Youth Mentorship Program',
    description: 'Connect local professionals with young people for career guidance, skill development, and educational support.',
    category: 'Education',
    creatorName: 'David Brown',
    creatorId: 'user6',
    votes: 178,
    upvotes: 178,
    downvotes: 9,
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  }
];

let proposals = [...mockProposals];

export const proposalsApi = {
  getAll: async (filter?: string, sort?: string): Promise<Proposal[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...proposals];
    
    if (filter && filter !== 'all') {
      filtered = filtered.filter(p => p.status === filter);
    }
    
    if (sort === 'votes') {
      filtered.sort((a, b) => b.votes - a.votes);
    } else if (sort === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return filtered;
  },

  getById: async (id: string): Promise<Proposal | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return proposals.find(p => p.id === id);
  },

  create: async (data: Omit<Proposal, 'id' | 'votes' | 'upvotes' | 'downvotes' | 'createdAt' | 'comments'>): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProposal: Proposal = {
      ...data,
      id: Date.now().toString(),
      votes: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      comments: []
    };
    
    proposals = [newProposal, ...proposals];
    return newProposal;
  },

  vote: async (id: string, type: 'up' | 'down'): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) throw new Error('Proposal not found');
    
    if (type === 'up') {
      proposal.upvotes += 1;
    } else {
      proposal.downvotes += 1;
    }
    proposal.votes = proposal.upvotes - proposal.downvotes;
    
    return proposal;
  },

  addComment: async (proposalId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');
    
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    proposal.comments.push(newComment);
    return newComment;
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected'): Promise<Proposal> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) throw new Error('Proposal not found');
    
    proposal.status = status;
    return proposal;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    proposals = proposals.filter(p => p.id !== id);
  }
};

export const statsApi = {
  get: async (): Promise<Stats> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      totalProposals: proposals.length,
      totalVotes: proposals.reduce((sum, p) => sum + p.upvotes + p.downvotes, 0),
      totalUsers: 523
    };
  }
};

export default api;
