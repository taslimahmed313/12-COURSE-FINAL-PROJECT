import React, { useState } from 'react';
import AppointmentBanner from '../AppointmentBanner.js/AppointmentBanner';
import AvailableAppointment from '../AvailableAppointment/AvailableAppointment';

const Appointment = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const setDate = (date) =>{
      if(date){
        setSelectedDate(date)
      }
    } 
    
    return (
      <div>
        <AppointmentBanner
          selectedDate={selectedDate}
          setSelectedDate={setDate}
        ></AppointmentBanner>
        <AvailableAppointment
          selectedDate={selectedDate}
        ></AvailableAppointment>
      </div>
    );
};

export default Appointment;