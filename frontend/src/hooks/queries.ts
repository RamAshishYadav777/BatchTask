import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { FilterState } from '../redux/filterSlice';
import { Product } from './useProducts';

// FETCH PRODUCTS
export const useProductsQuery = (filters: FilterState) => {
    return useQuery({
        queryKey: [
            "products",
            filters.search,
            filters.size,
            filters.color,
            filters.category,
            filters.minPrice,
            filters.maxPrice,
            filters.isTrash,
        ],
        queryFn: async () => {
            const params: any = {};
            if (filters.search.trim().length >= 3) params.search = filters.search;
            if (filters.size.length > 0) params.size = filters.size.join(",");
            if (filters.color.length > 0) params.color = filters.color.join(",");
            if (filters.category.length > 0)
                params.category = filters.category.join(",");
            if (filters.minPrice > 0) params.minPrice = filters.minPrice;
            if (filters.maxPrice < 3000000) params.maxPrice = filters.maxPrice;

            const endpoint = filters.isTrash ? "/api/v1/products/trash" : "/api/v1/products";
            const response = await api.get(endpoint, { params });
            return response.data.data || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
        gcTime: 1000 * 60 * 10, // 10 minutes cache time
        refetchOnMount: true, // Always refetch on mount
        refetchOnWindowFocus: false, // Prevent refetch on window focus
        placeholderData: (previousData) => previousData, // Keep previous data while fetching
    });
};

// CREATE PRODUCT
export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newProduct: Partial<Product> | FormData) => {
            const response = await api.post("/api/v1/products", newProduct);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// UPDATE PRODUCT
export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Product> | FormData }) => {
            const response = await api.put(`/api/v1/products/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// SOFT DELETE / TRASH
export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isTrash }: { id: string; isTrash: boolean }) => {
            if (isTrash) {
                // Permanent delete
                await api.delete(`/api/v1/products/${id}`);
            } else {
                // Soft delete
                await api.patch(`/api/v1/products/${id}/delete`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// RESTORE
export const useRestoreProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/api/v1/products/${id}/restore`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
