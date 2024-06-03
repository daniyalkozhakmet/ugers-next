import React, { ReactNode } from "react";

export const ErrorAlert = ({
  message,
  className,
  children,
}: {
  message: string;
  className: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`alert alert-${className} d-flex justify-content-between align-items-center p-0 px-1 my-1`}
    >
      {message}
      {children}
    </div>
  );
};

export default ErrorAlert;
