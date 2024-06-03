"use client";
import { useAppSelector } from "@/lib/hooks";
import React from "react";
import Alert from "../Alert";

export const UserCreateMessage = () => {
  const { message } = useAppSelector((state) => state.userReducer);
  let content = message ? (
    <Alert message={message} className="success" />
  ) : null;
  return content;
};

