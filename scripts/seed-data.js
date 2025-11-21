const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function seedData() {
  const db = await open({
    filename: path.join(process.cwd(), 'bloodbank.db'),
    driver: sqlite3.Database,
  });

  // Create tables if they don't exist
  await db.exec(`
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

  // Sample donors data
  const sampleDonors = [
    {
      name: 'Ahmed Rahman',
      email: 'ahmed.rahman@email.com',
      password: 'password123',
      phone: '+880 1712 345678',
      blood_group: 'A+',
      area: 'Gulshan',
      city: 'Dhaka',
    },
    {
      name: 'Fatima Begum',
      email: 'fatima.begum@email.com',
      password: 'password123',
      phone: '+880 1812 345679',
      blood_group: 'B+',
      area: 'Banani',
      city: 'Dhaka',
    },
    {
      name: 'Mohammad Ali',
      email: 'mohammad.ali@email.com',
      password: 'password123',
      phone: '+880 1912 345680',
      blood_group: 'O+',
      area: 'Dhanmondi',
      city: 'Dhaka',
    },
    {
      name: 'Ayesha Khan',
      email: 'ayesha.khan@email.com',
      password: 'password123',
      phone: '+880 1612 345681',
      blood_group: 'AB+',
      area: 'Mohammadpur',
      city: 'Dhaka',
    },
    {
      name: 'Rashid Hassan',
      email: 'rashid.hassan@email.com',
      password: 'password123',
      phone: '+880 1512 345682',
      blood_group: 'A-',
      area: 'Mirpur',
      city: 'Dhaka',
    },
    {
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@email.com',
      password: 'password123',
      phone: '+880 1412 345683',
      blood_group: 'B-',
      area: 'Uttara',
      city: 'Dhaka',
    },
    {
      name: 'Kamal Uddin',
      email: 'kamal.uddin@email.com',
      password: 'password123',
      phone: '+880 1312 345684',
      blood_group: 'O-',
      area: 'Motijheel',
      city: 'Dhaka',
    },
    {
      name: 'Sabina Yasmin',
      email: 'sabina.yasmin@email.com',
      password: 'password123',
      phone: '+880 1212 345685',
      blood_group: 'AB-',
      area: 'Old Dhaka',
      city: 'Dhaka',
    },
    {
      name: 'Zahid Hossain',
      email: 'zahid.hossain@email.com',
      password: 'password123',
      phone: '+880 1112 345686',
      blood_group: 'A+',
      area: 'New Market',
      city: 'Dhaka',
    },
    {
      name: 'Rehana Akter',
      email: 'rehana.akter@email.com',
      password: 'password123',
      phone: '+880 1012 345687',
      blood_group: 'B+',
      area: 'Farmgate',
      city: 'Dhaka',
    },
    {
      name: 'Abdul Karim',
      email: 'abdul.karim@email.com',
      password: 'password123',
      phone: '+880 0912 345688',
      blood_group: 'O+',
      area: 'Tejgaon',
      city: 'Dhaka',
    },
    {
      name: 'Nasreen Begum',
      email: 'nasreen.begum@email.com',
      password: 'password123',
      phone: '+880 0812 345689',
      blood_group: 'AB+',
      area: 'Ramna',
      city: 'Dhaka',
    },
  ];

  console.log('Seeding database with sample donors...');

  for (const donor of sampleDonors) {
    const hashedPassword = await bcrypt.hash(donor.password, 12);

    try {
      await db.run(
        `INSERT INTO users (email, password, name, phone, blood_group, area, city)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          donor.email,
          hashedPassword,
          donor.name,
          donor.phone,
          donor.blood_group,
          donor.area,
          donor.city,
        ]
      );
      console.log(`Added donor: ${donor.name} (${donor.blood_group})`);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        console.log(`Donor ${donor.name} already exists, skipping...`);
      } else {
        console.error(`Error adding donor ${donor.name}:`, error);
      }
    }
  }

  console.log('Database seeding completed!');
  await db.close();
}

seedData().catch(console.error);
