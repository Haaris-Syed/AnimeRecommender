import React, { useState }  from 'react'
import * as BSIcons from "react-icons/bs";
import '../assets/css/Filters.css'


function Filters() {
const [sidebar, setSidebar] = useState(false);

  const showSideBar = () => setSidebar(!sidebar);

  return (
    <button className='filter-button'>
        <BSIcons.BsSliders onClick={showSideBar}/>
    </button>
  )
}

export default Filters