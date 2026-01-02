import React from 'react';
import { Outlet } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Badge
} from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            Ecommerce Store
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {isAuthenticated ? (
                                <>
                                    <IconButton color="inherit" onClick={() => navigate('/profile')}>
                                        <Person />
                                    </IconButton>
                                    <IconButton color="inherit">
                                        <Badge badgeContent={0} color="error">
                                            <ShoppingCart />
                                        </Badge>
                                    </IconButton>
                                    <Button color="inherit" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                    <Typography variant="body2">
                                        Welcome, {user?.firstName}
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Button color="inherit" onClick={() => navigate('/login')}>
                                        Login
                                    </Button>
                                    <Button color="inherit" onClick={() => navigate('/register')}>
                                        Register
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container component="main" sx={{ flex: 1, py: 4 }}>
                <Outlet />
            </Container>

            <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Ecommerce Store. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;