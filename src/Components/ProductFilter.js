import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Button,
    Grid,
    Typography
} from '@mui/material';
import productService from '../Services/productService'; // Adjust path as needed

const ProductFilter = ({ onFilterChange, initialFilters }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        brand: '',
        minPrice: 0,
        maxPrice: 1000,
        sortBy: 'name',
        sortOrder: 'asc',
        ...initialFilters
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        setLoading(true);
        try {
            const [categoriesData, brandsData] = await Promise.all([
                productService.getCategories(),
                productService.getBrands()
            ]);
            setCategories(categoriesData);
            setBrands(brandsData);
        } catch (error) {
            console.error('Error fetching filter options:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (event, newValue) => {
        const newFilters = {
            ...filters,
            minPrice: newValue[0],
            maxPrice: newValue[1],
            page: 1
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        let sortBy = 'name';
        let sortOrder = 'asc';
        
        if (value === 'price:asc') {
            sortBy = 'price';
            sortOrder = 'asc';
        } else if (value === 'price:desc') {
            sortBy = 'price';
            sortOrder = 'desc';
        } else if (value === 'rating') {
            sortBy = 'rating';
            sortOrder = 'desc';
        } else {
            sortBy = value;
            sortOrder = 'asc';
        }
        
        const newFilters = {
            ...filters,
            sortBy,
            sortOrder,
            page: 1
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            category: '',
            brand: '',
            minPrice: 0,
            maxPrice: 1000,
            sortBy: 'name',
            sortOrder: 'asc',
            page: 1
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const getSortValue = () => {
        if (filters.sortBy === 'price') {
            return filters.sortOrder === 'desc' ? 'price:desc' : 'price:asc';
        }
        if (filters.sortBy === 'rating') {
            return 'rating';
        }
        return 'name';
    };

    if (loading) {
        return <Typography>Loading filter options...</Typography>;
    }

    return (
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
                Filters
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Search Products"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={filters.category}
                            label="Category"
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id || category} value={category.id || category}>
                                    {category.name || category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Brand</InputLabel>
                        <Select
                            value={filters.brand}
                            label="Brand"
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                        >
                            <MenuItem value="">All Brands</MenuItem>
                            {brands.map((brand) => (
                                <MenuItem key={brand.id || brand} value={brand.id || brand}>
                                    {brand.name || brand}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                        Price Range: ${filters.minPrice} - ${filters.maxPrice}
                    </Typography>
                    <Slider
                        value={[filters.minPrice, filters.maxPrice]}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                        step={10}
                        size="small"
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={getSortValue()}
                            label="Sort By"
                            onChange={handleSortChange}
                        >
                            <MenuItem value="name">Name (A-Z)</MenuItem>
                            <MenuItem value="price:asc">Price (Low to High)</MenuItem>
                            <MenuItem value="price:desc">Price (High to Low)</MenuItem>
                            <MenuItem value="rating">Rating (High to Low)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={clearFilters}
                        size="small"
                    >
                        Clear All Filters
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductFilter;