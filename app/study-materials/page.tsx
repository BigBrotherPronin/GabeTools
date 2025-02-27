"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider';
import AdminLoginModal from '../../components/AdminLoginModal';

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
      setError(`Error fetching materials: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📑';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📁';
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Study Materials</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-[var(--card-border)] text-[var(--text-secondary)] rounded"
            >
              Back to Home
            </button>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="px-4 py-2 bg-[var(--accent)] text-white rounded"
            >
              Admin
            </button>
          </div>
        </div>
        
        <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-6 shadow-sm">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-secondary)]">Loading study materials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchCategoriesAndFiles}
                className="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.id} className="border border-[var(--card-border)] rounded-lg overflow-hidden">
                  <div className="bg-[var(--card-background-secondary)] p-4">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{category.name}</h2>
                    <p className="text-[var(--text-secondary)]">{category.description}</p>
                  </div>
                  
                  <div className="p-4">
                    {category.files.length === 0 ? (
                      <p className="text-center py-4 text-[var(--text-tertiary)]">
                        No files available in this category
                      </p>
                    ) : (
                      <ul className="divide-y divide-[var(--card-border)]">
                        {category.files.map((file) => (
                          <li key={file.name} className="py-3 flex items-center">
                            <span className="mr-2">{getFileIcon(file.type)}</span>
                            <span className="flex-grow text-[var(--text-primary)]">{file.name}</span>
                            <span className="text-sm text-[var(--text-tertiary)]">{formatFileSize(file.size)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="bg-[var(--card-background-secondary)] p-4 flex justify-end">
                    <button
                      onClick={() => window.location.href = `/api/study-materials/download/${category.id}`}
                      disabled={category.files.length === 0}
                      className={`px-4 py-2 rounded ${
                        category.files.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[var(--accent)] text-white'
                      }`}
                    >
                      DOWNLOAD ZIP
                    </button>
                  </div>
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
          <div className="mt-8 p-6 bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Admin Information</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              To add or update study materials, you need to manually add files to the following directories in the codebase:
            </p>
            <ul className="list-disc pl-5 mb-4 text-[var(--text-secondary)]">
              <li><code>/public/study-materials/structural/</code> - For structural engineering materials</li>
              <li><code>/public/study-materials/mechanics/</code> - For mechanics of materials</li>
              <li><code>/public/study-materials/construction/</code> - For construction methods</li>
            </ul>
            <p className="text-[var(--text-secondary)]">
              After adding files, redeploy the application for changes to take effect.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 