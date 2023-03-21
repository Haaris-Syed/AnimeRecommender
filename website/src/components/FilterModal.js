import React from 'react'
import '../assets/css/FilterModal.css'

function FilterModal(props) {
  return (
    <div className='modal'>
        <div className='modal-content'>
            {props.children}
        </div>
    </div>
  );
}

export default FilterModal