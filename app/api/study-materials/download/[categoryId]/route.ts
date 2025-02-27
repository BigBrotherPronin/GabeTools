import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

// Simplified route handler with correct types
export async function GET(request: NextRequest, context: { params: { categoryId: string } }) {
  const { categoryId } = context.params;
  
  // Validate category ID
  const validCategories = ['structural', 'mechanics', 'construction'];
  if (!validCategories.includes(categoryId)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  
  try {
    const categoryDir = path.join(process.cwd(), 'public', 'study-materials', categoryId);
    
    // Check if directory exists
    if (!fs.existsSync(categoryDir)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Read files in the directory
    const files = fs.readdirSync(categoryDir);
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files in this category' }, { status: 404 });
    }
    
    // Create a zip archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    // Add files to the archive
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      archive.file(filePath, { name: file });
    }
    
    archive.finalize();
    
    // Convert archive to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of archive) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    
    // Create response with appropriate headers
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', `attachment; filename=${categoryId}-materials.zip`);
    
    return response;
  } catch (error) {
    console.error('Error creating zip archive:', error);
    return NextResponse.json({ error: 'Failed to create zip archive' }, { status: 500 });
  }
} 