import { format } from 'date-fns';
import React from 'react';
import Options from '../../AppointmentOptions/Options';

const AvailableAppointment = ({selectedDate}) => {
    return (
      <div className="">
        <p className="text-center my-16 text-secondary font-semibold">
          Available Appointments on {format(selectedDate, "PP")}
        </p>
        <Options selectedDate={selectedDate}></Options>
        <div></div>
      </div>
    );
};

export default AvailableAppointment;