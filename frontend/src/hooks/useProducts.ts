import { useState, useEffect, useCallback } from 'react';
import Swal from "sweetalert2";
import api from '../api';

export interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    desc: string;
    image: string;
    size: string[];
    color: string[];
}

export interface Notification {
    type: 'success' | 'error';
    msg: string;
}

export interface FilterState {
    search: string;
    size: string[];
    color: string[];
    category: string[];
    minPrice: number;
    maxPrice: number;
    isTrash?: boolean;
}

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        size: [],
        color: [],
        category: [],
        minPrice: 0,
        maxPrice: 700000,
        isTrash: false
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filters.search.trim().length >= 3) params.search = filters.search;
            if (filters.size.length > 0) params.size = filters.size.join(',');
            if (filters.color.length > 0) params.color = filters.color.join(',');
            if (filters.category.length > 0) params.category = filters.category.join(',');
            if (filters.minPrice > 0) params.minPrice = filters.minPrice;
            if (filters.maxPrice < 700000) params.maxPrice = filters.maxPrice;


            const endpoint = filters.isTrash ? '/products/trash' : '/products';
            const response = await api.get(endpoint, { params });


            const productsList = response.data.data || [];
            setProducts(productsList);
        } catch (error) {
            console.error('FETCH ERROR:', error);
            showNotification('error', 'Error fetching products');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 400);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleFormSubmit = async (payload: Partial<Product>, editingProduct: Product | null, onSuccess: () => void) => {
        try {
            let response;
            if (editingProduct) {
                response = await api.put(`/products/${editingProduct._id}`, payload);
            } else {
                response = await api.post('/products', payload);
            }

            if (response.data.success) {
                showNotification('success', `Product ${editingProduct ? 'updated' : 'added'} successfully`);
                fetchProducts();
                onSuccess();
            } else {
                showNotification('error', response.data.message || 'Operation failed');
            }
        } catch (error: any) {
            console.error("SUBMIT ERROR", error);
            const msg = error.response?.data?.message || 'Server connection error';
            showNotification('error', msg);
        }
    };

    const deleteProduct = async (id: string) => {
        const result = await Swal.fire({
            title: "Retire Asset?",
            text: "This will permanently remove this record.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008b8b",
            cancelButtonColor: "#d33",
            confirmButtonText: "YES, RETIRE"
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`/products/${id}/delete`);
                showNotification('success', 'Asset moved to trash');
                fetchProducts();
            } catch (error) {
                showNotification('error', 'Failed to move asset to trash');
            }
        }
    };

    const restoreProduct = async (id: string) => {
        try {
            await api.patch(`/products/${id}/restore`);
            showNotification('success', 'Asset restored successfully');
            fetchProducts();
        } catch (error) {
            showNotification('error', 'Failed to restore asset');
        }
    };

    return {
        products,
        loading,
        notification,
        filters,
        setFilters,
        handleFormSubmit,
        deleteProduct,
        restoreProduct
    };
};
