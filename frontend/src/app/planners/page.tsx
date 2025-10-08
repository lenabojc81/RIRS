import ProtectedRoute from "../../components/ProtectedRoute";
import CreatePlannerBtn from "../components/planner/createPlannerBtn";
import DisplayPlanner from "../components/planner/displayPlanner";

export default function PlannersScreen() {
    return (
        <ProtectedRoute>
            <div className="container mt-4">
                <h1 className="mb-4">My Planners</h1>
                <CreatePlannerBtn />
                <DisplayPlanner />
            </div>
        </ProtectedRoute>
    )
}