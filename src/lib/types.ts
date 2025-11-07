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

export type UserProfile = {
  id: string;
  bio: string;
  experience: string;
  areasOfExpertise: string[];
  certifications: string[];
  websiteUrl: string;
  linkedInUrl: string;
  hourlyRate: number;
};

export const expertises = [
  "Corporate & Commercial Law",
  "Litigation & Dispute Resolution",
  "Intellectual Property",
  "Family Law",
  "Criminal Law",
  "Real Estate & Property Law",
  "Taxation",
  "Labour & Employment Law",
  "Technology & E-commerce",
  "Immigration Law",
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
  "Jaipur",
  "Chandigarh",
];
