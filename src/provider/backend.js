import React, { createContext, useState, useEffect } from "react";
import { FrappeApp } from "frappe-js-sdk";
import { BASE_URI } from "../data/constants";

const FrappeContext = createContext();

const FrappeProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [call, setCall] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const frappe = new FrappeApp(BASE_URI);

    setDb(frappe.db());
    setCall(frappe.call());
    setAuth(frappe.auth());
  }, []);

  return (
    <FrappeContext.Provider value={{
      db,
      auth,
      call
    }}>{children}</FrappeContext.Provider>
  );
};

export const useFrappe = () => {
  const frappe = React.useContext(FrappeContext);
  return frappe;
};

export { FrappeContext, FrappeProvider };
