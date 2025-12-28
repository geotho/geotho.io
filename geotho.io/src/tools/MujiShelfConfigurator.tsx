import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ProductType = 'base' | 'addon' | 'grid' | 'drawer';

interface Product {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  price: number;
  type: ProductType;
  rotatable?: boolean;
  rows: number;
  cols: number;
}

const PRODUCTS: Product[] = [
  // 1-Column Units (Narrow)
  { id: 'narrow-2', name: 'Narrow 2', width: 42, depth: 28.5, height: 81.5, price: 149.00, type: 'base', rotatable: true, rows: 2, cols: 1 },
  { id: 'narrow-3', name: 'Narrow 3', width: 42, depth: 28.5, height: 121, price: 189.00, type: 'base', rotatable: true, rows: 3, cols: 1 },
  { id: 'narrow-5', name: 'Narrow 5', width: 42, depth: 28.5, height: 200, price: 219.00, type: 'base', rotatable: true, rows: 5, cols: 1 },

  // Wide Units (1 Column)
  { id: 'wide-2', name: 'Wide 2', width: 81.5, depth: 28.5, height: 81.5, price: 199.00, type: 'base', rotatable: true, rows: 2, cols: 1 },
  { id: 'wide-3', name: 'Wide 3', width: 81.5, depth: 28.5, height: 121, price: 229.00, type: 'base', rotatable: true, rows: 3, cols: 1 },
  { id: 'wide-5', name: 'Wide 5', width: 81.5, depth: 28.5, height: 200, price: 279.00, type: 'base', rotatable: true, rows: 5, cols: 1 },

  // 2-Column Grids (3x2, 5x2)
  { id: 'grid-3-2', name: 'Grid 3x2', width: 82, depth: 28.5, height: 121, price: 299.00, type: 'grid', rotatable: true, rows: 3, cols: 2 },
  { id: 'grid-5-2', name: 'Grid 5x2', width: 82, depth: 28.5, height: 200, price: 379.00, type: 'grid', rotatable: true, rows: 5, cols: 2 },

  // 3-Column Grids (3x3, 5x3)
  { id: 'grid-3-3', name: 'Grid 3x3', width: 122, depth: 28.5, height: 121, price: 429.00, type: 'grid', rotatable: true, rows: 3, cols: 3 },
  { id: 'grid-5-3', name: 'Grid 5x3', width: 122, depth: 28.5, height: 200, price: 529.00, type: 'grid', rotatable: true, rows: 5, cols: 3 },


  // Add Ons
  { id: 'addon-wide-5', name: 'Oak Wide 5 Shelf - Add On', width: 79.5, depth: 28.5, height: 200, price: 249.00, type: 'addon', rows: 5, cols: 1 },
  { id: 'addon-narrow-5', name: 'Oak Narrow 5 Shelf - Add On', width: 40, depth: 28.5, height: 200, price: 199.00, type: 'addon', rows: 5, cols: 1 },
  { id: 'addon-narrow-3', name: 'Oak Narrow 3 Shelf - Add On', width: 40, depth: 28.5, height: 121, price: 169.00, type: 'addon', rows: 3, cols: 1 },
  { id: 'addon-wide-3', name: 'Oak Wide 3 Shelf - Add On', width: 79.5, depth: 28.5, height: 121, price: 219.00, type: 'addon', rows: 3, cols: 1 },
  { id: 'addon-wide-2', name: 'Oak Wide 2 Shelf - Add On', width: 79.5, depth: 28.5, height: 81.5, price: 179.00, type: 'addon', rows: 2, cols: 1 },
  { id: 'addon-narrow-2', name: 'Oak Narrow 2 Shelf - Add On', width: 40, depth: 28.5, height: 81.5, price: 129.00, type: 'addon', rows: 2, cols: 1 },

  // Drawers (Optional/Extra)
  { id: 'drawer-4', name: 'Oak Cube Drawer Unit - 4 Tier', width: 37, depth: 28, height: 37, price: 79.95, type: 'drawer', rows: 2, cols: 2 }, // Approximating 2x2 for drawer visualization if needed
];

const BASE_PRODUCTS = PRODUCTS.filter(p => p.type === 'base' || p.type === 'grid');
const ADDON_PRODUCTS = PRODUCTS.filter(p => p.type === 'addon');

