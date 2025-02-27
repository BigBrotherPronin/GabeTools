"use client";

import { useState } from 'react';

export interface File {
  name: string;
  size: number;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  files: File[];
}

export interface AdminInterfaceProps {
  categories: Category[];
  onUpdate: () => void;
}

export default function AdminInterface({ categories, onUpdate }: AdminInterfaceProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setMessage({ text: '', type: '' });
    
    const formData = new FormData();
    formData.append('categoryId', categoryId);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      const response = await fetch('/api/study-materials/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setMessage({ text: 'Files uploaded successfully', type: 'success' });
        onUpdate();
      } else {
        const error = await response.json();
        setMessage({ text: error.error || 'Failed to upload files', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error uploading files', type: 'error' });
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };
  
  const handleDeleteFile = async (categoryId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }
    
    setMessage({ text: '', type: '' });
    
    try {
      const response = await fetch('/api/study-materials/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId, fileName }),
      });
      
      if (response.ok) {
        setMessage({ text: 'File deleted successfully', type: 'success' });
        onUpdate();
      } else {
        const error = await response.json();
        setMessage({ text: error.error || 'Failed to delete file', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error deleting file', type: 'error' });
      console.error('Error deleting file:', error);
    }
  };
  
  const category = categories.find(c => c.id === activeCategory);
  
  return (
    <div className="minimal-card p-8 mb-8">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-widest border-b border-[var(--card-border)] pb-4 mb-8">
        ADMIN PANEL
      </h2>
      
      {message.text && (
        <div className={`p-4 mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded`}>
          {message.text}
        </div>
      )}
      
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--input-bg)] text-[var(--text-secondary)]'
            } transition-colors`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {category && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{category.name}</h3>
          
          {/* File Upload */}
          <div className="mb-6">
            <h4 className="text-sm font-bold mb-2 text-[var(--text-secondary)]">UPLOAD FILES</h4>
            <label className="block w-full p-4 border-2 border-dashed border-[var(--card-border)] text-center cursor-pointer hover:border-[var(--text-secondary)] transition-colors">
              <span className="block mb-2 text-[var(--text-secondary)]">Drop files here or click to browse</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, category.id)}
                disabled={uploading}
              />
              {uploading && <span className="text-[var(--text-tertiary)]">Uploading...</span>}
            </label>
          </div>
          
          {/* File Management */}
          <div>
            <h4 className="text-sm font-bold mb-2 text-[var(--text-secondary)]">MANAGE FILES</h4>
            <div className="border border-[var(--card-border)] rounded">
              {category.files.length === 0 ? (
                <p className="p-4 text-center text-[var(--text-tertiary)]">
                  No files in this category
                </p>
              ) : (
                <ul className="divide-y divide-[var(--card-border)]">
                  {category.files.map((file) => (
                    <li key={file.name} className="flex items-center justify-between p-4 text-[var(--text-primary)]">
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleDeleteFile(category.id, file.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 