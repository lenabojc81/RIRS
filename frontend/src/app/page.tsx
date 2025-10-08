
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            // User is logged in, redirect to tasks page
            router.push('/tasks');
        }
    }, [user, router]);

    const handleAuthSuccess = () => {
        // Auth modal will be closed automatically
        // User will be redirected via the auth state listener
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">
                                Achieve Your Goals with 
                                <span className="text-warning"> Smart Planning</span>
                            </h1>
                            <p className="lead mb-4">
                                Transform your productivity with our comprehensive task management and goal-oriented planning system. 
                                Break down big dreams into actionable steps and track your progress every step of the way.
                            </p>
                            <div className="d-flex gap-3">
                                <button 
                                    className="btn btn-warning btn-lg px-4"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    Get Started Free
                                </button>
                                <button 
                                    className="btn btn-outline-light btn-lg px-4"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="bg-white rounded-3 p-4 shadow-lg">
                                <h3 className="text-primary mb-3">📋 Task Tracker</h3>
                                <div className="text-start">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span className="text-dark">Complete project proposal</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-circle text-secondary me-2"></i>
                                        <span className="text-dark">Review team feedback</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-circle text-secondary me-2"></i>
                                        <span className="text-dark">Prepare presentation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <h2 className="display-5 fw-bold mb-3">Why Choose Our Platform?</h2>
                            <p className="lead text-muted">
                                Everything you need to stay organized and achieve your goals
                            </p>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-list-task fs-4"></i>
                                    </div>
                                    <h4 className="card-title">Task Management</h4>
                                    <p className="card-text text-muted">
                                        Create, organize, and track your tasks with ease. Set priorities, due dates, and monitor your progress in real-time.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-bullseye fs-4"></i>
                                    </div>
                                    <h4 className="card-title">Goal-Oriented Planning</h4>
                                    <p className="card-text text-muted">
                                        Create comprehensive planners with milestone goals. Break down complex objectives into manageable weekly targets.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-graph-up fs-4"></i>
                                    </div>
                                    <h4 className="card-title">Progress Tracking</h4>
                                    <p className="card-text text-muted">
                                        Visualize your progress with intuitive timelines and completion tracking. Stay motivated with clear milestone achievements.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-calendar-event fs-4"></i>
                                    </div>
                                    <h4 className="card-title">Timeline Management</h4>
                                    <p className="card-text text-muted">
                                        Organize your goals across years, months, and weeks. Get a clear overview of what needs to be accomplished when.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-shield-check fs-4"></i>
                                    </div>
                                    <h4 className="card-title">Secure & Private</h4>
                                    <p className="card-text text-muted">
                                        Your data is protected with enterprise-grade security. Only you have access to your tasks and planning information.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-phone-laptop fs-4"></i>
                                    </div>
                                    <h4 className="card-title">Cross-Platform</h4>
                                    <p className="card-text text-muted">
                                        Access your tasks and plans from any device. Seamless synchronization keeps everything up-to-date across platforms.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-light py-5">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
                            <p className="lead text-muted">
                                Simple steps to transform your productivity
                            </p>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 text-center">
                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                <span className="fs-3 fw-bold">1</span>
                            </div>
                            <h4>Create Your Account</h4>
                            <p className="text-muted">
                                Sign up in seconds and start organizing your life. No complex setup required.
                            </p>
                        </div>
                        
                        <div className="col-lg-4 text-center">
                            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                <span className="fs-3 fw-bold">2</span>
                            </div>
                            <h4>Set Your Goals</h4>
                            <p className="text-muted">
                                Create planners with milestone goals and break them down into weekly objectives.
                            </p>
                        </div>
                        
                        <div className="col-lg-4 text-center">
                            <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                <span className="fs-3 fw-bold">3</span>
                            </div>
                            <h4>Track Progress</h4>
                            <p className="text-muted">
                                Monitor your achievements, complete tasks, and celebrate your milestones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-white py-5">
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="display-5 fw-bold mb-3">Ready to Achieve Your Goals?</h2>
                            <p className="lead mb-4">
                                Join thousands of users who have transformed their productivity with our platform.
                            </p>
                            <button 
                                className="btn btn-warning btn-lg px-5"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Start Your Journey Today
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auth Modal */}
            <AuthModal 
                show={showAuthModal}
                onHide={() => setShowAuthModal(false)}
                onAuthSuccess={handleAuthSuccess}
            />
        </>
    );
}
