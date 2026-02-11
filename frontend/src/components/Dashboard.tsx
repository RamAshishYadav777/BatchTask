import React, { useState, useMemo, useCallback } from 'react';
import Notification from './Notification';
import Navbar from './Navbar';
import { Trash2, Home } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import ProductForm from './ProductForm';
import Sidebar from './Sidebar';
import ProductDetail from './ProductDetail';
import { useProducts, Product } from '../hooks/useProducts';

type ViewMode = 'list' | 'add' | 'edit' | 'detail';

const Dashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const {
        products,
        loading,
        filters,
        setFilters,
        handleFormSubmit,
        deleteProduct,
        restoreProduct
    } = useProducts();

    const onEdit = useCallback((p: Product) => {
        setSelectedProduct(p);
        setViewMode('edit');
    }, []);

    const onView = useCallback((p: Product) => {
        setSelectedProduct(p);
        setViewMode('detail');
    }, []);

    const onSubmit = useCallback((payload: Partial<Product> | FormData) => {
        handleFormSubmit(payload, viewMode === 'edit' ? selectedProduct : null, () => {
            setViewMode('list');
            setSelectedProduct(null);
        });
    }, [handleFormSubmit, viewMode, selectedProduct]);

    const resetToHome = useCallback(() => {
        setViewMode('list');
        setSelectedProduct(null);
    }, []);

    const handleAddClick = useCallback(() => {
        setSelectedProduct(null);
        setViewMode('add');
    }, []);

    const availableCategories = useMemo(() => Array.from(new Set(products.map((p: Product) => p.category).filter(Boolean))) as string[], [products]);

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans">
            <Notification />
            <Navbar />

            <div className="max-w-[1440px] mx-auto flex flex-row min-h-screen">
                {/* Sidebar - Always visible, narrower on mobile */}
                {viewMode === 'list' && (
                    <Sidebar filters={filters} setFilters={setFilters} availableCategories={availableCategories} />
                )}

                <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 bg-[#0f172a]">
                    {viewMode === 'list' ? (
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6 bg-[#1e293b] p-3 sm:p-4 md:p-6 border border-slate-800 shadow-xl rounded-xl">
                                <div className="w-full md:w-auto">
                                    <button
                                        onClick={handleAddClick}
                                        className="bg-[#00d2d3] hover:bg-[#008b8b] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <span>+</span> ADD ASSET
                                    </button>
                                </div>

                                <div className="flex-1 flex justify-center w-full">
                                    <div className="relative w-full max-w-xl group">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 sm:p-2.5 md:p-3 pl-8 sm:pl-9 md:pl-10 text-sm sm:text-base text-slate-100 focus:border-[#00d2d3] focus:ring-1 focus:ring-[#00d2d3] outline-none transition-all placeholder:text-slate-500 group-hover:bg-slate-800/80"
                                        />
                                        <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00d2d3] transition-colors text-sm sm:text-base">🔍</span>
                                        {loading && (
                                            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#00d2d3] border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                    {filters.isTrash && (
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, isTrash: false }))}
                                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 hover:text-[#00d2d3] hover:border-[#00d2d3]/30 transition-all flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider active:scale-95"
                                        >
                                            <Home size={14} className="sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">Back to Home</span>
                                            <span className="sm:hidden">Home</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, isTrash: !prev.isTrash }))}
                                        className={`p-2 sm:p-2.5 md:p-3 border rounded-lg transition-all active:scale-95 group relative ${filters.isTrash
                                            ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5'
                                            }`}
                                        title={filters.isTrash ? "View Active Assets" : "View Trash"}
                                    >
                                        <Trash2 size={18} className="sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                                        {!filters.isTrash && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b] animate-pulse"></div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Grid */}
                            {loading && products.length === 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                    {[...Array(6)].map((_, i) => (
                                        <ProductCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20 sm:py-32 md:py-40 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs sm:text-sm px-4">Target Asset Not Found</p>
                                    <button
                                        onClick={() => setFilters({ search: '', size: [], color: [], category: [], minPrice: 0, maxPrice: 3000000, isTrash: filters.isTrash })}
                                        className="mt-4 text-[#00d2d3] font-bold text-[10px] sm:text-xs underline uppercase tracking-tighter hover:text-white transition-colors"
                                    >
                                        CLEAR FIELD ANALYTICS
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                    {products.map((p: Product) => (
                                        <ProductCard
                                            key={p._id}
                                            product={p}
                                            onEdit={onEdit}
                                            onDelete={deleteProduct}
                                            onView={onView}
                                            onRestore={filters.isTrash ? restoreProduct : undefined}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : viewMode === 'detail' && selectedProduct ? (
                        <ProductDetail product={selectedProduct} onBack={resetToHome} />
                    ) : (
                        <ProductForm
                            onSubmit={onSubmit}
                            initialData={selectedProduct}
                            onCancel={resetToHome}
                        />
                    )}
                </main>
            </div>

            <footer className="bg-slate-950 border-t border-white/5 py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-10">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#00d2d3] rounded-md rotate-45 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00d2d3] rounded-full"></div>
                        </div>
                        <span className="text-white font-black uppercase tracking-tighter text-base sm:text-lg">Admin <span className="text-[#00d2d3]">Pro</span></span>
                    </div>

                    <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Security</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                    </div>

                    <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-600">
                        &copy; 2026 Admin Pro
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
