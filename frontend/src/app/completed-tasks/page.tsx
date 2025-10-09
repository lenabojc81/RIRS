import ProtectedRoute from "../../components/ProtectedRoute";
import CompletedTasksList from "@/app/components/tasks/completedTasksList";

export default function CompletedTasksPage() {
    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-success text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                <i className="bi bi-check-circle me-3"></i>
                                Completed <span className="text-warning">Tasks</span>
                            </h1>
                            <p className="lead mb-4">
                                Review your accomplished tasks and celebrate your productivity! Manage and organize your completed work history.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-trophy text-success" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Completed Tasks Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12 text-center">
                            <h2 className="display-6 fw-bold mb-4">Your Accomplishments</h2>
                            <p className="lead text-muted mb-4">
                                Browse through your completed tasks with filtering and management options
                            </p>
                        </div>
                    </div>

                    {/* Display Completed Tasks */}
                    <div className="row">
                        <div className="col-12">
                            <CompletedTasksList />
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}