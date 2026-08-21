import { useEffect, useState } from "react";
import { Permission, Role, useAuth } from "../../../providers/auth";
import {
  capitalizeFirstLetter,
  deleteRequest,
  get,
  post,
  put,
} from "../../../util/generalActions";
import { Toolbar } from "@mui/material";
import { useNavigate } from "react-router";
import classnames from "better-classnames";
import { FaCheck, FaSearch } from "react-icons/fa";

export const Roles = () => {
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [roles, setRoles] = useState<Role[]>([]);
  const { profile, token, roleHasPermissions, hasPermissions, role } =
    useAuth();
  const [customRole, setCustomRole] = useState(false);
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(
    JSON.parse(window.localStorage.getItem("permissions") || "{}")
  );
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );
  const [customName, setCustomName] = useState("a");
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && token) {
      get<{ data: Role[] }>("/roles", token).then((res) => setRoles(res.data));
    }
  }, [profile, token]);

  useEffect(() => {
    if (roles.length > 0 && !selectedRole && !customRole) {
      if (!!roles.find((r) => r.id == role?.id)) {
        setSelectedRole(role);
      } else {
        setSelectedRole(roles[0]);
      }
    }
  }, [roles]);

  useEffect(() => {
    if (selectedRole?.isCustom) {
      setSelectedPermissions(selectedRole.permissions);
      setCustomName(selectedRole.name);
      setDescription(selectedRole.description);
    }
  }, [selectedRole]);

  const getFiltered = (newPerm: Permission[], value: string) => {
    let returnPerm: Permission[] = [];
    const newVals = newPerm
      .map((perm) =>
        perm.action.map((a) => `${a} the ${perm.subject} resource`)
      )
      .flat()
      .filter((p) => p.includes(value));
    for (let a of newVals) {
      const values = a.split(" ");
      if (returnPerm.find((ret) => ret.subject == values[2])) {
        returnPerm
          .find((ret) => ret.subject == values[2])
          ?.action.push(values[0]);
      } else {
        returnPerm.push({
          subject: values[2],
          action: [values[0]],
        });
      }
    }
    return returnPerm;
  };

  return (
    <div className="relative " style={{ marginTop: 78 }}>
      <Toolbar
        style={{ height: 80 }}
        className={classnames(
          "bg-main border-b-4 border-green fixed block w-full",
          {
            "w-1/2 border-r-4 border-solid": selectedRole || customRole,
            "w-full ": "_DEFAULT_",
          }
        )}
      >
        <div
          className={classnames(
            "flex flex-row justify-between green font-bold "
          )}
        >
          Manage Roles
        </div>
      </Toolbar>
      <div className="flex flex-row h-full">
        <div
          className={classnames(
            "  border-green bottom-height style-2 overflow-auto",
            {
              "w-1/2 border-r-4 border-solid": selectedRole || customRole,
              "w-full ": "_DEFAULT_",
            }
          )}
        >
          {roles.map((role) => (
            <div
              key={role.name}
              className={classnames(
                `flex flex-col items-start justify-center px-8  border-green border-b-2 border-t-0 border-l-0 relative cursor-pointer z-50 `
              )}
              style={{ minHeight: "6rem" }}
              onClick={() => {
                setSelectedRole(role);
                setCustomRole(false);
              }}
            >
              {selectedRole?.id == role.id && (
                <span
                  className={classnames(
                    "bg-green opacity-30 h-full absolute top-0 left-0 w-full"
                  )}
                ></span>
              )}
              <span className="font-bold text-xl green text-18">
                {role.name}
              </span>
              <span className="text-sm green pl-1 text-12">
                {role.description}
              </span>
            </div>
          ))}
          <div
            className={classnames(
              `flex flex-col items-start justify-center px-8  border-green border-b-2 border-t-0 border-l-0 relative cursor-pointer z-50 `
            )}
            style={{ minHeight: "6rem" }}
            onClick={() => {
              setCustomRole(true);
              setCustomName("");
              setSelectedRole(undefined);
              setSelectedPermissions([]);
              setDescription("");
            }}
          >
            {customRole && (
              <span
                className={classnames(
                  "bg-green opacity-30 h-full absolute top-0 left-0 w-full"
                )}
              ></span>
            )}
            <span className="font-bold text-18 green ">Custom Role</span>
            <span className="text-sm green pl-1 text-12" >Assign Custom Role</span>
          </div>
        </div>

        {(selectedRole || customRole) && (
          <div
            className={classnames(
              " green px-8  items-start justify-start overflow-auto  style-1  overflow-x-hidden bottom-height",
              {
                "w-1/2 ": selectedRole || customRole,
                "w-0 ": "_DEFAULT_",
              }
            )}
          >
            <div className="flex flex-row justify-between w-full">
              {(customRole || selectedRole?.isCustom) && (
                <div className="mb-2 relative">
                  <input
                    className="h-8 rounded-3xl w-60 pl-8 bg-main border border-green outline-none pb-1 green"
                    placeholder="Name of Role"
                    onChange={(event) =>
                      setCustomName(event.currentTarget.value)
                    }
                    value={customName}
                  ></input>
                </div>
              )}
              {(selectedRole || customRole) && (
                <div className="mb-4 relative">
                  <FaSearch className="green absolute ml-3 mt-2 left-0" />
                  <input
                    className={`h-8 rounded-3xl w-60 pl-8 bg-main border border-green outline-none pb-1 green`}
                    onChange={(event) =>
                      setPermissions((prev) => {
                        let newPerm = JSON.parse(
                          window.localStorage.getItem("permissions") || "{}"
                        );
                        return event.target.value
                          ? getFiltered(newPerm, event.target.value)
                          : newPerm;
                      })
                    }
                  />
                </div>
              )}
            </div>
            {(customRole || selectedRole?.isCustom) && (
              <textarea
                className="descrip-prod w-full bg-main rounded-md outline-none p-4 green border border-green mb-4 resize-none overflow-hidden h-20"
                placeholder="Type your description..."
                onChange={(event) => setDescription(event.currentTarget.value)}
                value={description}
              />
            )}
            <div className="border border-green rounded-lg rounded-br-none w-full  flex flex-col h-2/3">
              {" "}
              <div className="py-1 font-bold text-left pl-4 border-solid border-b border-green">
                Select Privileges
              </div>
              <div className="flex flex-col items-start justify-start pl-4 overflow-auto style-1  border-green">
                {permissions
                  .filter((p) => p.subject != "all")
                  .map((permission) =>
                    permission.action.map((action) => (
                      <div
                        className="py-2 flex flex-row items-center"
                        key={`${action}_${permission.subject}`}
                      >
                        <div
                          className={`rounded-sm  w-5 h-5 cursor-pointer flex flex-row justify-center items-center ${
                            selectedRole && !selectedRole?.isCustom
                              ? "grayed"
                              : !!selectedPermissions
                                  .find((p) => p.subject == permission.subject)
                                  ?.action?.includes(action) ||
                                !!selectedPermissions
                                  .find((p) => p.subject == permission.subject)
                                  ?.action.includes("manage")
                              ? "bg-blue"
                              : "bg-green"
                          }`}
                          onClick={(e) =>
                            setSelectedPermissions((prev) => {
                              let newPerms = JSON.parse(
                                JSON.stringify(prev)
                              ) as Permission[];
                              let currentSubj = newPerms.find(
                                (p) => p.subject == permission.subject
                              );
                              if (!!currentSubj) {
                                if (currentSubj.action.includes(action)) {
                                  currentSubj.action =
                                    currentSubj.action.filter(
                                      (a) => a != action
                                    );
                                  if (!currentSubj.action.length) {
                                    newPerms = newPerms.filter(
                                      (p) => p.subject != permission.subject
                                    );
                                  }
                                } else if (
                                  !currentSubj.action.includes("manage")
                                ) {
                                  currentSubj.action.push(action);
                                }
                              } else {
                                newPerms.push({
                                  subject: permission.subject,
                                  action: [action],
                                });
                              }
                              return newPerms;
                            })
                          }
                        >
                          {(selectedRole && !selectedRole?.isCustom
                            ? roleHasPermissions({
                                action,
                                resource: permission.subject,
                                role: selectedRole,
                              })
                            : !!selectedPermissions
                                .find((p) => p.subject == permission.subject)
                                ?.action?.includes(action) ||
                              !!selectedPermissions
                                .find((p) => p.subject == permission.subject)
                                ?.action.includes("manage")) && (
                            <FaCheck className="text-white w-3" />
                          )}
                        </div>
                        <div className="ml-4">
                          {" "}
                          {capitalizeFirstLetter(action)} The{" "}
                          {capitalizeFirstLetter(permission.subject)} Resource{" "}
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </div>
            {customRole &&
              customName != "" &&
              selectedPermissions.length > 0 && (
                <button
                  onClick={() =>
                    post(
                      "/roles",
                      {
                        name: customName,
                        description,
                        permissions: selectedPermissions,
                        isCustom: true,
                      },
                      token || ""
                    )
                      .then((res1) => {
                        get<{ data: Role[] }>("/roles", token).then((res) => {
                          setRoles(res.data);
                          setSelectedRole(res.data[res.data.length - 1]);
                          setCustomRole(false);
                        });
                      })
                      .catch((error) => {})
                  }
                  className="green mt-4  ml-auto mr-auto border rounded-md p-1 px-6 border-green mb-4"
                >
                  Add Role
                </button>
              )}
            {!customRole &&
              hasPermissions({ action: "update", resource: "role" }) &&
              selectedRole?.isCustom && (
                <button
                  onClick={() =>
                    put(
                      `/roles/${selectedRole?.id}`,
                      {
                        name: customName,
                        description,
                        permissions: selectedPermissions,
                        isCustom: true,
                      },
                      token || ""
                    )
                      .then((res1) => {
                        get<{ data: Role[] }>("/roles", token).then((res) => {
                          setRoles(res.data);
                          setSelectedRole((prev) =>
                            res.data.find((r) => r.id == prev?.id)
                          );
                          setCustomRole(false);
                        });
                      })
                      .catch((error) => {})
                  }
                  className="green mt-4  ml-auto  border rounded-md p-1 px-6 border-green mr-4"
                >
                  Edit Role
                </button>
              )}
            {!customRole &&
              hasPermissions({ action: "delete", resource: "role" }) && (
                <button
                  onClick={() =>
                    deleteRequest(
                      `/roles/${selectedRole?.id}`,

                      token || ""
                    )
                      .then((res1) => {
                        get<{ data: Role[] }>("/roles", token).then((res) => {
                          setRoles(res.data);
                          setSelectedRole(res.data[0]);
                        });
                      })
                      .catch((error) => {})
                  }
                  className="green mt-4 mb-4 ml-auto mr-auto border rounded-md p-1 px-6 border-red-600"
                >
                  Delete Role
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
