import React from "react";
import validate from "./validateInfo";
import useForm from "./useForm";
import "../assets/css/Login.css";

function Login({ submitForm }) {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );
  return (
    <div className="form-container">
      <div className="form-content">
        <form onSubmit={handleSubmit} className="form" noValidate>
          <h1>Please enter your login details below</h1>
          <div className="form-inputs">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="form-inputs">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <button className="form-input-btn" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
