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
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                Welcome back,&nbsp;
                                <span className="text-warning">{user?.username}</span>!
                            </h1>
                            <p className="lead mb-4">
                                Manage your profile, track your progress, and continue your productivity journey.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg"
                                style={{ width: '120px', height: '120px' }}>
                                <i className="bi bi-person-fill text-primary" style={{ fontSize: '4rem' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Content */}
            <section className="py-5">
                <div className="container">
                    {user && (
                        <>
                            {/* Profile Information */}
                            <div className="row g-4 mb-5 justify-content-center">
                                <div className="col-12">
                                    <h2 className="display-6 fw-bold mb-4 text-center">Profile Information</h2>
                                </div>

                                {/* Main Profile Card */}
                                <div className="col-lg-8">
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body p-5">
                                            <div className="row align-items-center">
                                                {/* Profile Avatar */}
                                                <div className="col-md-4 text-center mb-4 mb-md-0">
                                                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg"
                                                        style={{ width: '120px', height: '120px' }}>
                                                        <i className="bi bi-person-fill text-white" style={{ fontSize: '4rem' }}></i>
                                                    </div>
                                                    <h3 className="mt-3 mb-1 text-primary fw-bold">{user.username}</h3>
                                                    <p className="text-muted mb-0">TaskTracker User</p>
                                                </div>

                                                {/* Profile Details */}
                                                <div className="col-md-8">
                                                    <div className="row g-3">
                                                        <div className="col-12">
                                                            <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                    style={{ width: '40px', height: '40px' }}>
                                                                    <i className="bi bi-envelope fs-6"></i>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 text-success">Email Address</h6>
                                                                    <p className="mb-0 text-muted">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {user.createdAt && (
                                                            <div className="col-12">
                                                                <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                                                    <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                        style={{ width: '40px', height: '40px' }}>
                                                                        <i className="bi bi-calendar-plus fs-6"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0 text-info">Member Since</h6>
                                                                        <p className="mb-0 text-muted">
                                                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="row g-4 mb-5">
                                <div className="col-12">
                                    <h2 className="display-6 fw-bold mb-4 text-center">Quick Actions</h2>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body text-center p-4">
                                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-list-task fs-4"></i>
                                            </div>
                                            <h4 className="card-title">My Tasks</h4>
                                            <p className="card-text text-muted mb-3">
                                                View and manage your personal tasks
                                            </p>
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => router.push('/tasks')}
                                            >
                                                View Tasks
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body text-center p-4">
                                            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-bullseye fs-4"></i>
                                            </div>
                                            <h4 className="card-title">My Planners</h4>
                                            <p className="card-text text-muted mb-3">
                                                Access your goal-oriented planners
                                            </p>
                                            <button
                                                className="btn btn-success w-100"
                                                onClick={() => router.push('/planners')}
                                            >
                                                View Planners
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body text-center p-4">
                                            <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-calendar-check fs-4"></i>
                                            </div>
                                            <h4 className="card-title">Daily Tracker</h4>
                                            <p className="card-text text-muted mb-3">
                                                Track your daily activities and habits
                                            </p>
                                            <button
                                                className="btn btn-warning w-100"
                                                onClick={() => router.push('/daily-tracker')}
                                            >
                                                Open Tracker
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body text-center p-4">
                                            <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-box-arrow-right fs-4"></i>
                                            </div>
                                            <h4 className="card-title">Sign Out</h4>
                                            <p className="card-text text-muted mb-3">
                                                Securely log out of your account
                                            </p>
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
                                                    'Sign Out'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Overview */}
                            <div className="row g-4">
                                <div className="col-12">
                                    <h2 className="display-6 fw-bold mb-4 text-center">Account Overview</h2>
                                </div>

                                <div className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm cursor-pointer" onClick={() => router.push('/completed-tasks')}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-check-circle fs-4"></i>
                                            </div>
                                            <h4 className="card-title">Completed Tasks</h4>
                                            <p className="card-text text-muted">
                                                Track your productivity with completed task metrics and achievement progress.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm cursor-pointer" onClick={() => router.push('/archived-planners')}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-archive fs-4"></i>
                                            </div>
                                            <h4 className="card-title">Archived Planners</h4>
                                            <p className="card-text text-muted">
                                                View your completed planners and their achieved goals.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm cursor-pointer" onClick={() => router.push('/labels')}>
                                        <div className="card-body text-center p-4">
                                            <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{ width: '60px', height: '60px' }}>
                                                <i className="bi bi-tags fs-4"></i>
                                            </div>
                                            <h4 className="card-title">Task Labels</h4>
                                            <p className="card-text text-muted">
                                                Organize and categorize your tasks with custom labels and colors.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </ProtectedRoute>
    );
}
