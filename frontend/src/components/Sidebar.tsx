import React from 'react';
import { FilterState } from '../redux/filterSlice';

interface SidebarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    availableCategories: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, availableCategories }) => {
    const handleCheckboxChange = (category: keyof FilterState, value: string) => {
        setFilters(prev => {
            const current = (prev[category] as string[]) || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setFilters(prev => ({
            ...prev,
            maxPrice: value
        }));
    };

    const sizes = ['s', 'm', 'l', 'xl', 'fixed size'];
    const colors = ['white', 'purple', 'blue', 'black', 'red', 'green', 'yellow', 'grey'];
    const defaultCategories = ['clothes', 'electronics', 'sports', 'vehicle', 'food'];


    const normalizedAvailable = availableCategories.map(c => c.toLowerCase().trim());
    const combined = Array.from(new Set([...defaultCategories, ...normalizedAvailable]))
        .filter(c => !['clothing', 'clothings', 'standard'].includes(c));

    const categories = combined;

    return (
        <aside className="w-16 sm:w-24 md:w-36 lg:w-44 flex-shrink-0 space-y-3 sm:space-y-4 lg:space-y-6 p-1 sm:p-1.5 md:p-2 lg:p-3 border-r border-slate-800 bg-[#0f172a] h-[calc(100vh-80px)] top-20 sticky overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                <h2 className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] lg:tracking-[0.4em] text-slate-500">Filters</h2>
                <button
                    onClick={() => setFilters({ search: '', size: [], color: [], category: [], minPrice: 0, maxPrice: 3000000, isTrash: filters.isTrash })}
                    className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold uppercase text-[#00d2d3] hover:text-white transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-6">
                <h3 className="sidebar-heading text-[10px] sm:text-xs lg:text-base">Price</h3>
                <div className="space-y-2 sm:space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="3000000"
                        step="1000"
                        value={filters.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-1 sm:h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00d2d3]"
                    />
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-slate-800/40 px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 rounded border border-slate-700/50 text-[8px] sm:text-[9px] lg:text-xs font-bold text-slate-200 gap-0.5 lg:gap-0">
                        <span className="truncate">₹{(filters.minPrice / 1000).toFixed(0)}k</span>
                        <span className="opacity-20 text-[7px] sm:text-[8px] lg:text-[10px] font-black uppercase tracking-tighter hidden lg:inline">to</span>
                        <span className="truncate">₹{(filters.maxPrice / 1000).toFixed(0)}k</span>
                    </div>
                </div>
            </div>
            {/* Size Filter */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-6">
                <h3 className="sidebar-heading text-[10px] sm:text-xs lg:text-base">Size</h3>
                <div className="flex flex-wrap gap-1 justify-start">
                    {sizes.map(size => (
                        <label key={size} className={`cursor-pointer px-1 py-0.5 rounded border transition-all text-[6px] sm:text-[7px] lg:text-[9px] font-bold uppercase ${filters.size.includes(size) ? 'bg-[#00d2d3] text-black border-[#00d2d3]' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-[#00d2d3]'}`}>
                            <input
                                type="checkbox"
                                checked={filters.size.includes(size)}
                                onChange={() => handleCheckboxChange('size', size)}
                                className="hidden"
                            />
                            {size === 'fixed size' ? 'FIX' : size}
                        </label>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-6">
                <h3 className="sidebar-heading text-[10px] sm:text-xs lg:text-base">Color</h3>
                <div className="grid grid-cols-4 gap-1 place-items-center">
                    {colors.map(color => (
                        <label key={color} className={`cursor-pointer w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full border flex items-center justify-center transition-all ${filters.color.includes(color) ? 'border-[#00d2d3] scale-110' : 'border-transparent hover:border-slate-500'}`} title={color}>
                            <input
                                type="checkbox"
                                checked={filters.color.includes(color)}
                                onChange={() => handleCheckboxChange('color', color)}
                                className="hidden"
                            />
                            <div className="w-full h-full rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: color.toLowerCase().trim() }} />
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-6">
                <h3 className="sidebar-heading text-[10px] sm:text-xs lg:text-base">Category</h3>
                <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-1 sm:gap-1.5 lg:gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.category.includes(cat)}
                                onChange={() => handleCheckboxChange('category', cat)}
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 border-slate-700 rounded cursor-pointer accent-[#00d2d3] bg-slate-800 flex-shrink-0"
                            />
                            <span className="text-[8px] sm:text-[9px] lg:text-sm font-semibold capitalize text-slate-400 group-hover:text-white transition-colors truncate">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
