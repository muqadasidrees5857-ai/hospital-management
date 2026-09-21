import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  confirmVariant = "danger",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: confirmVariant === "danger" ? "#fee2e2" : "#fef3c7",
            color: confirmVariant === "danger" ? "#ef4444" : "#d97706",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <AlertTriangle size={28} />
        </div>
        <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5" }}>{message}</p>
        
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          <button className="btn-secondary-custom" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary-custom"
            style={{
              background: confirmVariant === "danger" ? "#dc2626" : "#0d9488",
              boxShadow: "none",
            }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
