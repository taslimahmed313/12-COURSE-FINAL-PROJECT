import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddADoctor = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const imageHostKey = process.env.REACT_APP_image_apikey;

    const navigate = useNavigate();

    const {data: specialties = [], isLoading} = useQuery({
      queryKey: ["specialty"],
      queryFn: async()=>{
        const res = await fetch("http://localhost:5000/appointmentSpecialty");
        const data = res.json();
        return data;
      }
    })

    const handleAddDoctor = data =>{
        console.log(data.image[0])
        const image = data.image[0];
        const formData = new FormData();
        formData.append("image", image)
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

        fetch(url, {
          method: "POST",
          body: formData
        })
        .then(res => res.json())
        .then(imgData => {
          if(imgData.success){
            console.log(imgData.data.url);
            const doctor = {
              name: data.name,
              email: data.email,
              specialty: data.specialty,
              image: imgData.data.url
            }
            
            // Save Doctor Information to the database-------------------------->
            fetch("http://localhost:5000/doctors",{
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization : `bearer ${localStorage.getItem("accessToken")}` 
              },
              body: JSON.stringify(doctor)
            })
            .then(res => res.json())
            .then(result => {
              console.log(result)
              if(result.acknowledged){
                toast.success(`${data.name} Added Successfully`);
                navigate("/dashboard/manageDoctors");
              }
            })
            

          }
        })
    }

    if(isLoading){
      return <LoaderIcon></LoaderIcon>
    }
    
    return (
      <div className="w-96">
        <h1 className="text-4xl">Add A Doctor</h1>
        <form onSubmit={handleSubmit(handleAddDoctor)}>
          <div className="form-control w-full mt-5">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", {
                required: "Email Address is Required ",
              })}
              type="email"
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500">{errors?.email?.message}</p>
            )}
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Specialty</span>
            </label>
            <select {...register('specialty')} className="select select-bordered w-full">
              <option disabled selected>
                Please Select Doctor's Specialty
              </option>
              {specialties.map((specialty) => (
                <option key={specialty._id} value={specialty.name}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control w-full mt-5">
            <label className="label">
              <span className="label-text">Photo</span>
            </label>
            <input
              {...register("image", { required: true })}
              type="file"
              className="input input-bordered w-full"
            />
          </div>

          <input className="btn w-full my-5" type="submit" value="Add Doctor" />
        </form>
      </div>
    );
};




/* 
* Third Party Image Hosting Server
* File System of Your Server
* MongoDB (database)
*/

export default AddADoctor;