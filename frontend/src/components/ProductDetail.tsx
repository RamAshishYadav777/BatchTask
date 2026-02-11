import React from 'react';
import { Product } from '../hooks/useProducts';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
    return (
        <div className="max-w-5xl mx-auto p-4 animate-in fade-in zoom-in duration-700">
            <div className="bg-[#1e293b] rounded-[2rem] border border-slate-700/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row backdrop-blur-xl">
                <div className="md:w-1/2 p-8 bg-black/20 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-700/50">
                    {product.image?.endsWith('.mp4') ? (
                        <video
                            src={product.image?.startsWith('http') || product.image?.startsWith('data:') ? product.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`}
                            className="w-full h-auto object-cover rounded shadow-sm"
                            controls
                            autoPlay
                            loop
                        />
                    ) : (
                        <img
                            src={product.image?.startsWith('http') || product.image?.startsWith('data:') ? product.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image || 'default.png'}`}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded shadow-sm"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                            }}
                        />
                    )}
                </div>
                <div className="md:w-1/2 p-12 space-y-10 text-left bg-transparent">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white tracking-tighter leading-none">{product.name || 'Untitled Asset'}</h2>
                        <div className="w-24 h-2 bg-[#00d2d3] rounded-full shadow-[0_0_15px_rgba(0,210,211,0.5)]"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 text-slate-300">
                        <div className="flex items-center gap-6">
                            <span className="w-28 font-black text-slate-500 uppercase text-[10px] tracking-[0.3em] border-l-2 border-slate-700 pl-4">Valuation</span>
                            <span className="text-3xl font-black text-white tracking-tight">₹{product.price !== undefined ? product.price.toLocaleString('en-IN') : 'N/A'}</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <span className="w-28 font-black text-slate-500 uppercase text-[10px] tracking-[0.3em] border-l-2 border-slate-700 pl-4 mt-1">Footprint</span>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(product.size) && product.size.length > 0)
                                    ? product.size.map(s => <span key={s} className="px-4 py-2 bg-slate-800 text-slate-100 rounded-xl text-[10px] font-black uppercase border border-slate-700 shadow-lg tracking-wider transition-all hover:border-[#00d2d3]">{s}</span>)
                                    : <span className="text-slate-600 italic text-sm">No telemetry provided</span>}
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <span className="w-28 font-black text-slate-500 uppercase text-[10px] tracking-[0.3em] border-l-2 border-slate-700 pl-4 mt-1">Palette</span>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(product.color) && product.color.length > 0)
                                    ? product.color.map(c => <span key={c} className="px-4 py-2 bg-slate-800 text-slate-100 rounded-xl text-[10px] font-black capitalize border border-slate-700 shadow-lg tracking-wider transition-all hover:border-[#00d2d3]">{c}</span>)
                                    : <span className="text-slate-600 italic text-sm">Standard configuration</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="w-28 font-black text-slate-500 uppercase text-[10px] tracking-[0.3em] border-l-2 border-slate-700 pl-4">Sector</span>
                            <span className="text-xl font-bold text-[#00d2d3] tracking-tight">{product.category || 'Standard Intelligence'}</span>
                        </div>

                        <div className="pt-8 border-t border-slate-800">
                            <h4 className="font-black text-slate-500 uppercase text-[10px] tracking-[0.4em] mb-4">Technical Logs & Analysis:</h4>
                            <p className="text-slate-400 leading-relaxed text-sm font-medium italic">
                                "{product.desc || (product as any).description || "No tactical record or technical documentation has been initialized for this asset."}"
                            </p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={onBack}
                            className="bg-transparent text-[#00d2d3] border-2 border-[#00d2d3] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-[#00d2d3] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,210,211,0.2)] active:scale-95 group/btn"
                        >
                            <span className="group-hover/btn:-translate-x-2 transition-transform duration-300">←</span> RETURN TO TERMINAL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
