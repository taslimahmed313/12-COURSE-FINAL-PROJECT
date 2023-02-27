import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Contexts/AuthProvider/AuthProvider';

const MyAppointment = () => {
    const {user} = useContext(AuthContext);
    console.log(user)
    const url = `http://localhost:5000/bookings?email=${user?.email}`;

    const { data: bookings = [] } = useQuery({
      queryKey: ["bookings", user?.email],
      queryFn: async () => {
        const res = await fetch(url, {
          headers: {
            authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = res.json();
        return data;
      },
    });
    // console.log(bookings)

    return (
      <div>
        <h3 className="text-3xl">My Appointment</h3>
        <div className="overflow-x-auto mt-5">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Treatment</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings &&
                bookings?.map((booking, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{booking.patientName}</td>
                    <td>{booking.appointmentDate}</td>
                    <td>{booking.slot}</td>
                    <td>
                      {booking.price && !booking.paid && (
                        <Link to={`/dashboard/payment/${booking._id}`}>
                          {" "}
                          <button className="btn btn-xs bg-primary">
                            Pay Now
                          </button>
                        </Link>
                      )}
                      {booking.price && booking.paid && (
                        <button className="btn btn-xs bg-primary">
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default MyAppointment;