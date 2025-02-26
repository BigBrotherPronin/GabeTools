"use client";

import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider';

export default function ResumePage() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen engineering-grid">
      <div className="w-full max-w-4xl mx-auto p-4">
        <button
          onClick={() => router.push('/')}
          className="mb-8 px-6 py-3 minimal-button tracking-wider transition-all duration-200"
        >
          ← BACK
        </button>
        
        <div className="minimal-card p-8 mb-8">
          <div className="flex justify-between items-center mb-8 border-b border-[var(--card-border)] pb-4">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-widest">
              RESUME
            </h1>
            <a 
              href="/gabriel_kafka_resume.pdf" 
              download
              className="px-6 py-3 bg-[var(--accent)] text-white tracking-wider transition-all duration-200 hover:opacity-90"
            >
              DOWNLOAD PDF
            </a>
          </div>
          
          <div className="text-[var(--text-primary)] space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">GABRIEL KAFKA-GIBBONS, EIT</h2>
              <p className="text-[var(--text-secondary)]">Structural Engineer in Training</p>
              <p className="mt-2">gabe@getcoffee.io | +16175045419</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold border-b border-[var(--card-border)] pb-2 mb-3">EDUCATION</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold">Worcester Polytechnic Institute</p>
                  <p>BSc Civil Engineering, Structural Focus</p>
                  <p className="text-[var(--text-secondary)]">2018 - 2022</p>
                </div>
                <div>
                  <p className="font-bold">New York University</p>
                  <p>MSc Civil Engineering, Structural Focus</p>
                  <p className="text-[var(--text-secondary)]">2024 - 2025</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold border-b border-[var(--card-border)] pb-2 mb-3">CAREER</h3>
              
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="font-bold">Dan Bonardi Consulting Engineers</p>
                  <p className="text-[var(--text-secondary)]">2022-2024</p>
                </div>
                <p className="italic">Structural Engineer in Training</p>
                <p>I worked under Dan Bondardi as a Junior Structural Designer</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Structural modeling</li>
                  <li>Gravity/Lateral Design of Residential Wood Structures</li>
                  <li>Gravity Design on Steel Structures</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="font-bold">Kibler AE</p>
                  <p className="text-[var(--text-secondary)]">2024</p>
                </div>
                <p className="italic">Structural Design Consultant</p>
                <p>I took on Timber and Steel structural projects as an external structural consultant and produced the required deliverables, including CAD.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Wood Design, Gravity/Lateral</li>
                  <li>Steel design, Gravity/Lateral</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="font-bold">Simpson Gumpertz & Heger</p>
                  <p className="text-[var(--text-secondary)]">2021</p>
                </div>
                <p className="italic">Building Technologies Intern</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Designed and modeled elements in Bluebeam, Revit, AutoCAD, and Rhino7.</li>
                  <li>Oversaw foundation quality control for waterproofing.</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="font-bold">SMMA</p>
                  <p className="text-[var(--text-secondary)]">2019</p>
                </div>
                <p className="italic">Sustainable Design Intern</p>
                <p>SMMA is an integrated multidisciplinary A&E firm outside of Boston.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Model energy consumption of large scale projects with Revit, Tally, and eQuest</li>
                  <li>Analyze and submit projects for LEED accreditation</li>
                  <li>Produce sustainable design plans for the intern group project redesigning a K-8 school</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold border-b border-[var(--card-border)] pb-2 mb-3">SOFTWARE</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-bold">CAD/BIM</p>
                  <p>AutoCAD: 3 | Revit: 3 | Lisp: 1 | Rhino7: 2 | LISP ACAD: 2</p>
                </div>
                <div>
                  <p className="font-bold">STRUCTURAL</p>
                  <p>RISA 3d: 3 | RISA Floor: 3 | SP Slab: 3 | SP Column: 3 | RAM: 3 | ETABS: 3</p>
                </div>
                <div>
                  <p className="font-bold">GENERAL</p>
                  <p>Excel: 3 | Bluebeam: 3 | Python: 2</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2">1-3 Ability-Level Metric: 1 = acceptable, 2 = strong, 3 = very strong</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold border-b border-[var(--card-border)] pb-2 mb-3">ORGANIZATIONS</h3>
              <ul className="space-y-2">
                <li><span className="font-bold">Engineers Without Borders</span> - University Chair Tanzania Project Structural Lead, 2023-Present</li>
                <li><span className="font-bold">Cambridge Camping STEM Instructor</span> - Instructor, Curriculum Creator 2023, Cambridge, MA</li>
                <li><span className="font-bold">ASCE Member</span>, 2024-Present</li>
                <li><span className="font-bold">Ski Club President</span> - President, Treasurer 2020-22, Worcester Polytechnic Institute, MA</li>
                <li><span className="font-bold">Varsity Rower</span> - 1st Boat Oarsman 2018-2021, Worcester Polytechnic Institute, MA</li>
              </ul>
            </div>
            
            <div className="text-center text-[var(--text-secondary)]">
              <p>REFERENCES AVAILABLE UPON REQUEST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 