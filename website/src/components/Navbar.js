import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { NavbarItems } from "./NavbarItems";
import "../assets/css/Navbar.css";


function Navbar() {
  const [navbar, setNavBar] = useState(false);

  const showNavBar = () => setNavBar(!navbar);

  return (
   
      <IconContext.Provider value={{ colour: "#fff" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showNavBar} />
          </Link>
        </div>
        <nav className={navbar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showNavBar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {NavbarItems.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    
  );
}

export default Navbar;
