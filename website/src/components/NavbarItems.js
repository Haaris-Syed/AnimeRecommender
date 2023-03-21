import React from "react";
import * as AiIcons from "react-icons/ai";
import * as BSIcons from "react-icons/bs";
import * as RIIcons from "react-icons/ri";

export const NavbarItems = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Filters",
    path: "/",
    icon: <BSIcons.BsSliders />,
    cName: "nav-text",
  },
  {
    title: "Account",
    path: "/account",
    icon: <RIIcons.RiAccountCircleLine />,
    cName: "nav-text",
  },
];
