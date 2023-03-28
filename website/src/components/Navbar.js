import React, { useState, useEffect } from "react";
import { MenuItems } from "./MenuItems";
import { LoggedInMenuItems } from "./LoggedInMenuItems";
import { Button } from "./Button";
import * as GiIcons from "react-icons/gi";
import "../assets/css/Navbar.css";
import httpClient from "./httpClient";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);

  const logoutUser = async () => {
    await httpClient.post("http://127.0.0.1:5000/logout");

    window.location.href = "/";
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          "http://127.0.0.1:5000/get_current_user"
        );
        setUser(resp.data.id);
      } catch (error) {
        console.log("Not Authenticated");
      }
    })();
  }, []);

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">
        <a className="nav-links-title" href="/">
          Anime Recommender
        </a>
        <GiIcons.GiBrain className="gi-brain" />
      </h1>
      <ul className="nav-menu">
        {/* <Link
          className="saved-anime"
          to="/saved"
          state={JSON.parse(localStorage.getItem("savedAnimeList"))}
        >
          View Saved
        </Link> */}
        {user != null ? (
          <>
            {LoggedInMenuItems.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <a className={item.cName} href={item.url}>
                    {item.title}
                  </a>
                </li>
              );
            })}
            <Button onClick={logoutUser}>
              <p className="navbar-logout">Log Out</p>
            </Button>
          </>
        ) : (
          <>
            {MenuItems.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <a className={item.cName} href={item.url}>
                    {item.title}
                  </a>
                </li>
              );
            })}
            <Button>
              <a className="nav-link-signup" href="/signup">
                Sign Up
              </a>
            </Button>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
