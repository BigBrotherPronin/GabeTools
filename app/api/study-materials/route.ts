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
    // Define your three categories
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
    
    // Read files from the public directory
    const studyMaterialsDir = path.join(process.cwd(), 'public', 'study-materials');
    
    // Only try to read if the directory exists
    if (fs.existsSync(studyMaterialsDir)) {
      for (const category of categories) {
        const categoryDir = path.join(studyMaterialsDir, category.id);
        
        if (fs.existsSync(categoryDir)) {
          try {
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
          }
        }
      }
    }
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error reading study materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study materials' },
      { status: 500 }
    );
  }
} 