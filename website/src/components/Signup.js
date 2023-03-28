import React, { useEffect, useState } from "react";
import validate from "./validateInfo";
import httpClient from "./httpClient";
import "../assets/css/Form.css";

const Signup = () => {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [password2, setPassword2] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors(validate(values));
    setIsSubmitting(true);
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        registerUser();
      }
    },
    [errors]
  );

  const registerUser = async () => {
    try {
      const email = values.email
      const password = values.password

      const resp = await httpClient.post("http://127.0.0.1:5000/register", {
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
    // <div className="form-container">
    //   <div className="form-content">
    //     <form className="form" onSubmit={handleSubmit} noValidate>
    //       <h1>
    //         Get started with us today! Create your account by filling out the
    //         information below.
    //       </h1>
    //       <div className="form-inputs">
    //         <label className="form-label">Email</label>
    //         <input
    //           className="form-input"
    //           type="email"
    //           name="email"
    //           placeholder="Enter your email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //         {errors.email && <p>{errors.email}</p>}
    //       </div>
    //       <div className="form-inputs">
    //         <label className="form-label">Password</label>
    //         <input
    //           className="form-input"
    //           type="password"
    //           name="password"
    //           placeholder="Enter your password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </div>
    //       <div className="form-inputs">
    //         <label className="form-label">Confirm Password</label>
    //         <input
    //           className="form-input"
    //           type="password"
    //           name="password2"
    //           placeholder="Confirm your password"
    //           value={values.password2}
    //           onChange={handleChange}
    //         />
    //         {errors.password2 && <p>{errors.password2}</p>}
    //       </div>
    //       <button
    //         className="form-input-btn"
    //         type="button"
    //         onClick={() => registerUser()}
    //       >
    //         Sign up
    //       </button>
    //       <span className="form-input-login">
    //         Already have an account? Login <a href="/login">here</a>
    //       </span>
    //     </form>
    //   </div>
    // </div>
    <div className='form-container'>
    <form onSubmit={handleSubmit} className='form' noValidate>
      <h1>
        Get started with us today! Create your account by filling out the
        information below.
      </h1>
      <div className='form-inputs'>
        <label className='form-label'>Username</label>
        <input
          className='form-input'
          type='text'
          name='username'
          placeholder='Enter your username'
          value={values.username}
          onChange={handleChange}
        />
        {errors.username && <p>{errors.username}</p>}
      </div>
      <div className='form-inputs'>
        <label className='form-label'>Email</label>
        <input
          className='form-input'
          type='email'
          name='email'
          placeholder='Enter your email'
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div className='form-inputs'>
        <label className='form-label'>Password</label>
        <input
          className='form-input'
          type='password'
          name='password'
          placeholder='Enter your password'
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <div className='form-inputs'>
        <label className='form-label'>Confirm Password</label>
        <input
          className='form-input'
          type='password'
          name='password2'
          placeholder='Confirm your password'
          value={values.password2}
          onChange={handleChange}
        />
        {errors.password2 && <p>{errors.password2}</p>}
      </div>
      <button className='form-input-btn' type='submit'>
        Sign up
      </button>
      <span className='form-input-login'>
        Already have an account? Login <a href='/login'>here</a>
      </span>
    </form>
  </div>
  );
};

export default Signup;
