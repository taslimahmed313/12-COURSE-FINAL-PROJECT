import React from 'react';
import { DayPicker } from 'react-day-picker';
import chair from "../../../assets/images/chair.png";

const AppointmentBanner = ({selectedDate ,setSelectedDate }) => {
  return (
    <div className="hero background">
      <div className="hero-content flex-col gap-5 lg:flex-row-reverse">
        <img src={chair} className="lg:w-1/2 rounded-lg shadow-2xl" alt="s" />
        <div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentBanner;