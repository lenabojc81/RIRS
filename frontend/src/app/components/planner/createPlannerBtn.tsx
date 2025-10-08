"use client";

import React from 'react';
import PlannerViewModal from '../modals/plannerViewModal';
import { initialPlanner } from '@/interfaces/IPlanner';

const CreatePlannerBtn: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <button className="btn btn-primary m-3" onClick={() => setShowModal(true)}>
                New Planner
            </button>

            {showModal && (
                <PlannerViewModal planner={initialPlanner} setShowModal={setShowModal} mode='create' />
            )}
        </div>
    );
};

export default CreatePlannerBtn;
