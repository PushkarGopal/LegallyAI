import { type DocumentData } from 'firebase/firestore';

export type Lawyer = DocumentData & {
  id: string;
  name: string;
  firm: string;
  expertise: string[];
  location: string;
  rating: number;
  reviews: number;
  avatarUrl: string;
  bio: string;
  userId: string; // Reference to the User document
};

export const expertises = [
  "Corporate Law",
  "Intellectual Property",
  "Family Law",
  "Criminal Law",
  "Real Estate Law",
  "Tax Law",
  "Immigration Law",
  "Labor Law",
];

export const locations = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
];
