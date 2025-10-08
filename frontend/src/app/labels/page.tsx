'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { fetchLabels, createLabel, deleteLabel, Label, DeleteLabelResponse } from '../../data/fetch_labels';

interface ExtendedLabel extends Label {
    isPreset?: boolean;
}

export default function LabelsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [labels, setLabels] = useState<ExtendedLabel[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#3b82f6');
    const [isLoading, setIsLoading] = useState(false);

    // Preset labels that come with the system
    const presetLabels: ExtendedLabel[] = [
        { id: 'preset-1', name: 'Work', color: '#3b82f6', isPreset: true },
        { id: 'preset-2', name: 'Personal', color: '#10b981', isPreset: true },
        { id: 'preset-3', name: 'Urgent', color: '#ef4444', isPreset: true },
        { id: 'preset-4', name: 'Health', color: '#f59e0b', isPreset: true },
        { id: 'preset-5', name: 'Learning', color: '#8b5cf6', isPreset: true },
        { id: 'preset-6', name: 'Shopping', color: '#ec4899', isPreset: true },
        { id: 'preset-7', name: 'Finance', color: '#06b6d4', isPreset: true },
        { id: 'preset-8', name: 'Home', color: '#84cc16', isPreset: true },
    ];

    const predefinedColors = [
        '#3b82f6', '#10b981', '#ef4444', '#f59e0b', 
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
        '#64748b', '#dc2626', '#ca8a04', '#16a34a'
    ];

    useEffect(() => {
        fetchUserLabels();
    }, []);

    const fetchUserLabels = async () => {
        try {
            const userLabels = await fetchLabels();
            const userLabelsWithFlag = userLabels.map(label => ({ ...label, isPreset: false }));
            setLabels([...presetLabels, ...userLabelsWithFlag]);
        } catch (error) {
            console.error('Error fetching labels:', error);
            // Fallback to just preset labels if API fails
            setLabels(presetLabels);
        }
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;

        setIsLoading(true);
        try {
            await createLabel({
                name: newLabelName.trim(),
                color: newLabelColor
            });

            // Refresh the labels list
            await fetchUserLabels();
            setNewLabelName('');
            setNewLabelColor('#3b82f6');
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating label:', error);
            alert('Error creating label: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLabel = async (labelId: string) => {
        if (window.confirm('⚠️ Delete Label?\n\nThis action will:\n• Delete the label permanently\n• Remove it from all tasks that use it\n• Cannot be undone\n\nAre you sure you want to continue?')) {
            try {
                const result: DeleteLabelResponse = await deleteLabel(labelId);
                
                // Show success message with task information
                if (result.success) {
                    if (result.affectedTasks && result.affectedTasks > 0) {
                        alert(`Label deleted successfully! It was removed from ${result.affectedTasks} task(s).`);
                    } else {
                        alert('Label deleted successfully!');
                    }
                }
                
                // Refresh the labels list
                await fetchUserLabels();
            } catch (error) {
                console.error('Error deleting label:', error);
                alert('Error deleting label: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        }
    };

    return (
        <ProtectedRoute>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-5 fw-bold mb-3">
                                Task <span className="text-warning">Labels</span>
                            </h1>
                            <p className="lead mb-4">
                                Organize and categorize your tasks with custom labels. Use colors and names that make sense to you.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg" 
                                 style={{width: '120px', height: '120px'}}>
                                <i className="bi bi-tags text-primary" style={{fontSize: '4rem'}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Labels Management Section */}
            <section className="py-5">
                <div className="container">
                    {/* Create Label Button */}
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <h2 className="display-6 fw-bold mb-4">Manage Your Labels</h2>
                            <p className="lead text-muted mb-4">
                                Create custom labels or use our preset ones to organize your tasks
                            </p>
                            <button 
                                className="btn btn-warning text-primary fw-bold px-4 py-2 shadow-sm"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Create New Label
                            </button>
                        </div>
                    </div>

                    {/* Preset Labels Section */}
                    <div className="row mb-5">
                        <div className="col-12">
                            <h3 className="fw-bold mb-3">
                                <i className="bi bi-star me-2 text-warning"></i>
                                Preset Labels
                            </h3>
                            <p className="text-muted mb-4">These labels are available to all users and cannot be deleted.</p>
                            <div className="row g-3">
                                {presetLabels.map((label) => (
                                    <div key={label.id} className="col-lg-3 col-md-4 col-sm-6">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body p-3 d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle me-3"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: label.color
                                                    }}
                                                ></div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-0">{label.name}</h6>
                                                    <small className="text-muted">Preset</small>
                                                </div>
                                                <i className="bi bi-lock text-muted" title="Cannot be deleted"></i>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Custom Labels Section */}
                    <div className="row">
                        <div className="col-12">
                            <h3 className="fw-bold mb-3">
                                <i className="bi bi-person-gear me-2 text-primary"></i>
                                Your Custom Labels
                            </h3>
                            <p className="text-muted mb-4">Labels you've created. You can delete these anytime.</p>
                            
                            {labels.filter(label => !label.isPreset).length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-tags display-1 text-muted mb-3"></i>
                                    <h4 className="text-muted">No Custom Labels Yet</h4>
                                    <p className="text-muted">Create your first custom label to get started!</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {labels.filter(label => !label.isPreset).map((label) => (
                                        <div key={label.id} className="col-lg-3 col-md-4 col-sm-6">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body p-3 d-flex align-items-center">
                                                    <div 
                                                        className="rounded-circle me-3"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: label.color
                                                        }}
                                                    ></div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0">{label.name}</h6>
                                                        <small className="text-muted">Custom</small>
                                                    </div>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDeleteLabel(label.id)}
                                                        title="Delete label"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="row mt-5">
                        <div className="col-12 text-center">
                            <button 
                                className="btn btn-outline-primary px-4"
                                onClick={() => router.back()}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Profile
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Create Label Modal */}
            {showCreateModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-plus-circle me-2 text-primary"></i>
                                    Create New Label
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Label Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newLabelName}
                                        onChange={(e) => setNewLabelName(e.target.value)}
                                        placeholder="Enter label name..."
                                        maxLength={20}
                                    />
                                    <small className="text-muted">{newLabelName.length}/20 characters</small>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Label Color</label>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`btn p-0 rounded-circle ${newLabelColor === color ? 'border border-dark border-3' : 'border-0'}`}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: color
                                                }}
                                                onClick={() => setNewLabelColor(color)}
                                            ></button>
                                        ))}
                                    </div>
                                    <input
                                        type="color"
                                        className="form-control form-control-color"
                                        value={newLabelColor}
                                        onChange={(e) => setNewLabelColor(e.target.value)}
                                        title="Choose custom color"
                                    />
                                </div>
                                
                                {/* Preview */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Preview</label>
                                    <div className="card bg-light">
                                        <div className="card-body p-3 d-flex align-items-center">
                                            <div 
                                                className="rounded-circle me-3"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: newLabelColor
                                                }}
                                            ></div>
                                            <div>
                                                <h6 className="mb-0">{newLabelName || 'Label Name'}</h6>
                                                <small className="text-muted">Custom</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCreateLabel}
                                    disabled={!newLabelName.trim() || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check me-2"></i>
                                            Create Label
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}