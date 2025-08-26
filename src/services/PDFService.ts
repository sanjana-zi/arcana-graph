import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFContent {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
  pages: number;
  info: any;
}

export class PDFService {
  static async parsePDF(file: File): Promise<PDFContent> {
    try {
      return await this.parsePDFInBrowser(file);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      // Return fallback content instead of throwing
      return this.createFallbackContent(file);
    }
  }
  
  private static async parsePDFInBrowser(file: File): Promise<PDFContent> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    try {
      // Load PDF document
      const pdf = await pdfjsLib.getDocument(uint8Array).promise;
      
      // Extract metadata
      const metadata = await pdf.getMetadata().catch(() => ({ info: {}, metadata: null }));
      const info = metadata.info as any;
      
      // Extract text from all pages
      let fullText = '';
      const numPages = pdf.numPages;
      
      for (let pageNum = 1; pageNum <= Math.min(numPages, 10); pageNum++) { // Limit to first 10 pages for performance
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .filter((item: any) => item.str)
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        } catch (pageError) {
          console.warn(`Error processing page ${pageNum}:`, pageError);
        }
      }
      
      return {
        text: fullText || 'No text content extracted from PDF',
        metadata: {
          title: info?.Title || this.extractTitleFromFilename(file.name),
          author: info?.Author || 'Unknown',
          subject: info?.Subject,
          creator: info?.Creator,
          producer: info?.Producer,
          creationDate: info?.CreationDate ? new Date(info.CreationDate) : new Date(),
          modificationDate: info?.ModDate ? new Date(info.ModDate) : undefined,
        },
        pages: numPages,
        info: {
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified),
          pdfVersion: info?.PDFFormatVersion
        }
      };
    } catch (pdfError) {
      console.warn('PDF.js parsing failed, using fallback:', pdfError);
      return this.createFallbackContent(file);
    }
  }
  
  private static createFallbackContent(file: File): PDFContent {
    return {
      text: `This PDF file (${file.name}) could not be parsed automatically. The file appears to be a valid PDF but may contain images, complex formatting, or be password protected. Please ensure the PDF contains searchable text for better analysis.`,
      metadata: {
        title: this.extractTitleFromFilename(file.name),
        author: 'Unknown',
        creationDate: new Date(),
      },
      pages: Math.ceil(file.size / 50000), // Rough estimate
      info: {
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        fallback: true
      }
    };
  }
  
  private static async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    // This is a simplified text extraction
    // In a real implementation, you'd use pdf.js WebWorker or similar
    
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // Look for text content between common PDF text markers
    const textDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
    const pdfString = textDecoder.decode(uint8Array);
    
    // Extract text between BT and ET markers (simplified)
    const textMatches = pdfString.match(/BT\s*(.*?)\s*ET/gs);
    if (textMatches) {
      textMatches.forEach(match => {
        // Clean up PDF text encoding
        const cleanText = match
          .replace(/BT|ET/g, '')
          .replace(/Tj|TJ|Tm|Td|TD/g, ' ')
          .replace(/\[\((.*?)\)\]/g, '$1')
          .replace(/\((.*?)\)/g, '$1')
          .replace(/[<>]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (cleanText.length > 3) {
          text += cleanText + ' ';
        }
      });
    }
    
    // If no text found through markers, try to extract readable text
    if (!text.trim()) {
      text = this.extractReadableText(pdfString);
    }
    
    // If still no text, provide a fallback
    if (!text.trim()) {
      text = "This PDF contains images or encoded text that requires advanced parsing. " +
             "The document appears to be a research paper based on its structure. " +
             "For full text analysis, please ensure the PDF contains searchable text.";
    }
    
    return text.trim();
  }
  
  private static extractReadableText(pdfString: string): string {
    // Extract any readable ASCII text from the PDF
    const readableText = pdfString
      .replace(/[^\x20-\x7E\n\r]/g, ' ') // Keep only printable ASCII
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter(word => word.length > 2 && /[a-zA-Z]/.test(word))
      .join(' ');
    
    return readableText;
  }
  
  private static extractTitleFromFilename(filename: string): string {
    return filename
      .replace(/\.pdf$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  static async downloadPDFFromURL(url: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF from URL');
    }
  }
  
  static validatePDF(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }
  
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}