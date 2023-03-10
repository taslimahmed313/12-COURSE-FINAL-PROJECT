import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import ConformationModal from '../../Shared/ConformationModal/ConformationModal';

const ManageDoctors = () => {
const [deletingDoctor, setDeletingDoctor] = useState(null);

const closeModal = () =>{
    setDeletingDoctor(null);
}

const {data: doctors = [], isLoading, refetch} = useQuery({
    queryKey: ['doctors'],
    queryFn: async()=>{
        try {
          const res = await fetch("http://localhost:5000/doctors", {
            headers: {
                authorization: `bearer ${localStorage.getItem("accessToken")}`
            } 
          });
          const data = await res.json();
          return data;  



        } catch (error) {
            console.log(error)
        }
    }
})


const handleDeleteDoctor = (doctor) => {
  fetch(`http://localhost:5000/doctors/${doctor._id}`, {
    method: "DELETE",
    headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`
    }
  })
  .then(res => res.json())
    .then(data =>{
        console.log(data)
        if (data.deletedCount > 0){
            toast.success(`Doctor ${doctor.name} Deleted Successfully`)
            refetch();
        } 
    })
};

if(isLoading){
    return <LoaderIcon></LoaderIcon>
}

    return (
      <div>
        <p className="text-3xl">Manage Doctors: {doctors?.length}</p>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, i) => (
                <tr key={doctor?._id}>
                  <th>{i + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src={doctor?.image} alt="" />
                      </div>
                    </div>
                  </td>
                  <td>{doctor?.name}</td>
                  <td>{doctor?.email}</td>
                  <td>{doctor?.specialty}</td>
                  <td>
                    <label
                      onClick={() => setDeletingDoctor(doctor)}
                      htmlFor="conformation-modal"
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deletingDoctor && (
          <ConformationModal
            title={`Are you sure want to delete?`}
            message={`If you delete ${deletingDoctor.name}. It Cannot be undone !!`}
            closeModal={closeModal}
            modalData={deletingDoctor}
            successAction={handleDeleteDoctor}
            actionName="Delete"
          ></ConformationModal>
        )}
      </div>
    );
};

export default ManageDoctors;