"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedFile, setSelectedFile] = useState<{categoryId: string, fileName: string} | null>(null);
  
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

  const handleDownload = (categoryId: string, fileName: string) => {
    setSelectedFile({categoryId, fileName});
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple hardcoded password - replace with your desired password
    if (password === 'engineering123') {
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      
      // Trigger download
      if (selectedFile) {
        window.location.href = `/api/study-materials/download/${selectedFile.categoryId}?file=${encodeURIComponent(selectedFile.fileName)}`;
      }
    } else {
      setPasswordError('Incorrect password');
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Study Materials</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-[var(--card-border)] text-[var(--text-secondary)] rounded"
          >
            Back to Home
          </button>
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
                          <li key={file.name} className="py-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="mr-2">{getFileIcon(file.type)}</span>
                              <span className="flex-grow text-[var(--text-primary)]">{file.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-[var(--text-tertiary)] mr-4">{formatFileSize(file.size)}</span>
                              <button
                                onClick={() => handleDownload(category.id, file.name)}
                                className="px-3 py-1 bg-[var(--accent)] text-white rounded text-sm"
                              >
                                Download
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--card-background)] p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Enter Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-[var(--text-secondary)] mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-[var(--card-border)] rounded bg-[var(--input-background)] text-[var(--text-primary)]"
                    placeholder="Enter password to download"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                      setPasswordError('');
                    }}
                    className="px-4 py-2 border border-[var(--card-border)] text-[var(--text-secondary)] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--accent)] text-white rounded"
                  >
                    Download
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 