import React from 'react';

interface ScrapingJob {
  id: string | number;
  sites: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | string;
  brand?: string;
  productsScraped?: number;
  productsCreated?: number;
  productsUpdated?: number;
  startedAt: string;
}

interface RecentScrapingJobsProps {
  jobs: ScrapingJob[];
  onJobSelect?: (job: ScrapingJob) => void;
  selectedJobId?: string | number | null;
}

const styles = {
  container: {
    marginTop: '30px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
    color: '#181818',
  },
  badge: {
    background: '#0176d3',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 500,
  },
  tableWrapper: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '13px',
    color: '#3e3e3c',
  },
  row: (isSelected: boolean, isInteractive: boolean) => ({
    background: isSelected ? '#eef2ff' : 'white',
    cursor: isInteractive ? 'pointer' : 'default',
    transition: 'background 0.2s',
  }),
  statusPill: (color: string) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'white',
    background: color,
    textTransform: 'capitalize' as const,
  }),
  emptyState: {
    padding: '40px',
    textAlign: 'center' as const,
    color: '#71717a',
    fontSize: '14px',
  },
  helperText: {
    padding: '8px 24px 0',
    fontSize: '12px',
    color: '#6b7280',
  },
  siteList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  siteChip: {
    background: '#eef2ff',
    color: '#4338ca',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'capitalize' as const,
  },
} as const;

const statusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#16a34a';
    case 'failed':
      return '#dc2626';
    case 'running':
      return '#2563eb';
    default:
      return '#f97316';
  }
};

export const RecentScrapingJobs: React.FC<RecentScrapingJobsProps> = ({
  jobs,
  onJobSelect,
  selectedJobId,
}) => (
  <div style={styles.container}>
    <div style={styles.header}>
      <h2 style={styles.title}>Recent Scraping Jobs</h2>
      <span style={styles.badge}>{jobs.length} total</span>
    </div>
    {onJobSelect && jobs.length > 0 && (
      <div style={styles.helperText}>
        Click on a job to load its results in the products table.
      </div>
    )}
    <div style={styles.tableWrapper}>
      {jobs.length === 0 ? (
        <div style={styles.emptyState}>
          No scraping jobs have been recorded yet.
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sites</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Started</th>
            </tr>
          </thead>
          <tbody>
            {jobs.slice(0, 10).map((job) => {
              const isSelected = selectedJobId === job.id;
              return (
                <tr
                  key={job.id}
                  onClick={() => onJobSelect?.(job)}
                  style={styles.row(isSelected, !!onJobSelect)}
                >
                  <td style={styles.td}>
                    <div style={styles.siteList}>
                      {(job.sites || []).map((site) => (
                        <span key={site} style={styles.siteChip}>
                          {site}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusPill(statusColor(job.status))}>
                      {job.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {job.productsScraped || 0} ({job.productsCreated || 0} new,{' '}
                    {job.productsUpdated || 0} updated)
                  </td>
                  <td style={styles.td}>
                    {new Date(job.startedAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
