import path from 'node:path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'bloodbank.db');
const db = new Database(dbPath, { readonly: true });

console.log('📊 Blood Bank Database Contents\n');
console.log('='.repeat(80));

// Get all users
const users = db
  .prepare(`
  SELECT id, name, email, blood_group, area, city, created_at 
  FROM users 
  ORDER BY blood_group, city, name
`)
  .all();

console.log(`\n✅ Total Donors: ${users.length}\n`);

// Group by blood type
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
bloodGroups.forEach((group) => {
  const donors = users.filter((u: any) => u.blood_group === group);
  if (donors.length > 0) {
    console.log(`\n🩸 ${group} Blood Group (${donors.length} donors):`);
    console.log('-'.repeat(80));
    donors.forEach((donor: any) => {
      console.log(`  📍 ${donor.name.padEnd(20)} | ${donor.area.padEnd(15)} | ${donor.city}`);
      console.log(`     📧 ${donor.email}`);
    });
  }
});

// Statistics by city
console.log('\n\n📍 Donors by City:');
console.log('='.repeat(80));
const cities = [...new Set(users.map((u: any) => u.city))];
cities.forEach((city) => {
  const cityDonors = users.filter((u: any) => u.city === city);
  console.log(`  ${city}: ${cityDonors.length} donors`);
});

// Get contact requests count
const requestCount = db.prepare('SELECT COUNT(*) as count FROM contact_requests').get() as {
  count: number;
};
console.log(`\n\n💌 Contact Requests: ${requestCount.count}`);

console.log(`\n${'='.repeat(80)}`);
console.log('✅ Database verification complete!');
console.log('🔐 All users have password: "password123"');
console.log('🌐 Start the app with: pnpm dev');

db.close();
