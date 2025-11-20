import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'bloodbank.db');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

// Create new database
const db = new Database(dbPath);
console.log('✅ Created new database at:', dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    blood_group TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    is_donor BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id INTEGER NOT NULL,
    donor_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users (id),
    FOREIGN KEY (donor_id) REFERENCES users (id)
  );
`);
console.log('✅ Created tables: users, contact_requests');

// Hash password function
const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

// Seed data
const dummyDonors = [
  {
    email: 'ahmed.rahman@example.com',
    password: hashPassword('password123'),
    name: 'Ahmed Rahman',
    phone: '+8801712345678',
    blood_group: 'A+',
    area: 'Dhanmondi',
    city: 'Dhaka',
  },
  {
    email: 'fatima.khan@example.com',
    password: hashPassword('password123'),
    name: 'Fatima Khan',
    phone: '+8801812345678',
    blood_group: 'O+',
    area: 'Gulshan',
    city: 'Dhaka',
  },
  {
    email: 'karim.hossain@example.com',
    password: hashPassword('password123'),
    name: 'Karim Hossain',
    phone: '+8801912345678',
    blood_group: 'B+',
    area: 'Mirpur',
    city: 'Dhaka',
  },
  {
    email: 'nadia.islam@example.com',
    password: hashPassword('password123'),
    name: 'Nadia Islam',
    phone: '+8801612345678',
    blood_group: 'AB+',
    area: 'Uttara',
    city: 'Dhaka',
  },
  {
    email: 'rafiq.ahmed@example.com',
    password: hashPassword('password123'),
    name: 'Rafiq Ahmed',
    phone: '+8801512345678',
    blood_group: 'A-',
    area: 'Banani',
    city: 'Dhaka',
  },
  {
    email: 'sadia.begum@example.com',
    password: hashPassword('password123'),
    name: 'Sadia Begum',
    phone: '+8801412345678',
    blood_group: 'O-',
    area: 'Mohammadpur',
    city: 'Dhaka',
  },
  {
    email: 'ibrahim.ali@example.com',
    password: hashPassword('password123'),
    name: 'Ibrahim Ali',
    phone: '+8801312345678',
    blood_group: 'B-',
    area: 'Agrabad',
    city: 'Chittagong',
  },
  {
    email: 'ayesha.sultana@example.com',
    password: hashPassword('password123'),
    name: 'Ayesha Sultana',
    phone: '+8801212345678',
    blood_group: 'AB-',
    area: 'Panchlaish',
    city: 'Chittagong',
  },
  {
    email: 'hassan.mahmud@example.com',
    password: hashPassword('password123'),
    name: 'Hassan Mahmud',
    phone: '+8801112345678',
    blood_group: 'A+',
    area: 'Zindabazar',
    city: 'Sylhet',
  },
  {
    email: 'zara.chowdhury@example.com',
    password: hashPassword('password123'),
    name: 'Zara Chowdhury',
    phone: '+8801012345678',
    blood_group: 'O+',
    area: 'Ambarkhana',
    city: 'Sylhet',
  },
  {
    email: 'farhan.kabir@example.com',
    password: hashPassword('password123'),
    name: 'Farhan Kabir',
    phone: '+8801712345679',
    blood_group: 'B+',
    area: 'Badda',
    city: 'Dhaka',
  },
  {
    email: 'maria.akter@example.com',
    password: hashPassword('password123'),
    name: 'Maria Akter',
    phone: '+8801812345679',
    blood_group: 'A+',
    area: 'Rampura',
    city: 'Dhaka',
  },
  {
    email: 'tanvir.hasan@example.com',
    password: hashPassword('password123'),
    name: 'Tanvir Hasan',
    phone: '+8801912345679',
    blood_group: 'O+',
    area: 'Motijheel',
    city: 'Dhaka',
  },
  {
    email: 'sabrina.rahman@example.com',
    password: hashPassword('password123'),
    name: 'Sabrina Rahman',
    phone: '+8801612345679',
    blood_group: 'AB+',
    area: 'Tejgaon',
    city: 'Dhaka',
  },
  {
    email: 'imran.sheikh@example.com',
    password: hashPassword('password123'),
    name: 'Imran Sheikh',
    phone: '+8801512345679',
    blood_group: 'B+',
    area: 'Farmgate',
    city: 'Dhaka',
  },
];

// Insert dummy donors
const insertStmt = db.prepare(`
  INSERT INTO users (email, password, name, phone, blood_group, area, city)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

let insertedCount = 0;
for (const donor of dummyDonors) {
  try {
    insertStmt.run(
      donor.email,
      donor.password,
      donor.name,
      donor.phone,
      donor.blood_group,
      donor.area,
      donor.city
    );
    insertedCount++;
  } catch (error) {
    console.error(`Failed to insert donor ${donor.name}:`, error);
  }
}

console.log(`✅ Inserted ${insertedCount} dummy donors`);

// Verify the data
const users = db.prepare('SELECT id, name, email, blood_group, area, city FROM users').all();
console.log('\n📊 Database Summary:');
console.log(`Total users: ${users.length}`);
console.log('\nSample donors:');
users.slice(0, 5).forEach((user: any) => {
  console.log(`  - ${user.name} (${user.blood_group}) - ${user.area}, ${user.city}`);
});

// Close database
db.close();
console.log('\n✅ Database setup completed successfully!');
console.log('📝 All dummy users have password: "password123"');
console.log('🔐 You can login with any of the emails listed above');
