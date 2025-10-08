import ProtectedRoute from "../../components/ProtectedRoute";
import CreateNewBtn from "../components/tasks/createNewBtn";
import TaskList from "../components/tasks/taskList";

export default function TasksScreen() {
    return (
        <ProtectedRoute>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h3 className="card-title mb-0">
                                    <i className="bi bi-list-task me-2"></i>
                                    My Tasks
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <CreateNewBtn />
                                </div>
                                <TaskList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}