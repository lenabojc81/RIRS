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
        <div className="mb-3">
            {goals.filter(goal => goal.category === category).length > 0 && goals
                .map((goal, originalIndex) => ({ goal, originalIndex }))
                .filter(({ goal }) => goal.category === category)
                .map(({ goal, originalIndex }) => (
                    <div key={originalIndex} className="d-flex align-items-center p-3 border rounded bg-light mb-1">
                        <div className="me-3">
                            <SlStar size={40} className="text-primary" />
                        </div>
                        {editingGoalIndex !== originalIndex ? (
                            <div className="transactionDetails flex-grow-1">
                                <div className="transactionName mb-1 fw-bold">{goal.text}</div>
                            </div>
                        ) : (
                            <textarea
                                value={currentGoalText}
                                onChange={(e) => setCurrentGoalText(e.target.value)}
                                className="form-control me-2"
                                rows={2}
                                style={{ resize: 'vertical', minHeight: '50px', maxWidth: '400px' }}
                            />
                        )
                        }
                        {editingGoalIndex !== originalIndex ? (
                            <div className="d-flex gap-1">
                                <button
                                    className={`btn btn-sm btn-secondary ${readOnly ? 'disabled' : ''}`}
                                    onClick={() => !readOnly && handleEdit(originalIndex)}
                                    aria-label="Edit Goal"
                                    disabled={readOnly}
                                >
                                    <SlPencil size={20} />
                                </button>
                                <button
                                    className={`btn btn-sm btn-danger ${readOnly ? 'disabled' : ''}`}
                                    onClick={() => !readOnly && handleDelete(goal.text)}
                                    aria-label="Delete Goal"
                                    disabled={readOnly}
                                >
                                    <SlTrash size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex gap-1">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleSaveGoalEdit(originalIndex)}
                                    aria-label="Save"
                                >
                                    <SlPaperPlane size={20} />
                                </button>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => { setEditingGoalIndex(null); setCurrentGoalText(""); }}
                                    aria-label="Cancel"
                                >
                                    <SlClose size={20} />
                                </button>
                            </div>
                        )
                        }
                    </div>
                ))}
        </div>
    )
}