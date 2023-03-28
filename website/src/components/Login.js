import React, { useEffect, useState } from "react";
import validate from "./validateInfo";
import useForm from "./useForm";
import httpClient from "./httpClient";
import "../assets/css/Login.css";

function Login({ submitForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    try {
      const resp = await httpClient.post("http://127.0.0.1:5000/login", {
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
    <div className="form-container">
      <div className="form-content">
        <form className="form">
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
          <button
            className="form-input-btn"
            type="button"
            onClick={() => logInUser()}
          >
            Log In
          </button>
          <span className="form-input-login">
            Not already registered? Sign up <a href="/signup">here</a>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;
