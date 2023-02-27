import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Contexts/AuthProvider/AuthProvider';
import useToken from '../../../Hooks/UseToken';

const Signup = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
const { signup, updateUser } = useContext(AuthContext);

const [signupError, setSignupError] = useState('');

const [createdUserEmail, setCreatedUserEmail] = useState('');
const [token] = useToken(createdUserEmail);

const navigate = useNavigate()
if(token){
  navigate("/")
}


    const handleSignup = (data) =>{
      setSignupError('')
        signup(data.email, data.password)
        .then(result =>{
          const user = result.user;
          console.log(user);
          const userInfo = {
            displayName: data.name,
          };
          updateUser(userInfo)
          .then(()=>{
            saveUser(data.name, data.email)
          })
          .catch(e =>console.log(e))
          toast.success("Successfully Signup!");
        })
        .catch(e => {
          console.error(e)
          setSignupError(e.message);
        })
    }

    const saveUser = (name, email) =>{
      const user = {name, email};
      fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "content-type" : "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
       setCreatedUserEmail(email);
      })
    }

    
    return (
      <div className="flex items-center h-[600px] justify-center">
        <div className="w-96 ">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit(handleSignup)}>
            <div className="form-control w-full">
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
                <span className="label-text">Password</span>
              </label>
              <input
                {...register("password", {
                  required: "Password Required !!!",
                  minLength: {
                    value: 6,
                    message: "Password Must have 6 character",
                  },
                  pattern: {
                    value: /[A-Za-z]*[!@#$&*]/,
                    message:
                      "password must be one uppercase, one lowercase and one special character",
                  },
                })}
                type="password"
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-red-500">{errors?.password?.message}</p>
              )}
            </div>

            <input className="btn w-full my-5" type="submit" value="SUBMIT" />
          </form>
          {signupError && <p className='text-red-500'>{signupError}</p>}
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-secondary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Signup;