import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const categoryId = formData.get('categoryId') as string;
    
    // Validate category ID
    const validCategories = ['structural', 'mechanics', 'construction'];
    if (!validCategories.includes(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    const categoryDir = path.join(process.cwd(), 'public', 'study-materials', categoryId);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    // Handle file uploads (multiple files)
    const files = formData.getAll('files');
    
    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }
      
      const fileName = file.name;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const targetPath = path.join(categoryDir, fileName);
      
      // Write file to target directory
      await writeFile(targetPath, fileBuffer);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
} 