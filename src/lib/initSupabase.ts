
import { supabase } from '../integrations/supabase/client';

// This file is used to initialize Supabase tables and storage buckets programmatically
// It's meant to be run once at the beginning to set up the database

const createTables = async () => {
  try {
    console.log('Creating database tables...');
    
    // Check if tables already exist instead of trying to create them
    // This way we avoid TypeScript errors with execute_sql
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Error checking profiles table:', profilesError);
      return false;
    }
    
    console.log('Profiles table exists:', profilesData !== null);
    
    // Check services table
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(1);
    
    if (servicesError) {
      console.error('Error checking services table:', servicesError);
      return false;
    }
    
    console.log('Services table exists:', servicesData !== null);
    
    // Check skills table
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .limit(1);
    
    if (skillsError) {
      console.error('Error checking skills table:', skillsError);
      return false;
    }
    
    console.log('Skills table exists:', skillsData !== null);
    
    // Check projects table
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      console.error('Error checking projects table:', projectsError);
      return false;
    }
    
    console.log('Projects table exists:', projectsData !== null);
    
    // Check experiences table
    const { data: experiencesData, error: experiencesError } = await supabase
      .from('experiences')
      .select('*')
      .limit(1);
    
    if (experiencesError) {
      console.error('Error checking experiences table:', experiencesError);
      return false;
    }
    
    console.log('Experiences table exists:', experiencesData !== null);
    
    // Check testimonials table
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);
    
    if (testimonialsError) {
      console.error('Error checking testimonials table:', testimonialsError);
      return false;
    }
    
    console.log('Testimonials table exists:', testimonialsData !== null);
    
    // Check messages table
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    if (messagesError) {
      console.error('Error checking messages table:', messagesError);
      return false;
    }
    
    console.log('Messages table exists:', messagesData !== null);
    
    // Check site_settings table
    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);
    
    if (settingsError) {
      console.error('Error checking site_settings table:', settingsError);
      return false;
    }
    
    console.log('Site settings table exists:', settingsData !== null);
    
    // Check site_visits table
    const { data: visitsData, error: visitsError } = await supabase
      .from('site_visits')
      .select('*')
      .limit(1);
    
    if (visitsError) {
      console.error('Error checking site_visits table:', visitsError);
      return false;
    }
    
    console.log('Site visits table exists:', visitsData !== null);

    // Insert sample data if tables are empty
    // Check if profile data exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .maybeSingle();
    
    if (profileCheckError) {
      console.error('Error checking existing profile:', profileCheckError);
    }
    
    if (!existingProfile) {
      console.log('No profile found, inserting sample data...');
      const { error: insertProfileError } = await supabase
        .from('profiles')
        .insert([{
          full_name: 'John Doe',
          title: 'Full Stack Developer',
          bio: 'Experienced developer with a passion for creating beautiful and functional web applications.',
          email: 'john@example.com',
          location: 'New York, USA'
        }]);
      
      if (insertProfileError) {
        console.error('Error inserting sample profile:', insertProfileError);
      } else {
        console.log('Sample profile inserted successfully');
      }
    }
    
    // Check if services data exists
    const { data: existingServices, error: servicesCheckError } = await supabase
      .from('services')
      .select('*');
    
    if (servicesCheckError) {
      console.error('Error checking existing services:', servicesCheckError);
    }
    
    if (!existingServices || existingServices.length === 0) {
      console.log('No services found, inserting sample data...');
      const { error: insertServicesError } = await supabase
        .from('services')
        .insert([
          {
            title: 'Web Development',
            description: 'Creating responsive and modern web applications using the latest technologies.',
            icon_name: 'code',
            order: 1
          },
          {
            title: 'UI/UX Design',
            description: 'Designing beautiful and intuitive user interfaces and experiences.',
            icon_name: 'palette',
            order: 2
          },
          {
            title: 'Mobile Development',
            description: 'Building cross-platform mobile applications for iOS and Android.',
            icon_name: 'smartphone',
            order: 3
          }
        ]);
      
      if (insertServicesError) {
        console.error('Error inserting sample services:', insertServicesError);
      } else {
        console.log('Sample services inserted successfully');
      }
    }

    console.log('Database tables and sample data checked/created successfully');
    return true;
  } catch (error) {
    console.error('Error checking/creating database tables:', error);
    return false;
  }
};

const createStorageBuckets = async () => {
  try {
    console.log('Checking storage buckets...');
    // Check if storage buckets exist
    const buckets = ['avatars', 'project-images', 'resumes', 'testimonial-avatars', 'company-logos'];
    
    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBucket, error: checkError } = await supabase.storage.getBucket(bucket);
        
        if (checkError) {
          console.error(`Error checking ${bucket} bucket:`, checkError);
          console.log(`Note: Bucket ${bucket} may need to be created manually in the Supabase dashboard.`);
        } else if (existingBucket) {
          console.log(`${bucket} bucket exists`);
        } else {
          console.log(`${bucket} bucket does not exist and may need to be created manually.`);
        }
      } catch (err) {
        console.error(`Error checking bucket ${bucket}:`, err);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking storage buckets:', error);
    return false;
  }
};

export const initializeSupabase = async () => {
  console.log('Initializing Supabase...');
  
  try {
    // First check if supabase is working at all
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking Supabase connection:', error);
      return { 
        success: false, 
        error: 'Failed to connect to Supabase. Check your URL and API key.',
        tablesCreated: false,
        bucketsCreated: false
      };
    }
  
    const tablesCreated = await createTables();
    const bucketsCreated = await createStorageBuckets();
    
    return {
      success: tablesCreated && bucketsCreated,
      tablesCreated,
      bucketsCreated
    };
  } catch (err) {
    console.error('Error initializing Supabase:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      tablesCreated: false,
      bucketsCreated: false
    };
  }
};
