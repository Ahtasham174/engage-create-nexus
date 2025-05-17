
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Project } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Pencil, Upload } from 'lucide-react';

const ProjectsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    image_url: '',
    live_url: '',
    github_url: '',
    technologies: [],
    categories: [],
    featured: false,
    order: 0
  });

  // For handling file uploads
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // For handling technologies and categories
  const [techInput, setTechInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: dbService.getProjects,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentProject({
      ...currentProject,
      [e.target.name]: e.target.value
    });
  };

  const handleFeaturedChange = (checked: boolean) => {
    setCurrentProject({
      ...currentProject,
      featured: checked
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && currentProject.technologies) {
      if (!currentProject.technologies.includes(techInput.trim())) {
        setCurrentProject({
          ...currentProject,
          technologies: [...currentProject.technologies, techInput.trim()]
        });
      }
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    if (currentProject.technologies) {
      setCurrentProject({
        ...currentProject,
        technologies: currentProject.technologies.filter(t => t !== tech)
      });
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && currentProject.categories) {
      if (!currentProject.categories.includes(categoryInput.trim())) {
        setCurrentProject({
          ...currentProject,
          categories: [...currentProject.categories, categoryInput.trim()]
        });
      }
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    if (currentProject.categories) {
      setCurrentProject({
        ...currentProject,
        categories: currentProject.categories.filter(c => c !== category)
      });
    }
  };

  const createMutation = useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at'>) => {
      // Handle image upload if there's a new file
      if (imageFile) {
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${imageFile.name}`;
          const imageUrl = await dbService.uploadImage('project-images', fileName, imageFile);
          project.image_url = imageUrl;
        } catch (error: any) {
          toast({
            title: "Image Upload Failed",
            description: error.message || "There was a problem uploading your image",
            variant: "destructive",
          });
          setIsUploading(false);
          throw error;
        }
        setIsUploading(false);
      }
      
      return dbService.addProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
      toast({
        title: "Project Created",
        description: "The project has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Project",
        description: error.message || "There was a problem creating the project.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (project: Partial<Project> & { id: string }) => {
      // Handle image upload if there's a new file
      if (imageFile) {
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${imageFile.name}`;
          const imageUrl = await dbService.uploadImage('project-images', fileName, imageFile);
          project.image_url = imageUrl;
        } catch (error: any) {
          toast({
            title: "Image Upload Failed",
            description: error.message || "There was a problem uploading your image",
            variant: "destructive",
          });
          setIsUploading(false);
          throw error;
        }
        setIsUploading(false);
      }
      
      return dbService.updateProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
      toast({
        title: "Project Updated",
        description: "The project has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Project",
        description: error.message || "There was a problem updating the project.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: dbService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Project",
        description: error.message || "There was a problem deleting the project.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentProject.id) {
      updateMutation.mutate(currentProject as any);
    } else {
      createMutation.mutate(currentProject as any);
    }
  };

  const editProject = (project: Project) => {
    setCurrentProject({
      ...project,
      // Ensure arrays are never null or undefined
      technologies: project.technologies || [],
      categories: project.categories || []
    });
    setImagePreview(project.image_url || null);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentProject({
      title: '',
      description: '',
      image_url: '',
      live_url: '',
      github_url: '',
      technologies: [],
      categories: [],
      featured: false,
      order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setTechInput('');
    setCategoryInput('');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Project Management</h1>
        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Form */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? "Edit Project" : "Add New Project"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Project Title</label>
                <Input
                  name="title"
                  value={currentProject.title}
                  onChange={handleInputChange}
                  placeholder="E-commerce Website"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Project Description</label>
                <Textarea
                  name="description"
                  value={currentProject.description}
                  onChange={handleInputChange}
                  placeholder="Describe the project..."
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60 min-h-[150px]"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Live URL</label>
                <Input
                  name="live_url"
                  value={currentProject.live_url}
                  onChange={handleInputChange}
                  placeholder="https://project-demo.com"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">GitHub URL</label>
                <Input
                  name="github_url"
                  value={currentProject.github_url}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div className="flex items-center">
                <Switch
                  checked={currentProject.featured}
                  onCheckedChange={handleFeaturedChange}
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm text-portfolio-gray ml-2">
                  Feature this project (show at the top)
                </label>
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Display Order</label>
                <Input
                  name="order"
                  type="number"
                  value={currentProject.order?.toString()}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-portfolio-darkest border-portfolio-dark/60 w-20"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Project Image */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Project Image</label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-portfolio-dark/60 rounded-lg p-4 flex flex-col items-center justify-center">
                    {imagePreview || currentProject.image_url ? (
                      <div className="relative w-full">
                        <img 
                          src={imagePreview || currentProject.image_url} 
                          alt="Project Preview" 
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <button 
                          type="button" 
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setCurrentProject({...currentProject, image_url: ''});
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
                          Drag and drop or click to upload
                        </p>
                      </>
                    )}
                    <label className="btn-secondary cursor-pointer flex items-center gap-2 px-3 py-2">
                      <Upload size={16} />
                      {imagePreview || currentProject.image_url ? "Change Image" : "Upload Image"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Technologies Used</label>
                <div className="flex items-center mb-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React"
                    className="bg-portfolio-darkest border-portfolio-dark/60 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    onClick={addTechnology}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProject.technologies?.map((tech, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-portfolio-blue/20 text-portfolio-blue px-2 py-1 rounded-md text-sm"
                    >
                      {tech}
                      <button 
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 text-portfolio-blue hover:text-white"
                      >
                        <span className="sr-only">Remove</span>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Project Categories</label>
                <div className="flex items-center mb-2">
                  <Input
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="Web Development"
                    className="bg-portfolio-darkest border-portfolio-dark/60 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    onClick={addCategory}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProject.categories?.map((category, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md text-sm"
                    >
                      {category}
                      <button 
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-2 text-indigo-400 hover:text-white"
                      >
                        <span className="sr-only">Remove</span>
                        &times;
                      </button>
                    </div>
                  ))}
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
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Project List */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-portfolio-darkest border border-portfolio-dark/60 rounded-lg overflow-hidden hover:border-portfolio-blue/40 transition-colors"
                >
                  {project.image_url ? (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-portfolio-dark/50 flex items-center justify-center">
                      <p className="text-portfolio-gray">No Image</p>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="bg-portfolio-blue/20 text-portfolio-blue text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-portfolio-gray text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span 
                            key={i} 
                            className="text-xs bg-portfolio-blue/10 text-portfolio-blue px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-portfolio-gray">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-portfolio-gray">
                        Order: {project.order}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editProject(project)}
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
                                Are you sure you want to delete this project? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteMutation.mutate(project.id)}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-portfolio-gray">
              No projects found. Create your first project using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsManagement;
