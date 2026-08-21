import { useEffect, useState } from "react";
import {
  getMessageFromError,
  getPromise,
  put,
  get,
} from "../../../util/generalActions";
import { useAuth } from "../../../providers/auth";
import { useDialog } from "../../../components/common/appDialog";
import { FaSearch } from "react-icons/fa";
import { ComponentPaginate } from "../../../components/common/componentPaginate";
import { Breadcrumbs, Toolbar, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import { AppSpinner } from "../../../components/common/appSpinner";
import { Button } from "../../../components/common/button";
import moment from "moment-timezone";
import DatePicker from "react-date-picker";
import { CURRENCY } from "../../../util/config";
import { useTranslation } from "react-i18next";

export interface Transaction {
  id: string;
  customer: string;
  vendor: string;
  product: string;
  warehouse: string;
  unit: string;
  category: string;
  status: Status;
  payment: PaymentMethod;
  quantity: number;
  amount: number;
  fee1: number;
  fee2: number;
  fee3: number;
  availableRewardPoints: number;
  rewardPoints: number;
  notes: string;
  createdBy: string;
  createdAt: Date;
  completedAt: Date;
  canceledAt: Date;
  refundedAt: Date;
}

export enum PaymentMethod {
  CASH = "CASH",
  REWARD_POINTS = "REWARD_POINTS",
}

export enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
  PENDING_REFUND = "PENDING_REFUND",
  CANCELED = "CANCELED",
}

