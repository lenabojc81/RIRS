import ProtectedRoute from "../../components/ProtectedRoute";
import CreateNewBtn from "../components/tasks/createNewBtn";
import TaskList from "../components/tasks/taskList";

export default function TasksScreen() {
    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                My <span className="text-warning">Tasks</span>
                            </h1>
                            <p className="lead mb-4">
                                Organize, prioritize, and track your daily tasks. Stay productive and achieve your goals one task at a time.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-list-task text-primary" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Task Management Section */}
            <section className="py-5">
                <div className="container">
                    {/* Create Task Action */}
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <h2 className="display-6 fw-bold mb-4">Task Management</h2>
                            <p className="lead text-muted mb-4">
                                Create new tasks and manage your existing ones
                            </p>
                            <CreateNewBtn />
                        </div>
                    </div>

                    {/* Color Legend */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <i className="bi bi-palette me-2 text-primary"></i>
                                        Task Status Legend
                                    </h5>
                                </div>
                                <div className="card-body py-3">
                                    <div className="row g-3">
                                        <div className="col-lg col-md-4 col-sm-6">
                                            <div className="card border-success border-2 h-100">
                                                <div className="card-body bg-success bg-opacity-10 text-center py-3">
                                                    <span className="badge bg-success text-white mb-2">
                                                        <i className="bi bi-check-circle me-1"></i>Done
                                                    </span>
                                                    <div className="small text-muted">Completed Tasks</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg col-md-4 col-sm-6">
                                            <div className="card border-danger border-3 h-100">
                                                <div className="card-body bg-danger bg-opacity-10 text-center py-3">
                                                    <span className="badge bg-danger text-white mb-2">
                                                        <i className="bi bi-exclamation-triangle me-1"></i>Overdue
                                                    </span>
                                                    <div className="small text-muted">Past Due Date</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg col-md-4 col-sm-6">
                                            <div className="card border-warning border-2 h-100">
                                                <div className="card-body bg-warning bg-opacity-10 text-center py-3">
                                                    <span className="badge bg-warning text-dark mb-2">
                                                        <i className="bi bi-clock me-1"></i>Today
                                                    </span>
                                                    <div className="small text-muted">Due Today</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg col-md-4 col-sm-6">
                                            <div className="card border-info border-2 h-100">
                                                <div className="card-body bg-info bg-opacity-10 text-center py-3">
                                                    <span className="badge bg-info text-white mb-2">
                                                        <i className="bi bi-calendar-week me-1"></i>This Week
                                                    </span>
                                                    <div className="small text-muted">Due This Week</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg col-md-4 col-sm-6">
                                            <div className="card border-secondary border-1 h-100">
                                                <div className="card-body bg-light text-center py-3">
                                                    <span className="badge bg-secondary text-white mb-2">
                                                        <i className="bi bi-calendar-x me-1"></i>No Date
                                                    </span>
                                                    <div className="small text-muted">No Due Date</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Priority Legend Row */}
                                    <div className="mt-4 pt-3 border-top">
                                        <div className="row align-items-center">
                                            <div className="col-md-3">
                                                <h6 className="mb-0 text-center text-md-start">
                                                    <i className="bi bi-flag me-2 text-warning"></i>
                                                    Priority Levels
                                                </h6>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="row g-2">
                                                    <div className="col d-flex justify-content-center align-items-center">
                                                        <span className="badge bg-danger me-2 px-2 py-1">P1</span>
                                                        <small className="text-muted">Critical</small>
                                                    </div>
                                                    <div className="col d-flex justify-content-center align-items-center">
                                                        <span className="badge bg-warning text-dark me-2 px-2 py-1">P2</span>
                                                        <small className="text-muted">High</small>
                                                    </div>
                                                    <div className="col d-flex justify-content-center align-items-center">
                                                        <span className="badge bg-secondary me-2 px-2 py-1">P3</span>
                                                        <small className="text-muted">Medium</small>
                                                    </div>
                                                    <div className="col d-flex justify-content-center align-items-center">
                                                        <span className="badge bg-info me-2 px-2 py-1">P4</span>
                                                        <small className="text-muted">Low</small>
                                                    </div>
                                                    <div className="col d-flex justify-content-center align-items-center">
                                                        <span className="badge bg-light text-dark border me-2 px-2 py-1">P5</span>
                                                        <small className="text-muted">Very Low</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="row">
                        <div className="col-12">
                            <TaskList />
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    )
}