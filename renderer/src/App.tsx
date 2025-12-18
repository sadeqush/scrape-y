import { useEffect, useState } from 'react';
import { apiClient } from './services/api-client';
import { ProductsTable } from './components/ProductsTable';
import { ScrapingOptions } from './components/ScrapingOptions';

function App() {
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [newBrandName, setNewBrandName] = useState<string>('');
  const [sites, setSites] = useState<string[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [scraping, setScraping] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [brandsRes, sitesRes, jobsRes, productsRes] = await Promise.all([
        apiClient.getBrands(),
        apiClient.getAvailableSites(),
        apiClient.getScrapingJobs(),
        apiClient.getProducts(),
      ]);

      setBrands(brandsRes.data);
      setSites(sitesRes.data.sites);
      setJobs(jobsRes.data.jobs);
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    const brandName = newBrandName.trim();
    try {
      await apiClient.addBrand(brandName);
      setSelectedBrand(brandName);
      setNewBrandName(brandName);
      await loadData();
    } catch (error: any) {
      alert(`Failed to add brand: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleScrape = async (site: string) => {
    if (!selectedBrand) {
      alert('Please select a brand first');
      return;
    }
    setScraping(site);
    try {
      await apiClient.triggerScrape(site, selectedBrand);
      alert(`Scraping started for brand "${selectedBrand}" on ${site}`);
      await loadData();
    } catch (error: any) {
      alert(`Failed to start scraping: ${error.message}`);
    } finally {
      setScraping(null);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Scrape-Y - Brand Price Tracker</h1>

      <ScrapingOptions
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandSelect={setSelectedBrand}
        newBrandName={newBrandName}
        onNewBrandNameChange={setNewBrandName}
        onAddBrand={handleAddBrand}
        sites={sites}
        scrapingSite={scraping}
        onScrapeSite={handleScrape}
      />

      {/* Products Table */}
      <ProductsTable products={products} />

      {/* Recent Jobs */}
      <div>
        <h2>Recent Scraping Jobs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Site</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Products</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Started</th>
            </tr>
          </thead>
          <tbody>
            {jobs.slice(0, 10).map((job) => (
              <tr key={job.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                  {job.site}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background:
                        job.status === 'completed'
                          ? '#4CAF50'
                          : job.status === 'failed'
                            ? '#f44336'
                            : job.status === 'running'
                              ? '#2196F3'
                              : '#FFC107',
                      color: 'white',
                      fontSize: '12px',
                    }}
                  >
                    {job.status}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {job.productsScraped || 0} ({job.productsCreated || 0} new, {job.productsUpdated || 0} updated)
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {new Date(job.startedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
