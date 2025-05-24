
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import ProfileManagement from "./pages/admin/ProfileManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import ExperienceManagement from "./pages/admin/ExperienceManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import SkillsManagement from "./pages/admin/SkillsManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";
import { initializeSupabase } from "./lib/initSupabase";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const setupSupabase = async () => {
      try {
        setIsInitializing(true);
        // Always attempt to initialize in development or production
        const result = await initializeSupabase();
        
        if (!result.success) {
          console.error('Failed to initialize Supabase:', result.error);
          toast({
            title: "Database Setup Error",
            description: result.error || "There was a problem setting up the database. Check console for details.",
            variant: "destructive",
          });
        } else {
          console.log('Supabase initialization complete:', result);
          if (result.tablesCreated) {
            toast({
              title: "Database Setup Complete",
              description: "Your portfolio database has been successfully configured.",
            });
          }
        }
      } catch (err) {
        console.error("Failed to initialize Supabase:", err);
        toast({
          title: "Database Setup Error",
          description: err instanceof Error ? err.message : "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    setupSupabase();
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<ProfileManagement />} />
              <Route path="services" element={<ServicesManagement />} />
              <Route path="skills" element={<SkillsManagement />} />
              <Route path="portfolio" element={<ProjectsManagement />} />
              <Route path="experience" element={<ExperienceManagement />} />
              <Route path="testimonials" element={<TestimonialsManagement />} />
              <Route path="messages" element={<MessagesManagement />} />
              <Route path="settings" element={<SettingsManagement />} />
              <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
