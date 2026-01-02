import React, { useState, useEffect,useCallback  } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Pagination,
    CircularProgress,
    Alert
} from '@mui/material';
import ProductCard from '../Components/ProductCard';
import ProductFilter from '../Components/ProductFilter';
import { productService } from '../Services/Api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        brand: '',
        minPrice: 0,
        maxPrice: 1000,
        sortBy: 'name',
        page: 1,
        pageSize: 12
    });
    const [pagination, setPagination] = useState({
        totalCount: 0,
        totalPages: 1,
        page: 1,
        pageSize: 12
    });




    const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
        const data = await productService.getProducts(filters);
        setProducts(data.items);
        setPagination({
            totalCount: data.totalCount,
            totalPages: data.totalPages,
            page: data.page,
            pageSize: data.pageSize
        });
    } catch (err) {
        setError('Failed to fetch products. Please try again.');
        console.error('Error fetching products:', err);
    } finally {
        setLoading(false);
    }
}, [filters]);

    useEffect(() => {
    fetchProducts();
}, [fetchProducts]);
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handlePageChange = (event, page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleAddToCart = (product) => {
        // Implement add to cart functionality
        console.log('Add to cart:', product);
        // You can implement a cart context or state management here
    };

    if (loading && !products.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Typography variant="h4" gutterBottom>
                Products
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <ProductFilter
                        onFilterChange={handleFilterChange}
                        initialFilters={filters}
                    />
                </Grid>
                
                <Grid item xs={12} md={9}>
                    {products.length === 0 ? (
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            No products found. Try adjusting your filters.
                        </Typography>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {products.map((product) => (
                                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                        <ProductCard
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={pagination.page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductList;