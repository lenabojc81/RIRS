"use client";

import React from 'react';
import PlannerViewModal from '../modals/plannerViewModal';
import { initialPlanner } from '@/interfaces/IPlanner';

const CreatePlannerBtn: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <>
            <button 
                className="btn btn-warning btn-lg px-5 py-3 shadow-sm"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-plus-circle me-2"></i>
                Create New Planner
            </button>

            {showModal && (
                <PlannerViewModal planner={initialPlanner} setShowModal={setShowModal} mode='create' />
            )}
        </>
    );
};

export default CreatePlannerBtn;
