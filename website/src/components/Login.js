import React, { useState } from "react";
import validate from "./validateInfo";
import useForm from "./useForm";
import httpClient from "./httpClient";
import "../assets/css/Login.css";


function Login({ submitForm }) {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );

  // MAYBE STORE LOGIN DETAILS AND STUFF IN LOCAL STORAGE? WHEN CALLING THE 
  // GET CURRENT USER FUNCTION

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logInUser = async () => {
    // console.log(email, password)
    try {
      const resp = await httpClient.post("http://127.0.0.1:5000/login", {
        email,
        password,
        // email: 'haarissyed@gmail.com',
        // password: 'randomrandom',
      });
      console.log('ID + EMAIL: ' ,resp.data)
      window.location.href = "/";

    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  }
  
  return (
    <div className="form-container">
      <div className="form-content">
        <form onSubmit={handleSubmit} className="form" noValidate>
          <h1>Please enter your login details below.</h1>
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
            {errors.email && <p>{errors.email}</p>}
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
          <button className="form-input-btn" type="button" onClick={() => logInUser()}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
