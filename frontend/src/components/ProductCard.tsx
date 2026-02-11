import React from 'react';
import { Product } from '../hooks/useProducts';

interface ProductCardProps {
    product: Product;
    onEdit: (p: Product) => void;
    onDelete: (id: string) => void;
    onView: (p: Product) => void;
    onRestore?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onView, onRestore }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // Ignore auto-play restriction errors or interruptions
            });
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset video to start
        }
    };

    return (
        <div
            className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md overflow-hidden flex flex-col h-full shadow-2xl hover:shadow-[0_0_30px_rgba(0,210,211,0.1)] transition-all duration-300 rounded-2xl group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="h-80 overflow-hidden bg-slate-900 relative">
                {product.image?.endsWith('.mp4') ? (
                    <video
                        ref={videoRef}
                        src={product.image?.startsWith('http') || product.image?.startsWith('data:') ? product.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <img
                        src={product.image?.startsWith('http') || product.image?.startsWith('data:') ? product.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image || 'default.png'}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                        }}
                        loading="lazy"
                        decoding="async"
                    />
                )}

                {/* Category Badge - Top Left */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#00d2d3]/90 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                        {product.category || 'Asset'}
                    </span>
                </div>

                {/* Size Display - Bottom Left */}
                <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1">
                    {Array.isArray(product.size) && product.size.map((s: string, idx: number) => (
                        <span key={idx} className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded border border-white/10 uppercase tracking-tighter shadow-lg">
                            {String(s).toUpperCase()}
                        </span>
                    ))}
                </div>

                {/* Color Dots - Bottom Right */}
                <div className="absolute bottom-4 right-4 z-10 flex gap-1.5 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl">
                    {Array.isArray(product.color) && product.color.length > 0 ? (
                        product.color.map((c: string, i: number) => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                style={{ backgroundColor: String(c).toLowerCase().trim() }}
                                title={String(c)}
                            />
                        ))
                    ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-white/20" />
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                {/* Visual Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between bg-slate-800/10">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white tracking-tighter leading-tight group-hover:text-[#00d2d3] transition-colors duration-300 uppercase">
                            {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                            {product.desc || "No description available for this item."}
                        </p>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-700/50 pt-4 mt-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Price</span>
                            <span className="text-2xl font-black text-white tracking-tight">
                                ₹{product.price?.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {!onRestore && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                                        className="bg-slate-700/50 hover:bg-[#00d2d3] text-white hover:text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-slate-600 hover:border-[#00d2d3] shadow-lg"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(product._id); }}
                                        className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-red-500/20 hover:border-red-600 shadow-lg"
                                        title="Delete"
                                    >
                                        🗑
                                    </button>
                                </>
                            )}
                            {onRestore && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRestore(product._id); }}
                                        className="bg-green-500/10 hover:bg-green-600 text-green-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-green-500/20 hover:border-green-600 shadow-lg"
                                        title="Restore"
                                    >
                                        🔄
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(product._id); }}
                                        className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-red-500/20 hover:border-red-600 shadow-lg"
                                        title="Delete Permanently"
                                    >
                                        🗑
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onView(product); }}
                className="w-full py-4 bg-[#00d2d3]/5 hover:bg-[#00d2d3] text-[#00d2d3] hover:text-slate-950 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all duration-500 border-t border-slate-700/50 group/btn relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10">See Details</span>
            </button>
        </div>
    );
};

export default ProductCard;
