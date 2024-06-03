"use client";
import { revalidateClaims, revalidateClaimsPath } from "@/app/actions";
import Alert from "@/app/components/Alert";
import Spinner from "@/app/components/Spinner";
import { useSignInUserMutation } from "@/lib/features/auth/authActions";
import { useAppSelector } from "@/lib/hooks";
import { getSession, signIn, useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import React, { startTransition, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
type userType = {
  email: string;
  password: string;
};
export default function Page() {
  const router = useRouter();
  const [signInUser] = useSignInUserMutation();
  const { error, loading } = useAppSelector((state) => state.authReducer);
  const [user, setUser] = useState<userType>({
    email: "",
    password: "",
  });
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await signInUser({ ...user });
    if (response.data) {
      setLoadingSuccess(true);
      await waitForSession();

      router.push("/claims");
    }
  };
  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const waitForSession = async () => {
    // Poll for the session to be available
    const timeout = 10000;
    const interval = 200;
    let elapsedTime = 0;

    while (elapsedTime < timeout) {
      let session = await getSession();
      if (session) {
        setLoadingSuccess(false); // Hide spinner when session is available
        await revalidateClaimsPath();
        router.push("/claims");

        break;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      console.log(elapsedTime);

      elapsedTime += interval;
    }

    // // Handle session not available within timeout
    // console.error("Session not available within timeout");
    // setLoadingSuccess(false); // Hide spinner after timeout
  };
  let content =
    loading || loadingSuccess ? (
      <Spinner />
    ) : (
      <div className="row">
        <div className="col-lg-9 col-12 mx-auto">
          <h1>Логин</h1>
          {error && <Alert message={error} className="danger" />}
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
  return content;
}
