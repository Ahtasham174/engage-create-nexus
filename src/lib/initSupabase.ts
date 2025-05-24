
import { supabase } from '../integrations/supabase/client';

// This file is used to initialize Supabase tables and storage buckets programmatically
// It's meant to be run once at the beginning to set up the database

const createTables = async () => {
  try {
    console.log('Creating database tables...');
    
    // Create profiles table
    const { error: profilesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          full_name TEXT NOT NULL,
          title TEXT NOT NULL,
          bio TEXT NOT NULL,
          avatar_url TEXT,
          email TEXT,
          phone TEXT,
          location TEXT,
          resume_url TEXT,
          github_url TEXT,
          linkedin_url TEXT,
          twitter_url TEXT,
          website_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
      return false;
    }
    
    // Create services table
    const { error: servicesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS services (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          icon_name TEXT NOT NULL,
          order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (servicesError) {
      console.error('Error creating services table:', servicesError);
      return false;
    }
    
    // Create skills table
    const { error: skillsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS skills (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          proficiency INTEGER NOT NULL,
          order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (skillsError) {
      console.error('Error creating skills table:', skillsError);
      return false;
    }
    
    // Create projects table
    const { error: projectsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image_url TEXT,
          live_url TEXT,
          github_url TEXT,
          technologies TEXT[] NOT NULL,
          categories TEXT[] NOT NULL,
          featured BOOLEAN NOT NULL DEFAULT false,
          order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (projectsError) {
      console.error('Error creating projects table:', projectsError);
      return false;
    }
    
    // Create experiences table
    const { error: experiencesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS experiences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE,
          description TEXT NOT NULL,
          current BOOLEAN NOT NULL DEFAULT false,
          company_logo TEXT,
          order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (experiencesError) {
      console.error('Error creating experiences table:', experiencesError);
      return false;
    }
    
    // Create testimonials table
    const { error: testimonialsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS testimonials (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          position TEXT NOT NULL,
          company TEXT NOT NULL,
          content TEXT NOT NULL,
          avatar_url TEXT,
          order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (testimonialsError) {
      console.error('Error creating testimonials table:', testimonialsError);
      return false;
    }
    
    // Create messages table
    const { error: messagesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (messagesError) {
      console.error('Error creating messages table:', messagesError);
      return false;
    }
    
    // Create site_settings table
    const { error: settingsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS site_settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (settingsError) {
      console.error('Error creating site_settings table:', settingsError);
      return false;
    }
    
    // Create site_visits table
    const { error: visitsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS site_visits (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          page TEXT NOT NULL,
          referrer TEXT,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (visitsError) {
      console.error('Error creating site_visits table:', visitsError);
      return false;
    }
    
    // Enable RLS on all tables
    await supabase.rpc('execute_sql', {
      sql_query: `
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE services ENABLE ROW LEVEL SECURITY;
        ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
        ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
        ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
        ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
      `
    });
    
    // Create RLS policies
    await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create public read policies for all content tables
        CREATE POLICY IF NOT EXISTS "Profiles are viewable by everyone."
          ON profiles FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Profiles can only be updated by authenticated users."
          ON profiles FOR UPDATE USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Services are viewable by everyone."
          ON services FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Skills are viewable by everyone."
          ON skills FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Projects are viewable by everyone."
          ON projects FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Experiences are viewable by everyone."
          ON experiences FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Testimonials are viewable by everyone."
          ON testimonials FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Site settings are viewable by everyone."
          ON site_settings FOR SELECT USING (true);

        -- Create authenticated user policies for admin operations
        CREATE POLICY IF NOT EXISTS "Services can be modified by authenticated users."
          ON services FOR ALL USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Skills can be modified by authenticated users."
          ON skills FOR ALL USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Projects can be modified by authenticated users."
          ON projects FOR ALL USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Experiences can be modified by authenticated users."
          ON experiences FOR ALL USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Testimonials can be modified by authenticated users."
          ON testimonials FOR ALL USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Messages can be read by authenticated users."
          ON messages FOR SELECT USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Messages can be created by anyone."
          ON messages FOR INSERT WITH CHECK (true);
          
        CREATE POLICY IF NOT EXISTS "Messages can be updated by authenticated users."
          ON messages FOR UPDATE USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Messages can be deleted by authenticated users."
          ON messages FOR DELETE USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Site settings can be modified by authenticated users."
          ON site_settings FOR ALL USING (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "Site visits can be recorded by anyone."
          ON site_visits FOR INSERT WITH CHECK (true);
          
        CREATE POLICY IF NOT EXISTS "Site visits can be viewed by authenticated users."
          ON site_visits FOR SELECT USING (auth.role() = 'authenticated');
      `
    });

    // Insert sample data
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (!existingProfile) {
      await supabase
        .from('profiles')
        .insert([{
          full_name: 'John Doe',
          title: 'Full Stack Developer',
          bio: 'Experienced developer with a passion for creating beautiful and functional web applications.',
          email: 'john@example.com',
          location: 'New York, USA'
        }]);
    }
    
    // Insert sample services if none exist
    const { data: existingServices } = await supabase
      .from('services')
      .select('*');
    
    if (!existingServices || existingServices.length === 0) {
      await supabase
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
    }

    console.log('Database tables and sample data created successfully');
    return true;
  } catch (error) {
    console.error('Error creating database tables:', error);
    return false;
  }
};

const createStorageBuckets = async () => {
  try {
    console.log('Creating storage buckets...');
    // Create storage buckets if they don't exist
    const buckets = ['avatars', 'project-images', 'resumes', 'testimonial-avatars', 'company-logos'];
    
    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBucket, error: checkError } = await supabase.storage.getBucket(bucket);
        
        if (checkError && checkError.message.includes('does not exist')) {
          console.log(`Creating bucket: ${bucket}`);
          const { data, error } = await supabase.storage.createBucket(bucket, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'application/pdf'],
            fileSizeLimit: 5 * 1024 * 1024 // 5MB
          });
            
          if (error) {
            console.error(`Error creating ${bucket} bucket:`, error);
          } else {
            console.log(`Created ${bucket} bucket successfully`);
          }
        } else if (existingBucket) {
          console.log(`${bucket} bucket already exists`);
        }
      } catch (err) {
        console.error(`Error checking/creating bucket ${bucket}:`, err);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error creating storage buckets:', error);
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
