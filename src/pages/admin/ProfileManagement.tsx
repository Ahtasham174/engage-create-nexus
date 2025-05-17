
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Profile } from '@/lib/supabase';
import { Loader2, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ProfileManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: dbService.getProfile,
  });

  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
  });

  // Update form data when profile is loaded
  useState(() => {
    if (profile) {
      setFormData({
        id: profile.id,
        full_name: profile.full_name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        website_url: profile.website_url || '',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      // Handle avatar upload if there's a new file
      if (avatarFile) {
        setIsUploading(true);
        const fileName = `${Date.now()}-${avatarFile.name}`;
        try {
          const avatarUrl = await dbService.uploadImage('avatars', fileName, avatarFile);
          data.avatar_url = avatarUrl;
        } catch (error: any) {
          toast({
            title: "Avatar Upload Failed",
            description: error.message || "There was a problem uploading your avatar",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      }

      // Handle resume upload if there's a new file
      if (resumeFile) {
        setIsUploading(true);
        const fileName = `${Date.now()}-${resumeFile.name}`;
        try {
          const resumeUrl = await dbService.uploadImage('resumes', fileName, resumeFile);
          data.resume_url = resumeUrl;
        } catch (error: any) {
          toast({
            title: "Resume Upload Failed",
            description: error.message || "There was a problem uploading your resume",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      }

      return dbService.updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-portfolio-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Profile Management</h1>
      </div>

      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-portfolio-blue/30">
                {avatarPreview || (profile?.avatar_url) ? (
                  <img 
                    src={avatarPreview || profile?.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-portfolio-darkest flex items-center justify-center text-portfolio-gray">
                    No Image
                  </div>
                )}
              </div>
              <label className="btn-secondary cursor-pointer flex items-center gap-2 px-3 py-2">
                <Upload size={16} />
                Upload Avatar
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Full Name</label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Professional Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Full Stack Developer"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-portfolio-gray mb-1 block">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a short bio about yourself..."
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60 min-h-[120px]"
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  type="email"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="New York, USA"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Resume</label>
                <label className="flex items-center gap-2 px-3 py-2 border border-portfolio-dark/60 rounded-md cursor-pointer bg-portfolio-darkest hover:bg-portfolio-dark/80 transition-colors">
                  <Upload size={16} />
                  {resumeFile ? resumeFile.name : profile?.resume_url ? "Change Resume" : "Upload Resume"}
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="hidden" 
                    onChange={handleResumeChange} 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">GitHub</label>
                <Input
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">LinkedIn</label>
                <Input
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourusername"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Twitter</label>
                <Input
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourusername"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Personal Website</label>
                <Input
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={updateMutation.isPending || isUploading}
            >
              {(updateMutation.isPending || isUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
