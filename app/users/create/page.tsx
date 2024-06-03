import ProtectedAdmin from "@/app/components/secure/ProtectedAdmin";
import { UserCreateForm } from "@/app/components/users/CreateForm";
import { fetchRes } from "@/lib/features/res/resActions";
import { ResType } from "@/lib/ts/res";
import { revalidateTag } from "next/cache";

export default async function Page() {
  revalidateTag("Res");
  const data = await fetchRes();
  const res: { res: ResType[] } = await data.json();

  return (
    <ProtectedAdmin>
      <UserCreateForm res={res.res} />
    </ProtectedAdmin>
  );
}
