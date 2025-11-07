import type { Lawyer } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const avatar1 = PlaceHolderImages.find(p => p.id === 'avatar-1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find(p => p.id === 'avatar-2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find(p => p.id === 'avatar-3')?.imageUrl || '';
const avatar4 = PlaceHolderImages.find(p => p.id === 'avatar-4')?.imageUrl || '';
const avatar5 = PlaceHolderImages.find(p => p.id === 'avatar-5')?.imageUrl || '';

export const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Jane Doe',
    firm: 'Doe & Associates',
    expertise: ['Corporate Law', 'Intellectual Property'],
    location: 'New York, NY',
    rating: 4.9,
    reviews: 124,
    avatarUrl: avatar1,
    bio: 'Jane Doe is a leading expert in corporate law, with over 15 years of experience helping businesses navigate complex legal landscapes. She specializes in mergers, acquisitions, and intellectual property protection.',
  },
  {
    id: '2',
    name: 'John Smith',
    firm: 'Smith Legal',
    expertise: ['Criminal Law', 'Family Law'],
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviews: 98,
    avatarUrl: avatar2,
    bio: 'John Smith is a dedicated defense attorney with a strong track record of success. He provides compassionate and effective representation for clients facing criminal charges and family disputes.',
  },
  {
    id: '3',
    name: 'Emily White',
    firm: 'White & Partners',
    expertise: ['Real Estate Law', 'Tax Law'],
    location: 'Chicago, IL',
    rating: 4.9,
    reviews: 85,
    avatarUrl: avatar3,
    bio: 'Emily White offers comprehensive legal services for real estate transactions and tax planning. Her meticulous approach ensures her clients\' interests are protected.',
  },
  {
    id: '4',
    name: 'Michael Brown',
    firm: 'Brown Immigration',
    expertise: ['Immigration Law'],
    location: 'Houston, TX',
    rating: 5.0,
    reviews: 210,
    avatarUrl: avatar4,
    bio: 'Michael Brown is a renowned immigration lawyer, helping individuals, families, and businesses with their immigration needs. He is committed to providing personalized and effective legal solutions.',
  },
  {
    id: '5',
    name: 'Sarah Green',
    firm: 'Green Labor Law',
    expertise: ['Labor Law'],
    location: 'Phoenix, AZ',
    rating: 4.7,
    reviews: 76,
    avatarUrl: avatar5,
    bio: 'Sarah Green specializes in labor and employment law, representing both employees and employers. She is a skilled negotiator and litigator, dedicated to achieving fair outcomes for her clients.',
  },
];
