import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './Context/AuthContext';

// Components

//import Layout from '../Components/Layout';
//import ProductList from './Pages/ProductList';
//import Login from './Pages/Login';
//import Register from '../src/Pages/re';
//import ProductDetail from './pages/ProductDetail';
//import Profile from './pages/Profile';

import Layout from './Components/Layout';
import ProductList from './Pages/ProductList';
import Login from './Pages/Login';

import Register from './Pages/Register';
import ProductDetail from './Pages/ProductDetail';
import Profile from './Pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<ProductList />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route 
                                path="/profile" 
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } 
                            />
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;