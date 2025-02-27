import { NextRequest, NextResponse } from 'next/server';

// Simple route that redirects to the file
export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const categoryId = params.categoryId;
  
  // Validate category ID - only allow structural-materials
  if (categoryId !== 'structural-materials') {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  
  // Get the filename from the query string
  const url = new URL(request.url);
  const filename = url.searchParams.get('file');
  
  if (!filename) {
    return NextResponse.json({ error: 'No file specified' }, { status: 400 });
  }
  
  // Create a redirect to the static file
  const fileUrl = `/study-materials/${categoryId}/${filename}`;
  
  // Return a redirect response
  return NextResponse.redirect(new URL(fileUrl, request.url));
} 