"use client";

import React from 'react';
import TaskViewModal from '../modals/taskViewModal';
import { initialTask } from '@/interfaces/ITasks';

const CreateNewBtn: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <>
            <button 
                className="btn btn-warning btn-lg px-5 py-3 shadow-sm"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-plus-circle me-2"></i>
                Create New Task
            </button>

            {showModal && (
                <TaskViewModal task={initialTask} setShowModal={setShowModal} mode="create" />
            )}
        </>
    );
};

export default CreateNewBtn;
