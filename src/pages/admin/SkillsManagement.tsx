
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, Skill } from '@/lib/supabase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react';

const SkillsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({
    name: '',
    category: '',
    proficiency: 80,
    order: 0
  });

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: dbService.getSkills,
  });

  const createMutation = useMutation({
    mutationFn: dbService.addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      resetForm();
      toast({
        title: "Skill Created",
        description: "The skill has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Skill",
        description: error.message || "There was a problem creating the skill.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: dbService.updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      resetForm();
      toast({
        title: "Skill Updated",
        description: "The skill has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Skill",
        description: error.message || "There was a problem updating the skill.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: dbService.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({
        title: "Skill Deleted",
        description: "The skill has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Skill",
        description: error.message || "There was a problem deleting the skill.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentSkill({
      ...currentSkill,
      [e.target.name]: e.target.value
    });
  };

  const handleProficiencyChange = (value: number[]) => {
    setCurrentSkill({
      ...currentSkill,
      proficiency: value[0]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentSkill.id) {
      updateMutation.mutate(currentSkill as any);
    } else {
      createMutation.mutate(currentSkill as any);
    }
  };

  const editSkill = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentSkill({
      name: '',
      category: '',
      proficiency: 80,
      order: 0
    });
    setIsEditing(false);
  };

  // Get unique categories for filtering
  const categories = skills 
    ? Array.from(new Set(skills.map(skill => skill.category)))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Skills Management</h1>
        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Skill
        </Button>
      </div>

      {/* Form */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? "Edit Skill" : "Add New Skill"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-portfolio-gray mb-1 block">Skill Name</label>
              <Input
                name="name"
                value={currentSkill.name}
                onChange={handleInputChange}
                placeholder="React"
                required
                className="bg-portfolio-darkest border-portfolio-dark/60"
              />
            </div>
            <div>
              <label className="text-sm text-portfolio-gray mb-1 block">Category</label>
              <Input
                name="category"
                value={currentSkill.category}
                onChange={handleInputChange}
                placeholder="Frontend"
                required
                className="bg-portfolio-darkest border-portfolio-dark/60"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <label className="text-sm text-portfolio-gray mb-1 block">Proficiency ({currentSkill.proficiency}%)</label>
            </div>
            <Slider
              defaultValue={[currentSkill.proficiency || 80]}
              max={100}
              step={1}
              value={[currentSkill.proficiency || 0]}
              onValueChange={handleProficiencyChange}
              className="py-4"
            />
          </div>
          
          <div>
            <label className="text-sm text-portfolio-gray mb-1 block">Display Order</label>
            <Input
              name="order"
              type="number"
              value={currentSkill.order?.toString()}
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
                isEditing ? 'Update Skill' : 'Create Skill'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Skill List */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-portfolio-blue animate-spin" />
            </div>
          ) : skills && skills.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-portfolio-dark/60">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Proficiency</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-portfolio-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-portfolio-dark/40">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-portfolio-darkest transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{skill.order}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{skill.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">{skill.category}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">
                        <div className="flex items-center">
                          <div className="w-32 bg-portfolio-darkest rounded-full h-2 mr-2">
                            <div 
                              className="bg-portfolio-blue h-2 rounded-full" 
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                          <span>{skill.proficiency}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editSkill(skill)}
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
                                Are you sure you want to delete this skill? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-portfolio-darkest text-white hover:bg-portfolio-dark">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteMutation.mutate(skill.id)}
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
              No skills found. Create your first skill using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsManagement;