interface Assembly {
  id: string;
  baseProduct: Product;
  rotated: boolean;
  leftAddon: Product | null;
  rightAddon: Product | null;
}

interface AnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface UndoNotice {
  prevBaseProduct: Product;
  prevLeftAddon: Product | null;
  prevRightAddon: Product | null;
  prevRotated: boolean;
  message: string;
}

const MujiShelfConfigurator: React.FC = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  // Store tuple of [assemblyIndex, side ('left'|'right')] or null
  const [openMenu, setOpenMenu] = useState<{ idx: number, side: 'left' | 'right', anchorRect: AnchorRect } | null>(null);
  const [undoNotices, setUndoNotices] = useState<Record<string, UndoNotice>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Don't deselect if clicking inside the menu or the container controls
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpenMenu(null);
        // Optional: Deselect unit on outside click?
        // setSelectedIdx(null); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const closeMenu = () => setOpenMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu);
    window.addEventListener('keydown', handleKeyDown);
    const workspaceEl = workspaceRef.current;
    if (workspaceEl) workspaceEl.addEventListener('scroll', closeMenu);
    return () => {
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu);
      window.removeEventListener('keydown', handleKeyDown);
      if (workspaceEl) workspaceEl.removeEventListener('scroll', closeMenu);
    };
  }, [openMenu]);

  const addBase = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      setAssemblies(prev => {
        const newAssemblies = [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          baseProduct: product, 
          rotated: false, 
          leftAddon: null,
          rightAddon: null 
        }];
        // Select the newly added assembly
        setSelectedIdx(newAssemblies.length - 1);
        return newAssemblies;
      });
      setOpenMenu(null);
    }
  };

  const removeAssembly = (index: number) => {
    setAssemblies(prev => {
      const newAssemblies = [...prev];
      const removed = newAssemblies.splice(index, 1)[0];
      if (removed) {
        setUndoNotices(notices => {
          if (!notices[removed.id]) return notices;
          const next = { ...notices };
          delete next[removed.id];
          return next;
        });
      }
      return newAssemblies;
    });
    setOpenMenu(null);
    setSelectedIdx(null);
  };

  const toggleRotation = (index: number) => {
    const assemblySnapshot = assemblies[index];
    if (!assemblySnapshot) return;
    const removedAddons = Boolean(assemblySnapshot.leftAddon || assemblySnapshot.rightAddon);

    setAssemblies(prev => prev.map((assembly, idx) => {
      if (idx !== index) return assembly;
      return {
        ...assembly,
        rotated: !assembly.rotated,
        leftAddon: removedAddons ? null : assembly.leftAddon,
        rightAddon: removedAddons ? null : assembly.rightAddon
      };
    }));

    if (removedAddons) {
      setUndoNotices(notices => ({
        ...notices,
        [assemblySnapshot.id]: {
          prevBaseProduct: assemblySnapshot.baseProduct,
          prevLeftAddon: assemblySnapshot.leftAddon,
          prevRightAddon: assemblySnapshot.rightAddon,
          prevRotated: assemblySnapshot.rotated,
          message: 'Rotation removed add-ons.'
        }
      }));
    } else {
      setUndoNotices(notices => {
        const next = { ...notices };
        delete next[assemblySnapshot.id];
        return next;
      });
    }
    setOpenMenu(null);
  };

  const addAddOn = (assemblyIndex: number, productId: string, side: 'left' | 'right') => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const assemblyId = assemblies[assemblyIndex]?.id;

    setAssemblies(prev => {
      const newAssemblies = [...prev];
      const assembly = newAssemblies[assemblyIndex];
      if (!assembly) return prev;
      if (side === 'left') {
          assembly.leftAddon = product;
      } else {
          assembly.rightAddon = product;
      }
      return newAssemblies;
    });
    setUndoNotices(notices => {
      if (!assemblyId) return notices;
      const next = { ...notices };
      delete next[assemblyId];
      return next;
    });
    setOpenMenu(null);
  };

  const removeAddOn = (assemblyIndex: number, side: 'left' | 'right') => {
    const assemblyId = assemblies[assemblyIndex]?.id;
    setAssemblies(prev => {
      const newAssemblies = [...prev];
      const assembly = newAssemblies[assemblyIndex];
      if (!assembly) return prev;
      if (side === 'left') {
          assembly.leftAddon = null;
      } else {
          assembly.rightAddon = null;
      }
      return newAssemblies;
    });
    setUndoNotices(notices => {
      if (!assemblyId) return notices;
      const next = { ...notices };
      delete next[assemblyId];
      return next;
    });
  };

  const toggleMenu = (index: number, side: 'left' | 'right', anchorRect: AnchorRect) => {
    if (openMenu?.idx === index && openMenu?.side === side) {
      setOpenMenu(null);
    } else {
      setOpenMenu({ idx: index, side, anchorRect });
    }
  };

  const undoLastChange = (assemblyId: string) => {
    const notice = undoNotices[assemblyId];
    if (!notice) return;
    setAssemblies(prev => prev.map(assembly => {
      if (assembly.id !== assemblyId) return assembly;
      return {
        ...assembly,
        baseProduct: notice.prevBaseProduct,
        leftAddon: notice.prevLeftAddon,
        rightAddon: notice.prevRightAddon,
        rotated: notice.prevRotated
      };
    }));
    setUndoNotices(notices => {
      const next = { ...notices };
      delete next[assemblyId];
      return next;
    });
  };

  const dismissNotice = (assemblyId: string) => {
    setUndoNotices(notices => {
      const next = { ...notices };
      delete next[assemblyId];
      return next;
    });
  };

  const getAssemblyTotal = (assembly: Assembly) => {
    let total = assembly.baseProduct.price;
    if (assembly.leftAddon) total += assembly.leftAddon.price;
    if (assembly.rightAddon) total += assembly.rightAddon.price;
    return total;
  };

  const getTotalPrice = () => {
    return assemblies.reduce((total, assembly) => total + getAssemblyTotal(assembly), 0);
  };

  const getDimensions = (product: Product, rotated: boolean) => {
    return {
      width: rotated ? product.height : product.width,
      height: rotated ? product.width : product.height,
      rows: rotated ? product.cols : product.rows,
      cols: rotated ? product.rows : product.cols,
    };
  };

  const getAssemblyDimensions = (assembly: Assembly) => {
    const baseDims = getDimensions(assembly.baseProduct, assembly.rotated);
    const leftWidth = assembly.leftAddon ? assembly.leftAddon.width : 0;
    const rightWidth = assembly.rightAddon ? assembly.rightAddon.width : 0;
    const leftHeight = assembly.leftAddon ? assembly.leftAddon.height : 0;
    const rightHeight = assembly.rightAddon ? assembly.rightAddon.height : 0;
    return {
      width: baseDims.width + leftWidth + rightWidth,
      height: Math.max(baseDims.height, leftHeight, rightHeight)
    };
  };

  const getBuildDimensions = () => {
    return assemblies.reduce((acc, assembly) => {
      const dims = getAssemblyDimensions(assembly);
      return {
        width: acc.width + dims.width,
        height: Math.max(acc.height, dims.height)
      };
    }, { width: 0, height: 0 });
  };

  const formatCm = (value: number) => {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  };

  const UNIT_PX = 84; // Fixed pixel size per 1x1 unit for perfect alignment

  const renderGridLines = (rows: number, cols: number) => {
      const lines = [];
      const thickness = 4;
      const colorClass = "bg-[#5D4037] dark:bg-[#8D6E63]";

      // Vertical lines
      for (let i = 1; i < cols; i++) {
          lines.push(
              <div 
                key={`v-${i}`}
                className={`absolute ${colorClass} pointer-events-none`}
                style={{
                    left: `${i * UNIT_PX - (thickness / 2)}px`,
                    top: 0,
                    bottom: 0,
                    width: `${thickness}px`
                }}
              />
          );
      }
      // Horizontal lines
      for (let i = 1; i < rows; i++) {
          lines.push(
              <div 
                key={`h-${i}`}
                className={`absolute ${colorClass} pointer-events-none`}
                style={{
                    top: `${i * UNIT_PX - (thickness / 2)}px`,
                    left: 0,
                    right: 0,
                    height: `${thickness}px`
                }}
              />
          );
      }
      return lines;
  };

  const getShortName = (name: string) => {
    return name
      .replace('Oak ', '')
      .replace('Shelving Unit', '')
      .replace('Narrow ', '')
      .replace('Wide ', '')
      .replace(' - Add On', '')
      .trim();
  };

  const renderProductBox = (product: Product, borders: { top: boolean, right: boolean, bottom: boolean, left: boolean }, rotated: boolean) => {
      const dims = getDimensions(product, rotated);
      
      // Calculate width based on Unit Size, but subtract width for missing borders 
      // to ensure internal cell spacing is preserved (shared upright logic).
      // Base (L+R borders) = N * UNIT_PX
      // Addon (L or R border) = N * UNIT_PX - 4
      const widthPx = (dims.cols * UNIT_PX) - (!borders.left ? 4 : 0) - (!borders.right ? 4 : 0);
      const heightPx = dims.rows * UNIT_PX;

      const borderColorClass = "border-[#5D4037] dark:border-[#8D6E63]";

      return (
        <div
            className={`relative flex items-center justify-center text-xs text-amber-900 dark:text-amber-100 overflow-hidden bg-[#FDFBF7] dark:bg-[#2C2C2C] z-10 box-border
                ${borders.top ? `border-t-[4px] ${borderColorClass}` : ''}
                ${borders.bottom ? `border-b-[4px] ${borderColorClass}` : ''}
                ${borders.left ? `border-l-[4px] ${borderColorClass}` : ''}
                ${borders.right ? `border-r-[4px] ${borderColorClass}` : ''}
            `}
            style={{
                width: `${widthPx}px`,
                height: `${heightPx}px`,
                transition: 'all 0.3s ease',
            }}
            title={product.name}
        >
            {/* Grid Lines */}
            {renderGridLines(dims.rows, dims.cols)}

            {/* Label */}
            <div className="text-center p-1 w-full truncate px-2 relative z-10 pointer-events-none">
                <div className="font-bold truncate text-[11px] sm:text-xs leading-tight">
                    {getShortName(product.name)}
                </div>
                <div className="opacity-75 text-[10px]">{dims.width}x{dims.height}cm</div>
            </div>
        </div>
      );
  };

  const getMenuStyle = (anchorRect: AnchorRect) => {
    const menuWidth = 288;
    const padding = 12;
    const verticalGap = 8;
    const availableBelow = window.innerHeight - (anchorRect.top + anchorRect.height + verticalGap) - padding;
    const availableAbove = anchorRect.top - verticalGap - padding;
    const openBelow = availableBelow >= 160 || availableBelow >= availableAbove;
    const maxHeight = Math.max(120, Math.min(320, openBelow ? availableBelow : availableAbove));
    const top = openBelow
      ? anchorRect.top + anchorRect.height + verticalGap
      : Math.max(padding, anchorRect.top - verticalGap - maxHeight);
    let left = anchorRect.left;
    if (left + menuWidth + padding > window.innerWidth) {
      left = Math.max(padding, window.innerWidth - menuWidth - padding);
    }
    return { top, left, width: menuWidth, maxHeight };
  };

  const renderBaseOptions = (includePlaceholder: boolean) => (
    <>
      {includePlaceholder && <option value="" disabled>Select a base...</option>}
      <optgroup label="Narrow (1 Column)">
        {BASE_PRODUCTS.filter(p => p.id.startsWith('narrow')).map(p => (
          <option key={p.id} value={p.id}>{p.name} - {p.width}cm x {p.height}cm (£{p.price})</option>
        ))}
      </optgroup>
      <optgroup label="Wide (1 Column)">
        {BASE_PRODUCTS.filter(p => p.id.startsWith('wide')).map(p => (
          <option key={p.id} value={p.id}>{p.name} - {p.width}cm x {p.height}cm (£{p.price})</option>
        ))}
      </optgroup>
      <optgroup label="Grid (3x2, 5x2, 3x3, 5x3)">
        {BASE_PRODUCTS.filter(p => p.type === 'grid').map(p => (
          <option key={p.id} value={p.id}>{p.name} - {p.width}cm x {p.height}cm (£{p.price})</option>
        ))}
      </optgroup>
    </>
  );

  const menuAssembly = openMenu ? assemblies[openMenu.idx] : null;
  const menuStyle = openMenu && typeof window !== 'undefined' ? getMenuStyle(openMenu.anchorRect) : null;
  const menuBaseDims = menuAssembly ? getDimensions(menuAssembly.baseProduct, menuAssembly.rotated) : null;
  const menuId = openMenu && menuAssembly ? `addon-menu-${menuAssembly.id}-${openMenu.side}` : undefined;
  const buildDims = getBuildDimensions();
  const buildWidth = assemblies.length ? formatCm(buildDims.width) : '—';
  const buildHeight = assemblies.length ? formatCm(buildDims.height) : '—';

  const selectedAssembly = selectedIdx !== null ? assemblies[selectedIdx] : null;

  return (
    <div ref={containerRef} className="flex flex-col gap-6 p-4 md:p-8 bg-white/50 dark:bg-black/40 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-lg min-h-screen">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Muji Shelf Configurator</h1>
           <p className="text-gray-600 dark:text-gray-400 mt-1">Design your storage solution. Select a unit below to edit it.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            Total: £{getTotalPrice().toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Build: {buildWidth}cm × {buildHeight}cm
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="min-h-[80px] p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
        {selectedAssembly && selectedIdx !== null ? (
            <div className="flex flex-col gap-4">
                 <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {selectedAssembly.baseProduct.name}
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Unit {selectedIdx + 1})
                            </span>
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                             £{getAssemblyTotal(selectedAssembly).toFixed(2)} • {getAssemblyDimensions(selectedAssembly).width}cm × {getAssemblyDimensions(selectedAssembly).height}cm
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {/* Rotate */}
                        {selectedAssembly.baseProduct.rotatable && (
                            <button
                                onClick={() => toggleRotation(selectedIdx)}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                            >
                                ↻ Rotate
                            </button>
                        )}
                        
                         {/* Left Addon */}
                         <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/30 p-1 rounded border border-gray-200 dark:border-gray-700">
                            <span className="text-xs font-semibold px-1 text-gray-500">LEFT</span>
                             {selectedAssembly.leftAddon ? (
                                <button
                                    onClick={() => removeAddOn(selectedIdx, 'left')}
                                    className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                                >
                                    Remove ({getShortName(selectedAssembly.leftAddon.name)})
                                </button>
                            ) : (
                                <button
                                    className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                                        openMenu?.idx === selectedIdx && openMenu?.side === 'left'
                                        ? 'bg-green-200 text-green-800 border-green-300'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                        toggleMenu(selectedIdx, 'left', { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                                    }}
                                >
                                    + Add
                                </button>
                            )}
                         </div>

                         {/* Right Addon */}
                         <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/30 p-1 rounded border border-gray-200 dark:border-gray-700">
                            <span className="text-xs font-semibold px-1 text-gray-500">RIGHT</span>
                             {selectedAssembly.rightAddon ? (
                                <button
                                    onClick={() => removeAddOn(selectedIdx, 'right')}
                                    className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                                >
                                    Remove ({getShortName(selectedAssembly.rightAddon.name)})
                                </button>
                            ) : (
                                <button
                                    className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                                        openMenu?.idx === selectedIdx && openMenu?.side === 'right'
                                        ? 'bg-green-200 text-green-800 border-green-300'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                        toggleMenu(selectedIdx, 'right', { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                                    }}
                                >
                                    + Add
                                </button>
                            )}
                         </div>

                        {/* Remove Assembly */}
                        <button
                            onClick={() => removeAssembly(selectedIdx)}
                            className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 border border-transparent ml-2"
                        >
                            Delete Unit
                        </button>
                    </div>
                 </div>

                 {/* Undo Notice for Selected */}
                 {undoNotices[selectedAssembly.id] && (
                    <div className="flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/30 dark:text-amber-100">
                      <span>{undoNotices[selectedAssembly.id].message}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => undoLastChange(selectedAssembly.id)}
                          className="px-2 py-1 text-xs font-bold rounded border border-amber-300 bg-white/70 hover:bg-white"
                        >
                          Undo
                        </button>
                        <button
                          onClick={() => dismissNotice(selectedAssembly.id)}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
            </div>
        ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    Add new unit:
                </div>
                <select
                    className="p-2 w-full sm:w-auto flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    onChange={(e) => {
                        if(e.target.value) {
                            addBase(e.target.value);
                            e.target.value = '';
                        }
                    }}
                    defaultValue=""
                >
                    {renderBaseOptions(true)}
                </select>
                <div className="hidden sm:block text-sm text-gray-400 border-l border-gray-300 dark:border-gray-700 pl-4 ml-2">
                    Tip: Click on a shelf unit below to edit it.
                </div>
            </div>
        )}
      </div>

      {/* Workspace */}
      <div
        ref={workspaceRef}
        className="relative w-full flex-1 min-h-[60vh] md:min-h-[70vh] overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F8F9FA] dark:bg-[#121212] flex flex-col justify-end"
        onClick={(e) => {
             // Deselect if clicking on empty space
             if(e.target === workspaceRef.current || (e.target as HTMLElement).classList.contains('min-w-max')) {
                 setSelectedIdx(null);
             }
        }}
      >
        {/* Scene Wrapper: Ensures floor stretches with content and everything stays synced */}
        <div className="relative min-w-full w-max">
            {/* Floor */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[#EAE8E4] dark:bg-[#1C1C1C] pointer-events-none border-t border-gray-300 dark:border-gray-800" />
            
            {/* Shelves Container */}
            <div className="relative flex flex-nowrap items-end px-12 pb-32 pt-16 z-10">
            {assemblies.length === 0 ? (
                <div className="w-[calc(100vw-6rem)] h-64 flex items-center justify-center text-gray-500 italic pointer-events-none">
                No shelves added yet. Start by adding a base unit above.
                </div>
            ) : (
                assemblies.map((assembly, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                    <div 
                        key={assembly.id} 
                        className={`
                            relative flex items-end rounded-sm transition-all cursor-pointer group
                            ${isSelected 
                                ? 'ring-[3px] ring-blue-500 z-20 scale-[1.01]' 
                                : 'hover:brightness-95 active:scale-[0.99] hover:z-10'
                            }
                        `}
                        style={{
                            filter: isSelected 
                                ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' 
                                : 'drop-shadow(0 2px 3px rgba(0,0,0,0.05))',
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIdx(idx);
                        }}
                    >
                        {/* Selection Indicator (Arrow) */}
                        {isSelected && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-500 animate-bounce">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11 5v10.17l-3.59-3.58L6 13l6 6 6-6-1.41-1.41L13 15.17V5h-2z" />
                                </svg>
                            </div>
                        )}
                        
                        {assembly.leftAddon && renderProductBox(assembly.leftAddon, { top: true, bottom: true, left: true, right: false }, false)}
                        {renderProductBox(assembly.baseProduct, { top: true, bottom: true, left: true, right: true }, assembly.rotated)}
                        {assembly.rightAddon && renderProductBox(assembly.rightAddon, { top: true, bottom: true, left: false, right: true }, false)}
                    </div>
                );
                })
            )}
            </div>
        </div>
      </div>

      {openMenu && menuAssembly && menuBaseDims && menuStyle && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Add-on options"
          className="fixed z-50 flex flex-col overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-md ring-1 ring-black ring-opacity-5"
          style={{ left: menuStyle.left, top: menuStyle.top, width: menuStyle.width, maxHeight: menuStyle.maxHeight }}
        >
          <div className="px-4 py-2 text-xs text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/60">
            Base height: {menuBaseDims.height}cm. Add-ons taller than this are unavailable.
          </div>
          <div className="flex-1 overflow-y-auto">
            {ADDON_PRODUCTS.map(addon => {
              const fits = menuBaseDims.height >= addon.height;
              return (
                <button
                  key={addon.id}
                  role="menuitem"
                  className={`block w-full text-left px-4 py-3 text-sm border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors ${
                    fits
                      ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (!fits) return;
                    addAddOn(openMenu.idx, addon.id, openMenu.side);
                  }}
                  disabled={!fits}
                  aria-disabled={!fits}
                >
                  <div className="font-medium">{addon.name}</div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{addon.width}cm x {addon.height}cm</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">£{addon.price}</span>
                  </div>
                  {!fits && (
                    <div className="text-[11px] text-red-500 mt-1">Too tall for base height</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MujiShelfConfigurator;
