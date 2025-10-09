"use client";
import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DailyTracker from "../components/tracker/dailyTracker";
import TaskList from "../components/tasks/taskList";

export default function DailyTrackerPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleTaskUpdate = () => {
        setRefreshKey(prev => prev + 1);
    };
    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-info text-white py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-9">
                            <h1 className="display-6 fw-bold mb-2">
                                <i className="bi bi-calendar-day me-2"></i>
                                Daily <span className="text-warning">Tracker</span>
                            </h1>
                            <p className="mb-3">
                                Focus on what matters today. Drag tasks from your task list to create your daily focus list.
                            </p>
                            <div className="alert alert-warning d-inline-flex align-items-center mb-0 py-2">
                                <i className="bi bi-lightbulb me-2"></i>
                                <small><strong>Tip:</strong> Drag incomplete tasks from the right panel to add them to today's focus!</small>
                            </div>
                        </div>
                        <div className="col-lg-3 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '80px', height: '80px'}}>
                                <i className="bi bi-bullseye text-info" style={{fontSize: '2.5rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Tracker Section */}
            <section className="py-4">
                <div className="container-fluid">
                    <div className="row g-3">
                        {/* Today's Tasks */}
                        <div className="col-xl-5 col-lg-6">
                            <DailyTracker onTaskUpdate={handleTaskUpdate} />
                        </div>

                        {/* All Tasks */}
                        <div className="col-xl-7 col-lg-6">
                            <div className="card shadow-sm" style={{ height: '580px' }}>
                                <div className="card-header bg-info text-white py-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="mb-0 d-flex align-items-center">
                                            <i className="bi bi-list-task me-2"></i>
                                            Your Tasks
                                        </h6>
                                        <span className="badge bg-warning text-dark">
                                            <i className="bi bi-cursor me-1"></i>
                                            Drag to focus
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body p-3" style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
                                    <div className="alert alert-info py-2 mb-3">
                                        <i className="bi bi-info-circle me-2"></i>
                                        <small>
                                            <strong>How to use:</strong> Drag incomplete tasks to "Today's Focus". 
                                            Tasks already in tracker appear dimmed.
                                        </small>
                                    </div>
                                    <TaskList key={refreshKey} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Instructions */}
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="card border-0 bg-light">
                                <div className="card-body py-3">
                                    <h6 className="card-title text-primary mb-3">
                                        <i className="bi bi-question-circle me-2"></i>
                                        Quick Guide
                                    </h6>
                                    <div className="row g-2">
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                     style={{width: '24px', height: '24px', minWidth: '24px', fontSize: '0.75rem'}}>
                                                    <strong>1</strong>
                                                </div>
                                                <div>
                                                    <small className="fw-medium">Drag Tasks</small>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        Move incomplete tasks to today's focus
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                     style={{width: '24px', height: '24px', minWidth: '24px', fontSize: '0.75rem'}}>
                                                    <strong>2</strong>
                                                </div>
                                                <div>
                                                    <small className="fw-medium">Work & Complete</small>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        Focus on daily tasks and mark complete
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                     style={{width: '24px', height: '24px', minWidth: '24px', fontSize: '0.75rem'}}>
                                                    <strong>3</strong>
                                                </div>
                                                <div>
                                                    <small className="fw-medium">Auto Reset</small>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        Incomplete tasks return to main list
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}