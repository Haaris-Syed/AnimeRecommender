import React, { useState, useEffect } from "react";
import { MenuItems } from "./MenuItems";
import { LoggedInMenuItems } from "./LoggedInMenuItems";
import { Button } from "./Button";
import * as GiIcons from "react-icons/gi";
import "../assets/css/Navbar.css";
import httpClient from "./httpClient";

function Navbar() {
  const [user, setUser] = useState(null);

  const logoutUser = async () => {
    await httpClient.get("http://127.0.0.1:5000/logout");

    window.location.href = "/";
  };

  // just cheat and set the user to not null
  // delete all that extra form input checking and just keep css

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       console.log("USER: ", user);
  // const resp = await httpClient.get(
  //   "http://127.0.0.1:5000/get_current_user"
  // );

  // //       // console.log("Checking: ", resp.data.id)
  // //       // setUser(resp.data.id);
  //       setUser('Logged In')
  //     } catch (error) {
  //       console.log("Not Authenticated");
  //     }
  //   })();
  // }, []);

  console.log("USER AFTER: ", user);
  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">
        <a className="nav-links-title" href="/">
          Anime Recommender
        </a>
        <GiIcons.GiBrain className="gi-brain" />
      </h1>
      <ul className="nav-menu">
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
            <li className="logout">
              <Button onClick={logoutUser}>Log Out</Button>
            </li>
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
