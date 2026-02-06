import React from 'react';
import { FilterState } from '../hooks/useProducts';

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
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-12 p-6 border-r border-slate-800 bg-[#0f172a] min-h-screen">
            <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Search Filters</h2>
                <button
                    onClick={() => setFilters({ search: '', size: [], color: [], category: [], minPrice: 0, maxPrice: 700000 })}
                    className="text-[10px] font-bold uppercase text-[#00d2d3] hover:text-white transition-colors"
                >
                    Reset All
                </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-6">
                <h3 className="sidebar-heading">Filter by Price</h3>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="700000"
                        step="1000"
                        value={filters.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00d2d3]"
                    />
                    <div className="flex justify-between items-center bg-slate-800/40 px-3 py-2 rounded border border-slate-700/50 text-xs font-bold text-slate-200">
                        <span>₹{filters.minPrice.toLocaleString()}</span>
                        <span className="opacity-20 text-[10px] font-black uppercase tracking-tighter mx-2">to</span>
                        <span>₹{filters.maxPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            {/* Size Filter */}
            <div className="space-y-6">
                <h3 className="sidebar-heading">Filter by Size</h3>
                <div className="space-y-3">
                    {sizes.map(size => (
                        <label key={size} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.size.includes(size)}
                                onChange={() => handleCheckboxChange('size', size)}
                                className="w-4 h-4 border-slate-700 rounded cursor-pointer accent-[#00d2d3] bg-slate-800"
                            />
                            <span className="text-sm font-semibold uppercase text-slate-400 group-hover:text-white transition-colors tracking-widest">{size}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-6">
                <h3 className="sidebar-heading">Filter by Color</h3>
                <div className="space-y-3">
                    {colors.map(color => (
                        <label key={color} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.color.includes(color)}
                                onChange={() => handleCheckboxChange('color', color)}
                                className="w-4 h-4 border-slate-700 rounded cursor-pointer accent-[#00d2d3] bg-slate-800"
                            />
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: color.toLowerCase().trim() }} />
                                <span className="text-sm font-semibold capitalize text-slate-400 group-hover:text-white transition-colors">{color}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-6">
                <h3 className="sidebar-heading">Filter by Category</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.category.includes(cat)}
                                onChange={() => handleCheckboxChange('category', cat)}
                                className="w-4 h-4 border-slate-700 rounded cursor-pointer accent-[#00d2d3] bg-slate-800"
                            />
                            <span className="text-sm font-semibold capitalize text-slate-400 group-hover:text-white transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
