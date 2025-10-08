import { IGoal } from '@/interfaces/IPlanner';
import React from 'react';
import { SlStar, SlPencil, SlTrash, SlPaperPlane, SlClose } from 'react-icons/sl';

interface GoalListElementProps {
    goals: IGoal[];
    category: string;
    handleEdit: (index: number) => void;
    handleDelete: (goalText: string) => void;
    handleSaveGoalEdit: (index: number) => void;
    editingGoalIndex: number | null;
    currentGoalText: string;
    setCurrentGoalText: (text: string) => void;
    setEditingGoalIndex: (index: number | null) => void;
    readOnly?: boolean;
}

export default function GoalListElement({ goals, category, handleEdit, handleDelete, handleSaveGoalEdit, editingGoalIndex, currentGoalText, setCurrentGoalText, setEditingGoalIndex, readOnly = false }: GoalListElementProps) {


    return (
        <div className="row mb-4">
            <div className="col-12">
                {goals.filter(goal => goal.category === category).length > 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-info text-white">
                            <div className="d-flex align-items-center">
                                <div className="bg-white text-info rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-list-stars fs-5"></i>
                                </div>
                                <h5 className="card-title mb-0">
                                    {category.charAt(0).toUpperCase() + category.slice(1)} Goals
                                </h5>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {goals
                                .map((goal, originalIndex) => ({ goal, originalIndex }))
                                .filter(({ goal }) => goal.category === category)
                                .map(({ goal, originalIndex }) => (
                                    <div key={originalIndex} className="border-bottom">
                                        <div className="card h-100 border-0">
                                            <div className="card-body d-flex align-items-center p-4">
                                                <div className="me-3">
                                                    <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                                                         style={{width: '45px', height: '45px'}}>
                                                        <SlStar size={20} />
                                                    </div>
                                                </div>
                                                {editingGoalIndex !== originalIndex ? (
                                                    <div className="flex-grow-1">
                                                        <h6 className="card-title mb-0">{goal.text}</h6>
                                                    </div>
                                                ) : (
                                                    <div className="flex-grow-1 me-3">
                                                        <textarea
                                                            value={currentGoalText}
                                                            onChange={(e) => setCurrentGoalText(e.target.value)}
                                                            className="form-control form-control-lg"
                                                            rows={2}
                                                            style={{ resize: 'vertical', minHeight: '50px' }}
                                                            autoFocus
                                                        />
                                                    </div>
                                                )}
                                                <div className="d-flex flex-column align-items-end gap-2">
                                                    {editingGoalIndex !== originalIndex ? (
                                                        <div className="btn-group">
                                                            <button
                                                                className={`btn btn-outline-primary btn-sm ${readOnly ? 'disabled' : ''}`}
                                                                onClick={() => !readOnly && handleEdit(originalIndex)}
                                                                aria-label="Edit Goal"
                                                                disabled={readOnly}
                                                                title="Edit Goal"
                                                            >
                                                                <SlPencil size={16} />
                                                            </button>
                                                            <button
                                                                className={`btn btn-outline-danger btn-sm ${readOnly ? 'disabled' : ''}`}
                                                                onClick={() => !readOnly && handleDelete(goal.text)}
                                                                aria-label="Delete Goal"
                                                                disabled={readOnly}
                                                                title="Delete Goal"
                                                            >
                                                                <SlTrash size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleSaveGoalEdit(originalIndex)}
                                                                aria-label="Save"
                                                                title="Save Changes"
                                                            >
                                                                <SlPaperPlane size={16} />
                                                            </button>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => { setEditingGoalIndex(null); setCurrentGoalText(""); }}
                                                                aria-label="Cancel"
                                                                title="Cancel Editing"
                                                            >
                                                                <SlClose size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-5">
                            <div className="bg-light text-muted rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                 style={{width: '60px', height: '60px'}}>
                                <i className="bi bi-list-stars fs-4"></i>
                            </div>
                            <h5 className="text-muted">No {category} goals yet</h5>
                            <p className="text-muted mb-0">Add your first goal to get started!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}