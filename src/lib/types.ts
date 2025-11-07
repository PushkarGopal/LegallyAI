export type Lawyer = {
  id: string;
  name: string;
  firm: string;
  expertise: string[];
  location: string;
  rating: number;
  reviews: number;
  avatarUrl: string;
  bio: string;
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
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
];
