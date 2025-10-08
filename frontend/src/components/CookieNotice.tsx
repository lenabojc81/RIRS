'use client';

import React, { useState, useEffect } from 'react';

const CookieNotice: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already acknowledged the cookie notice
        const cookieNoticeAccepted = localStorage.getItem('cookieNoticeAccepted');
        
        if (!cookieNoticeAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieNoticeAccepted', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div 
            className="position-fixed bottom-0 start-0 end-0 bg-dark text-white p-3 shadow-lg"
            style={{ zIndex: 9999 }}
        >
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-8 col-lg-9">
                        <div className="d-flex align-items-start">
                            <i className="bi bi-info-circle-fill text-info me-2 mt-1"></i>
                            <div>
                                <p className="mb-1">
                                    <strong>This website uses cookies</strong>
                                </p>
                                <p className="mb-0 small text-light">
                                    We use essential cookies to provide authentication and ensure the proper functioning 
                                    of our task management system. These cookies are necessary for the website to work 
                                    and cannot be switched off.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-3 text-md-end mt-2 mt-md-0">
                        <button 
                            className="btn btn-light btn-sm"
                            onClick={handleAccept}
                        >
                            <i className="bi bi-check-lg me-1"></i>
                            I understand
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieNotice;