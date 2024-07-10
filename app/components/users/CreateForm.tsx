"use client";
import Alert from "@/app/components/Alert";
import { useCreateUserMutation } from "@/lib/features/users/userActions";
import { ResType } from "@/lib/ts/res";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Spinner from "../Spinner";
import { useAppDispatch } from "@/lib/hooks";
import { registerSuccess } from "@/lib/features/users/userSlice";
import { useRouter } from "next/navigation";
import { revalidateUsers } from "@/app/actions";
import { useSession } from "next-auth/react";
type userType = {
  email: string;
  password: string;
  password_confirm: string;
  res: string;
};
export const UserCreateForm = ({ res }: { res: ResType[] }) => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [user, setUser] = useState<userType>({
    email: "",
    password: "",
    password_confirm: "",
    res: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.password !== user.password_confirm) {
      setPasswordError("Пароли не совпадают");
      return;
    }
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{9,})"
    );
    // if (user.res == "") {
    //   setPasswordError("Выберите РЭС");
    //   return;
    // }
    if (!strongRegex.test(user.password)) {
      setPasswordError(
        "Пароль должен содержать не менее 9 символов и содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ"
      );
      return;
    }
    setPasswordError("");
    const { data } = await createUser({
      email: user.email,
      password: user.password,
      res: user.res,
    });
    // console.log(user);
    if (data?.error) {
      setPasswordError(data.error.message);
    }
    if (data?.data) {
      dispatch(registerSuccess({ message: data?.data.message }));
      await revalidateUsers();
      //   redirect("/users");
      router.push("/users");
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
        <h1>Регистрация пользователя</h1>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {passwordError && (
              <Alert className="danger" message={passwordError} />
            )}
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
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">РЭС</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  name="neighborhood"
                  value={user.res}
                  onChange={(e) => setUser({ ...user, res: e.target.value })}
                >
                  <option value="">Выберите</option>
                  {res.map((r) => (
                    <option value={r._id} key={r._id}>
                      РЭС {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group my-2">
                <label htmlFor="exampleInputPassword1">Пароль</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="exampleInputPassword12"
                    placeholder="Введите пароль"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
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
              <div className="form-group my-2">
                <label htmlFor="exampleInputPassword1">
                  Подтверждение пароля
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Введите пароль"
                    value={user.password_confirm}
                    onChange={(e) =>
                      setUser({ ...user, password_confirm: e.target.value })
                    }
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
                className="btn btn-primary btn-block my-2 mr-2"
              >
                Создать
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
