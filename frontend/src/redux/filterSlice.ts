import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
    search: string;
    size: string[];
    color: string[];
    category: string[];
    minPrice: number;
    maxPrice: number;
    isTrash: boolean;
}

const initialState: FilterState = {
    search: '',
    size: [],
    color: [],
    category: [],
    minPrice: 0,
    maxPrice: 3000000,
    isTrash: false,
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        toggleSize: (state, action: PayloadAction<string>) => {
            const index = state.size.indexOf(action.payload);
            if (index !== -1) {
                state.size.splice(index, 1);
            } else {
                state.size.push(action.payload);
            }
        },
        toggleColor: (state, action: PayloadAction<string>) => {
            const index = state.color.indexOf(action.payload);
            if (index !== -1) {
                state.color.splice(index, 1);
            } else {
                state.color.push(action.payload);
            }
        },
        toggleCategory: (state, action: PayloadAction<string>) => {
            const index = state.category.indexOf(action.payload);
            if (index !== -1) {
                state.category.splice(index, 1);
            } else {
                state.category.push(action.payload);
            }
        },
        setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
            state.minPrice = action.payload.min;
            state.maxPrice = action.payload.max;
        },
        setIsTrash: (state, action: PayloadAction<boolean>) => {
            state.isTrash = action.payload;
        },
        toggleIsTrash: (state) => {
            state.isTrash = !state.isTrash;
        },
        resetFilters: (state) => {
            // Keep isTrash state when clearing filters? Usually yes, or default to false?
            // The user wanted "CLEAR FIELD ANALYTICS" button which reset everything.
            // But let's keep isTrash separate if needed.
            return { ...initialState, isTrash: state.isTrash };
        },
        setFilters: (_state, action: PayloadAction<FilterState>) => {
            return action.payload;
        }
    },
});

export const {
    setSearch,
    toggleSize,
    toggleColor,
    toggleCategory,
    setPriceRange,
    setIsTrash,
    toggleIsTrash,
    resetFilters,
    setFilters
} = filterSlice.actions;

export default filterSlice.reducer;
