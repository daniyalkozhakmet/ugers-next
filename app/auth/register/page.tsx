"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
type userType = {
  email: string;
  password: string;
};
const Page = () => {
  const [user, setUser] = useState<userType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user }),
      });
    } catch (error) {
    }
  };
  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  return (
    <div className="row">
      <div className="col-lg-9 col-12 mx-auto">
        <h1>Регистрация</h1>
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="form-group my-2">
            <label htmlFor="exampleInputEmail1">Почта</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Введите почту"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="exampleInputPassword1">Пароль</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Введите пароль"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <div className="input-group-append">
                <button
                  onClick={(e) => togglePasswordVisibility(e)}
                  className="btn btn-outline-secondary password-toggle-button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block my-2 mr-2"
          >
            Вход
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
