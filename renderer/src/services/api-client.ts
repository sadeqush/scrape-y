import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const port = await window.electronAPI.getServerPort();
    this.baseUrl = `http://localhost:${port}`;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initialized = true;
    console.log(`API client initialized: ${this.baseUrl}`);
  }

  // Products
  async getProducts(params?: any) {
    await this.initialize();
    return this.client.get('/products', { params });
  }

  async getProduct(id: string) {
    await this.initialize();
    return this.client.get(`/products/${id}`);
  }

  async getProductStats() {
    await this.initialize();
    return this.client.get('/products/stats');
  }

  // Brands
  async getBrands() {
    await this.initialize();
    return this.client.get('/brands');
  }

  async addBrand(name: string) {
    await this.initialize();
    return this.client.post('/brands', { name });
  }

  // Scrapers
  async triggerScrape(site: string, brand: string, maxPages?: number) {
    await this.initialize();
    return this.client.post('/scrapers/scrape', { site, brand, maxPages });
  }

  async getScrapingJobs() {
    await this.initialize();
    return this.client.get('/scrapers/jobs');
  }

  async getScrapingJob(id: string) {
    await this.initialize();
    return this.client.get(`/scrapers/jobs/${id}`);
  }

  async getAvailableSites() {
    await this.initialize();
    return this.client.get('/scrapers/sites');
  }

  // Sync
  async triggerSync(force?: boolean) {
    await this.initialize();
    return this.client.post('/sync/trigger', null, {
      params: { force: force ? 'true' : 'false' },
    });
  }

  async getSyncHistory() {
    await this.initialize();
    return this.client.get('/sync/history');
  }

  async getSyncStatus() {
    await this.initialize();
    return this.client.get('/sync/status');
  }
}

export const apiClient = new ApiClient();
