import React, { Component, ReactElement, useEffect, useState } from "react";

interface SessionContextValue {
  goBackFromLogin: string;
  setGoBackFromLogin(str: string): void;
  setOpen(open: boolean): void;
  open: boolean;
}

export const SessionContext = React.createContext<SessionContextValue>(
  {} as SessionContextValue
);
export const useSession = () => React.useContext(SessionContext);

export const SessionProvider: React.FC = ({ children }) => {
  const [goBackFromLogin, setGoBackFromLogin] = useState("/");
  const [open, setOpen] = useState(true);
  return (
    <SessionContext.Provider
      value={{ goBackFromLogin, setGoBackFromLogin, open, setOpen }}
    >
      {children}
    </SessionContext.Provider>
  );
};
