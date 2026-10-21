import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import MasonryGrid from "./components/MasonryGrid";
import ProjectModal from "./components/ProjectModal";
import AdminModal from "./components/AdminModal";
import ContactModal from "./components/ContactModal";
import ProjectCalculator from "./components/ProjectCalculator";
import Footer from "./components/Footer";
import { INITIAL_PROJECTS } from "./data/initialProjects";
import { supabase } from "./lib/supabaseClient";
import {
  fetchProjects,
  createProject,
  deleteProject,
  importProjects,
  signIn,
  signOut,
} from "./lib/projectsApi";

export default function App() {
  // Theme Switching State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("worksphere_theme") || "dark";
  });

  // Apply theme to <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("worksphere_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("worksphere_theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // -------------------------------------------------------------------------
  // Studio login (Supabase). Only invited team members can sign in.
  // -------------------------------------------------------------------------
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const isAdmin = !!session;

  const handleSignIn = async (email, password) => {
    // Returns null on success, or an error message to show on screen
    return await signIn(email, password);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // -------------------------------------------------------------------------
  // Projects: loaded from the database for every visitor.
  // If the database is empty (or unreachable) we show the sample projects.
  // -------------------------------------------------------------------------
  const [projects, setProjects] = useState([]);
  const [usingSamples, setUsingSamples] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchProjects()
      .then((rows) => {
        if (cancelled) return;
        if (rows.length > 0) {
          setProjects(rows);
          setUsingSamples(false);
        } else {
          setProjects(INITIAL_PROJECTS);
          setUsingSamples(true);
        }
      })
      .catch((err) => {
        console.error("Could not load projects from the database:", err);
        if (cancelled) return;
        setProjects(INITIAL_PROJECTS);
        setUsingSamples(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingProjects(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtering States
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [activeProject, setActiveProject] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactProject, setContactProject] = useState(null);
  const [calculatorBrief, setCalculatorBrief] = useState("");

  // Filtered Projects computation
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (
        selectedCategory !== "All Work" &&
        project.category !== selectedCategory
      ) {
        return false;
      }

      // Tool filter
      if (selectedTool) {
        const hasTool = project.tools?.some(
          (t) => t.toLowerCase() === selectedTool.toLowerCase(),
        );
        if (!hasTool) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchClient = project.client?.toLowerCase().includes(q);
        const matchDesc = project.description?.toLowerCase().includes(q);
        const matchTools = project.tools?.some((t) =>
          t.toLowerCase().includes(q),
        );
        const matchTags = project.tags?.some((t) =>
          t.toLowerCase().includes(q),
        );
        if (
          !matchTitle &&
          !matchClient &&
          !matchDesc &&
          !matchTools &&
          !matchTags
        ) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedCategory, selectedTool, searchQuery]);

  // -------------------------------------------------------------------------
  // Project management handlers (used by Studio Admin; they throw on failure
  // so the admin window can show the error message)
  // -------------------------------------------------------------------------
  const handleAddProject = async (fields, file) => {
    const saved = await createProject(fields, file);
    setProjects((prev) => (usingSamples ? [saved] : [saved, ...prev]));
    setUsingSamples(false);
  };

  const handleDeleteProject = async (project) => {
    await deleteProject(project);
    const remaining = projects.filter((p) => p.id !== project.id);
    if (remaining.length === 0) {
      setProjects(INITIAL_PROJECTS);
      setUsingSamples(true);
    } else {
      setProjects(remaining);
    }
    if (activeProject?.id === project.id) {
      setActiveProject(null);
    }
  };

  const handleImportProjects = async (imported) => {
    const saved = await importProjects(imported);
    setProjects((prev) => (usingSamples ? saved : [...saved, ...prev]));
    setUsingSamples(false);
    return saved.length;
  };

  const handleOpenContactWithProject = (project) => {
    setCalculatorBrief("");
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
        projectCount={usingSamples ? 0 : projects.length}
        isAdmin={isAdmin}
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
        {loadingProjects ? (
          <div className="py-24 text-center text-sm font-mono text-gray-700 dark:text-gray-300">
            Loading designs…
          </div>
        ) : (
          <MasonryGrid
            projects={filteredProjects}
            onSelectProject={setActiveProject}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {/* Interactive Scope & Cost Estimator */}
        <div id="calculator">
          <ProjectCalculator onLaunchInquiry={handleLaunchCalculatorInquiry} />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContact={() => {
          setContactProject(null);
          setCalculatorBrief("");
          setIsContactOpen(true);
        }}
      />

      {/* Project Lightbox Modal (Uncropped Aspect Ratio + Live Interactive Embed) */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onOpenContactWithProject={handleOpenContactWithProject}
      />

      {/* Studio Admin Management Modal (login required) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        usingSamples={usingSamples}
        session={session}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onImportProjects={handleImportProjects}
      />

      {/* Client Commission Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setCalculatorBrief("");
        }}
        preselectedProject={contactProject}
        calculatorBrief={calculatorBrief}
      />
    </div>
  );
}
