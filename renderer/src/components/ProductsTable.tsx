import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  site: string;
  scrapedAt: string;
}

interface ProductsTableProps {
  products: Product[];
}

const columnHelper = createColumnHelper<Product>();

const styles = {
  container: {
    marginBottom: '30px',
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
    fontWeight: '600',
    color: '#181818',
    margin: 0,
  },
  badge: {
    background: '#0176d3',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
  filterBar: {
    padding: '16px 24px',
    background: '#fafaf9',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  filterContainer: {
    display: 'flex',
    flex: 1,
    gap: '8px',
    alignItems: 'stretch',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #d4d4d8',
    borderRadius: '4px 0 0 4px',
    fontSize: '13px',
    outline: 'none',
    background: 'white',
    color: '#3e3e3c',
    cursor: 'pointer',
    minWidth: '160px',
    transition: 'border-color 0.2s',
  },
  filterInput: {
    padding: '8px 12px',
    border: '1px solid #d4d4d8',
    borderLeft: 'none',
    borderRadius: '0 4px 4px 0',
    fontSize: '13px',
    flex: 1,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  clearButton: {
    padding: '8px 16px',
    background: 'white',
    color: '#0176d3',
    border: '1px solid #0176d3',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  tableWrapper: {
    overflow: 'auto',
    maxHeight: '500px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: (isHovered: boolean, isSorted: boolean) => ({
    padding: '12px 16px',
    textAlign: 'left' as const,
    background: isHovered ? '#f4f6f9' : 'white',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '12px',
    fontWeight: '600',
    color: '#3e3e3c',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'background 0.2s',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  }),
  sortIcon: (sorted: string | false) => ({
    display: 'inline-flex',
    flexDirection: 'column' as const,
    marginLeft: '6px',
    fontSize: '10px',
    lineHeight: '1',
  }),
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f3f3f3',
    fontSize: '13px',
    color: '#3e3e3c',
  },
  row: (isHovered: boolean) => ({
    background: isHovered ? '#fafaf9' : 'white',
    transition: 'background 0.15s',
  }),
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center' as const,
    color: '#71717a',
    fontSize: '14px',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#71717a',
  },
};

export function ProductsTable({ products }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('name');
  const [filterValue, setFilterValue] = useState<string>('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <span style={{ fontWeight: '500' }}>{info.getValue()}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span style={{ fontWeight: '600', color: '#0176d3' }}>
            ৳{info.getValue().toLocaleString()}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('brand', {
        header: 'Brand',
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('site', {
        header: 'Site',
        cell: (info) => (
          <span
            style={{
              textTransform: 'capitalize',
              background: '#f0f9ff',
              color: '#0369a1',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('scrapedAt', {
        header: 'Scraped At',
        cell: (info) => (
          <span style={{ color: '#71717a', fontSize: '12px' }}>
            {new Date(info.getValue()).toLocaleString()}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: false,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setColumnFilters(value ? [{ id: selectedColumn, value }] : []);
  };

  const handleColumnChange = (columnId: string) => {
    setSelectedColumn(columnId);
    // Reapply the current filter value to the new column
    setColumnFilters(filterValue ? [{ id: columnId, value: filterValue }] : []);
  };

  const clearFilter = () => {
    setFilterValue('');
    setColumnFilters([]);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Scraped Products</h2>
        <span style={styles.badge}>
          {table.getRowModel().rows.length} items
        </span>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterContainer}>
          <select
            value={selectedColumn}
            onChange={(e) => handleColumnChange(e.target.value)}
            style={{
              ...styles.filterSelect,
              borderColor: filterValue ? '#0176d3' : '#d4d4d8',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#0176d3')}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = filterValue
                ? '#0176d3'
                : '#d4d4d8')
            }
          >
            <option value="name">Product Name</option>
            <option value="brand">Brand</option>
            <option value="site">Site</option>
          </select>
          <input
            type="text"
            placeholder={`Filter by ${selectedColumn === 'name' ? 'product name' : selectedColumn}...`}
            value={filterValue}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={{
              ...styles.filterInput,
              borderColor: filterValue ? '#0176d3' : '#d4d4d8',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#0176d3')}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = filterValue
                ? '#0176d3'
                : '#d4d4d8')
            }
          />
        </div>

        {filterValue && (
          <button
            onClick={clearFilter}
            style={styles.clearButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0176d3';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#0176d3';
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortState = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      style={styles.th(
                        hoveredHeader === header.id,
                        !!sortState,
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onMouseEnter={() => setHoveredHeader(header.id)}
                      onMouseLeave={() => setHoveredHeader(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <span style={styles.sortIcon(sortState)}>
                            <span
                              style={{
                                color:
                                  sortState === 'asc' ? '#0176d3' : '#d4d4d8',
                              }}
                            >
                              ▲
                            </span>
                            <span
                              style={{
                                color:
                                  sortState === 'desc' ? '#0176d3' : '#d4d4d8',
                                marginTop: '-2px',
                              }}
                            >
                              ▼
                            </span>
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={styles.emptyState}>
                  {products.length === 0 ? (
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        📦
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          color: '#3e3e3c',
                        }}
                      >
                        No products yet
                      </div>
                      <div>
                        Select a brand and start scraping to see products here
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🔍
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          color: '#3e3e3c',
                        }}
                      >
                        No matching products
                      </div>
                      <div>Try adjusting your filters to see more results</div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  style={styles.row(hoveredRow === row.id)}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={styles.td}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {products.length > 0 && (
        <div style={styles.footer}>
          <div>
            Showing <strong>{table.getRowModel().rows.length}</strong> of{' '}
            <strong>{products.length}</strong> products
          </div>
          {filterValue && (
            <div style={{ color: '#0176d3' }}>
              🔎 Filtering by{' '}
              {selectedColumn === 'name' ? 'product name' : selectedColumn}: "
              {filterValue}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
