import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// IMPORTANT: Replace this with your actual Firebase config
const firebaseConfig = {
  "projectId": "studio-2757243045-daec1",
  "appId": "1:923657323581:web:29cf8f6900897c9c465654",
  "apiKey": "AIzaSyDji78jN7Fi8IkBmpQUkBtyVtsIE7H1fAg",
  "authDomain": "studio-2757243045-daec1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "923657323581"
};


const placeholderImages = {
    'avatar-1': 'https://images.unsplash.com/photo-1557053908-4793c484d06f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2MjQ1ODcyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    'avatar-2': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjI0MTg2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'avatar-3': 'https://images.unsplash.com/photo-1610655507808-a59293f4e332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2MjQ1ODcyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    'avatar-4': 'https://images.unsplash.com/photo-1583195763986-0231686dcd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjI0MTg2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'avatar-5': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2MjQ1ODcyOXww&ixlib=rb-4.1.0&q=80&w=1080',
}

const lawyersData = [
  {
    id: '1',
    name: 'Jane Doe',
    firm: 'Doe & Associates',
    expertise: ['Corporate Law', 'Intellectual Property'],
    location: 'New York, NY',
    rating: 4.9,
    reviews: 124,
    avatarUrl: placeholderImages['avatar-1'],
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
    avatarUrl: placeholderImages['avatar-2'],
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
    avatarUrl: placeholderImages['avatar-3'],
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
    avatarUrl: placeholderImages['avatar-4'],
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
    avatarUrl: placeholderImages['avatar-5'],
    bio: 'Sarah Green specializes in labor and employment law, representing both employees and employers. She is a skilled negotiator and litigator, dedicated to achieving fair outcomes for her clients.',
  },
];

async function seedDatabase() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  try {
    console.log('Signing in anonymously...');
    await signInAnonymously(auth);
    console.log('Anonymous sign-in successful.');

    console.log('Seeding lawyers collection...');
    
    // Create a new batch
    const batch = writeBatch(db);

    const lawyersCol = collection(db, 'lawyers');
    
    lawyersData.forEach(lawyer => {
      const { id, ...data } = lawyer;
      const docRef = lawyersCol.doc(id);
      batch.set(docRef, data);
    });

    // Commit the batch
    await batch.commit();

    console.log(`Successfully seeded ${lawyersData.length} lawyers.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Firebase does not need to be explicitly closed in Node.js
    // It will keep the process alive if there are active listeners,
    // but this script will exit once the async operations are done.
    process.exit(0);
  }
}

seedDatabase();
