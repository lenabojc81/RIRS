import ProtectedRoute from "../../components/ProtectedRoute";
import CreateNewBtn from "../components/tasks/createNewBtn";
import TaskList from "../components/tasks/taskList";

export default function TasksScreen() {
    return (
        <ProtectedRoute>
            <div className="container mt-4">
                <h1 className="mb-4">My Tasks</h1>
                <CreateNewBtn />
                <TaskList />
            </div>
        </ProtectedRoute>
    )
}