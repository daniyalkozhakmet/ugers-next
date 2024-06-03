"use client";
import { UsersGetResponse } from "@/lib/ts/user";
import React from "react";
import Alert from "../Alert";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDeleteUserMutation } from "@/lib/features/users/userActions";
import Spinner from "../Spinner";
import { deleteError, deleteSuccess } from "@/lib/features/users/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { revalidateUsers } from "@/app/actions";

const UsersTable = ({ data }: { data: UsersGetResponse }) => {
  const dispatch = useAppDispatch();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const editHandler = (id: string) => {
    router.push(`/users/${id}`);
  };
  const deleteHandler = async (id: string) => {
    const { data } = await deleteUser({ user_id: id });
    if (data?.error) {
      dispatch(deleteError({ error: data.error.message }));
    }
    if (data?.data) {
      dispatch(deleteSuccess({ message: data?.data.message }));
    }
    await revalidateUsers();
    router.push("/users");
  };
  const router = useRouter();
  let content = data.error ? (
    <Alert message={data.error.message} className="danger" />
  ) : (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Почта</th>
                <th scope="col">Доступ</th>
                <th scope="col">РЭС</th>
                <th scope="col">Действия</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.users.map((user, index) => (
                <tr key={user._id}>
                  <td scope="row">{index + 1}</td>
                  <td scope="row">{user.email}</td>
                  <td scope="row">{user.role}</td>
                  <td scope="row">РЭС {user.res.name}</td>
                  <td scope="row">
                    <span className="d-flex justify-content-start align-items-center">
                      <span className="border border-warning rounded p-1 mx-1 d-flex justify-content-center align-items-center">
                        <MdEdit
                          color="orange"
                          size={23}
                          onClick={() => editHandler(user._id)}
                        />
                      </span>
                      <span className="border border-danger rounded p-1 mx-1 d-flex justify-content-center align-items-center">
                        <FaTrash
                          color="red"
                          size={23}
                          onClick={() => deleteHandler(user._id)}
                        />
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
  return content;
};

export default UsersTable;
