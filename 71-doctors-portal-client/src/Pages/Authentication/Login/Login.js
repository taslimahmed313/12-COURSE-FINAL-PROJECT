import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Contexts/AuthProvider/AuthProvider';
import useToken from '../../../Hooks/UseToken';

const Login = () => {
    const { register,formState: { errors }, handleSubmit } = useForm();
    const {login} = useContext(AuthContext);
    const [loginError, setLoginError] = useState('');

    const [loginUserEmail, setLoginUserEmail] = useState('');
    const [token] = useToken(loginUserEmail);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    if(token){
       navigate(from, { replace: true });
    }
    
    const handleLogin = data =>{
        console.log(data)
        setLoginError('')
        login(data.email, data.password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setLoginUserEmail(data.email);
          toast.success("Successfully Login!");
        })
        .catch(e => {
          console.log(e);
          setLoginError(e.message)
        });
    }

    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="w-96 p-7">
          <h1 className="text-3xl">Login</h1>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                {...register("email", {
                  required: "Email Address is required",
                })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.email && (
                <p className=" text-red-600" role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password Must be 8 Character",
                  },
                })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.password && (
                <p className="text-red-600" role="alert">
                  {errors.password?.message}
                </p>
              )}
              <label className="label">
                <span className="label-text">Forget Password?</span>
              </label>
            </div>
            <input
              value="Login"
              className="w-full btn btn-accent"
              type="submit"
            />
          </form>
          {loginError && <p className='text-red-600'>{loginError}</p>}

          <p>
            New to Doctor's Portal?{" "}
            <Link to="/signup" className="text-secondary hover:underline">
              Create an Account
            </Link>
          </p>
          <div className="divider">OR</div>
          <button className="btn btn-outline uppercase w-full">
            Continue With Google
          </button>
        </div>
      </div>
    );
};

export default Login;