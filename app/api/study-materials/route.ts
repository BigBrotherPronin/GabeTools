import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the file interface
interface FileInfo {
  name: string;
  size: number;
  type: string;
}

// Define the category interface
interface Category {
  id: string;
  name: string;
  description: string;
  files: FileInfo[];
}

export async function GET() {
  try {
    // Define your three categories with empty files arrays by default
    const categories: Category[] = [
      {
        id: 'structural',
        name: 'Structural Engineering',
        description: 'Fundamentals of structural analysis, design codes, and practice problems.',
        files: []
      },
      {
        id: 'mechanics',
        name: 'Mechanics of Materials',
        description: 'Resources covering stress, strain, deformation, and material properties.',
        files: []
      },
      {
        id: 'construction',
        name: 'Construction Methods',
        description: 'Documents on construction techniques, management, and standards.',
        files: []
      }
    ];
    
    // In Vercel's serverless environment, we can't reliably create directories
    // So we'll try to read files if the directories exist, but won't try to create them
    const studyMaterialsDir = path.join(process.cwd(), 'public', 'study-materials');
    
    // Only try to read files if the base directory exists
    if (fs.existsSync(studyMaterialsDir)) {
      // Read files from each category directory
      for (const category of categories) {
        const categoryDir = path.join(studyMaterialsDir, category.id);
        
        // Only try to read files if the category directory exists
        if (fs.existsSync(categoryDir)) {
          try {
            // Read files in the directory
            const files = fs.readdirSync(categoryDir);
            
            category.files = files.map(fileName => {
              try {
                const filePath = path.join(categoryDir, fileName);
                const stats = fs.statSync(filePath);
                
                return {
                  name: fileName,
                  size: stats.size,
                  type: path.extname(fileName).substring(1)
                };
              } catch (fileError) {
                console.error(`Error reading file ${fileName}:`, fileError);
                return {
                  name: fileName,
                  size: 0,
                  type: path.extname(fileName).substring(1)
                };
              }
            });
          } catch (dirError) {
            console.error(`Error reading directory ${categoryDir}:`, dirError);
            // Continue with empty files array
          }
        }
      }
    }
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error reading study materials:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch study materials', 
        categories: [
          {
            id: 'structural',
            name: 'Structural Engineering',
            description: 'Fundamentals of structural analysis, design codes, and practice problems.',
            files: []
          },
          {
            id: 'mechanics',
            name: 'Mechanics of Materials',
            description: 'Resources covering stress, strain, deformation, and material properties.',
            files: []
          },
          {
            id: 'construction',
            name: 'Construction Methods',
            description: 'Documents on construction techniques, management, and standards.',
            files: []
          }
        ]
      },
      { status: 200 }  // Return 200 even on error, with empty categories
    );
  }
} 