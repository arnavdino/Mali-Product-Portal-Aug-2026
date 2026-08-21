import { Toolbar, useTheme } from "@mui/material";
import { Location, useAuth } from "../../../providers/auth";
import { useDialog } from "../../../components/common/appDialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  capitalizeFirstLetter,
  deleteRequest,
  getMessageFromError,
  getPromise,
  put,
} from "../../../util/generalActions";
import { FaCheck, FaSearch } from "react-icons/fa";
import { ComponentPaginate } from "../../../components/common/componentPaginate";
import { Button } from "../../../components/common/button";
import { AppSpinner } from "../../../components/common/appSpinner";
import { useTranslation } from "react-i18next";

export interface Warehouse {
  id: string;

  name: string;

  legalForm: string;

  headOffice: string;

  capital: string;

  legalRep: string;

  phone: string;

  receiptNumber: string;

  members: number;

  location: Location;

  villagesSummary: number;

  membersSummary: number;

  potentialAreaSummary: number;

  cultivatedAreaSummary: number;

  forecastCampaignAreasSummary: number;

  areaForecastCountrySideSummary: number;

  areaOfForecastCollectiveFields: number;

  areaOfCollectiveFieldsExploited: number;

  totalProduction: number;

  collectivesExploited: number;

  storage: number;

  weighingEquipment: string;

  blowingEquipment: string;

  meansOfTransportation: string;

  distanceFromCentralizationLocation: number;

  distanceFromFactory: number;

  marketedProduction: number;

  turnOver: number;

  fixedChargeWithTax: number;

  netMargin: number;

  managementOfCommitments: number;

  accessToFinancing: number;

  otherProducts: string;

  otherAgr: string;
}

