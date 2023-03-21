import React, { useState } from 'react'
import * as BSIcons from "react-icons/bs";


function Filters() {
const [sidebar, setSidebar] = useState(false);

  const showSideBar = () => setSidebar(!sidebar);

  return (
    <div><BSIcons.BsSliders onClick={showSideBar}/></div>
  )
}

export default Filters