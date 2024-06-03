import { UserCreateForm } from "@/app/components/users/CreateForm";
import { UserCreateMessage } from "../components/users/UserCreateMessage";
import { fetchUsers } from "@/lib/features/users/userActions";
import { UsersGetResponse } from "@/lib/ts/user";
import UsersTable from "../components/users/UsersTable";
import { revalidateTag } from "next/cache";
import ProtectedAdmin from "../components/secure/ProtectedAdmin";
export default async function Page() {


  const data = await fetchUsers();
  const users: UsersGetResponse = await data.json();
  return (
    <ProtectedAdmin>
      <h1>Пользователи</h1>
      <UserCreateMessage />
      <UsersTable data={users} />
    </ProtectedAdmin>
  );
}
