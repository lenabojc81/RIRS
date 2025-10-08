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