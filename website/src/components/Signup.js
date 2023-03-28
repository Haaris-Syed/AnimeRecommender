import React, { useState } from "react";
import validate from "./validateInfo";
import useForm from "./useForm";
import httpClient from "./httpClient";
import "../assets/css/Form.css";

const Signup = ({ submitForm }) => {
  // const { handleChange, handleSubmit, values, errors } = useForm(
  //   submitForm,
  //   validate
  // );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {

    try {
      const resp = await httpClient.post("http://127.0.0.1:5000/register", 
      {
        email,
        password,
      });

      window.location.href = "/";

    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    // <div className='form-content'>
    //   <form onSubmit={handleSubmit} className='form' noValidate>
    //     <h1>
    // Get started with us today! Create your account by filling out the
    // information below.
    //     </h1>
    //     <div className='form-inputs'>
    //       <label className='form-label'>Username</label>
    //       <input
    //         className='form-input'
    //         type='text'
    //         name='username'
    //         placeholder='Enter your username'
    //         value={values.username}
    //         onChange={handleChange}
    //       />
    //       {errors.username && <p>{errors.username}</p>}
    //     </div>
    //     <div className='form-inputs'>
    //       <label className='form-label'>Email</label>
    //       <input
    //         className='form-input'
    //         type='email'
    //         name='email'
    //         placeholder='Enter your email'
    //         value={values.email}
    //         onChange={handleChange}
    //       />
    //       {errors.email && <p>{errors.email}</p>}
    //     </div>
    //     <div className='form-inputs'>
    //       <label className='form-label'>Password</label>
    //       <input
    //         className='form-input'
    //         type='password'
    //         name='password'
    //         placeholder='Enter your password'
    //         value={values.password}
    //         onChange={handleChange}
    //       />
    //       {errors.password && <p>{errors.password}</p>}
    //     </div>
    // <div className='form-inputs'>
    //   <label className='form-label'>Confirm Password</label>
    //   <input
    //     className='form-input'
    //     type='password'
    //     name='password2'
    //     placeholder='Confirm your password'
    //     value={values.password2}
    //     onChange={handleChange}
    //   />
    //   {errors.password2 && <p>{errors.password2}</p>}
    // </div>
    // <div className="form-container">onSubmit={handleSubmit}
    <div className='form-container'>
    <div className="form-content">
      <form className="form">
        <h1>
          Get started with us today! Create your account by filling out the
          information below.
        </h1>
        <div className="form-inputs">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* {errors.email && <p>{errors.email}</p>} */}
        </div>
        <div className="form-inputs">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* <div className="form-inputs">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            name="password2"
            placeholder="Confirm your password"
            value={values.password2}
            onChange={handleChange}
          />
          {errors.password2 && <p>{errors.password2}</p>}
        </div> */}
        <button
          className="form-input-btn"
          type="button"
          onClick={() => registerUser()}
        >
          Sign up
        </button>
        <span className="form-input-login">
          Already have an account? Login <a href="/login">here</a>
        </span>
      </form>
    </div>
    </div>
  );
};

export default Signup;
