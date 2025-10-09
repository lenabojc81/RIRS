import ProtectedRoute from "../../components/ProtectedRoute";

export default function PrivacyPolicyPage() {
    const lastUpdated = "October 9, 2025";

    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-info text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                <i className="bi bi-shield-check me-3"></i>
                                Privacy <span className="text-warning">Policy</span>
                            </h1>
                            <p className="lead mb-4">
                                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                            </p>
                            <p className="mb-0">
                                <small>Last updated: {lastUpdated}</small>
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-shield-lock text-info" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            
                            {/* Information We Collect */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-primary">
                                        <i className="bi bi-person-lines-fill me-2"></i>
                                        Information We Collect
                                    </h3>
                                    <div className="card-text">
                                        <h5 className="mt-3">Personal Information</h5>
                                        <p>When you create an account with TaskTracker, we collect:</p>
                                        <ul>
                                            <li><strong>Account Information:</strong> Username, email address, and password (encrypted)</li>
                                            <li><strong>Profile Data:</strong> Any additional profile information you choose to provide</li>
                                            <li><strong>Authentication Data:</strong> Login credentials and session information</li>
                                        </ul>

                                        <h5 className="mt-4">Usage Information</h5>
                                        <p>To provide and improve our services, we collect:</p>
                                        <ul>
                                            <li><strong>Task Data:</strong> Tasks, planners, goals, and related content you create</li>
                                            <li><strong>Activity Data:</strong> How you interact with our application features</li>
                                            <li><strong>Device Information:</strong> Browser type, operating system, and IP address</li>
                                            <li><strong>Usage Analytics:</strong> Features used, time spent, and performance metrics</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* How We Use Your Information */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-success">
                                        <i className="bi bi-gear-fill me-2"></i>
                                        How We Use Your Information
                                    </h3>
                                    <div className="card-text">
                                        <p>We use your personal information to:</p>
                                        <ul>
                                            <li><strong>Provide Services:</strong> Enable you to use TaskTracker's task management and planning features</li>
                                            <li><strong>Account Management:</strong> Create, maintain, and secure your user account</li>
                                            <li><strong>Data Synchronization:</strong> Store and sync your tasks, planners, and preferences across devices</li>
                                            <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance user experience and add new features</li>
                                            <li><strong>Security:</strong> Protect against fraud, abuse, and unauthorized access</li>
                                            <li><strong>Communication:</strong> Send important service updates and security notifications</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Data Storage and Security */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-warning">
                                        <i className="bi bi-shield-lock-fill me-2"></i>
                                        Data Storage and Security
                                    </h3>
                                    <div className="card-text">
                                        <h5>Data Storage</h5>
                                        <p>Your data is stored securely using:</p>
                                        <ul>
                                            <li><strong>Firebase/Firestore:</strong> Google's secure cloud database platform</li>
                                            <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                                            <li><strong>Access Controls:</strong> Strict authentication and authorization protocols</li>
                                        </ul>

                                        <h5 className="mt-4">Security Measures</h5>
                                        <ul>
                                            <li><strong>Authentication:</strong> Secure user authentication with JWT tokens</li>
                                            <li><strong>Data Isolation:</strong> Each user's data is completely isolated from others</li>
                                            <li><strong>Regular Updates:</strong> We regularly update our security measures and dependencies</li>
                                            <li><strong>Access Logging:</strong> We monitor access to detect and prevent unauthorized use</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Information Sharing */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-danger">
                                        <i className="bi bi-people-fill me-2"></i>
                                        Information Sharing
                                    </h3>
                                    <div className="card-text">
                                        <p className="fw-bold text-success">We do NOT sell, rent, or share your personal information with third parties for marketing purposes.</p>
                                        
                                        <p>We may share your information only in these limited circumstances:</p>
                                        <ul>
                                            <li><strong>Service Providers:</strong> With trusted partners who help us operate our service (e.g., Google Firebase for data storage)</li>
                                            <li><strong>Legal Requirements:</strong> If required by law, court order, or government regulation</li>
                                            <li><strong>Safety Protection:</strong> To protect the safety and security of our users and services</li>
                                            <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets (with user notification)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Your Rights */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-primary">
                                        <i className="bi bi-person-check-fill me-2"></i>
                                        Your Rights and Choices
                                    </h3>
                                    <div className="card-text">
                                        <p>You have the following rights regarding your personal information:</p>
                                        <ul>
                                            <li><strong>Access:</strong> View and download your personal data</li>
                                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                                            <li><strong>Data Portability:</strong> Export your data in a standard format</li>
                                            <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
                                        </ul>

                                        <div className="alert alert-info mt-3">
                                            <i className="bi bi-info-circle me-2"></i>
                                            <strong>To exercise these rights:</strong> Contact us through your user profile settings or reach out to our support team.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cookies and Tracking */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-warning">
                                        <i className="bi bi-cookie me-2"></i>
                                        Cookies and Tracking
                                    </h3>
                                    <div className="card-text">
                                        <p>We use cookies and similar technologies to:</p>
                                        <ul>
                                            <li><strong>Authentication:</strong> Keep you logged in securely</li>
                                            <li><strong>Preferences:</strong> Remember your settings and preferences</li>
                                            <li><strong>Analytics:</strong> Understand how our service is used (anonymized data)</li>
                                            <li><strong>Performance:</strong> Optimize application performance and loading times</li>
                                        </ul>

                                        <p>You can control cookies through your browser settings, but disabling certain cookies may affect functionality.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Data Retention */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-secondary">
                                        <i className="bi bi-clock-fill me-2"></i>
                                        Data Retention
                                    </h3>
                                    <div className="card-text">
                                        <p>We retain your personal information for as long as:</p>
                                        <ul>
                                            <li>Your account remains active</li>
                                            <li>Necessary to provide our services</li>
                                            <li>Required by law or for legitimate business purposes</li>
                                        </ul>

                                        <p>When you delete your account:</p>
                                        <ul>
                                            <li>Your personal data will be permanently deleted within 30 days</li>
                                            <li>Some data may be retained longer if required by law</li>
                                            <li>Anonymized usage statistics may be retained for service improvement</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Changes to This Policy */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-info">
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Changes to This Policy
                                    </h3>
                                    <div className="card-text">
                                        <p>We may update this Privacy Policy from time to time to reflect:</p>
                                        <ul>
                                            <li>Changes in our practices</li>
                                            <li>Updates to legal requirements</li>
                                            <li>New features or services</li>
                                        </ul>

                                        <p>When we make significant changes:</p>
                                        <ul>
                                            <li>We will notify you through the application</li>
                                            <li>The "Last Updated" date will be revised</li>
                                            <li>Continued use of the service constitutes acceptance of changes</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}