
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, supabase, SiteSetting } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Save, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Settings {
  site_name: string;
  meta_description: string;
  contact_email: string;
  enable_blog: boolean;
  maintenance_mode: boolean;
  analytics_id: string;
  primary_color: string;
  footer_text: string;
}

const DEFAULT_SETTINGS: Settings = {
  site_name: 'Portfolio',
  meta_description: 'My professional portfolio website',
  contact_email: '',
  enable_blog: false,
  maintenance_mode: false,
  analytics_id: '',
  primary_color: '#8B5CF6',
  footer_text: '© 2023 Portfolio. All rights reserved.',
};

const SettingsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  // Fetch current settings
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: dbService.getSiteSettings,
  });
  
  // Convert array of settings to object on load
  useEffect(() => {
    if (siteSettings) {
      const settingsObj = { ...DEFAULT_SETTINGS };
      siteSettings.forEach(setting => {
        const key = setting.key as keyof Settings;
        
        // Handle boolean values
        if (typeof DEFAULT_SETTINGS[key] === 'boolean') {
          settingsObj[key] = setting.value === 'true';
        } else {
          settingsObj[key] = setting.value as any;
        }
      });
      
      setSettings(settingsObj);
    }
  }, [siteSettings]);

  const updateMutation = useMutation({
    mutationFn: async (settings: Settings) => {
      // Convert settings object to array of settings and update each one
      const settingsArray = Object.entries(settings).map(([key, value]) => {
        // Find existing setting if it exists
        const existingSetting = siteSettings?.find(s => s.key === key);
        
        return {
          id: existingSetting?.id || '',
          key,
          value: String(value),
          description: `Site setting for ${key}`
        };
      });
      
      // Update existing settings
      for (const setting of settingsArray) {
        if (setting.id) {
          await dbService.updateSiteSetting(setting);
        } else {
          // For new settings, we'd need an add method, but we're not handling that here
          // as we're assuming all settings already exist
        }
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Save Settings",
        description: error.message || "There was a problem updating your settings.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSwitchChange = (name: keyof Settings, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(settings);
  };
  
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setIsResetDialogOpen(false);
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults. Click Save to apply changes.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const initializeDatabaseTables = async () => {
    try {
      // This function would call our initialize database function from initSupabase.ts
      const { initializeSupabase } = await import('@/lib/initSupabase');
      const result = await initializeSupabase();
      
      if (result.tablesCreated && result.bucketsCreated) {
        toast({
          title: "Database Initialized",
          description: "All tables and storage buckets have been created successfully.",
        });
      } else {
        toast({
          title: "Initialization Incomplete",
          description: "Some parts of the database initialization failed. Check the console for details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Initialization Failed",
        description: error.message || "There was a problem initializing the database.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Settings</h1>
      </div>

      {/* Settings Form */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : (
            <>
              {/* General Settings */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-portfolio-gray mb-1 block">Site Name</label>
                    <Input
                      name="site_name"
                      value={settings.site_name}
                      onChange={handleInputChange}
                      placeholder="My Portfolio"
                      className="bg-portfolio-darkest border-portfolio-dark/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-portfolio-gray mb-1 block">Contact Email</label>
                    <Input
                      name="contact_email"
                      value={settings.contact_email}
                      onChange={handleInputChange}
                      placeholder="contact@example.com"
                      type="email"
                      className="bg-portfolio-darkest border-portfolio-dark/60"
                    />
                  </div>
                </div>
              </div>
              
              {/* SEO Settings */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">SEO Settings</h2>
                <div>
                  <label className="text-sm text-portfolio-gray mb-1 block">Meta Description</label>
                  <Textarea
                    name="meta_description"
                    value={settings.meta_description}
                    onChange={handleInputChange}
                    placeholder="Enter a description for search engines..."
                    className="bg-portfolio-darkest border-portfolio-dark/60"
                    maxLength={160}
                  />
                  <p className="text-xs text-portfolio-gray mt-1">
                    {settings.meta_description.length}/160 characters
                  </p>
                </div>
              </div>
              
              {/* Appearance Settings */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Appearance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-portfolio-gray mb-1 block">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="color"
                        name="primary_color"
                        value={settings.primary_color}
                        onChange={handleInputChange}
                        className="w-12 h-10 p-1 bg-portfolio-darkest border-portfolio-dark/60"
                      />
                      <Input
                        name="primary_color"
                        value={settings.primary_color}
                        onChange={handleInputChange}
                        className="bg-portfolio-darkest border-portfolio-dark/60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-portfolio-gray mb-1 block">Footer Text</label>
                    <Input
                      name="footer_text"
                      value={settings.footer_text}
                      onChange={handleInputChange}
                      placeholder="© 2023 My Portfolio"
                      className="bg-portfolio-darkest border-portfolio-dark/60"
                    />
                  </div>
                </div>
              </div>
              
              {/* Feature Toggles */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Features</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-portfolio-darkest rounded-lg border border-portfolio-dark/40">
                    <div>
                      <h3 className="font-medium text-white">Blog</h3>
                      <p className="text-sm text-portfolio-gray">Enable blog functionality on your portfolio</p>
                    </div>
                    <Switch
                      checked={settings.enable_blog}
                      onCheckedChange={(checked) => handleSwitchChange('enable_blog', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-portfolio-darkest rounded-lg border border-portfolio-dark/40">
                    <div>
                      <h3 className="font-medium text-white">Maintenance Mode</h3>
                      <p className="text-sm text-portfolio-gray">Put your site in maintenance mode</p>
                    </div>
                    <Switch
                      checked={settings.maintenance_mode}
                      onCheckedChange={(checked) => handleSwitchChange('maintenance_mode', checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Analytics */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Analytics</h2>
                <div>
                  <label className="text-sm text-portfolio-gray mb-1 block">Google Analytics ID</label>
                  <Input
                    name="analytics_id"
                    value={settings.analytics_id}
                    onChange={handleInputChange}
                    placeholder="G-XXXXXXXXXX"
                    className="bg-portfolio-darkest border-portfolio-dark/60"
                  />
                  <p className="text-xs text-portfolio-gray mt-1">
                    Leave blank to disable Google Analytics
                  </p>
                </div>
              </div>
              
              {/* Database Management */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Database Management</h2>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={initializeDatabaseTables}
                  >
                    <RefreshCw size={16} />
                    Initialize Database
                  </Button>
                  <p className="text-sm text-portfolio-gray">
                    Create or reset database tables and storage buckets
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-portfolio-dark/40 mt-8 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex space-x-2 order-2 md:order-1">
                  <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="outline">
                        Reset to Defaults
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-portfolio-dark border-portfolio-dark/60">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Reset Settings</AlertDialogTitle>
                        <AlertDialogDescription className="text-portfolio-gray">
                          Are you sure you want to reset all settings to their default values? This action can be undone by not saving.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={handleReset}
                        >
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  className="btn-primary order-1 md:order-2"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsManagement;
