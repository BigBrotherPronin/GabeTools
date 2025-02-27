import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const studyMaterialsDir = path.join(process.cwd(), 'public', 'study-materials');
    
    // Define your three categories
    const categories = [
      {
        id: 'structural',
        name: 'Structural Engineering',
        description: 'Fundamentals of structural analysis, design codes, and practice problems.',
        files: [] as Array<{name: string; size: number; type: string}>
      },
      {
        id: 'mechanics',
        name: 'Mechanics of Materials',
        description: 'Resources covering stress, strain, deformation, and material properties.',
        files: [] as Array<{name: string; size: number; type: string}>
      },
      {
        id: 'construction',
        name: 'Construction Methods',
        description: 'Documents on construction techniques, management, and standards.',
        files: [] as Array<{name: string; size: number; type: string}>
      }
    ];
    
    // Read files from each category directory
    for (const category of categories) {
      const categoryDir = path.join(studyMaterialsDir, category.id);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Read files in the directory
      const files = fs.readdirSync(categoryDir);
      
      category.files = files.map(fileName => {
        const filePath = path.join(categoryDir, fileName);
        const stats = fs.statSync(filePath);
        
        return {
          name: fileName,
          size: stats.size,
          type: path.extname(fileName).substring(1)
        };
      });
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