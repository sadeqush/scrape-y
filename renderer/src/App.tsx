import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from './services/api-client';
import { ProductsTable } from './components/ProductsTable';
import { ScrapingOptions } from './components/ScrapingOptions';
import { RecentScrapingJobs } from './components/RecentScrapingJobs';

function App() {
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [newBrandName, setNewBrandName] = useState<string>('');
  const [sites, setSites] = useState<string[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productFilters, setProductFilters] = useState<Record<
    string,
    any
  > | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const hasActiveJob = useMemo(
    () => jobs.some((job) => job.status !== 'completed'),
    [jobs],
  );

  const loadData = useCallback(
    async (overrideFilters?: Record<string, any> | null) => {
      const filtersToUse =
        overrideFilters !== undefined ? overrideFilters : productFilters;
      try {
        const [brandsRes, sitesRes, jobsRes, productsRes] = await Promise.all([
          apiClient.getBrands(),
          apiClient.getAvailableSites(),
          apiClient.getScrapingJobs(),
          apiClient.getProducts(filtersToUse ?? undefined),
        ]);

        setBrands(brandsRes.data);
        setSites(sitesRes.data.sites);
        setJobs(jobsRes.data.jobs);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    },
    [productFilters],
  );

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const applyJobFilter = async (job: any | null) => {
    if (!job) {
      setProductFilters(null);
      setSelectedJob(null);
      await loadData(null);
      return;
    }

    const filters: Record<string, any> = {};

    if (job.brand) {
      filters.brand = job.brand;
    }

    if (Array.isArray(job.sites) && job.sites.length === 1) {
      filters.site = job.sites[0];
    }

    setProductFilters(filters);
    setSelectedJob(job);
    await loadData(filters);
  };

  const handleJobSelection = async (job: any) => {
    if (selectedJob?.id === job.id) {
      await applyJobFilter(null);
      return;
    }

    await applyJobFilter(job);
  };

  const handleClearJobSelection = async () => {
    await applyJobFilter(null);
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
      alert(
        `Failed to add brand: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  const handleRunScrapeJob = async (selectedSites: string[]) => {
    if (!selectedBrand) {
      alert('Please select a brand first');
      return;
    }
    if (!selectedSites.length) return;

    try {
      await apiClient.triggerScrape(selectedSites, selectedBrand);
      alert(
        `Scraping started for brand "${selectedBrand}" on ${selectedSites.join(', ')}`,
      );
      await loadData();
    } catch (error: any) {
      alert(`Failed to start scraping: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1>ScrapeY - Brand Price Tracker</h1>

      <ScrapingOptions
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandSelect={setSelectedBrand}
        newBrandName={newBrandName}
        onNewBrandNameChange={setNewBrandName}
        onAddBrand={handleAddBrand}
        sites={sites}
        hasActiveJob={hasActiveJob}
        onRunScrape={handleRunScrapeJob}
      />

      {selectedJob && (
        <div
          style={{
            margin: '16px 0',
            padding: '12px 16px',
            background: '#eef2ff',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#1d1d1f' }}>
            Showing results for{' '}
            <strong>{selectedJob.brand || 'selected job'}</strong> on{' '}
            <strong style={{ textTransform: 'capitalize' }}>
              {Array.isArray(selectedJob.sites)
                ? selectedJob.sites.join(', ')
                : 'selected sites'}
            </strong>{' '}
            (started {new Date(selectedJob.startedAt).toLocaleString()}).
          </div>
          <button
            onClick={handleClearJobSelection}
            style={{
              border: 'none',
              background: '#4338ca',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Products Table */}
      <ProductsTable products={products} />

      <RecentScrapingJobs
        jobs={jobs}
        onJobSelect={handleJobSelection}
        selectedJobId={selectedJob?.id}
      />
    </div>
  );
}

export default App;
