import React from "react";

type Props = {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmPopup({ open, title, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="popup">
      <div className="popup-box">
        <p>{title}</p>
        <div className="popup-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopup;
