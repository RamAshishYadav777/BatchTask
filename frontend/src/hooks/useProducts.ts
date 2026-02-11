import { useCallback } from 'react';
import Swal from "sweetalert2";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setFilters as setReduxFilters, FilterState } from '../redux/filterSlice';
import { showNotification } from '../redux/notificationSlice';
import {
    useProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useRestoreProductMutation
} from './queries';

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

export const useProducts = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.filters);

    // Queries
    const { data: products = [], isLoading: loading } = useProductsQuery(filters);

    // Mutations
    const createMutation = useCreateProductMutation();
    const updateMutation = useUpdateProductMutation();
    const deleteMutation = useDeleteProductMutation();
    const restoreMutation = useRestoreProductMutation();

    const notify = (type: 'success' | 'error', msg: string) => {
        dispatch(showNotification({ type, message: msg }));
    };

    const setFilters = useCallback((update: FilterState | ((prev: FilterState) => FilterState)) => {
        if (typeof update === 'function') {
            dispatch(setReduxFilters(update(filters)));
        } else {
            dispatch(setReduxFilters(update));
        }
    }, [dispatch, filters]);

    const handleFormSubmit = async (payload: Partial<Product> | FormData, editingProduct: Product | null, onSuccess: () => void) => {
        try {
            if (editingProduct) {
                await updateMutation.mutateAsync({ id: editingProduct._id, data: payload });
                notify('success', 'Product updated successfully');
            } else {
                await createMutation.mutateAsync(payload);
                notify('success', 'Product added successfully');
            }
            onSuccess();
        } catch (error: any) {
            console.error("SUBMIT ERROR", error);
            const msg = error.response?.data?.message || 'Operation failed';
            notify('error', msg);
        }
    };

    const deleteProduct = async (id: string) => {
        const isInTrash = filters.isTrash;

        const result = await Swal.fire({
            title: isInTrash ? "Delete Permanently?" : "Retire Asset?",
            text: isInTrash
                ? "This action cannot be undone. This record will be gone forever."
                : "This will move the record to trash.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isInTrash ? "#d33" : "#008b8b",
            cancelButtonColor: "#64748b",
            confirmButtonText: isInTrash ? "YES, DELETE FOREVER" : "YES, RETIRE"
        });

        if (result.isConfirmed) {
            try {
                await deleteMutation.mutateAsync({ id, isTrash: !!isInTrash });
                notify('success', isInTrash ? 'Asset permanently deleted' : 'Asset moved to trash');
            } catch (error) {
                notify('error', `Failed to ${isInTrash ? 'permanently delete' : 'move'} asset`);
            }
        }
    };

    const restoreProduct = async (id: string) => {
        try {
            await restoreMutation.mutateAsync(id);
            notify('success', 'Asset restored successfully');
        } catch (error) {
            notify('error', 'Failed to restore asset');
        }
    };

    return {
        products,
        loading,
        filters,
        setFilters,
        handleFormSubmit,
        deleteProduct,
        restoreProduct
    };
};
