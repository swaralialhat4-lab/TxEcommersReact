import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Avatar,
    Alert,
    Divider,
    CircularProgress,
    IconButton,
    InputAdornment,
    Card,
    CardContent,
    Tab,
    Tabs
} from '@mui/material';
import {
    Edit,
    Save,
    Cancel,
    Person,
    Email,
    Phone,
    LocationOn,
    Lock,
    Visibility,
    VisibilityOff,
    ShoppingBag,
    History,
    Favorite,
    Security
} from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';

// Tab panel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Profile = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    // Load user orders (mock data for now)
    useEffect(() => {
        // In a real app, you would fetch this from your API
        const mockOrders = [
            {
                id: 1,
                orderNumber: 'ORD-2024-001',
                date: '2024-01-15',
                total: 299.99,
                status: 'Delivered',
                items: 2
            },
            {
                id: 2,
                orderNumber: 'ORD-2024-002',
                date: '2024-01-10',
                total: 149.99,
                status: 'Processing',
                items: 1
            },
            {
                id: 3,
                orderNumber: 'ORD-2024-003',
                date: '2024-01-05',
                total: 499.99,
                status: 'Shipped',
                items: 3
            }
        ];

        const mockWishlist = [
            {
                id: 1,
                name: 'Wireless Headphones',
                price: 199.99,
                image: 'https://via.placeholder.com/100',
                addedDate: '2024-01-10'
            },
            {
                id: 2,
                name: 'Smart Watch',
                price: 299.99,
                image: 'https://via.placeholder.com/100',
                addedDate: '2024-01-12'
            },
            {
                id: 3,
                name: 'Running Shoes',
                price: 89.99,
                image: 'https://via.placeholder.com/100',
                addedDate: '2024-01-08'
            }
        ];

        setOrders(mockOrders);
        setWishlist(mockWishlist);
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Reset form data on cancel
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
        setEditMode(!editMode);
        setError('');
        setSuccess('');
    };

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        const newErrors = {};

        if (editMode) {
            // Only validate password fields if any password field is filled
            if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
                if (!formData.currentPassword) {
                    newErrors.currentPassword = 'Current password is required to change password';
                }
                if (!formData.newPassword) {
                    newErrors.newPassword = 'New password is required';
                } else if (formData.newPassword.length < 8) {
                    newErrors.newPassword = 'Password must be at least 8 characters';
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }

            // Phone validation (optional)
            if (formData.phoneNumber && !/^[+]?[0-9\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
                newErrors.phoneNumber = 'Please enter a valid phone number';
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            // In a real app, you would set these errors to display
            console.log('Validation errors:', validationErrors);
            setError('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Prepare data for API call
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address
            };

            // Add password data only if user is changing password
            if (formData.currentPassword && formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            // TODO: Replace with actual API call
            console.log('Updating profile:', updateData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // For demo purposes - in real app, update user context with response
            setSuccess('Profile updated successfully!');
            setEditMode(false);
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    // Calculate user initials for avatar
    const getUserInitials = () => {
        if (!user) return '';
        const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
        const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    };

    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Grid container spacing={4}>
                {/* Left Sidebar */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: '2.5rem',
                                    bgcolor: 'primary.main',
                                    mb: 2
                                }}
                            >
                                {getUserInitials()}
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Member since {new Date().getFullYear()}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Account Stats
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="h6" color="primary">
                                            {orders.length}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Orders
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="h6" color="primary">
                                            {wishlist.length}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Wishlist
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleEditToggle}
                            startIcon={editMode ? <Cancel /> : <Edit />}
                            sx={{ mb: 2 }}
                        >
                            {editMode ? 'Cancel Edit' : 'Edit Profile'}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                            sx={{ mb: 2 }}
                        >
                            Logout
                        </Button>
                    </Paper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleTabChange}
                                variant="fullWidth"
                            >
                                <Tab 
                                    icon={<Person />} 
                                    iconPosition="start"
                                    label="Profile Info" 
                                />
                                <Tab 
                                    icon={<ShoppingBag />} 
                                    iconPosition="start"
                                    label="My Orders" 
                                />
                                <Tab 
                                    icon={<Favorite />} 
                                    iconPosition="start"
                                    label="Wishlist" 
                                />
                                <Tab 
                                    icon={<Security />} 
                                    iconPosition="start"
                                    label="Security" 
                                />
                            </Tabs>
                        </Box>

                        {/* Profile Info Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ px: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Personal Information
                                </Typography>
                                
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                                        {success}
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                disabled={!editMode || loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                disabled={!editMode || loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!editMode || loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Email color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                disabled={!editMode || loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                disabled={!editMode || loading}
                                                multiline
                                                rows={3}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LocationOn color="action" sx={{ alignSelf: 'flex-start', mt: 1 }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        {editMode && (
                                            <>
                                                <Grid item xs={12}>
                                                    <Divider sx={{ my: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Change Password (Optional)
                                                        </Typography>
                                                    </Divider>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Current Password"
                                                        name="currentPassword"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.currentPassword}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Lock color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={handlePasswordVisibility}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="New Password"
                                                        name="newPassword"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.newPassword}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Confirm New Password"
                                                        name="confirmPassword"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        {editMode && (
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleEditToggle}
                                                        disabled={loading}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        startIcon={<Save />}
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            'Save Changes'
                                                        )}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </form>
                            </Box>
                        </TabPanel>

                        {/* My Orders Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <Box sx={{ px: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Order History
                                </Typography>

                                {orders.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No orders yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Start shopping to see your orders here
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {orders.map((order) => (
                                            <Grid item xs={12} key={order.id}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Grid container alignItems="center" spacing={2}>
                                                            <Grid item xs={12} md={3}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Order #{order.orderNumber}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {order.date}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Typography variant="body2">
                                                                    {order.items} item{order.items > 1 ? 's' : ''}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Typography variant="h6" color="primary">
                                                                    ${order.total.toFixed(2)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Box sx={{ 
                                                                    display: 'inline-block',
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    bgcolor: order.status === 'Delivered' ? 'success.light' :
                                                                              order.status === 'Processing' ? 'warning.light' :
                                                                              order.status === 'Shipped' ? 'info.light' : 'grey.200',
                                                                    color: order.status === 'Delivered' ? 'success.dark' :
                                                                           order.status === 'Processing' ? 'warning.dark' :
                                                                           order.status === 'Shipped' ? 'info.dark' : 'text.primary'
                                                                }}>
                                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                        {order.status}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </TabPanel>

                        {/* Wishlist Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <Box sx={{ px: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    My Wishlist
                                </Typography>

                                {wishlist.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Your wishlist is empty
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Add items you like to your wishlist
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        {wishlist.map((item) => (
                                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                                <Card>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <Avatar 
                                                                src={item.image} 
                                                                alt={item.name}
                                                                variant="rounded"
                                                                sx={{ width: 60, height: 60, mr: 2 }}
                                                            />
                                                            <Box>
                                                                <Typography variant="subtitle1" noWrap>
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography variant="h6" color="primary">
                                                                    ${item.price.toFixed(2)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Added on {item.addedDate}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </TabPanel>

                        {/* Security Tab */}
                        <TabPanel value={tabValue} index={3}>
                            <Box sx={{ px: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Security Settings
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                    Two-Factor Authentication
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    Add an extra layer of security to your account
                                                </Typography>
                                                <Button variant="outlined" size="small">
                                                    Enable 2FA
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                    Login History
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                                <Button variant="outlined" size="small">
                                                    View All Sessions
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                    Account Deletion
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    Permanently delete your account and all associated data
                                                </Typography>
                                                <Button variant="outlined" color="error" size="small">
                                                    Delete Account
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;