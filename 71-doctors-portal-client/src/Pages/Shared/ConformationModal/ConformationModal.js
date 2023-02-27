import React from 'react';

const ConformationModal = ({
  title,
  message,
  closeModal,
  successAction,
  actionName,
  modalData
}) => {
  return (
    <div>
      <input type="checkbox" id="conformation-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            <label
              onClick={() => successAction(modalData)}
              htmlFor="conformation-modal"
              className="btn"
            >
              {actionName}
            </label>
            <button onClick={closeModal} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConformationModal;