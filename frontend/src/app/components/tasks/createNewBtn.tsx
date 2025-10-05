"use client";

import React from 'react';

const CreateNewBtn: React.FC = () => {
    return (
        <div style={{ textAlign: "center" }}>
            <button className="btn btn-primary m-3" onClick={() => { window.location.href = '/new' }}>
                New Task
            </button>
        </div>
    );
};

export default CreateNewBtn;
