import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useState } from 'react';
import Loading from '../Shared/Loading/Loading';
import BookingModal from './BookingModal';
import Option from './Option';

const Options = ({ selectedDate }) => {
  // const [options, setOptions] = useState([]);
  const [treatment, setTreatment] = useState(null);

  // const { data: options = [] } = useQuery({
  //   queryKey: ["options"],
  //   queryFn: () =>
  //     fetch("http://localhost:5000/appointmentOptions").then((res) =>
  //       res.json()
  //     ),
  // });

  // const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })

  const date = format(selectedDate, "PP")

  const { data: options = [], refetch, isLoading } = useQuery({
    queryKey: ["options", date],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/appointmentOptions?date=${date}`);
      const data = await res.json();
      return data;
    },
  });

  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <div>
      <div className="grid gap-6 my-16 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {options.map((option) => (
          <Option
            key={option._id}
            setTreatment={setTreatment}
            option={option}
          ></Option>
        ))}
      </div>
      <div>
        {treatment && (
          <BookingModal
            selectedDate={selectedDate}
            treatment={treatment}
            setTreatment={setTreatment}
            refetch={refetch}
          ></BookingModal>
        )}
      </div>
    </div>
  );
};

export default Options;