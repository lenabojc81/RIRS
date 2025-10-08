'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // User is not authenticated, redirect to landing page
            router.push('/');
        }
    }, [user, loading, router]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-muted">Checking authentication...</h5>
                </div>
            </div>
        );
    }

    // Show loading while redirecting unauthenticated users
    if (!user) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-warning mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Redirecting...</span>
                    </div>
                    <h5 className="text-muted">Redirecting to login...</h5>
                </div>
            </div>
        );
    }

    // User is authenticated, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute;