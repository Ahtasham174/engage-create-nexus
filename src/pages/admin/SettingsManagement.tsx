
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, SiteSetting } from '@/lib/supabase';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

interface FormData {
  id?: string;
  key: string;
  value: string;
  description?: string;
}

const SettingsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    key: '',
    value: '',
    description: ''
  });
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: dbService.getSiteSettings,
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: newSetting, error } = await supabase
        .from('site_settings')
        .insert({
          key: data.key,
          value: data.value,
          description: data.description || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return newSetting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Setting Created",
        description: "The site setting has been created successfully.",
      });
      setFormData({ key: '', value: '', description: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Setting",
        description: error.message || "There was a problem creating the setting.",
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (setting: SiteSetting) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          value: setting.value,
          description: setting.description
        })
        .eq('id', setting.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Setting Updated",
        description: "The site setting has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating the setting.",
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Setting Deleted",
        description: "The site setting has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "There was a problem deleting the setting.",
        variant: "destructive",
      });
    }
  });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setting?: SiteSetting
  ) => {
    if (setting) {
      // Update existing setting
      updateMutation.mutate({
        ...setting,
        [e.target.name]: e.target.value,
      });
    } else {
      // Update form for new setting
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Site Settings</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-portfolio-dark border-portfolio-dark/60">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Setting</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Key</label>
                <Input
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  placeholder="setting_key"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
                <p className="text-xs text-portfolio-gray mt-1">A unique identifier for this setting</p>
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Value</label>
                <Input
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="Setting value"
                  required
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <div>
                <label className="text-sm text-portfolio-gray mb-1 block">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="What this setting is used for..."
                  className="bg-portfolio-darkest border-portfolio-dark/60"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Setting
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-portfolio-blue animate-spin" />
          </div>
        ) : settings && settings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-portfolio-dark/60">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Key</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-portfolio-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-portfolio-dark/40">
                {settings.map((setting) => (
                  <tr key={setting.id} className="hover:bg-portfolio-darkest transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {setting.key}
                    </td>
                    <td className="px-4 py-4 text-sm text-portfolio-gray">
                      <Input
                        name="value"
                        value={setting.value}
                        onChange={(e) => handleInputChange(e, setting)}
                        className="bg-portfolio-darkest border-portfolio-dark/60"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-portfolio-gray">
                      <Textarea
                        name="description"
                        value={setting.description || ''}
                        onChange={(e) => handleInputChange(e, setting)}
                        className="bg-portfolio-darkest border-portfolio-dark/60 min-h-[80px]"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteMutation.mutate(setting.id)}
                        className="text-red-500 hover:text-white hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-portfolio-gray mb-4">No settings found</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              variant="secondary"
            >
              Add Your First Setting
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManagement;
