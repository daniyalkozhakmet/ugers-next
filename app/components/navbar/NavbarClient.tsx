"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavbarClient = () => {
  const { data, status } = useSession();
  return (
    <div>
      <Link
        href={"/claims"}
        className="nav-link text-uppercase d-flex justify-content-center align-items-center"
      >
        <Image src={"/azhk2.png"} alt="Logo" width="45" height="45" />
        {status == "authenticated" ? (
          <>
            <span className="navbar-brand mb-0 h1 mx-1">
              {data?.user?.email}
            </span>
          </>
        ) : (
          <>
            <span className="navbar-brand mb-0 h1 mx-1">ASFALT_NEW</span>
          </>
        )}
      </Link>
    </div>
  );
};

export default NavbarClient;
