import React, { useMemo, useState } from 'react';

interface Brand {
  id: string | number;
  name: string;
}

interface BrandSelectionProps {
  brands: Brand[];
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
  newBrandName: string;
  onNewBrandNameChange: (value: string) => void;
  onAddBrand: () => void | Promise<void>;
}

export const BrandSelection: React.FC<BrandSelectionProps> = ({
  brands,
  selectedBrand,
  onBrandSelect,
  newBrandName,
  onNewBrandNameChange,
  onAddBrand,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const normalizedInput = newBrandName.trim().toLowerCase();
  const filteredBrands = useMemo(
    () =>
      normalizedInput
        ? brands.filter((brand) => brand.name.toLowerCase().includes(normalizedInput))
        : brands,
    [brands, normalizedInput],
  );

  const hasExactMatch = useMemo(
    () => brands.some((brand) => brand.name.toLowerCase() === normalizedInput),
    [brands, normalizedInput],
  );
  const showAddOption = Boolean(newBrandName.trim()) && !hasExactMatch;

  const handleInputChange = (value: string) => {
    onNewBrandNameChange(value);
    setIsDropdownOpen(true);
    setIsInputFocused(true);
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
    setIsInputFocused(false);
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
      setIsInputFocused(false);
    }, 150);
  };

  const showSelectedBadge = Boolean(selectedBrand && !isInputFocused);
  const inputValue = showSelectedBadge ? '' : newBrandName;
  const inputPlaceholder = showSelectedBadge ? '' : 'Type to search or add a brand';

  return (
    <div style={{ marginBottom: '30px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
      <h2>Brand Selection</h2>
      <div
        style={{
          position: 'relative',
          marginBottom: '15px',
          border: '1px solid #a1a1a1',
          borderRadius: '6px',
          background: '#fff',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsDropdownOpen(true);
            setIsInputFocused(true);
          }}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={inputPlaceholder}
          style={{
            padding: '10px 36px 10px 12px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            background: 'transparent',
            outline: 'none',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        />
        {showSelectedBadge && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#e0f2ff',
              color: '#0a5eb8',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              pointerEvents: 'none',
              maxWidth: 'calc(100% - 50px)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {selectedBrand}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid #555',
            transform: 'translateY(-25%)',
            pointerEvents: 'none',
          }}
        />
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: '-1px',
              right: '-1px',
              background: 'white',
              border: '1px solid #a1a1a1',
              borderRadius: '6px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 10,
            }}
          >
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: brand.name === selectedBrand ? '#f0f7ff' : 'transparent',
                }}
                onMouseDown={() => handleSelectBrand(brand.name)}
              >
                {brand.name}
              </div>
            ))}
            {showAddOption && (
              <div
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  color: '#2196F3',
                  fontWeight: 600,
                  }}
                onMouseDown={handleAddBrandClick}
              >
                Add "{newBrandName.trim()}"
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
