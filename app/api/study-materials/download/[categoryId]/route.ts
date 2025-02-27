import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const { categoryId } = params;
  
  // Validate category ID - only allow structural-materials
  if (categoryId !== 'structural-materials') {
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
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        archive.file(filePath, { name: file });
      }
    }
    
    // Collect chunks in memory
    const chunks: Buffer[] = [];
    archive.on('data', (chunk) => chunks.push(chunk));
    
    // Return a promise that resolves when the archive is finalized
    return new Promise<NextResponse>((resolve, reject) => {
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const response = new NextResponse(buffer);
        response.headers.set('Content-Type', 'application/zip');
        response.headers.set('Content-Disposition', `attachment; filename=structural-materials.zip`);
        resolve(response);
      });
      
      archive.finalize();
    });
  } catch (error) {
    console.error('Error creating zip archive:', error);
    return NextResponse.json({ error: 'Failed to create zip archive' }, { status: 500 });
  }
} 