import ProtectedRoute from "../../components/ProtectedRoute";

export default function CookiePolicyPage() {
    const lastUpdated = "October 9, 2025";

    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-warning text-dark py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                <i className="bi bi-cookie me-3"></i>
                                Cookie <span className="text-primary">Policy</span>
                            </h1>
                            <p className="lead mb-4">
                                Learn about how we use cookies and similar technologies to improve your experience on TaskTracker.
                            </p>
                            <p className="mb-0">
                                <small>Last updated: {lastUpdated}</small>
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg"
                                style={{ width: '120px', height: '120px' }}>
                                <i className="bi bi-shield-check text-warning" style={{ fontSize: '4rem' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cookie Policy Content */}
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">

                            {/* What Are Cookies */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-primary">
                                        <i className="bi bi-question-circle-fill me-2"></i>
                                        What Are Cookies?
                                    </h3>
                                    <div className="card-text">
                                        <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>

                                        <p>Cookies help us:</p>
                                        <ul>
                                            <li>Remember your preferences and settings</li>
                                            <li>Keep you logged in securely</li>
                                            <li>Understand how you use our application</li>
                                            <li>Improve the performance and functionality of our service</li>
                                        </ul>

                                        <div className="alert alert-info mt-3">
                                            <i className="bi bi-info-circle me-2"></i>
                                            <strong>Note:</strong> Cookies cannot harm your device or files, and they cannot access personal information unless you provide it.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Types of Cookies We Use */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-success">
                                        <i className="bi bi-collection me-2"></i>
                                        Types of Cookies We Use
                                    </h3>
                                    <div className="card-text">

                                        {/* Essential Cookies */}
                                        <div className="border-start border-success border-4 ps-3 mb-4">
                                            <h5 className="text-success">
                                                <i className="bi bi-shield-check me-2"></i>
                                                Essential Cookies (Required)
                                            </h5>
                                            <p>These cookies are necessary for the website to function properly and cannot be disabled.</p>
                                            <ul>
                                                <li><strong>Authentication Cookies:</strong> Keep you logged in securely</li>
                                                <li><strong>Session Cookies:</strong> Maintain your session state while using the app</li>
                                                <li><strong>Security Cookies:</strong> Protect against cross-site request forgery and other security threats</li>
                                                <li><strong>Load Balancing:</strong> Ensure proper distribution of server requests</li>
                                            </ul>
                                            <p><small className="text-muted">Duration: Session-based (deleted when you close your browser) or up to 30 days for persistent login</small></p>
                                        </div>

                                        {/* Functional Cookies */}
                                        <div className="border-start border-primary border-4 ps-3 mb-4">
                                            <h5 className="text-primary">
                                                <i className="bi bi-gear me-2"></i>
                                                Functional Cookies (Recommended)
                                            </h5>
                                            <p>These cookies enhance your experience by remembering your preferences.</p>
                                            <ul>
                                                <li><strong>User Preferences:</strong> Remember your theme, language, and display settings</li>
                                                <li><strong>Form Data:</strong> Temporarily store form inputs to prevent data loss</li>
                                                <li><strong>UI State:</strong> Remember collapsed/expanded sections and view preferences</li>
                                                <li><strong>Accessibility:</strong> Store accessibility preferences and settings</li>
                                            </ul>
                                            <p><small className="text-muted">Duration: Up to 1 year or until you clear your browser data</small></p>
                                        </div>

                                        {/* Analytics Cookies */}
                                        <div className="border-start border-info border-4 ps-3 mb-4">
                                            <h5 className="text-info">
                                                <i className="bi bi-graph-up me-2"></i>
                                                Analytics Cookies (Optional)
                                            </h5>
                                            <p>These cookies help us understand how you use our application to improve it.</p>
                                            <ul>
                                                <li><strong>Usage Analytics:</strong> Track which features are used most frequently</li>
                                                <li><strong>Performance Monitoring:</strong> Identify slow pages and optimize performance</li>
                                                <li><strong>Error Tracking:</strong> Detect and fix bugs and issues</li>
                                                <li><strong>User Journey:</strong> Understand how users navigate through the application</li>
                                            </ul>
                                            <p><small className="text-muted">Duration: Up to 2 years</small></p>
                                            <div className="alert alert-info mt-2">
                                                <small>
                                                    <i className="bi bi-shield-lock me-1"></i>
                                                    All analytics data is anonymized and cannot be used to identify individual users.
                                                </small>
                                            </div>
                                        </div>

                                        {/* Performance Cookies */}
                                        <div className="border-start border-warning border-4 ps-3 mb-4">
                                            <h5 className="text-warning">
                                                <i className="bi bi-speedometer2 me-2"></i>
                                                Performance Cookies (Optional)
                                            </h5>
                                            <p>These cookies help us optimize the speed and performance of our application.</p>
                                            <ul>
                                                <li><strong>Caching:</strong> Store frequently accessed data for faster loading</li>
                                                <li><strong>CDN Optimization:</strong> Optimize content delivery from our servers</li>
                                                <li><strong>Resource Loading:</strong> Prioritize loading of critical application resources</li>
                                                <li><strong>Performance Metrics:</strong> Measure page load times and optimize accordingly</li>
                                            </ul>
                                            <p><small className="text-muted">Duration: Up to 30 days</small></p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Third-Party Cookies */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-warning">
                                        <i className="bi bi-globe me-2"></i>
                                        Third-Party Services
                                    </h3>
                                    <div className="card-text">
                                        <p>We use some third-party services that may set their own cookies:</p>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <h5 className="text-primary">
                                                    <i className="bi bi-google me-2"></i>
                                                    Google Firebase
                                                </h5>
                                                <ul>
                                                    <li>Authentication services</li>
                                                    <li>Database operations</li>
                                                    <li>Performance monitoring</li>
                                                </ul>
                                                <p><small className="text-muted">
                                                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                        View Google's Privacy Policy <i className="bi bi-box-arrow-up-right"></i>
                                                    </a>
                                                </small></p>
                                            </div>
                                            <div className="col-md-6">
                                                <h5 className="text-info">
                                                    <i className="bi bi-shield-check me-2"></i>
                                                    Security Services
                                                </h5>
                                                <ul>
                                                    <li>DDoS protection</li>
                                                    <li>Bot detection</li>
                                                    <li>Fraud prevention</li>
                                                </ul>
                                                <p><small className="text-muted">These services help protect our application from malicious attacks.</small></p>
                                            </div>
                                        </div>

                                        <div className="alert alert-warning mt-3">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            <strong>Note:</strong> Third-party cookies are governed by the respective privacy policies of those services.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Managing Your Cookie Preferences */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-primary">
                                        <i className="bi bi-sliders me-2"></i>
                                        Managing Your Cookie Preferences
                                    </h3>
                                    <div className="card-text">

                                        <h5>Browser Settings</h5>
                                        <p>You can control cookies through your browser settings:</p>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <h6><i className="bi bi-browser-chrome text-primary me-2"></i>Chrome:</h6>
                                                <p><small>Settings → Privacy and security → Cookies and other site data</small></p>

                                                <h6><i className="bi bi-browser-firefox text-warning me-2"></i>Firefox:</h6>
                                                <p><small>Options → Privacy & Security → Cookies and Site Data</small></p>
                                            </div>
                                            <div className="col-md-6">
                                                <h6><i className="bi bi-browser-safari text-info me-2"></i>Safari:</h6>
                                                <p><small>Preferences → Privacy → Cookies and website data</small></p>

                                                <h6><i className="bi bi-browser-edge text-success me-2"></i>Edge:</h6>
                                                <p><small>Settings → Cookies and site permissions → Cookies and site data</small></p>
                                            </div>
                                        </div>

                                        <h5 className="mt-4">Cookie Categories</h5>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Cookie Type</th>
                                                        <th>Can be Disabled</th>
                                                        <th>Impact if Disabled</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><span className="badge bg-success">Essential</span></td>
                                                        <td><i className="bi bi-x-circle text-danger"></i> No</td>
                                                        <td>Application will not function properly</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span className="badge bg-primary">Functional</span></td>
                                                        <td><i className="bi bi-check-circle text-success"></i> Yes</td>
                                                        <td>You'll need to reset preferences each visit</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span className="badge bg-info">Analytics</span></td>
                                                        <td><i className="bi bi-check-circle text-success"></i> Yes</td>
                                                        <td>No impact on functionality</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span className="badge bg-warning">Performance</span></td>
                                                        <td><i className="bi bi-check-circle text-success"></i> Yes</td>
                                                        <td>Slightly slower loading times</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="alert alert-info mt-3">
                                            <i className="bi bi-lightbulb me-2"></i>
                                            <strong>Tip:</strong> Most browsers allow you to set different cookie preferences for different websites.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile App Considerations */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-info">
                                        <i className="bi bi-phone me-2"></i>
                                        Mobile and App Considerations
                                    </h3>
                                    <div className="card-text">
                                        <p>When using TaskTracker on mobile devices:</p>
                                        <ul>
                                            <li><strong>Mobile Browsers:</strong> Cookie settings work similarly to desktop browsers</li>
                                            <li><strong>Local Storage:</strong> We may use HTML5 local storage for better performance</li>
                                            <li><strong>App Data:</strong> Mobile app versions may store preferences differently</li>
                                            <li><strong>Sync:</strong> Data synchronization may require certain storage permissions</li>
                                        </ul>

                                        <div className="alert alert-warning">
                                            <i className="bi bi-phone me-2"></i>
                                            <strong>Mobile Settings:</strong> Check your mobile browser's privacy settings to control cookies on mobile devices.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Updates to Cookie Policy */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-secondary">
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Updates to This Cookie Policy
                                    </h3>
                                    <div className="card-text">
                                        <p>We may update this Cookie Policy from time to time to reflect:</p>
                                        <ul>
                                            <li>Changes in technology and cookie usage</li>
                                            <li>Updates to legal requirements</li>
                                            <li>New features that require different cookies</li>
                                            <li>Changes in third-party services we use</li>
                                        </ul>

                                        <p>When we make significant changes:</p>
                                        <ul>
                                            <li>We will update the "Last Updated" date at the top of this policy</li>
                                            <li>We may notify you through the application or via email</li>
                                            <li>We will provide a reasonable notice period for significant changes</li>
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