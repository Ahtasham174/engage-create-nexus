
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Testimonial } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Pencil, Upload } from 'lucide-react';

const TestimonialsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    position: '',
    company: '',
    content: '',
    avatar_url: '',
    order: 0
  });

  // For handling file uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: dbService.getTestimonials,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentTestimonial({
      ...currentTestimonial,
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

  const createMutation = useMutation({
    mutationFn: async (testimonial: Omit<Testimonial, 'id' | 'created_at'>) => {
      // Handle avatar upload if there's a new file
      if (avatarFile) {
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${avatarFile.name}`;
          const avatarUrl = await dbService.uploadImage('testimonial-avatars', fileName, avatarFile);
          testimonial.avatar_url = avatarUrl;
        } catch (error: any) {
          toast({
            title: "Avatar Upload Failed",
            description: error.message || "There was a problem uploading the testimonial avatar",
            variant: "destructive",
          });
          setIsUploading(false);
          throw error;
        }
        setIsUploading(false);
      }
      
      return dbService.addTestimonial(testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
      toast({
        title: "Testimonial Created",
        description: "The testimonial has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Testimonial",
        description: error.message || "There was a problem creating the testimonial.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (testimonial: Partial<Testimonial> & { id: string }) => {
      // Handle avatar upload if there's a new file
      if (avatarFile) {
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${avatarFile.name}`;
          const avatarUrl = await dbService.uploadImage('testimonial-avatars', fileName, avatarFile);
          testimonial.avatar_url = avatarUrl;
        } catch (error: any) {
          toast({
            title: "Avatar Upload Failed",
            description: error.message || "There was a problem uploading the testimonial avatar",
            variant: "destructive",
          });
          setIsUploading(false);
          throw error;
        }
        setIsUploading(false);
      }
      
      return dbService.updateTestimonial(testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
      toast({
        title: "Testimonial Updated",
        description: "The testimonial has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Testimonial",
        description: error.message || "There was a problem updating the testimonial.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: dbService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Testimonial Deleted",
        description: "The testimonial has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Testimonial",
        description: error.message || "There was a problem deleting the testimonial.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentTestimonial.id) {
      updateMutation.mutate(currentTestimonial as any);
    } else {
      createMutation.mutate(currentTestimonial as any);
    }
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setAvatarPreview(testimonial.avatar_url || null);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentTestimonial({
      name: '',
      position: '',
      company: '',
      content: '',
      avatar_url: '',
      order: 0
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Testimonials Management</h1>
        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Testimonial
        </Button>
      </div>

      {/* Form */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Column */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-portfolio-blue/30">
                {avatarPreview || (currentTestimonial.avatar_url) ? (
                  <img 
                    src={avatarPreview || currentTestimonial.avatar_url} 
                    alt="Testimonial Avatar" 
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
            
            {/* Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-portfolio-gray mb-1 block">Name</label>
                  <Input
                    name="name"
                    value={currentTestimonial.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    required
                    className="bg-portfolio-darkest border-portfolio-dark/60"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-portfolio-gray mb-1 block">Position</label>
                  <Input
                    name="position"
                    value={currentTestimonial.position}
                    onChange={handleInputChange}
                    placeholder="CTO"
                    required
                    className="bg-portfolio-darkest border-portfolio-dark/60"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Company</label>
                <Input
                  name="company"
                  value={currentTestimonial.company}
                  onChange={handleInputChange}
                  placeholder="Acme Inc."
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Testimonial Content</label>
                <Textarea
                  name="content"
                  value={currentTestimonial.content}
                  onChange={handleInputChange}
                  placeholder="Write the testimonial text here..."
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60 min-h-[120px]"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Display Order</label>
                <Input
                  name="order"
                  type="number"
                  value={currentTestimonial.order?.toString()}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-portfolio-darkest border-portfolio-dark/60 w-20"
                />
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
                isEditing ? 'Update Testimonial' : 'Create Testimonial'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Testimonial List */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Testimonials</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-portfolio-darkest border border-portfolio-dark/60 rounded-lg overflow-hidden hover:border-portfolio-blue/40 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="mr-4">
                        {testimonial.avatar_url ? (
                          <img 
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-portfolio-dark/50 flex items-center justify-center">
                            <span className="text-xl text-portfolio-gray font-medium">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white">{testimonial.name}</h3>
                        <p className="text-portfolio-blue text-sm">
                          {testimonial.position} at {testimonial.company}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editTestimonial(testimonial)}
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
                                Are you sure you want to delete this testimonial? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteMutation.mutate(testimonial.id)}
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
                    
                    <blockquote className="mt-4 text-portfolio-gray italic text-sm">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="mt-2 text-xs text-portfolio-gray">
                      Order: {testimonial.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-portfolio-gray">
              No testimonials found. Create your first testimonial using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManagement;
