import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import MasonryGrid from './components/MasonryGrid';
import ProjectModal from './components/ProjectModal';
import AdminModal from './components/AdminModal';
import ContactModal from './components/ContactModal';
import ProjectCalculator from './components/ProjectCalculator';
import Footer from './components/Footer';
import { INITIAL_PROJECTS } from './data/initialProjects';

export default function App() {
  // Theme Switching State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('worksphere_theme') || 'dark';
  });

  // Apply theme to <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('worksphere_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('worksphere_theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Projects State (Persisted in LocalStorage)
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('worksphere_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load projects from storage:', e);
    }
    return INITIAL_PROJECTS;
  });

  // Save projects to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('worksphere_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects:', e);
    }
  }, [projects]);

  // Filtering States
  const [selectedCategory, setSelectedCategory] = useState('All Work');
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeProject, setActiveProject] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactProject, setContactProject] = useState(null);
  const [calculatorBrief, setCalculatorBrief] = useState('');

  // Filtered Projects computation
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (selectedCategory !== 'All Work' && project.category !== selectedCategory) {
        return false;
      }

      // Tool filter
      if (selectedTool) {
        const hasTool = project.tools?.some(
          (t) => t.toLowerCase() === selectedTool.toLowerCase()
        );
        if (!hasTool) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchClient = project.client?.toLowerCase().includes(q);
        const matchDesc = project.description?.toLowerCase().includes(q);
        const matchTools = project.tools?.some((t) => t.toLowerCase().includes(q));
        const matchTags = project.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchClient && !matchDesc && !matchTools && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedCategory, selectedTool, searchQuery]);

  // Project management handlers
  const handleAddProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
  };

  const handleResetProjects = () => {
    if (window.confirm('Reset portfolio back to original curated showcase projects?')) {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('worksphere_projects', JSON.stringify(INITIAL_PROJECTS));
    }
  };

  const handleImportProjects = (imported) => {
    setProjects(imported);
    localStorage.setItem('worksphere_projects', JSON.stringify(imported));
  };

  const handleOpenContactWithProject = (project) => {
    setCalculatorBrief('');
    setContactProject(project);
    setIsContactOpen(true);
  };

  const handleLaunchCalculatorInquiry = (brief) => {
    setContactProject(null);
    setCalculatorBrief(brief);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContact={() => {
          setContactProject(null);
          setIsContactOpen(true);
        }}
        projectCount={projects.length}
      />

      {/* Hero Section with Live Tool Filter and Aspect Ratio fidelity guarantee */}
      <Hero
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        onOpenContact={() => {
          setContactProject(null);
          setIsContactOpen(true);
        }}
      />

      {/* Main Content Showcase */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Category & Search Filter Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={filteredProjects.length}
          activeToolFilter={selectedTool}
          onClearToolFilter={() => setSelectedTool(null)}
        />

        {/* Dynamic Aspect Ratio Masonry Grid */}
        <MasonryGrid
          projects={filteredProjects}
          onSelectProject={setActiveProject}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Interactive Scope & Cost Estimator */}
        <div id="calculator">
          <ProjectCalculator
            onLaunchInquiry={handleLaunchCalculatorInquiry}
          />
        </div>

      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContact={() => {
          setContactProject(null);
          setCalculatorBrief('');
          setIsContactOpen(true);
        }}
      />

      {/* Project Lightbox Modal (Uncropped Aspect Ratio + Live Interactive Embed) */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onOpenContactWithProject={handleOpenContactWithProject}
      />

      {/* Studio Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onResetProjects={handleResetProjects}
        onImportProjects={handleImportProjects}
      />

      {/* Client Commission Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setCalculatorBrief('');
        }}
        preselectedProject={contactProject}
        calculatorBrief={calculatorBrief}
      />

    </div>
  );
}
