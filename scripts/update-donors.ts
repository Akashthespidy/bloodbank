import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { db } from '../lib/database';
import { users } from '../lib/schema';

async function updateDonors() {
  console.log('🔄 Updating all users to be donors...');

  try {
    // Update all users to set isDonor = true
    await db.execute(
      sql`UPDATE users SET is_donor = true WHERE is_donor IS NULL OR is_donor = false`
    );

    console.log('✅ All users updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateDonors();
