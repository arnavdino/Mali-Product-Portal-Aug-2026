import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useIdleTimer } from "react-idle-timer";
import { getPromise, post } from "../util/generalActions";
import { Card } from "../pages/protected-pages/users/add-user";

interface AuthContextValue {
  token: string | null;
  login(form: AuthForm): void;
  role?: Role;
  logout(): void;
  profile: ProfileInfo | undefined;
  setProfile(pr: ProfileInfo): void;
  hasPermissions(param: { action: string; resource: string }): boolean;
  roleHasPermissions(param: {
    action: string;
    resource: string;
    role: Role;
  }): boolean;
}

export interface ProfileInfo {
  email: string;
  fname: string;
  lname: string;
  imageUrl: string;
  id: string;
}

export interface User extends ProfileInfo {
  status: string;
  email: string;
  phone: string;
  role: Role;
  fname: "";
  lname: "";
  dob: "";
  gender: "";
  lang: "";
  rewardPoints: number;
  location: Location;
  cards: Card[];
  nina: string;
  language: string;
  externalId: string;
  mainCrop: string;
  secondaryCrop: string;
  otherProducts: string;
  activities: string;
  liveStockFarming: string;
  smallTrade: string;
  profession: string;
  meansOfProduction: string;
  meansOfTransport: string;
  financialEducation: string;
  accessToCredit: string;
  accessToInsurance: string;
  accessToGap: string;
  totalArea: number;
  totalUsedArea: number;
  cultivatedArea: number;
  actualArea: number;
  propertyStatus: string;
  longitude: number;
  latitude: number;
  forecastedSurfaceArea: number;
  authorizedSurfaceArea: number;
  literacyLevel: string;
  numOfChildren: number;
  maritalStatus: string;
  organization: string;
}
export interface Location {
  street: "";
  street2: "";
  city: "";
  state: "";
  country: "";
  zip: "";
}
export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
  isCustom: boolean;
}
export interface Permission {
  action: string[];
  subject: string;
}

interface AuthForm {
  username: string;
  password: string;
}
export const AuthContext = React.createContext<AuthContextValue>(
  {} as AuthContextValue
);
export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const logout = () => {
    removeToken();
  };
  const removeToken = () => {
    window.localStorage.removeItem("token");
    setToken(null);
    setProfile(undefined);
  };

  const handleOnIdle = () => token && logout();
  useIdleTimer({
    timeout: 1000 * 60 * 45,
    onIdle: handleOnIdle,
  });

  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem("token")
  );
  const [role, setRole] = useState<Role>(
    JSON.parse(window.localStorage.getItem("role") || "{}")
  );
  const [profile, setProfile] = useState<ProfileInfo>();

  useEffect(() => {
    token &&
      getPromise<{ data: ProfileInfo }>("/user", token)
        .then((res) => {
          setProfile(res.data);
        })
        .catch((error) => logout());
  }, [token]);

  const hasPermissions = ({
    action,
    resource,
  }: {
    action: string;
    resource: string;
  }) =>
    !!role.permissions.find(
      (permission) =>
        permission.action.includes("manage") && permission.subject == "all"
    ) ||
    !!role.permissions.find(
      (permission) =>
        permission.action.includes("manage") && permission.subject == resource
    ) ||
    !!role.permissions.find(
      (permission) =>
        permission.action.includes(action) && permission.subject == resource
    );

  const roleHasPermissions = ({
    action,
    resource,
    role,
  }: {
    action: string;
    resource: string;
    role: Role;
  }) => {
    return (
      !!role.permissions.find(
        (permission) =>
          permission.action?.includes("manage") && permission.subject == "all"
      ) ||
      !!role.permissions.find(
        (permission) =>
          permission.action?.includes("manage") &&
          permission.subject == resource
      ) ||
      !!role.permissions.find(
        (permission) =>
          permission.action?.includes(action) && permission.subject == resource
      )
    );
  };

  const login = useCallback(async (auth: AuthForm) => {
    const response = await post<any>("auth/login", auth);
    let returnedToken = response.data.data["access_token"];
    window.localStorage.setItem("token", `Bearer ${returnedToken}`);
    window.localStorage.setItem(
      "permissions",
      JSON.stringify(response.data.data["permissions"])
    );
    const decoded = jwt_decode(response.data.data.access_token) as {
      role: Role;
    };
    setRole({
      id: decoded.role.id,
      name: decoded.role.name,
      permissions: decoded.role.permissions,
      description: role.description,
      isCustom: false,
    });
    window.localStorage.setItem("role", JSON.stringify(decoded.role));
    setToken(`Bearer ${returnedToken}`);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        profile,
        setProfile,
        role,
        hasPermissions,
        roleHasPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
