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
            <nav className='navbar navbar-expand-lg bg-primary text-white shadow-sm'>
                <div className="container">
                    <Link className='navbar-brand fw-bold fs-3 text-white text-decoration-none' href='/'>
                        <i className="bi bi-check-circle-fill me-2 text-warning"></i>
                        <span className="text-warning">Task</span>Tracker
                    </Link>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {user && (
                            <div className="navbar-nav me-auto ms-4">
                                <Link href="/tasks" className="nav-link text-white fw-medium px-3 py-2 rounded-pill mx-1 hover-bg-light">
                                    <i className="bi bi-list-task me-2"></i>
                                    Tasks
                                </Link>
                                <Link href="/daily-tracker" className="nav-link text-white fw-medium px-3 py-2 rounded-pill mx-1 hover-bg-light">
                                    <i className="bi bi-calendar-day me-2"></i>
                                    Daily Tracker
                                </Link>
                                <Link href="/planners" className="nav-link text-white fw-medium px-3 py-2 rounded-pill mx-1 hover-bg-light">
                                    <i className="bi bi-bullseye me-2"></i>
                                    Planners
                                </Link>
                            </div>
                        )}
                        <div className="navbar-nav">
                            {loading ? (
                                <div className="nav-link text-white">
                                    <span className="spinner-border spinner-border-sm text-warning" role="status"></span>
                                    <span className="ms-2">Loading...</span>
                                </div>
                            ) : user ? (
                                <div className="d-flex align-items-center">
                                    <Link href="/user" className="nav-link text-white fw-medium px-3 py-2 rounded-pill hover-bg-light text-decoration-none">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                 style={{width: '32px', height: '32px'}}>
                                                <i className="bi bi-person-fill text-primary"></i>
                                            </div>
                                            <span>{user.username}</span>
                                        </div>
                                    </Link>
                                    <button 
                                        className="btn btn-outline-warning ms-2 px-3 py-1"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-warning text-primary fw-bold px-4 py-2 shadow-sm"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    <i className="bi bi-person-plus me-2"></i>
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

