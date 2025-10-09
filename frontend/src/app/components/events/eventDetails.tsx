import React from "react";
import { IEvent } from "../../../interfaces/IEvent";
import { SlTrash, SlPencil, SlCheck } from "react-icons/sl";
import { fetchLabels, Label } from "../../../data/fetch_labels";
import { createEvent, updateEvent, deleteEvent } from "../../../data/fetch_events";

interface EventDetailsProps {
    event: IEvent;
    mode: string;
    plannerId?: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, mode, plannerId }) => {
    // Helper function to safely convert dates
    const safeConvertDate = (date: any): Date | undefined => {
        if (!date) return undefined;
        
        try {
            // Check if it's a Firebase Timestamp object
            if (date && typeof date === 'object' && typeof date.toDate === 'function') {
                return date.toDate();
            }
            
            // Check if it's already a Date object
            if (date instanceof Date) {
                return date;
            }
            
            // Try to convert string/number to Date
            const converted = new Date(date);
            return isNaN(converted.getTime()) ? undefined : converted;
        } catch (error) {
            console.error("Error converting date:", error, "Date value:", date);
            return undefined;
        }
    };

    // Helper function to sanitize event dates
    const sanitizeEvent = (event: IEvent): IEvent => {
        return {
            ...event,
            date_start: safeConvertDate(event.date_start) || new Date(),
            date_end: safeConvertDate(event.date_end)
        };
    };

    const [editedEvent, setEditedEvent] = React.useState<IEvent>(sanitizeEvent(event));
    const [currentMode, setCurrentMode] = React.useState(mode);
    const [availableLabels, setAvailableLabels] = React.useState<Label[]>([]);
    const [presetLabels] = React.useState<Label[]>([
        { id: 'preset-1', name: 'Work', color: '#3b82f6' },
        { id: 'preset-2', name: 'Personal', color: '#10b981' },
        { id: 'preset-3', name: 'Meeting', color: '#ef4444' },
        { id: 'preset-4', name: 'Social', color: '#f59e0b' },
        { id: 'preset-5', name: 'Learning', color: '#8b5cf6' },
        { id: 'preset-6', name: 'Travel', color: '#ec4899' },
        { id: 'preset-7', name: 'Health', color: '#06b6d4' },
        { id: 'preset-8', name: 'Family', color: '#84cc16' },
    ]);

    React.useEffect(() => {
        setCurrentMode(mode);
    }, [mode]);

    React.useEffect(() => {
        // Fetch user labels and combine with preset labels
        const loadLabels = async () => {
            try {
                const userLabels = await fetchLabels();
                setAvailableLabels([...presetLabels, ...userLabels]);
            } catch (error) {
                console.error('Error fetching labels:', error);
                // Fallback to just preset labels
                setAvailableLabels(presetLabels);
            }
        };
        
        loadLabels();
    }, [currentMode, presetLabels]);

    const handleDelete = async () => {
        if (!plannerId || !event.id) {
            console.error("Missing plannerId or event ID for deletion");
            return;
        }
        
        const success = await deleteEvent(plannerId, event.id);
        if (success) {
            window.location.reload();
        }
    };

    const handleEdit = async () => {
        setCurrentMode("edit");
    };

    const handleSave = async () => {
        if (!plannerId) {
            console.error("Missing plannerId for event save");
            return;
        }

        let success = false;
        if (currentMode === "edit") {
            // Update event
            success = await updateEvent(plannerId, editedEvent);
        } else {
            // Create event
            const createdEvent = await createEvent(plannerId, editedEvent);
            success = createdEvent !== false;
        }
        
        if (success) {
            window.location.reload();
        }
    };

    const handleChange = (field: string, value: any) => {
        setEditedEvent((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div className="container mt-4">

            {/* name */}
            {currentMode === "view" && (
                <>
                    <h2>{event.name.toUpperCase()}</h2>
                    <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-calendar-event me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                        <span className="text-muted">Event</span>
                    </div>
                </>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Event Name</strong>
                    <input
                        type="text"
                        value={editedEvent.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="form-control mb-2"
                        placeholder="Enter event name"
                    />
                </div>
            )}

            {/* date_start */}
            {currentMode === "view" && (
                <p>
                    <strong>Start Date: </strong>
                    {(() => {
                        const date = safeConvertDate(event.date_start);
                        return date ? date.toLocaleDateString() : 'No date set';
                    })()}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Start Date</strong>
                    <input
                        type="date"
                        value={(() => {
                            try {
                                const date = safeConvertDate(editedEvent.date_start);
                                return date ? date.toISOString().split("T")[0] : "";
                            } catch (error) {
                                console.error("Error formatting date for input:", error);
                                return "";
                            }
                        })()}
                        onChange={(e) => {
                            const newDate = e.target.value ? new Date(e.target.value) : new Date();
                            handleChange("date_start", newDate);
                        }}
                        className="form-control mb-2"
                        required
                    />
                </div>
            )}

            {/* date_end */}
            {(currentMode === "view" && event.date_end !== undefined) && (
                <p>
                    <strong>End Date: </strong>
                    {(() => {
                        const date = safeConvertDate(event.date_end);
                        return date ? date.toLocaleDateString() : 'No date set';
                    })()}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>End Date (Optional)</strong>
                    <input
                        type="date"
                        value={(() => {
                            if (!editedEvent.date_end) return "";
                            try {
                                const date = safeConvertDate(editedEvent.date_end);
                                return date ? date.toISOString().split("T")[0] : "";
                            } catch (error) {
                                console.error("Error formatting date for input:", error);
                                return "";
                            }
                        })()}
                        onChange={(e) => {
                            const newDate = e.target.value ? new Date(e.target.value) : undefined;
                            handleChange("date_end", newDate);
                        }}
                        className="form-control mb-2"
                    />
                </div>
            )}

            {/* location */}
            {currentMode === "view" && event.location && (
                <p>
                    <strong>Location: </strong>
                    {event.location}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Location (Optional)</strong>
                    <input
                        type="text"
                        value={editedEvent.location || ""}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="form-control mb-2"
                        placeholder="Enter event location"
                    />
                </div>
            )}

            {/* color */}
            {currentMode === "view" && event.color && (
                <p>
                    <strong>Color: </strong>
                    <span 
                        className="badge"
                        style={{ backgroundColor: event.color, color: '#fff' }}
                    >
                        {event.color}
                    </span>
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Event Color</strong>
                    <div className="d-flex align-items-center gap-2 mt-2">
                        <input
                            type="color"
                            value={editedEvent.color || "#3b82f6"}
                            onChange={(e) => handleChange("color", e.target.value)}
                            className="form-control form-control-color"
                            style={{ width: '50px', height: '40px' }}
                        />
                        <span className="text-muted">Choose a color for your event</span>
                    </div>
                </div>
            )}

            {/* labels */}
            {currentMode === "view" && (event.labels && event.labels.length > 0) && (
                <div className="mb-3">
                    <strong>Labels: </strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {event.labels.map((labelId) => {
                            const label = availableLabels.find(l => l.id === labelId);
                            if (!label) return null;
                            return (
                                <span 
                                    key={labelId}
                                    className="badge d-flex align-items-center"
                                    style={{
                                        backgroundColor: label.color,
                                        color: '#fff',
                                        fontSize: '0.8rem',
                                        padding: '0.4rem 0.8rem'
                                    }}
                                >
                                    <i className="bi bi-tag-fill me-1"></i>
                                    {label.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Labels</strong>
                    <div className="mt-2">
                        <div className="row g-2">
                            {availableLabels.map((label) => {
                                const isSelected = editedEvent.labels?.includes(label.id) || false;
                                return (
                                    <div key={label.id} className="col-sm-6 col-md-4">
                                        <div 
                                            className={`card cursor-pointer border-2 ${isSelected ? 'border-primary' : 'border-light'}`}
                                            onClick={() => {
                                                const currentLabels = editedEvent.labels || [];
                                                if (isSelected) {
                                                    // Remove label
                                                    handleChange("labels", currentLabels.filter(id => id !== label.id));
                                                } else {
                                                    // Add label
                                                    handleChange("labels", [...currentLabels, label.id]);
                                                }
                                            }}
                                            style={{
                                                transition: 'all 0.2s ease',
                                                transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                        >
                                            <div className="card-body p-2 d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle me-2"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: label.color
                                                    }}
                                                ></div>
                                                <small className="flex-grow-1">{label.name}</small>
                                                {isSelected && (
                                                    <i className="bi bi-check-circle-fill text-primary"></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {availableLabels.length === 0 && (
                            <div className="text-center py-3 text-muted">
                                <i className="bi bi-tags display-6 mb-2"></i>
                                <p className="mb-0">No labels available. Create some in your profile!</p>
                            </div>
                        )}
                        {editedEvent.labels && editedEvent.labels.length > 0 && (
                            <div className="mt-3">
                                <small className="text-muted">Selected labels:</small>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {editedEvent.labels.map((labelId) => {
                                        const label = availableLabels.find(l => l.id === labelId);
                                        if (!label) return null;
                                        return (
                                            <span 
                                                key={labelId}
                                                className="badge"
                                                style={{
                                                    backgroundColor: label.color,
                                                    color: '#fff',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {label.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* description */}
            {currentMode === "view" && event.description && event.description !== "" && (
                <p>
                    <strong>Description: </strong>
                    {event.description}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Description (Optional)</strong>
                    <textarea
                        value={editedEvent.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="form-control mb-2"
                        rows={3}
                        placeholder="Enter event description"
                    />
                </div>
            )}

            <div className="row justify-content-center">
                {(currentMode === "edit" || currentMode === "create") ? (
                        <button className="btn btn-success" onClick={handleSave}>
                            Save Event
                        </button>
                ) : (
                    <>
                        <div className="col-3 d-flex justify-content-center">
                            <button
                                className="btn btn-link text-secondary"
                                onClick={() => handleEdit()}
                                aria-label="Edit Event"
                            >
                                <SlPencil size={24} />
                            </button>
                        </div>
                        <div className="col-3 d-flex justify-content-center">
                            <button
                                className="btn btn-link text-danger"
                                onClick={() => handleDelete()}
                                aria-label="Delete Event"
                            >
                                <SlTrash size={24} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventDetails;