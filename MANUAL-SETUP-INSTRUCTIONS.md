
# Manual Supabase Setup Instructions

Follow these detailed steps to set up your Supabase project manually.

## 1. Set Up Database Tables and Policies

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Select your project (URL: `https://ivwjieykglkaqkfquqnu.supabase.co`)
3. Go to the SQL Editor in the left sidebar
4. Copy the contents of the `supabase-manual-setup.sql` file
5. Paste it into a new SQL query
6. Click "Run" to execute the SQL commands

This will create:
- All required database tables (profiles, services, skills, projects, experiences, testimonials, messages, site_settings, site_visits)
- Row Level Security (RLS) policies for each table
- Sample data for the profile and services tables
- Custom functions for site analytics and message management

## 2. Set Up Storage Buckets

Create the following storage buckets through the Supabase Dashboard:

1. Go to "Storage" in the left sidebar
2. For each of these buckets, click "New Bucket" and create them:
   - `avatars` (for profile pictures)
   - `project-images` (for portfolio project images)
   - `resumes` (for resume PDF files)
   - `testimonial-avatars` (for testimonial profile images)
   - `company-logos` (for experience company logos)

For each bucket:
1. Enter the bucket name
2. Set "Public bucket" to ON (to allow public access to images)
3. Click "Create"

## 3. Set Up Storage Security Policies

For each bucket, set up the following policies:

1. Click on the bucket name in the Storage section
2. Go to the "Policies" tab
3. Add a policy for public read access:
   - Policy Type: SELECT (read)
   - Policy Name: "Allow public read access"
   - Policy Definition: `true` (meaning anyone can view the files)
4. Add a policy for authenticated writes:
   - Policy Type: INSERT (create)
   - Policy Name: "Allow authenticated users to upload"
   - Policy Definition: `auth.role() = 'authenticated'`
5. Add similar policies for UPDATE and DELETE operations with the same condition

## 4. Create an Admin User

1. Go to "Authentication" > "Users" in the left sidebar
2. Click "Invite user"
3. Enter your email address
4. After receiving the invitation, click the link and set a password

## 5. Authentication Settings

1. Go to "Authentication" > "Providers"
2. Make sure "Email" provider is enabled
3. Under "Authentication" > "URL Configuration", set your site URL and redirect URLs if needed

## 6. Sign in to the Admin Panel

1. Go to your portfolio site admin login page (`/admin`)
2. Sign in with the admin user credentials you created
3. You should now have access to all admin features

## 7. Troubleshooting Common Issues

If you encounter any issues:

1. **Database Connection Issues**:
   - Verify your Supabase URL and API key in `src/lib/supabase.ts`
   - Check that the Supabase project is active

2. **Authentication Issues**:
   - Make sure the user was properly created in the Authentication section
   - Check that the user has verified their email

3. **Storage Issues**:
   - Verify all buckets were created with the correct names
   - Check that the storage policies are correctly set

4. **Data Not Updating**:
   - Check browser console for errors
   - Verify that the RLS policies allow the authenticated user to modify data
   - Try refreshing the page or signing out and back in

## 8. Manual Database Operations

If you need to perform manual operations on the database:

1. **Adding a new record**:
   ```sql
   INSERT INTO services (title, description, icon_name, order)
   VALUES ('New Service', 'Description here', 'icon-name', 4);
   ```

2. **Updating a record**:
   ```sql
   UPDATE profiles
   SET full_name = 'Your Name'
   WHERE id = 'your-profile-id';
   ```

3. **Deleting a record**:
   ```sql
   DELETE FROM messages
   WHERE id = 'message-id-to-delete';
   ```

## 9. Testing the Setup

After completing all the steps above:

1. Navigate to your admin dashboard
2. Try creating, editing, and deleting entries in each section
3. Test file uploads for profile pictures, project images, etc.
4. View the public-facing pages to ensure content is displaying correctly

If everything is working properly, your portfolio site should now be fully functional with all backend capabilities.
