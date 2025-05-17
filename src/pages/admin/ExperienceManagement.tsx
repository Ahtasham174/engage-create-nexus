
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Experience } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Pencil, Upload, Calendar } from 'lucide-react';

const ExperienceManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Partial<Experience>>({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    current: false,
    order: 0
  });

  // For handling file uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: dbService.getExperiences,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentExperience({
      ...currentExperience,
      [e.target.name]: e.target.value
    });
  };

  const handleCurrentChange = (checked: boolean) => {
    setCurrentExperience({
      ...currentExperience,
      current: checked,
      // Clear end date if "current" is checked
      end_date: checked ? undefined : currentExperience.end_date
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const createMutation = useMutation({
    mutationFn: async (experience: Omit<Experience, 'id' | 'created_at'>) => {
      // Handle logo upload if there's a new file
      if (logoFile) {
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${logoFile.name}`;
          const logoUrl = await dbService.uploadImage('project-images', fileName, logoFile);
          experience.company_logo = logoUrl;
        } catch (error: any) {
          toast({
            title: "Logo Upload Failed",
            description: error.message || "There was a problem uploading the company logo",
            variant: "destructive",
          });
          setIsUploading(false);
          throw error;
        }
        setIsUploading(false);
      }
      
      return dbService.addExperience(experience);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      resetForm();
      toast({
        title: "Experience Created",
        description: "The experience has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Experience",
        description: error.message || "There was a problem creating the experience.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (experience: Partial<Experience> & { id: string }) => {
      // Handle logo upload if there's a new file
      if (logoFile) {
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${logoFile.name}`;
          const logoUrl = await dbService.uploadImage('project-images', fileName, logoFile);
          experience.company_logo = logoUrl;
        } catch (error: any) {
          toast({
            title: "Logo Upload Failed",
            description: error.message || "There was a problem uploading the company logo",
            variant: "destructive",
          });
          setIsUploading(false);
          throw error;
        }
        setIsUploading(false);
      }
      
      return dbService.updateExperience(experience);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      resetForm();
      toast({
        title: "Experience Updated",
        description: "The experience has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Experience",
        description: error.message || "There was a problem updating the experience.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: dbService.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast({
        title: "Experience Deleted",
        description: "The experience has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Experience",
        description: error.message || "There was a problem deleting the experience.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentExperience.id) {
      updateMutation.mutate(currentExperience as any);
    } else {
      createMutation.mutate(currentExperience as any);
    }
  };

  const editExperience = (experience: Experience) => {
    setCurrentExperience(experience);
    setLogoPreview(experience.company_logo || null);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentExperience({
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      current: false,
      order: 0
    });
    setLogoFile(null);
    setLogoPreview(null);
    setIsEditing(false);
  };

  // Helper function to format dates for display
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Experience Management</h1>
        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Experience
        </Button>
      </div>

      {/* Form */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? "Edit Experience" : "Add New Experience"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Job Title</label>
                <Input
                  name="title"
                  value={currentExperience.title}
                  onChange={handleInputChange}
                  placeholder="Senior Software Engineer"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Company</label>
                <Input
                  name="company"
                  value={currentExperience.company}
                  onChange={handleInputChange}
                  placeholder="Google"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Location</label>
                <Input
                  name="location"
                  value={currentExperience.location}
                  onChange={handleInputChange}
                  placeholder="Mountain View, CA"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-portfolio-gray mb-1 block">Start Date</label>
                  <Input
                    name="start_date"
                    type="date"
                    value={currentExperience.start_date}
                    onChange={handleInputChange}
                    required
                    className="bg-portfolio-darkest border-portfolio-dark/60"
                  />
                </div>
                <div>
                  <label className="text-sm text-portfolio-gray mb-1 block">End Date</label>
                  <Input
                    name="end_date"
                    type="date"
                    value={currentExperience.end_date || ''}
                    onChange={handleInputChange}
                    disabled={currentExperience.current}
                    className="bg-portfolio-darkest border-portfolio-dark/60"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <Switch
                  checked={currentExperience.current || false}
                  onCheckedChange={handleCurrentChange}
                  id="current"
                />
                <label htmlFor="current" className="text-sm text-portfolio-gray ml-2">
                  I currently work here
                </label>
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Display Order</label>
                <Input
                  name="order"
                  type="number"
                  value={currentExperience.order?.toString()}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-portfolio-darkest border-portfolio-dark/60 w-20"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Job Description</label>
                <Textarea
                  name="description"
                  value={currentExperience.description}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and achievements..."
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60 min-h-[180px]"
                />
              </div>
              
              {/* Company Logo */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Company Logo</label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-portfolio-dark/60 rounded-lg p-4 flex flex-col items-center justify-center">
                    {logoPreview || currentExperience.company_logo ? (
                      <div className="relative w-full">
                        <img 
                          src={logoPreview || currentExperience.company_logo} 
                          alt="Company Logo" 
                          className="h-24 object-contain mx-auto mb-2"
                        />
                        <button 
                          type="button" 
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                            setCurrentExperience({...currentExperience, company_logo: undefined});
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-portfolio-gray mb-2">
                          <Upload className="mx-auto h-12 w-12 opacity-50" />
                        </div>
                        <p className="text-sm text-portfolio-gray text-center mb-2">
                          Upload company logo (optional)
                        </p>
                      </>
                    )}
                    <label className="btn-secondary cursor-pointer flex items-center gap-2 px-3 py-2">
                      <Upload size={16} />
                      {logoPreview || currentExperience.company_logo ? "Change Logo" : "Upload Logo"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoChange} 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={createMutation.isPending || updateMutation.isPending || isUploading}
            >
              {(createMutation.isPending || updateMutation.isPending || isUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Experience' : 'Create Experience'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Experience List */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Experiences</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((experience) => (
                <div 
                  key={experience.id}
                  className="bg-portfolio-darkest border border-portfolio-dark/60 rounded-lg overflow-hidden hover:border-portfolio-blue/40 transition-colors p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Company Logo */}
                    {experience.company_logo ? (
                      <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                        <img 
                          src={experience.company_logo}
                          alt={experience.company}
                          className="max-w-full max-h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-portfolio-dark/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl text-portfolio-gray opacity-50 font-bold">
                          {experience.company.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Experience Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-white">{experience.title}</h3>
                        <div className="flex items-center text-portfolio-gray text-sm space-x-2">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {formatDate(experience.start_date)} - {experience.current ? 'Present' : formatDate(experience.end_date || '')}
                          </span>
                        </div>
                      </div>
                      <div className="text-portfolio-blue mb-2">{experience.company} • {experience.location}</div>
                      <p className="text-portfolio-gray text-sm line-clamp-2">
                        {experience.description}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editExperience(experience)}
                        className="text-portfolio-blue hover:text-white hover:bg-portfolio-blue/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-portfolio-dark border-portfolio-dark/60">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription className="text-portfolio-gray">
                              Are you sure you want to delete this experience? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => deleteMutation.mutate(experience.id)}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-portfolio-gray">
              No experiences found. Create your first experience using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceManagement;
