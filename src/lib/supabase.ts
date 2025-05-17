import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with the provided values
const supabaseUrl = 'https://ivwjieykglkaqkfquqnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d2ppZXlrZ2xrYXFrZnF1cW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTM1MDMsImV4cCI6MjA2MzA2OTUwM30.9cQ9lzI2WbH4MDf43q6UK71U6zdwwDYYtl0zA4I1oP8';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our database schema
export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  created_at: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  created_at: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  categories: string[];
  created_at: string;
  featured: boolean;
  order: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date?: string;
  description: string;
  current: boolean;
  created_at: string;
  order: number;
  company_logo?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url?: string;
  created_at: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface SiteVisit {
  id: string;
  page: string;
  referrer?: string;
  user_agent?: string;
  created_at: string;
}

// Database service functions
export const dbService = {
  // Profile functions
  getProfile: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) throw error;
    return data as Profile;
  },
  
  updateProfile: async (profile: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  },
  
  // Services functions
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Service[];
  },
  
  addService: async (service: Omit<Service, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
    
    if (error) throw error;
    return data as Service;
  },
  
  updateService: async (service: Partial<Service> & { id: string }) => {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', service.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Service;
  },
  
  deleteService: async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Skills functions
  getSkills: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Skill[];
  },
  
  addSkill: async (skill: Omit<Skill, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();
    
    if (error) throw error;
    return data as Skill;
  },
  
  updateSkill: async (skill: Partial<Skill> & { id: string }) => {
    const { data, error } = await supabase
      .from('skills')
      .update(skill)
      .eq('id', skill.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Skill;
  },
  
  deleteSkill: async (id: string) => {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Projects functions
  getProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Project[];
  },
  
  addProject: async (project: Omit<Project, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },
  
  updateProject: async (project: Partial<Project> & { id: string }) => {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },
  
  deleteProject: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Experience functions
  getExperiences: async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('end_date', { ascending: false, nullsFirst: true })
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data as Experience[];
  },
  
  addExperience: async (experience: Omit<Experience, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('experiences')
      .insert(experience)
      .select()
      .single();
    
    if (error) throw error;
    return data as Experience;
  },
  
  updateExperience: async (experience: Partial<Experience> & { id: string }) => {
    const { data, error } = await supabase
      .from('experiences')
      .update(experience)
      .eq('id', experience.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Experience;
  },
  
  deleteExperience: async (id: string) => {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Testimonials functions
  getTestimonials: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Testimonial[];
  },
  
  addTestimonial: async (testimonial: Omit<Testimonial, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    
    if (error) throw error;
    return data as Testimonial;
  },
  
  updateTestimonial: async (testimonial: Partial<Testimonial> & { id: string }) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', testimonial.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Testimonial;
  },
  
  deleteTestimonial: async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Messages functions
  getMessages: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Message[];
  },
  
  getMessage: async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Message;
  },
  
  markMessageAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  },
  
  deleteMessage: async (id: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Site Settings functions
  getSiteSettings: async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) throw error;
    return data as SiteSetting[];
  },
  
  updateSiteSetting: async (setting: Partial<SiteSetting> & { id: string }) => {
    const { data, error } = await supabase
      .from('site_settings')
      .update(setting)
      .eq('id', setting.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SiteSetting;
  },
  
  // Site visits/analytics
  logSiteVisit: async (visit: Omit<SiteVisit, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('site_visits')
      .insert(visit);
    
    if (error) throw error;
    return true;
  },
  
  getSiteVisits: async () => {
    const { data, error } = await supabase
      .from('site_visits')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SiteVisit[];
  },
  
  // Storage functions
  uploadImage: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl.publicUrl;
  },
  
  deleteImage: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return true;
  },
};
