import React, { ReactNode } from "react";

export const Alert = ({
  message,
  className,
  children,
}: {
  message: string;
  className: string;
  children?: ReactNode;
}) => {
  return (
    <div className={`alert alert-${className} d-flex justify-content-between align-items-center`}>
      {message}
      {children}
    </div>
  );
};

export default Alert;
