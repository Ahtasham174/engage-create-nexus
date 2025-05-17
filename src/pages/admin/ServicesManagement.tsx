
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Service } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react';

const ServicesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon_name: '',
    order: 0
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: dbService.getServices,
  });

  const createMutation = useMutation({
    mutationFn: dbService.addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
      toast({
        title: "Service Created",
        description: "The service has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Service",
        description: error.message || "There was a problem creating the service.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: dbService.updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
      toast({
        title: "Service Updated",
        description: "The service has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Service",
        description: error.message || "There was a problem updating the service.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: dbService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Service Deleted",
        description: "The service has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Service",
        description: error.message || "There was a problem deleting the service.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentService({
      ...currentService,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentService.id) {
      updateMutation.mutate(currentService as any);
    } else {
      createMutation.mutate(currentService as any);
    }
  };

  const editService = (service: Service) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentService({
      title: '',
      description: '',
      icon_name: '',
      order: 0
    });
    setIsEditing(false);
  };

  // Common UI for select available icons
  const IconOptions = () => (
    <>
      <option value="">Select an icon</option>
      <option value="code">Code</option>
      <option value="globe">Globe</option>
      <option value="smartphone">Smartphone</option>
      <option value="palette">Palette</option>
      <option value="zap">Zap</option>
      <option value="shield">Shield</option>
      <option value="settings">Settings</option>
      <option value="search">Search</option>
      <option value="image">Image</option>
      <option value="file-text">File</option>
      <option value="mail">Mail</option>
      <option value="database">Database</option>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Services Management</h1>
        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Service
        </Button>
      </div>

      {/* Form */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? "Edit Service" : "Add New Service"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-portfolio-gray mb-1 block">Title</label>
              <Input
                name="title"
                value={currentService.title}
                onChange={handleInputChange}
                placeholder="Web Development"
                required
                className="bg-portfolio-darkest border-portfolio-dark/60"
              />
            </div>
            <div>
              <label className="text-sm text-portfolio-gray mb-1 block">Icon</label>
              <select
                name="icon_name"
                value={currentService.icon_name}
                onChange={handleInputChange as any}
                required
                className="w-full px-3 py-2 bg-portfolio-darkest border border-portfolio-dark/60 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-blue/50"
              >
                <IconOptions />
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-portfolio-gray mb-1 block">Description</label>
            <Textarea
              name="description"
              value={currentService.description}
              onChange={handleInputChange}
              placeholder="Describe the service you provide..."
              required
              className="bg-portfolio-darkest border-portfolio-dark/60 min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="text-sm text-portfolio-gray mb-1 block">Display Order</label>
            <Input
              name="order"
              type="number"
              value={currentService.order?.toString()}
              onChange={handleInputChange}
              placeholder="0"
              className="bg-portfolio-darkest border-portfolio-dark/60 w-20"
            />
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
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Service' : 'Create Service'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Service List */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Services</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : services && services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-portfolio-dark/60">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Icon</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-portfolio-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-portfolio-dark/40">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-portfolio-darkest transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{service.order}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{service.title}</td>
                      <td className="px-4 py-4 text-sm text-portfolio-gray truncate max-w-xs">
                        {service.description.length > 80 
                          ? `${service.description.substring(0, 80)}...` 
                          : service.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">{service.icon_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editService(service)}
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
                                Are you sure you want to delete this service? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteMutation.mutate(service.id)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-portfolio-gray">
              No services found. Create your first service using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;