export const Warehouses: React.FC = () => {
  const { token, profile, hasPermissions } = useAuth();
  const { showDialog, closeDialog } = useDialog();
  const theme = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rpg, setRpg] = useState(20);
  const [rows, setRows] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);

  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(["main"]);

  useEffect(() => {
    let fetchCanceled = false;
    if (token && profile) {
      setLoading(true);
      getPromise<{ data: { warehouses: Warehouse[]; count: number } }>(
        `admin/warehouses?rowsPerPage=${rpg}&page=${page}&filter=${filter}`,
        token
      ).then((res) => {
        if (fetchCanceled) {
          return;
        }
        setLoading(false);
        setRows(res.data.warehouses);
        setTotalPages(Math.ceil(res.data.count / rpg));
        setTotal(res.data.count);
      });
    }
    return () => {
      fetchCanceled = true;
    };
  }, [token, filter, page, profile]);

  function getWarehouses(token: string, filter: string, callBack?: Function) {
    setLoading(true);
    getPromise<{ data: { warehouses: Warehouse[]; count: number } }>(
      `admin/warehouses?rowsPerPage=${rpg}&page=${page}&filter=${filter}`,
      token
    ).then((res) => {
      setLoading(false);
      setRows(res.data.warehouses);
      setTotalPages(Math.ceil(res.data.count / rpg));
      setTotal(res.data.count);
      if (callBack) {
        callBack();
      }
    });
  }

  const DeleteComponent: React.FC<{ warehouse: Warehouse }> = ({ warehouse }) => {
    const [error, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    return (
      <div className="flex flex-col p-10 green">
        {error && <div className="my-3 text-red-600">{error}</div>}
        <div className="my-5">
          {t("DELETE_SURE_WAREHOUSE")}: <br /> {warehouse.name} <br />
          {t("ACTION_CANNOT_UNDONE")}!
        </div>
        <div className="flex flex-row justify-between w-full">
          <Button
            className="bg-red-700  text-white rounded-lg px-3 py-1"
            loading={loading}
            onClick={() => {
              setLoading(true);
              deleteRequest(`/admin/warehouses/${warehouse.id}`, token || "")
                .then((res) => {
                  getWarehouses(token || "", filter, () => closeDialog());
                })
                .catch((error) => {
                  setLoading(false);
                  setErrorMessage(getMessageFromError(error));
                });
            }}
          >
            {t("DELETE")}
          </Button>
          <button
            className="rounded-lg px-3 py-1 bg-green main"
            onClick={() => closeDialog()}
          >
            {t("CANCEL")}
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="relative" style={{ marginTop: 78 }}>
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green fixed block w-full"
      >
        <div className="flex flex-row justify-between green w-full ">
          <div>
            <span className="font-bold ">{t('MANAGE')} {t('WAREHOUSES')} &nbsp;</span> / &nbsp;
            <span className="text-white">{t('WAREHOUSES')}</span>
          </div>
          <div className="flex flex-row justify-between relative">
            <div>
              <FaSearch className="green absolute ml-3 mt-2" />
              <input
                className="h-8 rounded-3xl w-72 pl-8 bg-main border border-green outline-none pb-1 green placeholder-small"
                placeholder={t("SEARCH_WAREHOUSE")}
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </div>
          </div>
        </div>
      </Toolbar>
      <div className="no-shadow flex flex-col bg-main bottom-height justify-between style-1 overflow-auto">
        <div
          className="flex flex-row ml-8  justify-between mr-8 items-center"
          style={{ height: 60 }}
        >
          {hasPermissions({ action: "create", resource: "warehouse" }) ? (
            <button
              className="main bg-green px-1  rounded-3xl flex flex-row items-center font-bold"
              onClick={() => navigate("add")}
              style={{ height: 25 }}
            >
              <div className="rounded-3xl w-7 h-5 bg-main text-white mr-2 flex flex-row justify-center items-center">
                +
              </div>{" "}
              {t("ADD")}{" "} {t("WAREHOUSE")}
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex flex-row relative">
            {/* {selected.length > 0 && (
              <button
                className=" bg-main border border-green green   rounded-3xl mr-4 flex flex-row justify-center items-center font-16"
                onClick={() =>
                  selected.length > 0 && setAction((prev) => !prev)
                }
                style={{ width: 112, height: 38 }}
              >
                Action
              </button>
            )}
            {action && (
              <span className="absolute top-10 bg-white rounded-b-md w-20 h-20 left-4 flex flex-col ">
                <span
                  className="mb-2 hover:bg-gray-400 cursor-pointer p-1"
                  onClick={() => {
                    setAction(false);
                    showDialog(
                      <div className="green ">
                        {t("ACTIVATE_WAREHOUSE_SURE")}?
                        <div className="flex flex-row justify-center mt-4 ">
                          <Button
                            onClick={() => {
                              put(
                                "admin/warehouses/status/batch",
                                { ids: selected, status: "active" },
                                token ?? ""
                              )
                                .then((res) => {
                                  getWarehouses(token ?? "", filter, () => {
                                    closeDialog();
                                    setSelected([]);
                                  });
                                })
                                .catch((error) => closeDialog());
                            }}
                            className="bg-green rounded-2xl ml-2 w-24 main "
                          >
                            {t("YES")}
                          </Button>{" "}
                          <Button
                            onClick={() => {
                              closeDialog();
                            }}
                            className="bg-white text-red-600 rounded-2xl ml-2 w-24 main"
                          >
                            {t("YES")}
                          </Button>
                        </div>
                      </div>,
                      "Activate Users",
                      false
                    );
                  }}
                >
                  {t("ACTIVE")}
                </span>{" "}
                <span
                  onClick={() => {
                    setAction(false);
                    showDialog(
                      <div className="green ">
                        {t("INACTIVATE_WAREHOUSE_SURE")}?
                        <div className="flex flex-row justify-center mt-4 ">
                          <Button
                            onClick={() => {
                              put(
                                "admin/warehouses/status/batch",
                                { ids: selected, status: "inactive" },
                                token ?? ""
                              )
                                .then((res) => {
                                  getWarehouses(token ?? "", filter, () => {
                                    closeDialog();
                                    setSelected([]);
                                  });
                                })
                                .catch((error) => closeDialog());
                            }}
                            className="bg-green rounded-2xl ml-2 w-24 main "
                          >
                            {t("YES")}
                          </Button>{" "}
                          <Button className="bg-white text-red-600 rounded-2xl ml-2 w-24 main">
                            {t("CANCEL")}
                          </Button>
                        </div>
                      </div>,
                      "Inactivate Users",
                      false
                    );
                  }}
                  className="hover:bg-gray-400 text-red-600 cursor-pointer p-1"
                >
                  {t("INACTIVE")}
                </span>
              </span>
            )} */}
            <button
              className=" bg-main border border-green green   rounded-3xl mr-4 flex flex-row justify-center items-center font-16"
              onClick={() => setFilter("")}
              style={{ width: 112, height: 38 }}
            >
              {filter == "" && (
                <div
                  className=" border-2 border-green mr-2 flex flex-row justify-center items-center"
                  style={{ height: 17, width: 17 }}
                >
                  <FaCheck style={{ height: 10, width: 10 }} />
                </div>
              )}
              {t("ALL")}
            </button>
            <button
              className="main bg-green  rounded-3xl mr-4 flex flex-row justify-center items-center font-16"
              onClick={() => setFilter("active_@@")}
              style={{ width: 100, height: 38 }}
            >
              {filter == "active_@@" && (
                <FaCheck className="mr-3" style={{ height: 10, width: 10 }} />
              )}
              {t("ACTIVE")}
            </button>
            <button
              className=" rounded-3xl pending flex flex-row justify-center items-center font-16 text-white"
              onClick={() => setFilter("pending_@@")}
              style={{ width: 100, height: 38 }}
            >
              {" "}
              {filter == "pending_@@" && (
                <FaCheck className="mr-3" style={{ height: 10, width: 10 }} />
              )}
              {t("INACTIVE")}
            </button>
          </div>
        </div>
        <div
          className="no-shadow bg-main table-wrapper"
          style={{ padding: theme.spacing(3) }}
        >
          <div className="border border-green rounded-lg rounded-br-none flex flex-col">
            <div
              className="grid grid-cols-5 bg-main justify-between  border-b border-green  rounded-t-lg green  py-2 font-16"
              style={{ fontSize: 16 }}
            >
              <span className="col-span-1 text-left ml-4 flex flex-row">
                {" "}
                {/* <div
                  className={`rounded-sm ${
                    selected.length < rpg ? "bg-main" : "bg-green"
                  } w-4 h-4 cursor-pointer flex flex-row justify-center items-center mr-2 border border-green`}
                  onClick={(event) =>
                    setSelected((prev) => {
                      let newArray = [...prev];
                      if (newArray.length < rpg) {
                        newArray = rows.map((p) => p.id);
                        return newArray;
                      } else {
                        return [];
                      }
                    })
                  }
                >
                  {selected.length == rpg && (
                    <FaCheck className="text-white w-3" />
                  )}
                </div> */}
                {t("NAME")}
              </span>
              <span className="flex flex-row justify-center col-span-1">
                {t("PHONE")}
              </span>
              <span className="flex flex-row justify-center col-span-1">
                {t("LEGAL_FORM")}
              </span>

              <span className="flex flex-row justify-center col-span-1">
                {t("CAPITAL")}
              </span>
              <span className="flex flex-row justify-center  col-span-1 w-full">
                {t("ACTION")}
              </span>
            </div>
            <div className=" rounded-lg ">
              {loading ? (
                <div className="my-10 p-10">
                  <AppSpinner loading={true} />
                </div>
              ) : (
                rows.map((row, indx) => (
                  <div
                    className={`grid grid-cols-5 bg-main justify-between rounded-lg font-size  pb-5 green mt-4`}
                    style={{ fontSize: 14 }}
                    key={row.id}
                  >
                    {" "}
                    <span className="col-span-1 text-left flex flex-row items-center">
                      <span className="green font-bold ml-4 flex flex-row">
                        {/* <div
                          className={`rounded-sm ${
                            !selected.includes(row.id) ? "bg-main" : "bg-green"
                          } w-4 h-4 cursor-pointer flex flex-row justify-center items-center mr-2 border border-green`}
                          onClick={(event) =>
                            setSelected((prev) => {
                              let newArray = [...prev];
                              if (!newArray.includes(row.id)) {
                                newArray.push(row.id);
                                return newArray;
                              } else {
                                return newArray.filter((f) => f != row.id);
                              }
                            })
                          }
                        >
                          {selected.includes(row.id) && (
                            <FaCheck className="text-white w-3" />
                          )}
                        </div> */}
                        {row.name}
                      </span>
                    </span>
                    <span className="flex flex-row items-center col-span-1 justify-center scroll-space">
                      {row.phone}
                    </span>
                    <span className=" flex flex-row items-center col-span-1 justify-center scroll-space">
                      {row.legalForm}
                    </span>
                    <span className=" flex flex-row items-center   col-span-1 justify-center scroll-space">
                      {row.capital}
                    </span>
                    <span className=" flex flex-row items-center col-span-1 justify-center scroll-space">
                      {hasPermissions({
                        action: "update",
                        resource: "warehouse",
                      }) && (
                        <img
                          src="/edit.png"
                          style={{ width: 10, height: 15 }}
                          className="mr-4 cursor-pointer"
                          onClick={() => navigate(`edit/${row.id}`)}
                        />
                      )}
                      {hasPermissions({
                        action: "delete",
                        resource: "warehouse",
                      }) && (
                        <img
                          src="/delete.png"
                          className="mr-4 cursor-pointer"
                          style={{ width: 15, height: 15 }}
                          onClick={() => {
                            showDialog(
                              <DeleteComponent warehouse={row} />,
                              "Delete User",
                              false
                            );
                          }}
                        />
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-6">
            <ComponentPaginate
              currentSize={rows.length}
              total={total}
              page={page}
              rowsPerPage={rpg}
              totalPages={totalPages}
              getPage={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
