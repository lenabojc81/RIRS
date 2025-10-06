"use client";

import React from 'react';

const CreateGroupBtn: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div style={{ textAlign: "center" }}>
            <button className="btn btn-primary m-3" onClick={() => setShowModal(true)}>
                New Group
            </button>

        </div>
    );
};

export default CreateGroupBtn;
