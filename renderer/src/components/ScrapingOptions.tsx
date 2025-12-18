import React, { useDeferredValue, useMemo, useState } from 'react';

interface Brand {
  id: string | number;
  name: string;
}

type NormalizedBrand = Brand & { lowerName: string };

interface ScrapingOptionsProps {
  brands: Brand[];
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
  newBrandName: string;
  onNewBrandNameChange: (value: string) => void;
  onAddBrand: () => void | Promise<void>;
  sites: string[];
  scrapingSite: string | null;
  onScrapeSite: (site: string) => void | Promise<void>;
}

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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  headerText: { margin: 0 },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#181818',
    margin: 0,
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#71717a',
  },
  badge: {
    background: '#0176d3',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  },
  badgeMuted: {
    background: '#f4f4f5',
    color: '#71717a',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  },
  body: {
    padding: '20px 24px',
    background: '#fafaf9',
    display: 'grid',
    gap: '16px',
  },
  section: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#3e3e3c',
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '12px 44px 12px 14px',
    border: '1px solid #d4d4d8',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  dropdownIndicator: {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '6px solid #555',
    transform: 'translateY(-25%)',
    pointerEvents: 'none' as const,
  },
  dropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    maxHeight: '220px',
    overflowY: 'auto' as const,
    zIndex: 20,
  },
  option: (active: boolean) => ({
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    background: active ? '#ebf5ff' : 'transparent',
    color: active ? '#0176d3' : '#3e3e3c',
    transition: 'background 0.2s',
  }),
  addOption: {
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#0176d3',
    fontWeight: 600,
    borderTop: '1px solid #f4f4f5',
  },
  helperText: {
    fontSize: '12px',
    color: '#71717a',
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  addButton: (disabled: boolean) => ({
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    background: disabled ? '#e5e7eb' : '#0176d3',
    color: disabled ? '#a1a1aa' : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 2px 6px rgba(1,118,211,0.3)',
    transition: 'opacity 0.2s',
  }),
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#181818',
    margin: 0,
  },
  sectionDescription: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '4px 0 0',
  },
  siteBadge: {
    background: '#eef2ff',
    color: '#4c1d95',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  siteButtons: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  siteButton: (disabled: boolean, active: boolean) => ({
    padding: '10px 18px',
    borderRadius: '6px',
    border: '1px solid transparent',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'capitalize' as const,
    background: active ? '#0176d3' : disabled ? '#e2e8f0' : '#0ea5e9',
    color: active || !disabled ? 'white' : '#94a3b8',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: active ? '0 2px 8px rgba(1,118,211,0.35)' : 'none',
    transition: 'all 0.2s',
  }),
};

export const ScrapingOptions: React.FC<ScrapingOptionsProps> = ({
  brands,
  selectedBrand,
  onBrandSelect,
  newBrandName,
  onNewBrandNameChange,
  onAddBrand,
  sites,
  scrapingSite,
  onScrapeSite,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const normalizedInput = newBrandName.trim().toLowerCase();
  const deferredInput = useDeferredValue(normalizedInput);

  const normalizedBrands = useMemo<NormalizedBrand[]>(
    () => brands.map((brand) => ({ ...brand, lowerName: brand.name.toLowerCase() })),
    [brands],
  );

  const filteredBrands = useMemo(
    () =>
      deferredInput
        ? normalizedBrands.filter((brand) => brand.lowerName.includes(deferredInput))
        : normalizedBrands,
    [deferredInput, normalizedBrands],
  );

  const hasExactMatch = useMemo(
    () => (normalizedInput ? normalizedBrands.some((brand) => brand.lowerName === normalizedInput) : false),
    [normalizedBrands, normalizedInput],
  );
  const showAddOption = Boolean(newBrandName.trim()) && !hasExactMatch;

  const handleInputChange = (value: string) => {
    onNewBrandNameChange(value);
    setIsDropdownOpen(true);
  };

  const handleSelectBrand = (name: string) => {
    onBrandSelect(name);
    onNewBrandNameChange(name);
    setIsDropdownOpen(false);
  };

  const handleAddBrandClick = async () => {
    if (!newBrandName.trim()) return;
    await onAddBrand();
    setIsDropdownOpen(false);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    if (showAddOption) {
      handleAddBrandClick();
      return;
    }

    if (filteredBrands.length) {
      handleSelectBrand(filteredBrands[0].name);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleScrapeClick = (site: string) => {
    if (!selectedBrand) return;
    onScrapeSite(site);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerText}>
          <h2 style={styles.title}>Scraping Options</h2>
          <p style={styles.subtitle}>Select a brand and trigger scrapers in one place</p>
        </div>
        <span style={selectedBrand ? styles.badge : styles.badgeMuted}>
          {selectedBrand ? `Selected: ${selectedBrand}` : 'No brand selected'}
        </span>
      </div>
      <div style={styles.body}>
        <div style={styles.section}>
          <div>
            <span style={styles.label}>Brand name</span>
            <p style={styles.sectionDescription}>Search existing brands or add a new one for tracking</p>
          </div>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                setIsDropdownOpen(true);
              }}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder="Type to search or add a brand"
              style={styles.input}
            />
            <div style={styles.dropdownIndicator} />
            {isDropdownOpen && (
              <div style={styles.dropdown}>
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    style={styles.option(brand.name === selectedBrand)}
                    onMouseDown={() => handleSelectBrand(brand.name)}
                  >
                    {brand.name}
                  </div>
                ))}
                {showAddOption && (
                  <div style={styles.addOption} onMouseDown={handleAddBrandClick}>
                    Add "{newBrandName.trim()}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Scrape price from sites</h3>
              <p style={styles.sectionDescription}>
                Trigger scrapers for {selectedBrand ? selectedBrand : 'the selected brand'} across available sites
              </p>
            </div>
            <span style={styles.siteBadge}>{sites.length} sites</span>
          </div>
          <div style={styles.siteButtons}>
            {sites.map((site) => {
              const isActive = scrapingSite === site;
              const isDisabled = !selectedBrand || isActive;
              return (
                <button
                  type="button"
                  key={site}
                  style={styles.siteButton(isDisabled, isActive)}
                  disabled={isDisabled}
                  onClick={() => handleScrapeClick(site)}
                >
                  {isActive ? 'Scraping...' : `Scrape ${site}`}
                </button>
              );
            })}
          </div>
          {!selectedBrand && (
            <span style={styles.helperText}>Choose a brand to enable scraping buttons.</span>
          )}
        </div>
      </div>
    </div>
  );
};
