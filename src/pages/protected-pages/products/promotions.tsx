import { useEffect, useState } from "react";
import {
  capitalizeFirstLetter,
  deleteRequest,
  getMessageFromError,
  getPromise,
  put,
} from "../../../util/generalActions";
import { useAuth } from "../../../providers/auth";
import { useDialog } from "../../../components/common/appDialog";
import { FaCheck, FaSearch } from "react-icons/fa";
import { ComponentPaginate } from "../../../components/common/componentPaginate";
import { useSession } from "../../../providers/session";
import { upperSectionStyle } from "../common-style";
import { Toolbar, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import { AppSpinner } from "../../../components/common/appSpinner";
import { Button } from "../../../components/common/button";

export interface Promotion {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: { username: string };
  product: { id: string; name: string };
  imageUrl: string;
  status: string;
  discount: number;
}

export const Promotions: React.FC = () => {
  const { token, profile, hasPermissions } = useAuth();
  const { showDialog, closeDialog } = useDialog();
  const theme = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [total, setTotal] = useState(0);
  const [rpg, setRpg] = useState(20);

  useEffect(() => {
    if (token && profile) {
      getProducts(token, filter);
    }
  }, [token, filter, profile, page]);

  function getProducts(token: string, filter: string) {
    setLoading(true);
    getPromise<{ data: { promotions: Promotion[]; count: number } }>(
      `admin/promotions?rowsPerPage=${rpg}&page=${page}&filter=${filter}`,
      token
    ).then((res) => {
      setLoading(false);
      setRows(res.data.promotions);
      setTotalPages(Math.ceil(res.data.count / rpg));
      setTotal(res.data.count);
    });
  }

  const DeleteComponent: React.FC<{ product: Promotion }> = ({ product }) => {
    const [error, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    return (
      <div className="flex flex-col">
        {error && <div className="my-3 text-red-600">{error}</div>}
        <div className="my-5">
          Are you sure you want to delete promotion: <br /> {product.name}{" "}
          <br />
          This Action cannot be undone!
        </div>
        <div className="flex flex-row justify-between w-full">
          <Button
            className="bg-red-700  text-white rounded-lg px-3 py-1"
            loading={loading}
            onClick={() => {
              setLoading(true);
              deleteRequest(`/admin/promotions/${product.id}`, token || "")
                .then((res) => {
                  closeDialog();
                })
                .catch((error) => {
                  setLoading(false);
                  setErrorMessage(getMessageFromError(error));
                });
            }}
          >
            Delete
          </Button>
          <button
            className="rounded-lg px-3 py-1 bg-green"
            onClick={() => closeDialog()}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="relative" style={{ marginTop: 78 }}>
      {" "}
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green"
      >
        <div className="flex flex-row justify-between green w-full">
          <span className="font-bold">Promotions</span>
          <div className="flex flex-row justify-between relative">
            <div>
              <FaSearch className="green absolute ml-3 mt-2" />
              <input
                className="h-8 rounded-3xl w-60 pl-8 bg-main border border-green outline-none pb-1 green"
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </div>
          </div>
        </div>
      </Toolbar>
      <div className="no-shadow flex flex-col bg-main bottom-height">
        <div
          className="flex flex-row ml-8  justify-between mr-8 items-center"
          style={{ height: 60 }}
        >
          {hasPermissions({ action: "create", resource: "promotion" }) ? (
            <button
              className="main bg-green py-1 px-6 rounded-xl"
              onClick={() => navigate("add")}
              style={{ height: 40 }}
            >
              + Add Promotion
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex flex-row">
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
              All
            </button>
            <button
              className="main bg-green  rounded-3xl mr-4 flex flex-row justify-center items-center font-16"
              onClick={() => setFilter("active_@@")}
              style={{ width: 100, height: 38 }}
            >
              {filter == "active_@@" && (
                <FaCheck className="mr-3" style={{ height: 10, width: 10 }} />
              )}
              Active
            </button>
            <button
              className=" rounded-3xl pending flex flex-row justify-center items-center font-16 text-white"
              onClick={() => setFilter("inactive_@@")}
              style={{ width: 100, height: 38 }}
            >
              {" "}
              {filter == "inactive_@@" && (
                <FaCheck className="mr-3" style={{ height: 10, width: 10 }} />
              )}
              Inactive
            </button>
          </div>
        </div>
        <div
          className="no-shadow bg-main table-wrapper"
          style={{ margin: theme.spacing(3) }}
        >
          <div
            className=" border border-green rounded-md rounded-br-none flex flex-col"
            style={{ height: "90%" }}
          >
            <div className="grid grid-cols-6 bg-main justify-between  green font-16 font-bold rounded-t-md border-b border-green p-2">
              <span className="col-span-2 text-left ">Promotion Name</span>
              <span className="text-center">Product</span>
              <span className="text-center">Discount</span>
              <span className="text-center">Status</span>
              <span className="text-center">Action</span>
            </div>
            <div className="overflow-auto style-1 rounded-md">
              {loading ? (
                <div className="my-10 p-10">
                  <AppSpinner loading={true} />
                </div>
              ) : (
                rows.map((row) => (
                  <div
                    className="grid grid-cols-6 bg-main justify-between rounded-md  green mt-4 text-14 p-2"
                    key={row.id}
                  >
                    {" "}
                    <span className="col-span-2 text-left flex flex-row items-center">
                      <div
                        className={`rounded-sm ${
                          !selected.includes(row.id) ? "bg-green" : "bg-blue"
                        } w-5 h-5 cursor-pointer flex flex-row justify-center items-center`}
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
                      </div>

                      <div className=" items-center flex flex-row justify-center rounded-sm w-12 h-12 ml-4">
                        <img src={row.imageUrl} className="w-9 h-9" />
                      </div>
                      <span className="green font-bold  ml-4">{row.name}</span>
                    </span>
                    <div className="flex flex-row items-center col-span-1 justify-center scroll-space">
                      {row.product?.name || 0}
                    </div>
                    <div className="flex flex-row items-center col-span-1 justify-center scroll-space">
                      {row.discount}
                    </div>
                    <span className=" flex flex-row items-center justify-center col-span-1 scroll-space">
                      <span
                        className={`${
                          row.status == "active" ? "bg-green" : "pending"
                        }  px-4 main font-extrabold rounded-xl text-sm flex flex-row justify-center items-center`}
                        style={{ width: 75, fontSize: 10, height: 20 }}
                      >
                        {capitalizeFirstLetter(
                          row.status == "active" ? "Active" : "Inactive"
                        )}
                      </span>
                    </span>
                    <span className=" flex flex-row items-center justify-center col-span-1 scroll-space">
                      {hasPermissions({
                        action: "update",
                        resource: "promotion",
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
                        resource: "promotion",
                      }) && (
                        <img
                          src="/delete.png"
                          className="cursor-pointer"
                          style={{ width: 15, height: 15 }}
                          onClick={() => {
                            showDialog(
                              <DeleteComponent product={row} />,
                              "Delete Promotion",
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
          <div style={{ height: "5%" }} className="mt-6">
            <ComponentPaginate
              currentSize={rows.length}
              rowsPerPage={rpg}
              page={page}
              total={total}
              totalPages={totalPages}
              getPage={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActionButton: React.FC<{
  name: string;
  action: () => void;
  active?: boolean;
  width?: string;
}> = ({ name, action, active = false, width = "w-20" }) => (
  <div
    className={`flex  bg-green items-center ${width} justify-center main font-bold font-16 rounded-md  mx-4  py-1 text-sm cursor-pointer`}
    onClick={() => active && action()}
  >
    {name}
  </div>
);
