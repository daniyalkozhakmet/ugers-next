"use client";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useRef } from "react";
import { useSession } from "next-auth/react";
import { useSignOutUserMutation } from "@/lib/features/auth/authActions";
import { useRouter } from "next/navigation";
import { revalidateClaimsPath } from "../actions";
import { useAppDispatch } from "@/lib/hooks";
import { resetClaims } from "@/lib/features/claim/claimSlice";
function SidebarNavbar() {
  const { status, data } = useSession();
  const dispatch = useAppDispatch();
  const [signOutUser] = useSignOutUserMutation();
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleCloseOffcanvas = () => {
    if (offcanvasRef.current) {
      const likeButton = document.getElementById("closeButton");
      if (likeButton) {
        likeButton.click(); // Trigger the click event of the like button
      }
    }
  };
  const signOutHandler = async () => {
    handleCloseOffcanvas();
    const response = await signOutUser();

    if (response?.data) {
      dispatch(resetClaims());
      localStorage.clear();
      sessionStorage.clear();
      router.refresh();
      router.push("/auth/login");
    }
  };
  return (
    <>
      <button
        className="btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
      >
        <GiHamburgerMenu size={30} />
      </button>
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            УРСГ Асфальт
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            id="closeButton"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <>
              {status != "authenticated" ? (
                <>
                  <li className="nav-item">
                    <Link
                      href="/auth/login"
                      className="nav-link text-uppercase"
                      onClick={handleCloseOffcanvas}
                    >
                      Логин
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      href="/claims"
                      className="nav-link text-uppercase"
                      onClick={handleCloseOffcanvas}
                    >
                      Заявки
                    </Link>
                  </li>
                  {data.user.role == "user" && (
                    <>
                      <li className="nav-item">
                        <Link
                          href="/claims/create"
                          className="nav-link text-uppercase"
                          onClick={handleCloseOffcanvas}
                        >
                          Создать заявку
                        </Link>
                      </li>
                    </>
                  )}
                  {data.user.role == "admin" && (
                    <>
                      <li className="nav-item">
                        <Link
                          href="/claims/neighborhood"
                          className="nav-link text-uppercase"
                          onClick={handleCloseOffcanvas}
                        >
                          Заявки по Адм.район
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          href="/claims/res"
                          className="nav-link text-uppercase"
                          onClick={handleCloseOffcanvas}
                        >
                          Заявки по РЭС
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          href="/users"
                          className="nav-link text-uppercase"
                          onClick={handleCloseOffcanvas}
                        >
                          Пользователи
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          href="/users/create"
                          className="nav-link text-uppercase"
                          onClick={handleCloseOffcanvas}
                        >
                          Создать пользователя
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          href="/statistics/res"
                          className="nav-link text-uppercase"
                          onClick={handleCloseOffcanvas}
                        >
                          Свод по РЭС
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <Link
                      href="/statistics/neighborhood"
                      className="nav-link text-uppercase"
                      onClick={handleCloseOffcanvas}
                    >
                      Свод по Адм.район
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/export"
                      className="nav-link text-uppercase"
                      onClick={handleCloseOffcanvas}
                    >
                      Экспорт данных
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-unstyled nav-link text-uppercase"
                      onClick={signOutHandler}
                    >
                      Выход
                    </button>
                  </li>
                </>
              )}
            </>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SidebarNavbar;
