import React from 'react';

const Option = ({ option, setTreatment }) => {
  const { name, slots, price } = option;
  return (
    <div>
      <div className="card shadow-xl">
        <div className="card-body text-center">
          <h2 className="text-center text-2xl font-semibold text-secondary">
            {name}
          </h2>
          <p>{slots.length > 0 ? slots[0] : "Try Another Day"}</p>
          <p>
            {slots.length} {slots.length > 1 ? "Spaces" : "Space"} Available
          </p>
          <p><small>Price: {price}</small></p>
          <div className="card-actions justify-center">
            <label
            disabled={slots.length === 0}
              onClick={() => setTreatment(option)}
              htmlFor="booking-modal"
              className="btn btn-primary text-white"
            >
              Book Appointment
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Option;