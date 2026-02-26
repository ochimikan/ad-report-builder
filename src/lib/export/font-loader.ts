import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFFont } from 'pdf-lib';

let cachedFontBytes: ArrayBuffer | null = null;

export async function loadJapaneseFont(pdfDoc: PDFDocument): Promise<PDFFont> {
  pdfDoc.registerFontkit(fontkit);

  if (!cachedFontBytes) {
    const response = await fetch('/fonts/NotoSansJP-Regular.ttf');
    cachedFontBytes = await response.arrayBuffer();
  }

  return pdfDoc.embedFont(cachedFontBytes);
}
