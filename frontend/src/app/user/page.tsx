'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function UserPage() {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.push('/'); // Redirect to landing page after logout
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h3 className="card-title mb-0">
                                    <i className="bi bi-person-circle me-2"></i>
                                    User Profile
                                </h3>
                            </div>
                            <div className="card-body">
                                {user && (
                                    <div className="mb-4">
                                        <div className="text-center mb-4">
                                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                                 style={{width: '100px', height: '100px'}}>
                                                <i className="bi bi-person-fill" style={{fontSize: '3rem'}}></i>
                                            </div>
                                            <h4 className="mb-1">{user.username}</h4>
                                            <p className="text-muted mb-0">Task Manager User</p>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-12">
                                                <div className="border rounded p-3 bg-light">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <strong className="text-muted">
                                                                <i className="bi bi-person me-1"></i>
                                                                Username:
                                                            </strong>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <span className="text-dark">{user.username}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="border rounded p-3 bg-light">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <strong className="text-muted">
                                                                <i className="bi bi-envelope me-1"></i>
                                                                Email:
                                                            </strong>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <span className="text-dark">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {user.createdAt && (
                                                <div className="col-12">
                                                    <div className="border rounded p-3 bg-light">
                                                        <div className="row">
                                                            <div className="col-sm-4">
                                                                <strong className="text-muted">
                                                                    <i className="bi bi-calendar-plus me-1"></i>
                                                                    Member Since:
                                                                </strong>
                                                            </div>
                                                            <div className="col-sm-8">
                                                                <span className="text-dark">
                                                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-light">
                                <div className="row g-2">
                                    <div className="col-sm-6">
                                        <button 
                                            className="btn btn-outline-secondary w-100"
                                            onClick={() => router.back()}
                                        >
                                            <i className="bi bi-arrow-left me-1"></i>
                                            Back
                                        </button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button 
                                            className="btn btn-danger w-100"
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Signing out...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-box-arrow-right me-1"></i>
                                                    Sign Out
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="card shadow-sm mt-4">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-lightning me-2"></i>
                                    Quick Actions
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-2">
                                    <div className="col-sm-6">
                                        <button 
                                            className="btn btn-outline-primary w-100"
                                            onClick={() => router.push('/tasks')}
                                        >
                                            <i className="bi bi-list-task me-1"></i>
                                            View Tasks
                                        </button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button 
                                            className="btn btn-outline-success w-100"
                                            onClick={() => router.push('/planners')}
                                        >
                                            <i className="bi bi-bullseye me-1"></i>
                                            View Planners
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Stats Card */}
                        <div className="card shadow-sm mt-4">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-graph-up me-2"></i>
                                    Account Overview
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row text-center">
                                    <div className="col-4">
                                        <div className="border-end">
                                            <h4 className="text-primary mb-1">
                                                <i className="bi bi-check-circle"></i>
                                            </h4>
                                            <small className="text-muted">Tasks</small>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="border-end">
                                            <h4 className="text-success mb-1">
                                                <i className="bi bi-target"></i>
                                            </h4>
                                            <small className="text-muted">Planners</small>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <h4 className="text-info mb-1">
                                            <i className="bi bi-trophy"></i>
                                        </h4>
                                        <small className="text-muted">Goals</small>
                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        Keep up the great work managing your productivity!
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
