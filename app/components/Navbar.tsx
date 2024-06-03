import Link from "next/link";
import React from "react";
import SidebarNavbar from "./SideNavbar";
import NavbarClient from "./navbar/NavbarClient";

const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light shadow p-3 mb-5 bg-white rounded fixed-top">
      <NavbarClient />
      <SidebarNavbar />
    </nav>
  );
};

export default Navbar;
