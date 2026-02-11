import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Product } from '../hooks/useProducts';
import Swal from 'sweetalert2';

interface ProductFormProps {
    onSubmit: (data: Partial<Product> | FormData) => void;
    initialData?: Product | null;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData = null, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        desc: '',
        image: '',
        category: '',
        size: [] as string[],
        color: [] as string[]
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price?.toString() || '0',
                desc: initialData.desc || '',
                image: initialData.image || '',
                category: initialData.category?.toLowerCase() || '',
                size: Array.isArray(initialData.size) ? initialData.size.map(s => s.toLowerCase()) : [],
                color: Array.isArray(initialData.color) ? initialData.color.map(c => c.toLowerCase()) : []
            });
            // If the existing image is a URL, we can set it as preview or just rely on formData.image
            // But if it's a relative path (from upload), we might need to prepend base URL if not already done.
        }
    }, [initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'image' && (e.target as HTMLInputElement).files) {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                processFile(file);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxToggle = (category: 'size' | 'color', value: string) => {
        setFormData(prev => {
            const current = (prev[category] as string[]) || [];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const processFile = (file: File) => {
        // Accept all image types and MP4
        if (file.type.startsWith('image/') || file.type === 'video/mp4') {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: 'Please upload an image file or MP4 video',
                confirmButtonColor: '#00d2d3'
            });
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('desc', formData.desc);
        data.append('category', formData.category);

        // Append arrays
        formData.size.forEach(s => data.append('size', s));
        formData.color.forEach(c => data.append('color', c));

        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image) {
            // If we have an existing image URL/path and no new file, we can either send it or not.
            // If we don't send 'image' key, backend won't update it (if we use direct update).
            // But our backend controller uses req.body.image if req.file is missing.
            // So we should append it if we want to keep it/update it.
            data.append('image', formData.image);
        }

        onSubmit(data);
    };

    const sizeOptions = ['s', 'm', 'l', 'xl', 'fixed size'];
    const colorOptions = ['white', 'purple', 'blue', 'black', 'red', 'green', 'yellow', 'grey'];

    return (
        <div className="max-w-2xl mx-auto my-8 bg-[#1e293b] border border-slate-700 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="py-8 border-b border-slate-800 bg-slate-800/30 text-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-[0.3em]">
                    {initialData ? 'Update Asset' : 'Register Asset'}
                </h2>
                <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest uppercase italic">Secure Fleet Entry Terminal</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Asset Designation *</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-[#00d2d3] focus:ring-1 focus:ring-[#00d2d3] outline-none transition-all placeholder:text-slate-600"
                            placeholder="Designation Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Valuation (INR) *</label>
                        <input
                            required
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-[#00d2d3] font-black focus:border-[#00d2d3] outline-none"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">System Classification *</label>
                    <select
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-[#00d2d3] outline-none cursor-pointer appearance-none"
                    >
                        <option value="" disabled>Choose Category</option>
                        <option value="clothes">Clothes</option>
                        <option value="electronics">Electronics</option>
                        <option value="sports">Sports</option>
                        <option value="vehicle">Vehicle</option>
                        <option value="food">Food</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 block">Component Dimensions:</label>
                    <div className="flex flex-wrap gap-4">
                        {sizeOptions.map(s => (
                            <label key={s} className="flex items-center gap-3 cursor-pointer group bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-700/50 hover:border-[#00d2d3] transition-all">
                                <input
                                    type="checkbox"
                                    checked={formData.size.includes(s)}
                                    onChange={() => handleCheckboxToggle('size', s)}
                                    className="w-4 h-4 accent-[#00d2d3]"
                                />
                                <span className="text-xs uppercase font-bold text-slate-400 group-hover:text-white">{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 block">Interface Themes:</label>
                    <div className="flex flex-wrap gap-4">
                        {colorOptions.map(c => (
                            <label key={c} className="flex items-center gap-3 cursor-pointer group bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-700/50 hover:border-[#00d2d3] transition-all">
                                <input
                                    type="checkbox"
                                    checked={formData.color.includes(c)}
                                    onChange={() => handleCheckboxToggle('color', c)}
                                    className="w-4 h-4 accent-[#00d2d3]"
                                />
                                <span className="text-xs capitalize font-bold text-slate-400 group-hover:text-white">{c}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Specification Log *</label>
                    <textarea
                        required
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 min-h-[120px] text-slate-200 focus:border-[#00d2d3] outline-none transition-all placeholder:text-slate-600 leading-relaxed"
                        placeholder="Technical description and specific telemetry data..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Media Upload (Images, GIFs & MP4)</label>

                    {/* Drag and Drop Zone */}
                    <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`relative w-full border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${isDragging
                            ? 'border-[#00d2d3] bg-[#00d2d3]/10 scale-[1.02]'
                            : 'border-slate-700 bg-slate-800/30 hover:border-[#00d2d3]/50 hover:bg-slate-800/50'
                            }`}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*,image/gif,video/mp4"
                            className="hidden"
                        />

                        <div className="flex flex-col items-center justify-center space-y-3">
                            {/* Upload Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isDragging ? 'bg-[#00d2d3]/20 scale-110' : 'bg-slate-700/50'
                                }`}>
                                <svg className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#00d2d3]' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>

                            {/* Text */}
                            <div className="text-center">
                                <p className={`text-sm font-bold transition-colors ${isDragging ? 'text-[#00d2d3]' : 'text-slate-300'}`}>
                                    {isDragging ? 'Drop your media here' : 'Drag & drop your media here'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">or click to upload</p>
                                <p className="text-[10px] text-slate-600 mt-2 font-semibold">
                                    Supports: JPG, PNG, GIF, WebP, MP4 (Max 50MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Media Preview */}
                    {(previewUrl || formData.image) && (
                        <div className="mt-4 relative w-full h-64 rounded-xl overflow-hidden border-2 border-[#00d2d3]/30 shadow-lg group">
                            {(imageFile?.type === 'video/mp4' || (!imageFile && formData.image?.endsWith('.mp4'))) ? (
                                <video
                                    src={previewUrl ? previewUrl : (formData.image?.startsWith('http') || formData.image?.startsWith('data:') ? formData.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${formData.image}`)}
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                />
                            ) : (
                                <img
                                    src={previewUrl ? previewUrl : (formData.image?.startsWith('http') || formData.image?.startsWith('data:') ? formData.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${formData.image}`)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                                    }}
                                />
                            )}
                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImageFile(null);
                                    setPreviewUrl('');
                                    setFormData(prev => ({ ...prev, image: '' }));
                                }}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                title="Remove media"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pointer-events-none">
                                <p className="text-xs text-white font-semibold">
                                    {imageFile ? imageFile.name : 'Current media'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 space-y-4">
                    <button
                        type="submit"
                        className="w-full bg-[#00d2d3] hover:bg-[#00b2b3] text-white font-black py-4 rounded-xl uppercase tracking-[0.4em] shadow-[0_10px_20px_rgba(0,210,211,0.3)] hover:shadow-[0_15px_30px_rgba(0,210,211,0.4)] active:scale-[0.98] transition-all duration-300"
                    >
                        {initialData ? 'COMMIT PROTOCOL' : 'DEPLOY TO FLEET'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-red-400 transition-colors"
                    >
                        ABORT OPERATION
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
