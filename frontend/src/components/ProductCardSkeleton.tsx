import React from 'react';

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-pulse">
            {/* Image Skeleton */}
            <div className="relative h-56 sm:h-64 bg-slate-800/50">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-800/20"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                {/* Title */}
                <div className="h-5 sm:h-6 bg-slate-800/50 rounded w-3/4"></div>

                {/* Price */}
                <div className="h-6 sm:h-7 bg-slate-700/50 rounded w-1/2"></div>

                {/* Category */}
                <div className="h-4 bg-slate-800/50 rounded w-1/3"></div>

                {/* Size & Color */}
                <div className="flex gap-2">
                    <div className="h-6 w-6 bg-slate-800/50 rounded"></div>
                    <div className="h-6 w-6 bg-slate-800/50 rounded"></div>
                    <div className="h-6 w-6 bg-slate-800/50 rounded"></div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                    <div className="h-9 flex-1 bg-slate-800/50 rounded-lg"></div>
                    <div className="h-9 w-9 bg-slate-800/50 rounded-lg"></div>
                    <div className="h-9 w-9 bg-slate-800/50 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
