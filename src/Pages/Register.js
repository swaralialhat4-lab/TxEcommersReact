import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    Grid,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    InputAdornment,
    FormHelperText
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Phone,
    LocationOn,
    Lock
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../Context/AuthContext';

// Validation schema
const validationSchema = yup.object({
    firstName: yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters'),
    
    lastName: yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters'),
    
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
    
    phoneNumber: yup.string()
        .nullable()
        .matches(/^[+]?[0-9\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
    
    address: yup.string()
        .nullable()
        .max(200, 'Address cannot exceed 200 characters'),
    
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const { register: registerUser } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        setSuccessMessage('');

        try {
            // Remove confirmPassword from data before sending to API
            const { confirmPassword, ...userData } = data;
            
            const result = await registerUser(userData);
            
            if (result.success) {
                setSuccessMessage('Registration successful! Redirecting...');
                reset();
                
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setServerError(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setServerError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const PasswordStrengthIndicator = ({ password }) => {
        if (!password) return null;

        const getStrength = (pwd) => {
            let strength = 0;
            if (pwd.length >= 8) strength++;
            if (/[a-z]/.test(pwd)) strength++;
            if (/[A-Z]/.test(pwd)) strength++;
            if (/[0-9]/.test(pwd)) strength++;
            if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
            return strength;
        };

        const strength = getStrength(password);
        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'];

        return (
            <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', gap: '2px', mb: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: 1,
                                height: 4,
                                backgroundColor: index <= strength ? strengthColors[strength - 1] : '#e0e0e0',
                                borderRadius: 1
                            }}
                        />
                    ))}
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        color: strengthColors[strength - 1],
                        fontWeight: 'medium'
                    }}
                >
                    Password strength: {strengthLabels[strength - 1] || 'None'}
                </Typography>
            </Box>
        );
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ 
                mt: { xs: 4, md: 8 }, 
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: { xs: 3, md: 4 },
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 600,
                                color: 'primary.main'
                            }}
                        >
                            Create Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Join our ecommerce community today
                        </Typography>
                    </Box>

                    {serverError && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 3 }}
                            onClose={() => setServerError('')}
                        >
                            {serverError}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert 
                            severity="success" 
                            sx={{ mb: 3 }}
                        >
                            {successMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            {/* First Name */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" error={!!errors.firstName}>
                                    <InputLabel htmlFor="first-name">First Name</InputLabel>
                                    <OutlinedInput
                                        id="first-name"
                                        label="First Name"
                                        {...register('firstName')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.firstName && (
                                        <FormHelperText error>
                                            {errors.firstName.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" error={!!errors.lastName}>
                                    <InputLabel htmlFor="last-name">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="last-name"
                                        label="Last Name"
                                        {...register('lastName')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.lastName && (
                                        <FormHelperText error>
                                            {errors.lastName.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" error={!!errors.email}>
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        label="Email Address"
                                        type="email"
                                        {...register('email')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Email color="action" />
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <FormHelperText error>
                                            {errors.email.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Phone Number */}
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" error={!!errors.phoneNumber}>
                                    <InputLabel htmlFor="phone">Phone Number (Optional)</InputLabel>
                                    <OutlinedInput
                                        id="phone"
                                        label="Phone Number (Optional)"
                                        {...register('phoneNumber')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Phone color="action" />
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.phoneNumber && (
                                        <FormHelperText error>
                                            {errors.phoneNumber.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Address */}
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" error={!!errors.address}>
                                    <InputLabel htmlFor="address">Address (Optional)</InputLabel>
                                    <OutlinedInput
                                        id="address"
                                        label="Address (Optional)"
                                        {...register('address')}
                                        multiline
                                        rows={2}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <LocationOn color="action" sx={{ alignSelf: 'flex-start', mt: 1 }} />
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.address && (
                                        <FormHelperText error>
                                            {errors.address.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" error={!!errors.password}>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        id="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.password && (
                                        <FormHelperText error>
                                            {errors.password.message}
                                        </FormHelperText>
                                    )}
                                    <PasswordStrengthIndicator 
                                        password={register('password').ref?.value} 
                                    />
                                    <FormHelperText>
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Confirm Password */}
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" error={!!errors.confirmPassword}>
                                    <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        id="confirm-password"
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        disabled={loading}
                                    />
                                    {errors.confirmPassword && (
                                        <FormHelperText error>
                                            {errors.confirmPassword.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Terms and Conditions */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        By creating an account, you agree to our{' '}
                                        <Link href="#" underline="hover" color="primary">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="#" underline="hover" color="primary">
                                            Privacy Policy
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Box 
                                                component="span" 
                                                sx={{ 
                                                    display: 'inline-block',
                                                    width: 20,
                                                    height: 20,
                                                    mr: 2,
                                                    border: '2px solid',
                                                    borderColor: 'transparent',
                                                    borderTopColor: 'white',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    '@keyframes spin': {
                                                        '0%': { transform: 'rotate(0deg)' },
                                                        '100%': { transform: 'rotate(360deg)' }
                                                    }
                                                }}
                                            />
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </Grid>

                            {/* Login Link */}
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Already have an account?{' '}
                                        <RouterLink 
                                            to="/login" 
                                            style={{ 
                                                textDecoration: 'none',
                                                color: '#1976d2',
                                                fontWeight: 600
                                            }}
                                        >
                                            Sign in here
                                        </RouterLink>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

                {/* Additional Info */}
                <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 600 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Why create an account?</strong>
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    ✓ Faster checkout
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    ✓ Order tracking
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    ✓ Wishlist & favorites
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;