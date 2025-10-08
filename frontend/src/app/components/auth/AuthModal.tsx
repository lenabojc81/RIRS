'use client';

import React, { useState } from 'react';
import { authManager, LoginData, RegistrationData } from '../../../services/authService';

interface AuthModalProps {
    show: boolean;
    onHide: () => void;
    onAuthSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ show, onHide, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return false;
        }

        if (!isLogin && !formData.username) {
            setError('Username is required for registration');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            let result;
            
            if (isLogin) {
                const loginData: LoginData = {
                    email: formData.email,
                    password: formData.password
                };
                result = await authManager.login(loginData);
            } else {
                const registrationData: RegistrationData = {
                    email: formData.email,
                    password: formData.password,
                    username: formData.username
                };
                result = await authManager.register(registrationData);
            }

            if (result.success) {
                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    username: ''
                });
                onAuthSuccess?.();
                onHide();
            } else {
                setError(result.error || 'Authentication failed');
            }
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            email: '',
            password: '',
            username: ''
        });
    };

    const handleClose = () => {
        setError('');
        setFormData({
            email: '',
            password: '',
            username: ''
        });
        onHide();
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isLogin ? 'Login' : 'Create Account'}
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleClose}
                            disabled={loading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {!isLogin && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                            placeholder="Enter your username"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                                {!isLogin && (
                                    <div className="form-text">
                                        Password must be at least 6 characters long
                                    </div>
                                )}
                            </div>

                            <div className="d-grid gap-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            {isLogin ? 'Signing in...' : 'Creating account...'}
                                        </>
                                    ) : (
                                        isLogin ? 'Sign In' : 'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <p className="text-center w-100 mb-0">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                className="btn btn-link p-0"
                                onClick={switchMode}
                                disabled={loading}
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;