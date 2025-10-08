'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import AuthModal from "../auth/AuthModal";

const Navbar: React.FC = () => {
    const { user, loading, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleAuthSuccess = () => {
        // Auth modal will be closed automatically
        // User state will be updated via the auth context
    };

    return (
        <>
            <nav className='navbar navbar-expand-lg bg-body-tertiary'>
                <div className="container-fluid">
                    <Link className='navbar-brand' href='/'>TT</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {user && (
                            <div className="navbar-nav me-auto">
                                <Link href="/tasks" className="nav-link">Task List</Link>
                                <Link href="/planners" className="nav-link">Planners</Link>
                            </div>
                        )}
                        <div className="navbar-nav">
                            {loading ? (
                                <div className="nav-link">
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                </div>
                            ) : user ? (
                                <Link href="/user" className="nav-link">
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user.username}
                                </Link>
                            ) : (
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    <i className="bi bi-person-plus me-1"></i>
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModal 
                show={showAuthModal}
                onHide={() => setShowAuthModal(false)}
                onAuthSuccess={handleAuthSuccess}
            />
        </>
    )
};

export default Navbar;

