import { useEffect, useState } from "react";
import {
  getMessageFromError,
  getPromise,
  put,
} from "../../../util/generalActions";
import { useAuth } from "../../../providers/auth";
import { useDialog } from "../../../components/common/appDialog";
import { ComponentPaginate } from "../../../components/common/componentPaginate";
import { Breadcrumbs, Toolbar, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import { AppSpinner } from "../../../components/common/appSpinner";
import { Button } from "../../../components/common/button";
import { useTranslation } from "react-i18next";
import moment from "moment-timezone";
import { Status, PaymentMethod, Transaction } from "./transaction";
import { CURRENCY } from "../../../util/config";

export const TransactionRefunds: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const navigate = useNavigate();
  const { token, profile, hasPermissions } = useAuth();
  const { showDialog, closeDialog } = useDialog();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rpg, setRpg] = useState(20);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "",
    id: "",
    customer: "",
    state: Status.PENDING_REFUND,
  });

  useEffect(() => {
    if (token && profile) {
      getProducts(token);
    }
  }, [token, page, profile, filters]);

  function getProducts(token: string) {
    setLoading(true);
    getPromise<{ data: { transactions: Transaction[]; count: number } }>(
      `transactions?rowsPerPage=${rpg}&page=${page}&state=${filters.state}`,
      token
    ).then((res) => {
      setLoading(false);
      setRows(res.data.transactions);
      setTotalPages(Math.ceil(res.data.count / rpg));
      setTotal(res.data.count);
    });
  }

  const TransactionDetails: React.FC<{ transaction: Transaction }> = ({
    transaction,
  }) => {
    return (
      <div className="w-full p-8">
        <div className="grid grid-cols-4 gap-8 text-center green">
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("TRANSACTION_ID")}
            </span>
            <span className="text-sm">{transaction.id}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("CUSTOMER_NAME")}
            </span>
            <span className="text-sm">{transaction.customer}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("VENDOR_NAME")}
            </span>
            <span className="text-sm">{transaction.vendor}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("WAREHOUSE_NAME")}
            </span>
            <span className="text-sm">{t(transaction.warehouse)}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("CREATED_DATE")}
            </span>
            <span className="text-sm">
              {moment(transaction.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("CREATED_BY")}
            </span>
            <span className="text-sm">{t(transaction.createdBy)}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("PRODUCT_CATEGORY")}
            </span>
            <span className="text-sm">{t(transaction.category)}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("PRODUCT_NAME")}
            </span>
            <span className="text-sm">{t(transaction.product)}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("PAYMENT_METHOD")}
            </span>
            <span className="text-sm">{t(transaction.payment)}</span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("AMOUNT_PER_UNIT")}
            </span>
            <span className="text-sm">
              {CURRENCY}
              {transaction.amount}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("QUANTITY")}
            </span>
            <span className="text-sm">
              {transaction.quantity + " " + transaction.unit}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("PRODUCT_TOTAL")}
            </span>
            <span className="text-sm">
              {CURRENCY}
              {parseFloat(
                (transaction.amount * transaction.quantity).toFixed(2)
              )}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-8 text-center green mt-8">
          <div>
            <span className="font-bold mb-2 text-base block">{t("FEE_1")}</span>
            <span className="text-sm">
              {CURRENCY}
              {transaction.fee1}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">{t("FEE_2")}</span>
            <span className="text-sm">
              {CURRENCY}
              {transaction.fee2}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">{t("FEE_3")}</span>
            <span className="text-sm">
              {CURRENCY}
              {transaction.fee3}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("FINAL_AMOUNT")}
            </span>
            <span className="text-sm">
              {CURRENCY}
              {parseFloat(
                (
                  transaction.amount * transaction.quantity +
                  transaction.fee1 +
                  transaction.fee2 +
                  transaction.fee3
                ).toFixed(2)
              )}
            </span>
          </div>
          <div>
            <span className="font-bold mb-2 text-base block">
              {t("REWARD_POINTS")}
            </span>
            <span className="text-sm">{transaction.rewardPoints}</span>
          </div>
        </div>
      </div>
    );
  };

  const updateTransaction = (newStatus: Status, row: Transaction) => {
    var updateDialogTitle = "";
    var updateDialogMessage = "";
    var successMessage = "";

    switch (newStatus) {
      case Status.COMPLETED:
        updateDialogTitle = t("CANCEL_REFUND");
        updateDialogMessage = t("CANCEL_REFUND_MSG");
        successMessage = t("REFUND_CANCELED");
        break;
      case Status.REFUNDED:
        updateDialogTitle = t("COMPLETE_REFUND");
        updateDialogMessage = t("COMPLETE_REFUND_MSG");
        successMessage = t("REFUND_COMPLETED");
        break;
    }

    showDialog(
      <div className="flex flex-col green px-24">
        <div className="flex justify-center mb-6 text-2xl">
          {updateDialogTitle}
        </div>
        <div className="flex justify-center mb-6">{updateDialogMessage}</div>
        <div className="w-full flex justify-center">
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              put<{ data: { id: string } }>(
                `transactions/${row.id}`,
                {
                  id: row.id,
                  status: newStatus,
                  notes: (document?.getElementById("notes") as HTMLInputElement)
                    .value
                },
                token || ""
              )
                .then((res) => {
                  setLoading(false);
                  showDialog(
                    <div className="flex flex-col green px-24 py-12">
                      <div className="flex justify-center mb-6 text-2xl">
                        {successMessage}
                      </div>
                    </div>,
                    "transaction_confirmed",
                    false,
                    () => {
                      navigate("/transactions/refunds");
                    }
                  );
                })
                .catch((error) => {
                  setLoading(false);
                  showDialog(
                    <div className="green">{getMessageFromError(error)}</div>,
                    "invalid_transactions",
                    false
                  );
                });
            }}
            className="rounded-full w-full py-2 mb-6 bg-green main-text"
          >
            <span className="font-bold">{t("CONFIRM")}</span>
          </Button>
        </div>
        <div className="text-s">{t("ADDITIONAL_NOTES")}</div>
        <textarea
          className={`border-solid green bg-main border rounded-md p-2 outline-none border-green w-full h-40`}
          id="notes"
          defaultValue={row.notes}
        />
      </div>,
      "complete_transaction",
      false
    );
  };

  return (
    <div className="relative" style={{ marginTop: 78 }}>
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green"
      >
        <Breadcrumbs aria-label="breadcrumb" className="green">
          <span color="inherit" className="font-bold">
            {t("MANAGE_TRANSACTIONS")}
          </span>
          <span className="green cursor-pointer">
            {t("TRANSACTION_REFUNDS")}
          </span>
        </Breadcrumbs>
      </Toolbar>
      <div className="no-shadow flex flex-col bg-main bottom-height">
        <div className="border border-green rounded-3xl w-72  mt-4 px-6 green flex flex-row items-center justify-between normal-size relative ml-auto mr-auto">
          {" "}
          <div
            className=" w-1/2  cursor-pointer h-14 flex flex-row items-center justify-between "
            onClick={() =>
              setFilters((prev) => ({ ...prev, state: Status.PENDING_REFUND }))
            }
          >
            {filters.state == Status.PENDING_REFUND && (
              <img src="/rectangle.png" className="absolute top-0"></img>
            )}
            <span className=" flex flex-row ">{t("PENDING_APPROVAL")}</span>
          </div>
          <div
            className=" w-1/2 top-0   cursor-pointer h-14 flex flex-row items-center justify-end "
            onClick={() =>
              setFilters((prev) => ({ ...prev, state: Status.REFUNDED }))
            }
          >
            {filters.state == Status.REFUNDED && (
              <img src="/rectangle.png" className="absolute top-0"></img>
            )}
            <span className=" top-4  flex flex-row mr-2">{t("COMPLETED")}</span>
          </div>
        </div>
        <div className="no-shadow flex flex-col bg-main bottom-height">
          <div
            className="no-shadow bg-main table-wrapper"
            style={{ padding: theme.spacing(3) }}
          >
            <div
              className="border border-green rounded-xl flex flex-col"
              style={{ height: "90%" }}
            >
              <div className="grid grid-cols-9 justify-between green font-16 font-bold border-b border-green p-2">
                <span className="text-center overflow-hidden">{t("DATE")}</span>
                <span className="text-center overflow-hidden">
                  {t("CUSTOMER_NAME")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("VENDOR_NAME")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("TRANSACTION_ID")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("PRODUCT_CATEGORY")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("QUANTITY")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("AMOUNT")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("STATUS")}
                </span>
                <span className="text-center overflow-hidden">
                  {t("ACTION")}
                </span>
              </div>
              <div className="overflow-auto style-1 rounded-md">
                {loading ? (
                  <div className="my-10 p-10">
                    <AppSpinner loading={true} />
                  </div>
                ) : (
                  rows.map((row) => (
                    <div
                      className="grid grid-cols-9 justify-between rounded-md green mt-4 p-2 text-14"
                      key={row.id}
                    >
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {moment(row.createdAt).format("MMM DD, YYYY")}
                      </span>
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {row.customer}
                      </span>
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {row.vendor}
                      </span>
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {row.id}
                      </span>
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {t(row.category)}
                      </span>
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {row.quantity + " " + row.unit}
                      </span>
                      <span
                        className="text-center overflow-hidden cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        {CURRENCY}
                        {parseFloat(
                          (
                            row.amount * row.quantity +
                            row.fee1 +
                            row.fee2 +
                            row.fee3
                          ).toFixed(2)
                        )}
                      </span>
                      <span
                        className="text-center px-4 cursor-pointer"
                        onClick={() =>
                          showDialog(
                            <TransactionDetails transaction={row} />,
                            "Details",
                            false
                          )
                        }
                      >
                        <span
                          className={`inline-block w-32 py-1 cursor-pointer text-black font-bold rounded-full ${
                            row.status == Status.PENDING
                              ? "bg-orange border-1 border-yellow"
                              : row.status == Status.COMPLETED
                              ? "bg-green"
                              : row.status == Status.REFUNDED ||
                                row.status == Status.PENDING_REFUND
                              ? "bg-red"
                              : row.status == Status.CANCELED
                              ? "bg-gray"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            showDialog(
                              <TransactionDetails transaction={row} />,
                              "Details",
                              false
                            )
                          }
                        >
                          {t(row.status)}
                        </span>
                      </span>
                      <span className="text-center overflow-hidden">
                        <span className=" flex flex-row items-center justify-center col-span-1 scroll-space">
                          {hasPermissions({
                            action: "refund_confirming",
                            resource: "transaction",
                          }) && (
                            <svg
                              width="23"
                              height="17"
                              viewBox="0 0 23 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={`mr-4 ${
                                row.status == Status.PENDING_REFUND
                                  ? "cursor-pointer"
                                  : ""
                              }`}
                              onClick={() => {
                                updateTransaction(Status.REFUNDED, row);
                              }}
                            >
                              <path
                                d="M2 8.85714L7.18182 14L21 2"
                                stroke={
                                  row.status == Status.PENDING_REFUND
                                    ? "#B9EA25"
                                    : "#C8C8C8"
                                }
                                strokeWidth="3.42857"
                              />
                            </svg>
                          )}
                          {hasPermissions({
                            action: "refund_confirming",
                            resource: "transaction",
                          }) && (
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={
                                row.status == Status.PENDING_REFUND
                                  ? "cursor-pointer"
                                  : ""
                              }
                              onClick={() => {
                                updateTransaction(Status.COMPLETED, row);
                              }}
                            >
                              <path
                                d="M15 2L2 15M2 2L15 15"
                                stroke={
                                  row.status == Status.PENDING_REFUND
                                    ? "#B9EA25"
                                    : "#C8C8C8"
                                }
                                strokeWidth="2.16667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
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
                total={total}
                page={page}
                totalPages={totalPages}
                getPage={(page) => setPage(page)}
              />
            </div>
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
