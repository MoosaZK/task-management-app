# TaskBoard Setup Guide

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. **Sign up for Supabase**: Go to [supabase.com](https://supabase.com) and create an account
2. **Create a new project**: 
   - Click "New Project"
   - Choose your organization
   - Enter project name: `taskboard-app`
   - Enter database password (save this!)
   - Select region closest to your users
   - Click "Create new project"

### Step 2: Configure Database Schema

1. **Go to SQL Editor**: In your Supabase dashboard, navigate to "SQL Editor"
2. **Run the schema**: Copy the entire contents of `supabase-schema.sql` and paste it into the SQL editor
3. **Execute**: Click "Run" to create all tables, policies, and functions

### Step 3: Get Your Project Credentials

1. **Navigate to Settings > API**: In your Supabase dashboard
2. **Copy the following values**:
   - `Project URL` → This becomes `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This becomes `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Configure Environment Variables

1. **Create `.env.local`**: In your project root (copy from `.env.example`)
2. **Add your credentials**:
   ```bash
   # Replace with your actual Supabase values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # These can stay as defaults for now
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   ```

### Step 5: Verify Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the database connection**: Once auth is implemented, you should be able to:
   - Sign up for a new account
   - Automatically get a sample board created
   - See the database tables populated in Supabase dashboard

## 🔧 Database Schema Overview

### Tables Created:
- **`users`**: User profiles (extends Supabase auth)
- **`boards`**: Project containers
- **`lists`**: Task categories within boards
- **`tasks`**: Individual work items

### Security Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Automatic user profile creation
- ✅ Cascade deletes for data integrity

### Sample Data:
- New users automatically get a "Welcome Board"
- Includes sample tasks to demonstrate features
- Default lists: "To Do", "In Progress", "Done"

## 🚀 Next Steps

After database setup is complete:
1. ✅ Database schema ← **You are here**
2. 🔄 Authentication implementation
3. 🔄 API routes development
4. 🔄 UI components creation
5. 🔄 Feature implementation

## 🔍 Troubleshooting

### Common Issues:

**"Invalid API credentials"**
- Double-check your environment variables
- Ensure you copied the correct anon key (not service_role key)
- Restart your development server after changing `.env.local`

**"RLS policy violation"**
- Ensure you're authenticated when testing
- Check that policies are correctly applied
- Review the SQL schema for any errors

**"Function does not exist"**
- Ensure the entire `supabase-schema.sql` was executed
- Check the Functions tab in Supabase dashboard
- Re-run the schema if needed

### Useful Supabase Dashboard Sections:
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users and settings
- **Logs**: Debug issues and monitor activity 