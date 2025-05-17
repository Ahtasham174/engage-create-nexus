
# Supabase Setup Instructions

## 1. Database Tables Setup

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project: `ivwjieykglkaqkfquqnu`
3. Go to the SQL Editor in the left sidebar
4. Copy the contents of the `supabase-tables.sql` file
5. Paste it into the SQL Editor
6. Click "Run" to execute the SQL commands

## 2. Storage Buckets Setup

Create the following storage buckets through the Supabase Dashboard:

1. Go to "Storage" in the left sidebar
2. Create the following buckets:
   - `avatars` - For profile and user avatars
   - `project-images` - For portfolio project images
   - `resumes` - For resume files
   - `testimonial-avatars` - For testimonial profile images

For each bucket:
1. Click "Create Bucket"
2. Enter the bucket name
3. Set "Public bucket" to ON (to allow public access to images)
4. Click "Create bucket"

## 3. Authentication Setup

1. Go to "Authentication" in the left sidebar
2. Under "Providers", make sure "Email" is enabled
3. You can customize the settings for email authentication

## 4. Create an Admin User

1. Go to "Authentication" > "Users" in the left sidebar
2. Click "Invite user"
3. Enter your email address and set a temporary password
4. Click "Invite"
5. Check your email for the invitation and follow the instructions to set up your account

## 5. Access Policy and Security Settings

The SQL script has already set up basic Row Level Security policies that:
- Allow public read access to most tables
- Restrict create, update, and delete operations to authenticated users only
- Allow anyone to send messages
- Restrict reading messages to authenticated users

You can refine these access policies as needed through the Supabase Dashboard.

## 6. Testing the Setup

1. Log in to the admin panel of your site using the admin user credentials
2. Try creating, updating, and deleting content to ensure database operations are working correctly
3. Check the public-facing pages to ensure content is displaying properly
