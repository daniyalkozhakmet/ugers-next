import { NextResponse } from "next/server";
export type ParamType = {
  claim_number: string;
  invent_num: string;
  neighborhood: string;
  res: string;
};
export function middleware(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;
  const requestHeaders = new Headers(request.headers);
  const claim_number = url.searchParams.get("claim_number") || "";
  const invent_num = url.searchParams.get("invent_num") || "";
  const neighborhood = url.searchParams.get("neighborhood") || "";
  const res = url.searchParams.get("res") || "";
  let params: ParamType = {} as ParamType;
  if (
    claim_number != "" ||
    invent_num != "" ||
    neighborhood != "" ||
    res != ""
  ) {
    params = { ...params, claim_number, invent_num, neighborhood, res };
  }
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);
  if (!isObjEmpty(params)) {
    requestHeaders.set("x-params", JSON.stringify(params));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
function isObjEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}
