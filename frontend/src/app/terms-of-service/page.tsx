import ProtectedRoute from "../../components/ProtectedRoute";

export default function TermsOfServicePage() {
    const lastUpdated = "October 9, 2025";

    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                <i className="bi bi-file-text me-3"></i>
                                Terms of <span className="text-warning">Service</span>
                            </h1>
                            <p className="lead mb-4">
                                Please read these terms carefully before using TaskTracker. By using our service, you agree to these terms.
                            </p>
                            <p className="mb-0">
                                <small>Last updated: {lastUpdated}</small>
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-clipboard-check text-primary" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            
                            {/* Acceptance of Terms */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-primary">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Acceptance of Terms
                                    </h3>
                                    <div className="card-text">
                                        <p>By accessing and using TaskTracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
                                        
                                        <p>If you do not agree to abide by the above, please do not use this service.</p>

                                        <div className="alert alert-warning">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            <strong>Important:</strong> These terms constitute a legal agreement between you and TaskTracker. Please read them carefully.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Description */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-success">
                                        <i className="bi bi-app-indicator me-2"></i>
                                        Service Description
                                    </h3>
                                    <div className="card-text">
                                        <p>TaskTracker is a web-based task management and planning application that allows users to:</p>
                                        <ul>
                                            <li>Create and manage personal tasks with priorities, labels, and due dates</li>
                                            <li>Organize tasks into planners and track progress toward goals</li>
                                            <li>Archive completed tasks and planners for reference</li>
                                            <li>Customize task organization with personal labels and categories</li>
                                            <li>Access their data from any web-enabled device</li>
                                        </ul>

                                        <p>The Service is provided on an "as is" basis and may be modified, updated, or discontinued at any time.</p>
                                    </div>
                                </div>
                            </div>

                            {/* User Accounts */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-info">
                                        <i className="bi bi-person-fill me-2"></i>
                                        User Accounts and Responsibilities
                                    </h3>
                                    <div className="card-text">
                                        <h5>Account Creation</h5>
                                        <ul>
                                            <li>You must provide accurate and complete information when creating your account</li>
                                            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                            <li>You must be at least 13 years old to use this service</li>
                                            <li>One person may not maintain multiple accounts</li>
                                        </ul>

                                        <h5 className="mt-4">User Responsibilities</h5>
                                        <ul>
                                            <li>Keep your login credentials secure and confidential</li>
                                            <li>Notify us immediately of any unauthorized use of your account</li>
                                            <li>Use the service only for lawful purposes</li>
                                            <li>Respect the rights and privacy of other users</li>
                                            <li>Maintain backup copies of important data</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* User Content */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-warning">
                                        <i className="bi bi-file-earmark-text me-2"></i>
                                        User Content and Data
                                    </h3>
                                    <div className="card-text">
                                        <h5>Your Content</h5>
                                        <p>You retain ownership of all content you create and store using TaskTracker, including:</p>
                                        <ul>
                                            <li>Task descriptions, titles, and notes</li>
                                            <li>Planner names and organizational structures</li>
                                            <li>Custom labels and categories</li>
                                            <li>Any other data you input into the system</li>
                                        </ul>

                                        <h5 className="mt-4">License to Use</h5>
                                        <p>By using our service, you grant TaskTracker a limited, non-exclusive license to:</p>
                                        <ul>
                                            <li>Store and process your content to provide the service</li>
                                            <li>Create backups and ensure data reliability</li>
                                            <li>Display your content back to you through the application interface</li>
                                        </ul>

                                        <p><strong>We do not claim ownership of your content and will not use it for any purpose other than providing the service.</strong></p>
                                    </div>
                                </div>
                            </div>

                            {/* Prohibited Uses */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-danger">
                                        <i className="bi bi-x-circle-fill me-2"></i>
                                        Prohibited Uses
                                    </h3>
                                    <div className="card-text">
                                        <p>You may not use TaskTracker to:</p>
                                        <ul>
                                            <li>Store or transmit illegal, harmful, or offensive content</li>
                                            <li>Violate any applicable laws or regulations</li>
                                            <li>Infringe upon the rights of others</li>
                                            <li>Distribute spam, malware, or malicious code</li>
                                            <li>Attempt to gain unauthorized access to our systems</li>
                                            <li>Reverse engineer or attempt to extract our source code</li>
                                            <li>Use automated tools to access the service without permission</li>
                                            <li>Impersonate others or provide false information</li>
                                        </ul>

                                        <div className="alert alert-danger mt-3">
                                            <i className="bi bi-exclamation-octagon me-2"></i>
                                            <strong>Violation Consequences:</strong> Accounts found in violation may be suspended or terminated without notice.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Availability */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-secondary">
                                        <i className="bi bi-cloud-check me-2"></i>
                                        Service Availability and Modifications
                                    </h3>
                                    <div className="card-text">
                                        <h5>Availability</h5>
                                        <ul>
                                            <li>We strive to maintain high service availability but cannot guarantee 100% uptime</li>
                                            <li>Planned maintenance will be announced when possible</li>
                                            <li>We are not liable for temporary service interruptions</li>
                                        </ul>

                                        <h5 className="mt-4">Service Modifications</h5>
                                        <ul>
                                            <li>We may modify, update, or discontinue features at any time</li>
                                            <li>Major changes will be communicated to users when possible</li>
                                            <li>Continued use after modifications constitutes acceptance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy and Data Protection */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-info">
                                        <i className="bi bi-shield-lock me-2"></i>
                                        Privacy and Data Protection
                                    </h3>
                                    <div className="card-text">
                                        <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
                                        
                                        <h5 className="mt-3">Data Security</h5>
                                        <ul>
                                            <li>We implement industry-standard security measures</li>
                                            <li>All data is encrypted in transit and at rest</li>
                                            <li>Access to user data is strictly controlled and monitored</li>
                                        </ul>

                                        <h5 className="mt-4">Data Backup</h5>
                                        <p>While we maintain backups of user data, you are responsible for maintaining your own backups of important information.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimers and Limitations */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-warning">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Disclaimers and Limitation of Liability
                                    </h3>
                                    <div className="card-text">
                                        <h5>Service Disclaimers</h5>
                                        <ul>
                                            <li>The service is provided "as is" without warranties of any kind</li>
                                            <li>We do not guarantee the service will meet your specific requirements</li>
                                            <li>We are not responsible for data loss due to user error or system failures</li>
                                            <li>The service may contain bugs, errors, or other problems</li>
                                        </ul>

                                        <h5 className="mt-4">Limitation of Liability</h5>
                                        <p>To the maximum extent permitted by law:</p>
                                        <ul>
                                            <li>Our liability is limited to the amount you paid for the service (if any)</li>
                                            <li>We are not liable for indirect, incidental, or consequential damages</li>
                                            <li>We are not liable for business losses, lost profits, or data loss</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Termination */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-danger">
                                        <i className="bi bi-power me-2"></i>
                                        Account Termination
                                    </h3>
                                    <div className="card-text">
                                        <h5>Termination by You</h5>
                                        <ul>
                                            <li>You may terminate your account at any time through your profile settings</li>
                                            <li>Upon termination, your data will be deleted according to our Privacy Policy</li>
                                            <li>You remain responsible for any actions taken before termination</li>
                                        </ul>

                                        <h5 className="mt-4">Termination by Us</h5>
                                        <p>We may terminate or suspend your account if:</p>
                                        <ul>
                                            <li>You violate these Terms of Service</li>
                                            <li>You engage in fraudulent or abusive behavior</li>
                                            <li>Required by law or court order</li>
                                            <li>The service is discontinued</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Changes to Terms */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-primary">
                                        <i className="bi bi-arrow-repeat me-2"></i>
                                        Changes to These Terms
                                    </h3>
                                    <div className="card-text">
                                        <p>We may update these Terms of Service from time to time. When we do:</p>
                                        <ul>
                                            <li>We will post the updated terms on this page</li>
                                            <li>We will update the "Last Updated" date</li>
                                            <li>For significant changes, we will provide notice through the application</li>
                                            <li>Continued use after changes constitutes acceptance of the new terms</li>
                                        </ul>

                                        <p>If you do not agree to the updated terms, you should stop using the service and may terminate your account.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Governing Law */}
                            <div className="card mb-4 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-secondary">
                                        <i className="bi bi-building me-2"></i>
                                        Governing Law and Disputes
                                    </h3>
                                    <div className="card-text">
                                        <h5>Governing Law</h5>
                                        <p>These terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.</p>

                                        <h5 className="mt-4">Dispute Resolution</h5>
                                        <ul>
                                            <li>We encourage resolving disputes through direct communication first</li>
                                            <li>Any legal disputes will be resolved in the courts of [Your Jurisdiction]</li>
                                            <li>You agree to resolve disputes individually, not as part of a class action</li>
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