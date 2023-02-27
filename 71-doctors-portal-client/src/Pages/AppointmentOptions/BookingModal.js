import { format } from 'date-fns';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Contexts/AuthProvider/AuthProvider';

const BookingModal = ({ treatment, selectedDate, setTreatment, refetch }) => {
  const { name, slots, price } = treatment; // treatment is appointments Option just another name
  const date = format(selectedDate, "PP");

  const { user } = useContext(AuthContext);

  const handleBooking = (event) => {
    event.preventDefault();
    const form = event.target;
    const patientName = form.name.value;
    const email = form.email.value;
    const slot = form.slot.value;
    const phone = form.phone.value;

    const booking = {
      appointmentDate: date,
      patientName,
      slot,
      email,
      phone,
      treatment: name,
      price
    };

    fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          toast.success("Your Booking Successfully Confirmed !!");
          setTreatment(null);
          refetch();
        }
        else{
          toast.error(data.message)
        }
      });

    // Send Data then SetTreatment to be null........................

    console.log(booking);
  };

  return (
    <div>
      <input type="checkbox" id="booking-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="booking-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-xl font-bold">{name}</h3>
          <form
            onSubmit={handleBooking}
            className="grid grid-cols-1 gap-5 mt-10"
          >
            <input
              type="text"
              value={date}
              disabled
              className="input input-bordered w-full"
            />
            <select name="slot" className="select select-bordered w-full">
              {slots.map((slot, i) => (
                <option value={slot} key={i}>
                  {slot}
                </option>
              ))}
            </select>
            <input
              type="text"
              defaultValue={user?.displayName}
              disabled
              name="name"
              className="input input-bordered w-full "
            />
            <input
              type="email"
              defaultValue={user?.email}
              disabled
              name="email"
              className="input input-bordered w-full "
            />
            <input
              type="text"
              placeholder="Your Phone No"
              name="phone"
              className="input input-bordered w-full "
            />
            <input
              className="w-full bg-accent text-white py-3 rounded-lg"
              type="submit"
              value="SUBMIT"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
