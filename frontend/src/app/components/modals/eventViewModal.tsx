import { IEvent } from "@/interfaces/IEvent";
import React from "react";
import EventDetails from "@/app/components/events/eventDetails";

interface EventModalProps {
    event: IEvent,
    mode: string,
    setShowModal: (show: boolean) => void,
    plannerId?: string
}

export default function EventViewModal({ event, setShowModal, mode, plannerId }: EventModalProps) {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {mode === "edit" && <h5 className="modal-title">Edit Event</h5>}
                        {mode === "view" && <h5 className="modal-title">View Event</h5>}
                        {mode === "create" && <h5 className="modal-title">Create Event</h5>}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <EventDetails event={event} mode={mode} plannerId={plannerId} />
                    </div>
                </div>
            </div>
        </div>
    )
}