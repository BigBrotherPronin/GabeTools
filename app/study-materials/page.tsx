"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider';
import AdminLoginModal from '../../components/AdminLoginModal';
import AdminInterface from '../../components/AdminInterface';

interface File {
  name: string;
  size: number;
  type: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  files: File[];
}

export default function StudyMaterialsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch categories and files on page load
  useEffect(() => {
    fetchCategoriesAndFiles();
  }, []);
  
  const fetchCategoriesAndFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/study-materials');
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.categories) {
        throw new Error('Invalid response format: missing categories');
      }
      
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError(error instanceof Error ? error.message : 'Failed to load study materials');
      // Set empty categories to prevent mapping errors
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async (categoryId: string) => {
    window.location.href = `/api/study-materials/download/${categoryId}`;
  };
  
  return (
    <div className="min-h-screen engineering-grid">
      <div className="w-full max-w-4xl mx-auto p-4">
        <button
          onClick={() => router.push('/')}
          className="mb-8 px-6 py-3 minimal-button tracking-wider transition-all duration-200"
        >
          ← BACK
        </button>
        
        <div className="minimal-card p-8">
          <div className="flex justify-between items-center mb-8 border-b border-[var(--card-border)] pb-4">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-widest">
              STUDY MATERIALS
            </h1>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="px-4 py-2 minimal-button tracking-wider"
            >
              ADMIN
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              Loading materials...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
              <button 
                onClick={fetchCategoriesAndFiles}
                className="block mx-auto mt-4 px-4 py-2 bg-[var(--accent)] text-white"
              >
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No study materials available.
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.id} className="p-6 border border-[var(--card-border)] bg-[var(--card-bg)]">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    {category.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    {category.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2">
                      CONTENTS:
                    </h4>
                    {!category.files || category.files.length === 0 ? (
                      <p className="text-[var(--text-tertiary)] italic">No files available yet</p>
                    ) : (
                      <ul className="list-disc pl-5 text-[var(--text-secondary)]">
                        {category.files.map((file) => (
                          <li key={file.name}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDownload(category.id)}
                    disabled={!category.files || category.files.length === 0}
                    className={`px-4 py-2 ${
                      !category.files || category.files.length === 0 
                        ? 'bg-[var(--input-bg)] text-[var(--text-tertiary)] cursor-not-allowed' 
                        : 'bg-[var(--accent)] text-white hover:opacity-90'
                    } transition-all duration-200`}
                  >
                    DOWNLOAD ZIP
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showAdminLogin && (
          <AdminLoginModal 
            onClose={() => setShowAdminLogin(false)}
            onLogin={() => setIsAdmin(true)}
          />
        )}
        
        {isAdmin && (
          <AdminInterface 
            categories={categories} 
            onUpdate={fetchCategoriesAndFiles} 
          />
        )}
      </div>
    </div>
  );
} 