import React, { useState } from 'react'
import FormSignup from './FormSignup'
import '../assets/css/Form.css';
import App from '../App';

const Form = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    function submitForm() {
        setIsSubmitted(true);
      }
    return (
        <>
      <div className='form-container'>
        <span className='close-btn'>×</span>
        <FormSignup />
        {/* {!isSubmitted ? (
          <FormSignup submitForm={submitForm} />
        ) : (
          <App />
        )} */}
      </div>
    </>
    )
}

export default Form