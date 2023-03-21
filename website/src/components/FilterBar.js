import React, { useState } from "react";
import * as BSIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import "../assets/css/Filters.css";

function Filters() {
  const [menubar, setMenuBar] = useState(false);

  const showMenuBar = () => setMenuBar(!menubar);

  return (
    <div>
      <button className="filter-button">
        <BSIcons.BsSliders onClick={showMenuBar} />
      </button>
      <div className="navbar">
      </div>
      <nav className={menubar ? "filter-menu.active" : "filter-menu"}>
        <ul className="nav-menu-items" onClick={showMenuBar}>
          <li className="filter-toggle">
            <p className="menu-bars">
              <AiIcons.AiOutlineClose />
            </p>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Filters;
