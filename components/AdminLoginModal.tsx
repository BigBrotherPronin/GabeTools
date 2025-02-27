"use client";

import { useState } from 'react';

export interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

export default function AdminLoginModal({ onClose, onLogin }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple hardcoded password - replace with your desired password
    if (password === 'engineering123') {
      onLogin();
      onClose();
    } else {
      setError('Incorrect password');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] p-8 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Admin Access</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-primary)] rounded"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--card-border)] text-[var(--text-secondary)] rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent)] text-white rounded"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 