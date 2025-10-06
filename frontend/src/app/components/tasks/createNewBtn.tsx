"use client";

import { initialTask, ITask } from '../../../interfaces/ITasks';
import React from 'react';
import TaskCreateModal from '../modals/taskCreateModal';

const CreateNewBtn: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div style={{ textAlign: "center" }}>
            <button className="btn btn-primary m-3" onClick={() => setShowModal(true)}>
                New Task
            </button>

            {showModal && (
                <TaskCreateModal setShowModal={setShowModal} />
            )}
        </div>
    );
};

export default CreateNewBtn;