export const Transactions: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const { token, profile, hasPermissions } = useAuth();
  const { showDialog } = useDialog();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rpg, setRpg] = useState(20);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "",
    id: "",
    customer: "",
    state: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token && profile) {
      getProducts(token);
    }
  }, [token, page, profile]);

  useEffect(() => {
    get<{ data: { id: string; name: string }[] }>(
      `/admin/products/categories`,
      token || ""
    ).then((res) => setCategories(res.data));
  }, []);

  function getProducts(token: string) {
    setLoading(true);
    getPromise<{ data: { transactions: Transaction[]; count: number } }>(
      `transactions?rowsPerPage=${rpg}&page=${page}&from=${filters.from}&to=${filters.to}&customer=${filters.customer}&id=${filters.id}&state=${filters.state}&type=${filters.type}`,
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
        {transaction.status === Status.COMPLETED &&
          hasPermissions({
            action: "refund_initiate",
            resource: "transaction",
          }) && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() =>
                  updateTransaction(Status.PENDING_REFUND, transaction)
                }
                className="w-40 rounded-3xl py-2 bg-red main-text font-bold mt-6"
              >
                {t("REFUND")}
              </Button>
            </div>
          )}
      </div>
    );
  };

  const isValidStatusTransition = (
    currentStatus: Status,
    newStatus: Status
  ) => {
    const isPendingToCompletedOrCanceled =
      currentStatus === Status.PENDING &&
      [Status.COMPLETED, Status.CANCELED].includes(newStatus);

    const isCompletedToPendingRefund =
      currentStatus === Status.COMPLETED && newStatus === Status.PENDING_REFUND;

    return isPendingToCompletedOrCanceled || isCompletedToPendingRefund;
  };

  const updateTransaction = (newStatus: Status, row: Transaction) => {
    if (!isValidStatusTransition(row.status, newStatus)) {
      return;
    }

    var updateDialogTitle = "";
    var updateDialogMessage = "";
    var successMessage = "";

    switch (newStatus) {
      case Status.COMPLETED:
        updateDialogTitle = t("COMPLETE_TRANSACTION");
        updateDialogMessage = t("COMPLETE_TRANSACTION_MSG");
        successMessage = t("TRANSACTION_COMPLETED");
        break;
      case Status.CANCELED:
        updateDialogTitle = t("CANCEL_TRANSACTION");
        updateDialogMessage = t("CANCEL_TRANSACTION_MSG");
        successMessage = t("TRANSACTION_CANCELED");
        break;
      case Status.PENDING_REFUND:
        updateDialogTitle = t("REFUND_TRANSACTION");
        updateDialogMessage = t("SUBMIT_REFUND_TRANSACTION_MSG");
        successMessage = t("REFUND_SUBMITTED");
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
                    .value,
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
                      navigate("/transactions/all");
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

  const completeTransaction = (row: Transaction) => {
    showDialog(
      <div className="flex flex-col green px-24">
        <div className="w-full p-8">
          <div className="grid grid-cols-4 gap-8 text-center green">
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("PAYMENT_METHOD")}
              </span>
              <span className="text-sm">{t(row.payment)}</span>
            </div>
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("AMOUNT_PER_UNIT")}
              </span>
              <span className="text-sm">
                {CURRENCY}
                {row.amount}
              </span>
            </div>
            <div>
              <span className="font-bold mb-2 text-base inline-block">
                {t("QUANTITY")}
              </span>
              {hasPermissions({
                action: "update",
                resource: "transaction",
              }) && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer inline-block ml-2"
                  onClick={() => {
                    showDialog(
                      <div className="flex flex-col green px-24">
                        <div className="flex justify-center mb-6 text-2xl">
                          {t("UPDATE_QUANTITY")}
                        </div>
                        <div className="flex justify-center mb-6">
                          {t("ENTER_NEW_QUANTITY") + " (" + row.unit + "):"}
                        </div>
                        <input
                          className={`border-solid green bg-main border rounded-md p-2 outline-none border-green w-full mb-6`}
                          id="upd-qtt"
                          defaultValue={row.quantity}
                        />
                        <div className="w-full flex justify-center">
                          <Button
                            className="rounded-full w-full py-2 mb-6 bg-green main-text"
                            onClick={() => {
                              const newQuantity = Number(
                                (
                                  document?.getElementById(
                                    "upd-qtt"
                                  ) as HTMLInputElement
                                ).value
                              );
                              if (isNaN(newQuantity) || newQuantity <= 0) {
                                showDialog(
                                  <div className="flex flex-col green px-24 py-12">
                                    <div className="flex justify-center mb-6 text-2xl">
                                      {t("INVALID_QUANTITY")}
                                    </div>
                                  </div>,
                                  "invalid_quantity",
                                  false,
                                  () => {
                                    completeTransaction(row);
                                  }
                                );
                              } else {
                                var newRow = JSON.parse(JSON.stringify(row));
                                newRow.quantity = newQuantity;
                                completeTransaction(newRow);
                              }
                            }}
                          >
                            <span className="font-bold">{t("CONFIRM")}</span>
                          </Button>
                        </div>
                      </div>,
                      "update_quantity",
                      false,
                      () => {
                        completeTransaction(row);
                      }
                    );
                  }}
                >
                  <path
                    d="M12.837 2.25023C13.0354 2.05324 13.2708 1.89699 13.5299 1.79038C13.7891 1.68378 14.0668 1.62891 14.3473 1.62891C14.6278 1.62891 14.9055 1.68378 15.1646 1.79038C15.4237 1.89699 15.6592 2.05324 15.8575 2.25023C16.0558 2.44721 16.2132 2.68106 16.3205 2.93843C16.4278 3.1958 16.4831 3.47165 16.4831 3.75023C16.4831 4.0288 16.4278 4.30465 16.3205 4.56202C16.2132 4.81939 16.0558 5.05324 15.8575 5.25023L5.66341 15.3752L1.51025 16.5002L2.64293 12.3752L12.837 2.25023Z"
                    stroke="#B9EA25"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span className="text-sm block">
                {row.quantity + " " + row.unit}
              </span>
            </div>
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("PRODUCT_TOTAL")}
              </span>
              <span className="text-sm">
                {CURRENCY}
                {parseFloat((row.amount * row.quantity).toFixed(2))}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-8 text-center green mt-8">
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("FEE_1")}
              </span>
              <span className="text-sm">
                {CURRENCY}
                {row.fee1}
              </span>
            </div>
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("FEE_2")}
              </span>
              <span className="text-sm">
                {CURRENCY}
                {row.fee2}
              </span>
            </div>
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("FEE_3")}
              </span>
              <span className="text-sm">
                {CURRENCY}
                {row.fee3}
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
                    row.amount * row.quantity +
                    row.fee1 +
                    row.fee2 +
                    row.fee3
                  ).toFixed(2)
                )}
              </span>
            </div>
            <div>
              <span className="font-bold mb-2 text-base block">
                {t("REWARD_POINTS")}
              </span>
              <span className="text-sm">
                {row.payment === PaymentMethod.REWARD_POINTS
                  ? row.availableRewardPoints + " (-" + Math.ceil(row.amount * row.quantity + row.fee1 + row.fee2 + row.fee3) + ")"
                  : row.availableRewardPoints + " (+" + row.rewardPoints + ")"}
              </span>
            </div>
          </div>
          {row.status === Status.COMPLETED &&
            hasPermissions({
              action: "refund_initiate",
              resource: "transaction",
            }) && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => updateTransaction(Status.PENDING_REFUND, row)}
                  className="w-40 rounded-3xl py-2 bg-red main-text font-bold mt-6"
                >
                  {t("REFUND")}
                </Button>
              </div>
            )}
        </div>
        <div className="flex justify-center mb-6 text-2xl">
          {t("COMPLETE_TRANSACTION")}
        </div>
        <div className="flex justify-center mb-6">
          {t("COMPLETE_TRANSACTION_MSG")}
        </div>
        <div className="w-full flex justify-center">
          <Button
            loading={loading}
            onClick={() => {
              if (row.payment === PaymentMethod.REWARD_POINTS && Math.ceil(row.amount * row.quantity + row.fee1 + row.fee2 + row.fee3) > row.availableRewardPoints) {
                showDialog(
                  <div className="green">
                    {t("INSUFFICIENT_REWARD_POINTS")}
                  </div>,
                  "invalid_transactions",
                  false
                );
              } else {
                setLoading(true);
                put<{ data: { id: string } }>(
                  `transactions/${row.id}`,
                  {
                    id: row.id,
                    status: Status.COMPLETED,
                    notes: (
                      document?.getElementById("notes") as HTMLInputElement
                    ).value,
                    quantity: row.quantity,
                  },
                  token || ""
                )
                  .then((res) => {
                    setLoading(false);
                    showDialog(
                      <div className="flex flex-col green px-24 py-12">
                        <div className="flex justify-center mb-6 text-2xl">
                          {t("TRANSACTION_COMPLETED")}
                        </div>
                      </div>,
                      "transaction_confirmed",
                      false,
                      () => {
                        navigate("/transactions/all");
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
              }
            }}
            className="rounded-full w-1/2 py-2 mb-6 bg-green main-text"
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
          <span className="green cursor-pointer">{t("TRANSACTIONS")}</span>
        </Breadcrumbs>
        <button
          className="rounded-full bg-green font-bold flex flex-row items-center px-4 absolute right-6"
          style={{ height: 38 }}
          onClick={() => navigate("/transactions/create")}
        >
          {"+ "}
          {t("CREATE_TRANSACTION")}
        </button>
      </Toolbar>
      <div className="no-shadow flex flex-col bg-main bottom-height">
        <div
          className="flex flex-row ml-8 justify-center mr-8 items-center"
          style={{ height: 60 }}
        >
          <div className="flex flex-row">
            <div className="relative">
              <span className="absolute text-xs green bg-main -top-2 left-3 z-50 px-1">
                {t("FROM_DATE")}
              </span>
              <DatePicker
                clearIcon={null}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                format="y-MM-dd"
                calendarIcon={
                  <img src="/calendar.svg" height={15} width={15} />
                }
                className={`date-picker border-solid bg-main border rounded-3xl p-2 py-1 text-xs outline-none border-green add-user-input mr-2 h-full`}
                value={
                  filters.from
                    ? moment(filters.from, "YYYY-MM-DD").toDate()
                    : undefined
                }
                onChange={(date) => {
                  setFilters((prev) => ({
                    ...prev,
                    from: moment(date?.valueOf()).format("YYYY-MM-DD"),
                  }));
                }}
              />
            </div>
            <div className="relative">
              <span className="absolute text-xs green bg-main -top-2 left-3 z-50 px-1">
                {t("TO_DATE")}
              </span>
              <DatePicker
                clearIcon={null}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                format="y-MM-dd"
                calendarIcon={
                  <img src="/calendar.svg" height={15} width={15} />
                }
                className={`date-picker border-solid bg-main border rounded-3xl p-2 py-1 text-xs outline-none border-green add-user-input mr-2 h-full`}
                value={
                  filters.to
                    ? moment(filters.to, "YYYY-MM-DD").toDate()
                    : undefined
                }
                onChange={(date) => {
                  setFilters((prev) => ({
                    ...prev,
                    to: moment(date?.valueOf()).format("YYYY-MM-DD"),
                  }));
                }}
              />
            </div>
            <div className="relative pr-3">
              <select
                style={{ height: 36 }}
                className={`border-solid green bg-main border rounded-3xl p-2 text-sm outline-none border-green add-user-input`}
                value={filters.type}
                onChange={(event) => {
                  setFilters((prev) => ({ ...prev, type: event.target.value }));
                }}
              >
                <option value="">{t("PRODUCT_CATEGORY")}</option>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FaSearch className="absolute green top-3 left-2 text-sm" />
              <input
                placeholder={t("CUSTOMER_NAME")}
                value={filters.customer}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, customer: e.target.value }))
                }
                className="bg-main border border-green green  rounded-3xl mr-4 flex flex-row justify-center items-center text-sm pl-6 outline-none w-40 add-user-input"
                style={{ height: 38 }}
              />
            </div>
            <div className="relative">
              <FaSearch className="absolute green top-3 left-2 text-sm" />
              <input
                value={filters.id}
                placeholder={t("TRANSACTION_ID")}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, id: e.target.value }))
                }
                className="bg-main border border-green green  rounded-3xl mr-4 flex flex-row justify-center items-center outline-none text-sm px-3 pl-6 w-36 add-user-input"
                style={{ height: 38 }}
              />
            </div>
            <div className="relative pr-3">
              <select
                style={{ height: 36 }}
                className={`border-solid green bg-main border rounded-3xl p-2 text-sm outline-none border-green add-user-input w-28`}
                value={filters.state}
                onChange={(event) => {
                  setFilters((prev) => ({
                    ...prev,
                    state: event.target.value,
                  }));
                }}
              >
                <option value="">{t("STATUS")}</option>
                {Object.entries(Status).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t(value)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="rounded-3xl bg-green font-bold flex flex-row justify-center items-center font-16"
              style={{ minWidth: 120, height: 38 }}
              onClick={() => getProducts(token || "")}
            >
              {t("APPLY_FILTERS")}
            </button>
          </div>
        </div>
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
              <span className="text-center overflow-hidden">{t("AMOUNT")}</span>
              <span className="text-center overflow-hidden">{t("STATUS")}</span>
              <span className="text-center overflow-hidden">{t("ACTION")}</span>
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
                          action: "update",
                          resource: "transaction",
                        }) && (
                          <svg
                            width="23"
                            height="17"
                            viewBox="0 0 23 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`mr-4 ${
                              row.status == Status.PENDING
                                ? "cursor-pointer"
                                : ""
                            }`}
                            onClick={() => {
                              completeTransaction(row);
                            }}
                          >
                            <path
                              d="M2 8.85714L7.18182 14L21 2"
                              stroke={
                                row.status == Status.PENDING
                                  ? "#B9EA25"
                                  : "#C8C8C8"
                              }
                              strokeWidth="3.42857"
                            />
                          </svg>
                        )}
                        {hasPermissions({
                          action: "update",
                          resource: "transaction",
                        }) && (
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={
                              row.status == Status.PENDING
                                ? "cursor-pointer"
                                : ""
                            }
                            onClick={() => {
                              updateTransaction(Status.CANCELED, row);
                            }}
                          >
                            <path
                              d="M15 2L2 15M2 2L15 15"
                              stroke={
                                row.status == Status.PENDING
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
  );
};
