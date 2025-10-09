import ProtectedRoute from "../../components/ProtectedRoute";
import DisplayPlanner from "../components/planner/displayPlanner";

export default function ArchivedPlannersPage() {
    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-secondary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                <i className="bi bi-archive me-3"></i>
                                Archived <span className="text-warning">Planners</span>
                            </h1>
                            <p className="lead mb-4">
                                Review your completed planners and celebrate your achievements! Browse through your finished goals and milestones to reflect on your journey.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-trophy text-secondary" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Archived Planners Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12 text-center">
                            <h2 className="display-6 fw-bold mb-4">Your Achievements</h2>
                            <p className="lead text-muted mb-4">
                                Explore your completed planners and the goals you've successfully accomplished
                            </p>
                        </div>
                    </div>

                    {/* Display Archived Planners */}
                    <div className="row">
                        <div className="col-12">
                            <DisplayPlanner archived={true} />
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}