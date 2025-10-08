import ProtectedRoute from "../../components/ProtectedRoute";
import CreatePlannerBtn from "../components/planner/createPlannerBtn";
import DisplayPlanner from "../components/planner/displayPlanner";

export default function PlannersScreen() {
    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                My <span className="text-warning">Planners</span>
                            </h1>
                            <p className="lead mb-4">
                                Create goal-oriented planners to achieve your long-term objectives. Break down big dreams into manageable milestones and track your progress.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-bullseye text-primary" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Planner Management Section */}
            <section className="py-5">
                <div className="container">
                    {/* Create Planner Action */}
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <h2 className="display-6 fw-bold mb-4">Goal Planning</h2>
                            <p className="lead text-muted mb-4">
                                Design your success roadmap with structured planners and milestone tracking
                            </p>
                            <CreatePlannerBtn />
                        </div>
                    </div>

                    {/* Planners Display */}
                    <div className="row">
                        <div className="col-12">
                            <DisplayPlanner />
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    )
}