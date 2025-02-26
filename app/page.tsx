"use client";

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useTheme } from '../components/ThemeProvider';

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto mt-20">
            {/* Header */}
            <div className="text-center mb-20">
              <h1 className="text-6xl font-bold text-[var(--text-primary)] tracking-tight">
                GABE KAFKA
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mt-2 tracking-wider">
                STRUCTURAL ENGINEER IN TRAINING
              </p>
            </div>
            
            {/* Links */}
            <div className="flex justify-center space-x-12 mb-24">
              <a 
                href="/resume" 
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] tracking-wider text-lg border-b border-[var(--text-tertiary)] hover:border-[var(--text-primary)] pb-1 transition-all duration-200"
              >
                RESUME
              </a>
              <a 
                href="#" 
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] tracking-wider text-lg border-b border-[var(--text-tertiary)] hover:border-[var(--text-primary)] pb-1 transition-all duration-200"
              >
                PORTFOLIO
              </a>
              <a 
                href="#" 
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] tracking-wider text-lg border-b border-[var(--text-tertiary)] hover:border-[var(--text-primary)] pb-1 transition-all duration-200"
              >
                GITHUB
              </a>
            </div>

            {/* Tools Section */}
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 tracking-wider text-center">
                MY TOOLS
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* W Beams Tool */}
                <button
                  onClick={() => router.push('/shapes')}
                  className="minimal-card p-6 group"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 tracking-wider">
                    W MEMBER Terminal
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm tracking-wider mb-4">
                    W Member AISC Values
                  </p>
                  <div className="text-[var(--accent)] text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300">
                    EXPLORE →
                  </div>
                </button>
                
                {/* Placeholder for future tools */}
                {/*
                <div className="minimal-card p-6 opacity-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-wider">
                    COMING SOON
                  </h3>
                  <p className="text-gray-600 text-sm tracking-wider">
                    More engineering tools in development
                  </p>
                </div>
                */}
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-[var(--text-tertiary)]">
              <p>© 2024 GABE KAFKA</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
} 