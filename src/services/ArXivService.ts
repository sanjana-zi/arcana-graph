// ArXiv API service for fetching research papers
export interface ArXivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  updated: string;
  categories: string[];
  pdfUrl: string;
  link: string;
}

export class ArXivService {
  private static readonly BASE_URL = 'https://api.allorigins.win/raw?url=http://export.arxiv.org/api/query';
  
  static async searchPapers(query: string, maxResults: number = 10): Promise<ArXivPaper[]> {
    try {
      const searchQuery = encodeURIComponent(query);
      const url = `${this.BASE_URL}?search_query=${searchQuery}&start=0&max_results=${maxResults}`;
      
      const response = await fetch(url);
      const xmlText = await response.text();
      
      return this.parseArXivXML(xmlText);
    } catch (error) {
      console.error('Error fetching from ArXiv:', error);
      throw new Error('Failed to fetch papers from ArXiv');
    }
  }
  
  static async getPaperById(arxivId: string): Promise<ArXivPaper | null> {
    try {
      const url = `${this.BASE_URL}?id_list=${arxivId}`;
      const response = await fetch(url);
      const xmlText = await response.text();
      
      const papers = this.parseArXivXML(xmlText);
      return papers.length > 0 ? papers[0] : null;
    } catch (error) {
      console.error('Error fetching paper by ID:', error);
      return null;
    }
  }
  
  private static parseArXivXML(xmlText: string): ArXivPaper[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    
    const papers: ArXivPaper[] = [];
    
    entries.forEach(entry => {
      const id = entry.querySelector('id')?.textContent?.split('/').pop() || '';
      const title = entry.querySelector('title')?.textContent?.trim() || '';
      const abstract = entry.querySelector('summary')?.textContent?.trim() || '';
      const published = entry.querySelector('published')?.textContent || '';
      const updated = entry.querySelector('updated')?.textContent || '';
      
      const authors: string[] = [];
      entry.querySelectorAll('author name').forEach(author => {
        const name = author.textContent?.trim();
        if (name) authors.push(name);
      });
      
      const categories: string[] = [];
      entry.querySelectorAll('category').forEach(cat => {
        const term = cat.getAttribute('term');
        if (term) categories.push(term);
      });
      
      const links = entry.querySelectorAll('link');
      let pdfUrl = '';
      let link = '';
      
      links.forEach(linkEl => {
        const href = linkEl.getAttribute('href') || '';
        const type = linkEl.getAttribute('type') || '';
        const title = linkEl.getAttribute('title') || '';
        
        if (title === 'pdf') {
          pdfUrl = href;
        } else if (type === 'text/html') {
          link = href;
        }
      });
      
      if (id && title) {
        papers.push({
          id,
          title,
          authors,
          abstract,
          published,
          updated,
          categories,
          pdfUrl,
          link
        });
      }
    });
    
    return papers;
  }
  
  static extractArXivId(url: string): string | null {
    const patterns = [
      /arxiv\.org\/abs\/(\d{4}\.\d{4,5})/,
      /arxiv\.org\/pdf\/(\d{4}\.\d{4,5})/,
      /(\d{4}\.\d{4,5})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }
}