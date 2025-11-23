import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../lib/database';
import { users } from '../lib/schema';

const dummyDonors = [
  {
    email: 'ahmed.rahman@example.com',
    password: 'password123',
    name: 'Ahmed Rahman',
    phone: '+8801712345678',
    bloodGroup: 'A+',
    area: 'Dhanmondi',
    city: 'Dhaka',
  },
  {
    email: 'fatima.khan@example.com',
    password: 'password123',
    name: 'Fatima Khan',
    phone: '+8801812345678',
    bloodGroup: 'O+',
    area: 'Gulshan',
    city: 'Dhaka',
  },
  {
    email: 'karim.hossain@example.com',
    password: 'password123',
    name: 'Karim Hossain',
    phone: '+8801912345678',
    bloodGroup: 'B+',
    area: 'Mirpur',
    city: 'Dhaka',
  },
  {
    email: 'nadia.islam@example.com',
    password: 'password123',
    name: 'Nadia Islam',
    phone: '+8801612345678',
    bloodGroup: 'AB+',
    area: 'Uttara',
    city: 'Dhaka',
  },
  {
    email: 'rafiq.ahmed@example.com',
    password: 'password123',
    name: 'Rafiq Ahmed',
    phone: '+8801512345678',
    bloodGroup: 'A-',
    area: 'Banani',
    city: 'Dhaka',
  },
  {
    email: 'sadia.begum@example.com',
    password: 'password123',
    name: 'Sadia Begum',
    phone: '+8801412345678',
    bloodGroup: 'O-',
    area: 'Mohammadpur',
    city: 'Dhaka',
  },
  {
    email: 'ibrahim.ali@example.com',
    password: 'password123',
    name: 'Ibrahim Ali',
    phone: '+8801312345678',
    bloodGroup: 'B-',
    area: 'Agrabad',
    city: 'Chittagong',
  },
  {
    email: 'ayesha.sultana@example.com',
    password: 'password123',
    name: 'Ayesha Sultana',
    phone: '+8801212345678',
    bloodGroup: 'AB-',
    area: 'Panchlaish',
    city: 'Chittagong',
  },
  {
    email: 'hassan.mahmud@example.com',
    password: 'password123',
    name: 'Hassan Mahmud',
    phone: '+8801112345678',
    bloodGroup: 'A+',
    area: 'Zindabazar',
    city: 'Sylhet',
  },
  {
    email: 'zara.chowdhury@example.com',
    password: 'password123',
    name: 'Zara Chowdhury',
    phone: '+8801012345678',
    bloodGroup: 'O+',
    area: 'Ambarkhana',
    city: 'Sylhet',
  },
  {
    email: 'farhan.kabir@example.com',
    password: 'password123',
    name: 'Farhan Kabir',
    phone: '+8801712345679',
    bloodGroup: 'B+',
    area: 'Badda',
    city: 'Dhaka',
  },
  {
    email: 'maria.akter@example.com',
    password: 'password123',
    name: 'Maria Akter',
    phone: '+8801812345679',
    bloodGroup: 'A+',
    area: 'Rampura',
    city: 'Dhaka',
  },
  {
    email: 'tanvir.hasan@example.com',
    password: 'password123',
    name: 'Tanvir Hasan',
    phone: '+8801912345679',
    bloodGroup: 'O+',
    area: 'Motijheel',
    city: 'Dhaka',
  },
  {
    email: 'sabrina.rahman@example.com',
    password: 'password123',
    name: 'Sabrina Rahman',
    phone: '+8801612345679',
    bloodGroup: 'AB+',
    area: 'Tejgaon',
    city: 'Dhaka',
  },
  {
    email: 'imran.sheikh@example.com',
    password: 'password123',
    name: 'Imran Sheikh',
    phone: '+8801512345679',
    bloodGroup: 'B+',
    area: 'Farmgate',
    city: 'Dhaka',
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  for (const donor of dummyDonors) {
    const existingUser = await db.select().from(users).where(eq(users.email, donor.email)).limit(1);

    if (existingUser.length === 0) {
      // Remove password from donor object before inserting
      const { password, ...donorData } = donor;
      await db.insert(users).values({
        ...donorData,
        isDonor: true,
      });
      console.log(`✅ Inserted user: ${donor.name}`);
    } else {
      console.log(`ℹ️ User already exists: ${donor.name}`);
    }
  }

  console.log('✅ Seeding completed');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
