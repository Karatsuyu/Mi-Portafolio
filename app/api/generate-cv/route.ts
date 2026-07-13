import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Ruta al PDF estático en la carpeta public
    const pdfPath = join(process.cwd(), 'public', 'cv', 'CV-Julian-Gutierrez-Tabares.pdf');
    
    // Leer el archivo PDF
    const pdfBuffer = await readFile(pdfPath);

    // Retornar el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="CV-Julian-Gutierrez-Tabares.pdf"',
      },
    });
  } catch (error) {
    console.error('Error al leer el PDF:', error);
    
    // Si el PDF no existe, retornar un mensaje claro
    return NextResponse.json(
      { 
        error: 'El archivo CV aún no está disponible',
        message: 'Por favor, coloca el archivo CV-Julian-Gutierrez-Tabares.pdf en la carpeta public/cv/'
      },
      { status: 404 }
    );
  }
}
