'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-white mt-auto">
            {/* Main Footer Content */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Brand Section */}
                    <div className="col-lg-6 col-md-6">
                        <div className="mb-4">
                            <h5 className="fw-bold mb-3">
                                <i className="bi bi-check-circle-fill me-2 text-warning"></i>
                                <span className="text-warning">Task</span>Tracker
                            </h5>
                            <p className="text-light mb-3">
                                Organize, prioritize, and achieve your goals with our comprehensive task and planner management system. 
                                Stay productive and make every day count with intelligent task management and goal planning.
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold mb-3 text-warning">Navigation</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/tasks" className="text-light text-decoration-none hover-warning">
                                    <i className="bi bi-list-task me-2"></i>Tasks
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/planners" className="text-light text-decoration-none hover-warning">
                                    <i className="bi bi-bullseye me-2"></i>Planners
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/user" className="text-light text-decoration-none hover-warning">
                                    <i className="bi bi-person-circle me-2"></i>Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold mb-3 text-warning">Features</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <span className="text-light">
                                    <i className="bi bi-check-circle me-2 text-warning"></i>Task Management
                                </span>
                            </li>
                            <li className="mb-2">
                                <span className="text-light">
                                    <i className="bi bi-check-circle me-2 text-warning"></i>Priority System
                                </span>
                            </li>
                            <li className="mb-2">
                                <span className="text-light">
                                    <i className="bi bi-check-circle me-2 text-warning"></i>Goal Planning
                                </span>
                            </li>
                            <li className="mb-2">
                                <span className="text-light">
                                    <i className="bi bi-check-circle me-2 text-warning"></i>Progress Tracking
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-top border-light border-opacity-25">
                <div className="container py-3">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <small className="text-light">
                                © {currentYear} TaskTracker. All rights reserved.
                            </small>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <small>
                                <Link href="/privacy-policy" className="text-light text-decoration-none me-3 hover-warning">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms-of-service" className="text-light text-decoration-none me-3 hover-warning">
                                    Terms of Service
                                </Link>
                                <Link href="/cookie-policy" className="text-light text-decoration-none hover-warning">
                                    Cookie Policy
                                </Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;