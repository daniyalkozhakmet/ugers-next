import { UserCreateForm } from "@/app/components/users/CreateForm";
import { UserCreateMessage } from "../components/users/UserCreateMessage";
import { fetchUsers } from "@/lib/features/users/userActions";
import { UsersGetResponse } from "@/lib/ts/user";
import UsersTable from "../components/users/UsersTable";
import { revalidateTag } from "next/cache";
import ProtectedAdmin from "../components/secure/ProtectedAdmin";
import { GET } from "../api/users/route";
export default async function Page() {
  const data = await GET();
  const users: UsersGetResponse = await data.json();
  return (
    <ProtectedAdmin>
      <h1>Пользователи</h1>
      <UserCreateMessage />
      <UsersTable data={users} />
    </ProtectedAdmin>
  );
}
