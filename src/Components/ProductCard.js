import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    Rating
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

const ProductCard = ({ product, onAddToCart }) => {
    const discountedPrice = product.discountPercentage
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {product.imageUrl && (
                <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 2 }}
                />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3" noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviewCount})
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={product.brand} size="small" />
                    <Chip label={product.category} size="small" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary">
                        ${discountedPrice.toFixed(2)}
                    </Typography>
                    {product.discountPercentage && (
                        <Typography variant="body2" color="error" sx={{ textDecoration: 'line-through' }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Stock: {product.stockQuantity}
                </Typography>
            </CardContent>
            
            <Box sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => onAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                >
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;