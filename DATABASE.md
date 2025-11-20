# Blood Bank BD - Database Setup

## Database Schema

The application uses SQLite with `better-sqlite3` for data persistence.

### Tables

#### `users`
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `email` - TEXT UNIQUE NOT NULL
- `password` - TEXT NOT NULL (bcrypt hashed)
- `name` - TEXT NOT NULL
- `phone` - TEXT (optional)
- `blood_group` - TEXT NOT NULL (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `area` - TEXT NOT NULL
- `city` - TEXT NOT NULL
- `is_donor` - BOOLEAN DEFAULT true
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

#### `contact_requests`
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `requester_id` - INTEGER NOT NULL (FK to users.id)
- `donor_id` - INTEGER NOT NULL (FK to users.id)
- `status` - TEXT DEFAULT 'pending'
- `message` - TEXT
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

## Setup Instructions

### Initial Setup

Run the database setup script to create the database and seed it with dummy data:

```bash
pnpm db:setup
```

This will:
1. Remove any existing `bloodbank.db` file
2. Create a new database with the proper schema
3. Insert 15 dummy donors with various blood groups and locations

### Dummy Data

The setup script creates 15 test users with the following details:

**Password for all users:** `password123`

**Sample Users:**
- ahmed.rahman@example.com - A+ blood, Dhanmondi, Dhaka
- fatima.khan@example.com - O+ blood, Gulshan, Dhaka
- karim.hossain@example.com - B+ blood, Mirpur, Dhaka
- nadia.islam@example.com - AB+ blood, Uttara, Dhaka
- rafiq.ahmed@example.com - A- blood, Banani, Dhaka
- sadia.begum@example.com - O- blood, Mohammadpur, Dhaka
- ibrahim.ali@example.com - B- blood, Agrabad, Chittagong
- ayesha.sultana@example.com - AB- blood, Panchlaish, Chittagong
- hassan.mahmud@example.com - A+ blood, Zindabazar, Sylhet
- zara.chowdhury@example.com - O+ blood, Ambarkhana, Sylhet
- farhan.kabir@example.com - B+ blood, Badda, Dhaka
- maria.akter@example.com - A+ blood, Rampura, Dhaka
- tanvir.hasan@example.com - O+ blood, Motijheel, Dhaka
- sabrina.rahman@example.com - AB+ blood, Tejgaon, Dhaka
- imran.sheikh@example.com - B+ blood, Farmgate, Dhaka

### Testing the Application

1. Start the development server:
```bash
pnpm dev
```

2. Navigate to `http://localhost:3000`

3. Try logging in with any of the dummy user emails and password `password123`

4. Test the donor search functionality with different blood groups and locations

5. Test contacting donors (requires login)

## Database Location

The database file is located at: `bloodbank.db` in the project root directory.

## Troubleshooting

### better-sqlite3 binding issues

If you encounter binding errors with better-sqlite3, run:

```bash
cd node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3
npm run build-release
cd ../../../../..
pnpm db:setup
```

### Reset Database

To reset the database and start fresh, simply run:

```bash
pnpm db:setup
```

This will delete the existing database and create a new one with fresh dummy data.

## Production Considerations

For production deployment:

1. Use environment variables for database path
2. Implement proper backup strategies
3. Consider migrating to PostgreSQL or MySQL for better scalability
4. Add database migrations system (e.g., Prisma, Drizzle)
5. Implement proper connection pooling
6. Add database indexes for frequently queried columns
