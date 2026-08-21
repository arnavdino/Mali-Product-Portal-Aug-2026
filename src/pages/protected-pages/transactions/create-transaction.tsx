import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getPromise, put } from "../../../util/generalActions";
import { useAuth } from "../../../providers/auth";
import { useDialog } from "../../../components/common/appDialog";
import { Breadcrumbs, Toolbar, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import { AppSpinner } from "../../../components/common/appSpinner";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/button";
import { get, getMessageFromError, post } from "../../../util/generalActions";
import { Product } from "../products/products";
import { PaymentMethod, Status } from "./transaction";

export const CreateTransaction: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { token, profile, hasPermissions } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pFocused, setPFocused] = useState(false);
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [vFocused, setVFocused] = useState(false);
  const [cFocused, setCFocused] = useState(false);
  const [customer, setCustomer] = useState("");
  const [arp, setARP] = useState(0);
  const [customers, setCustomers] = useState<
    { id: string; fname: string; lname: string; rewardPoints: number }[]
  >([]);
  const [vendor, setVendor] = useState("");
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);
  const [wFocused, setWFocused] = useState(false);
  const [warehouse, setWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    []
  );
  const [amount, setAmount] = useState(0);
  const [rewardRatio, setRewardRatio] = useState(0);
  const [total, setTotal] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [unit, setUnit] = useState(t("UNIT"));

  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const DEFAULT_QTY = 1;

  useEffect(() => {
    setProducts([]);
    setProduct("");
    setValue("product", "");
    if (category) {
      get<{ data: { id: string; name: string }[] }>(
        `/admin/products/categories/search?search=${category}`,
        token || ""
      ).then((res) => setCategories(res.data));
    } else {
      setCategories([]);
    }
  }, [category]);

  useEffect(() => {
    if (customer) {
      get<{
        data: {
          id: string;
          fname: string;
          lname: string;
          rewardPoints: number;
        }[];
      }>(`/admin/user/search?search=${customer}`, token || "").then((res) =>
        setCustomers(res.data)
      );
    } else {
      setCustomers([]);
    }
  }, [customer]);

  useEffect(() => {
    if (product) {
      get<{ data: Product[] }>(
        `/products/search?search=${product}&category=${getValues("category")}`,
        token || ""
      ).then((res) => setProducts(res.data));
    } else {
      setProducts([]);
    }
    updateTotal();
  }, [product]);

  useEffect(() => {
    if (vendor) {
      get<{ data: { id: string; name: string }[] }>(
        `/admin/vendors/search?search=${vendor}`,
        token || ""
      ).then((res) => setVendors(res.data));
    } else {
      setVendors([]);
    }
  }, [vendor]);

  useEffect(() => {
    if (warehouse) {
      get<{ data: { id: string; name: string }[] }>(
        `/admin/warehouses/search?search=${warehouse}`,
        token || ""
      ).then((res) => setWarehouses(res.data));
    } else {
      setWarehouses([]);
    }
  }, [warehouse]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer: "",
      vendor: "",
      product: "",
      category: "",
      createdBy: profile?.id,
      payment: PaymentMethod.CASH,
      warehouse: "",
      amount: 0,
      quantity: DEFAULT_QTY,
      total: 0,
      fee1: 0,
      fee2: 0,
      fee3: 0,
    },
  });

  function updateTotal() {
    let quantity = getValues("quantity");
    let fee1 = getValues("fee1");
    let fee2 = getValues("fee2");
    let fee3 = getValues("fee3");
    if (isNaN(quantity) || quantity <= 0) {
      quantity = DEFAULT_QTY;
      setValue("quantity", quantity);
    }
    if (isNaN(fee1) || fee1 < 0) {
      fee1 = 0;
      setValue("fee1", fee1);
    }
    if (isNaN(fee2) || fee2 < 0) {
      fee2 = 0;
      setValue("fee2", fee2);
    }
    if (isNaN(fee3) || fee3 < 0) {
      fee3 = 0;
      setValue("fee3", fee3);
    }
    setTotal(parseFloat((amount * quantity).toFixed(2)));
    setFinalAmount(
      parseFloat((amount * quantity + fee1 + fee2 + fee3).toFixed(2))
    );
    setRewardPoints(Math.floor(amount * quantity * rewardRatio));
  }

  const onSubmit = (data: any) => {
    if (data.payment === PaymentMethod.REWARD_POINTS && arp < finalAmount) {
      showDialog(
        <div className="green">{t("INSUFFICIENT_REWARD_POINTS")}</div>,
        "invalid_transactions",
        false
      );
    } else {
      showDialog(
        <div className="flex flex-col green px-24">
          <div className="flex justify-center mb-6 text-2xl">
            {t("CONFIRM_TRANSACTION")}
          </div>
          <div className="flex justify-center mb-6">
            {t("CONFIRM_TRANSACTION_MSG")}
          </div>
          <div className="w-full flex justify-center">
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                post<{ data: { id: string } }>(
                  "transactions",
                  {
                    customer: { id: data.customer },
                    vendor: { id: data.vendor },
                    product: { id: data.product },
                    category: { id: data.category },
                    createdBy: data.createdBy,
                    paymentMethod: data.payment,
                    status: Status.PENDING,
                    warehouse: { id: data.warehouse },
                    amount: amount,
                    quantity: data.quantity,
                    fee1: data.fee1,
                    fee2: data.fee2,
                    fee3: data.fee3,
                    rewardPoints:
                      data.payment === PaymentMethod.REWARD_POINTS
                        ? 0
                        : rewardPoints,
                    notes: (
                      document?.getElementById("notes") as HTMLInputElement
                    ).value,
                  },
                  token || ""
                )
                  .then((res) => {
                    setLoading(false);
                    showDialog(
                      <div className="flex flex-col green px-24 py-12">
                        <div className="flex justify-center mb-6 text-2xl">
                          {t("TRANSACTION_CONFIRMED")}
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
              <span className="font-bold">{t("CREATE")}</span>
            </Button>
          </div>
          <div className="text-s">{t("ADDITIONAL_NOTES")}</div>
          <textarea
            className={`border-solid green bg-main border rounded-md p-2 outline-none border-green w-full h-40`}
            id="notes"
          />
        </div>,
        "confirm_transaction",
        false
      );
    }
  };

  return (
    <div className="relative" style={{ marginTop: 78 }}>
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green"
      >
        <Breadcrumbs aria-label="breadcrumb" className="green">
          <span color="inherit" className="font-bold">
            {t("MANAGE_TRANSACTION")}
          </span>
          <span className="green cursor-pointer">
            {t("CREATE_TRANSACTION")}
          </span>
        </Breadcrumbs>
      </Toolbar>
      <div className="flex flex-col border rounded-md border-green m-6 table-wrapper overflow-auto">
        <div className="no-shadow flex justify-center border-b border-green p-2">
          <div className="flex border rounded-full border-green p-2">
            <div className="flex items-center rounded-full px-8 py-1 bg-green main-text">
              <img src="/new-transaction-dollar.svg" />
              <span className="font-bold ml-2">{t("NEW_TRANSACTION")}</span>
            </div>
          </div>
        </div>
        <div
          className="no-shadow flex m-auto w-full"
          style={{ maxWidth: 1000 }}
        >
          <form className="w-full px-12 py-4 text-left">
            <div className="flex flex-row justify-between relative">
              <div className="flex flex-col relative">
                <label className="green normal-size mb-1">
                  {t("CUSTOMER_NAME")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="customer"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div
                      className="relative"
                      onFocus={() => setCFocused(true)}
                      onBlur={(e) => {
                        (e.relatedTarget == null ||
                          e.relatedTarget.id != "cust-select") &&
                          setCFocused(false);
                      }}
                    >
                      <input
                        tabIndex={1}
                        value={customer}
                        className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                        placeholder={t("CUSTOMER_NAME_PH")}
                        onChange={(event) => {
                          setCustomer(event.target.value);
                          let v = customers.find(
                            (c) =>
                              (c.fname + " " + c.lname).toLowerCase() ==
                              event.target.value.toLowerCase()
                          );
                          if (!!v) {
                            field.onChange(v.id);
                            setARP(v.rewardPoints);
                          } else {
                            field.onChange("");
                            setARP(0);
                          }
                        }}
                      />
                      {cFocused && (
                        <div
                          tabIndex={2}
                          id="cust-select"
                          className="absolute bg-green flex flex-col justify-start top-12 w-full rounded-md z-10"
                        >
                          {customers.map((c, indx) => (
                            <div
                              onClick={(e) => {
                                field.onChange(c.id);
                                setCustomer(c.fname + " " + c.lname);
                                setARP(c.rewardPoints);
                                setCFocused(false);
                              }}
                              key={indx}
                              className={`text-left p-2 cursor-pointer hover:bg-white ${
                                indx == 0 ? "rounded-t-md" : ""
                              }`}
                            >
                              {c.fname + " " + c.lname}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.customer && (
                  <span className="text-sm text-red-700 absolute top-16">
                    {t("INVALID_CUSTOMER")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">
                  {t("VENDOR_NAME")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="vendor"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div
                      className="relative"
                      onFocus={() => setVFocused(true)}
                      onBlur={(e) => {
                        (e.relatedTarget == null ||
                          e.relatedTarget.id != "vend-select") &&
                          setVFocused(false);
                      }}
                    >
                      <input
                        tabIndex={1}
                        value={vendor}
                        className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                        placeholder={t("VENDOR_NAME_PH")}
                        onChange={(event) => {
                          setVendor(event.target.value);
                          let v = vendors.find(
                            (c) =>
                              c.name.toLowerCase() ==
                              event.target.value.toLowerCase()
                          );
                          if (!!v) {
                            field.onChange(v.id);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                      {vFocused && (
                        <div
                          tabIndex={2}
                          id="vend-select"
                          className="absolute bg-green flex flex-col justify-start top-12 w-full rounded-md z-10"
                        >
                          {vendors.map((v, indx) => (
                            <div
                              onClick={(e) => {
                                field.onChange(v.id);
                                setVendor(v.name);
                                setVFocused(false);
                              }}
                              key={indx}
                              className={`text-left p-2 cursor-pointer hover:bg-white ${
                                indx == 0 ? "rounded-t-md" : ""
                              }`}
                            >
                              {v.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.vendor && (
                  <span className="text-sm text-red-700 absolute top-16">
                    {t("INVALID_VENDOR")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <label className="green normal-size mb-1">
                    {t("PRODUCT_CATEGORY")}{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="category"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div
                        className="relative"
                        onFocus={() => setFocused(true)}
                        onBlur={(e) => {
                          (e.relatedTarget == null ||
                            e.relatedTarget.id != "cat-select") &&
                            setFocused(false);
                        }}
                      >
                        <input
                          tabIndex={1}
                          value={category}
                          className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                          placeholder={t("CATEGORY_NAME_PH")}
                          onChange={(event) => {
                            setCategory(event.target.value);
                            let v = categories.find(
                              (c) =>
                                c.name.toLowerCase() ==
                                event.target.value.toLowerCase()
                            );
                            if (!!v) {
                              field.onChange(v.id);
                            } else {
                              field.onChange("");
                            }
                          }}
                        />
                        {focused && (
                          <div
                            tabIndex={2}
                            id="cat-select"
                            className="absolute bg-green flex flex-col justify-start top-12 w-full rounded-md z-10"
                          >
                            {categories.map((v, indx) => (
                              <div
                                onClick={(e) => {
                                  field.onChange(v.id);
                                  setCategory(v.name);
                                  setFocused(false);
                                }}
                                key={indx}
                                className={`text-left p-2 cursor-pointer hover:bg-white ${
                                  indx == 0 ? "rounded-t-md" : ""
                                }`}
                              >
                                {v.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {errors.category && (
                    <span className="text-sm text-red-700 absolute top-16">
                      {t("INVALID_CATEGORY")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="green normal-size mb-1">
                  {t("PAYMENT_METHOD")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="payment"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                    >
                      <option value="CASH">{t("CASH")}</option>
                      <option value="REWARD_POINTS">
                        {t("REWARD_POINTS")}
                      </option>
                    </select>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">
                  {t("TRANSACTION_CREATED_BY")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                  disabled
                  value={profile?.fname + " " + profile?.lname}
                />
              </div>
              <div className="flex flex-col relative">
                <label className="green normal-size mb-1">
                  {t("PRODUCT")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="product"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div
                      className="relative"
                      onFocus={() => setPFocused(true)}
                      onBlur={(e) => {
                        (e.relatedTarget == null ||
                          e.relatedTarget.id != "prod-select") &&
                          setPFocused(false);
                      }}
                    >
                      <input
                        tabIndex={1}
                        value={product}
                        className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                        placeholder={t("PRODUCT_PH")}
                        onChange={(event) => {
                          setProduct(event.target.value);
                          let p = products.find(
                            (c) =>
                              c.name.toLowerCase() ==
                              event.target.value.toLowerCase()
                          );
                          if (!!p) {
                            field.onChange(p.id);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                      {pFocused && (
                        <div
                          tabIndex={2}
                          id="prod-select"
                          className="absolute bg-green flex flex-col justify-start top-12 w-full rounded-md z-10"
                        >
                          {products.map((p, indx) => (
                            <div
                              onClick={() => {
                                field.onChange(p.id);
                                setProduct(p.name);
                                setAmount(p.price);
                                setRewardRatio(p.rewardRatio);
                                setUnit(p.unit);
                                setPFocused(false);
                              }}
                              key={indx}
                              className={`text-left p-2 cursor-pointer hover:bg-white ${
                                indx == 0 ? "rounded-t-md" : ""
                              }`}
                            >
                              {p.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.product && (
                  <span className="text-sm text-red-700 absolute top-16">
                    {t("INVALID_PRODUCT")}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-row justify-between">
              <div className="flex flex-col relative">
                <label className="green normal-size mb-1">
                  {t("WAREHOUSE_NAME")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="warehouse"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div
                      className="relative"
                      onFocus={() => setWFocused(true)}
                      onBlur={(e) => {
                        (e.relatedTarget == null ||
                          e.relatedTarget.id != "war-select") &&
                          setWFocused(false);
                      }}
                    >
                      <input
                        tabIndex={1}
                        value={warehouse}
                        className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                        placeholder={t("WAREHOUSE_NAME_PH")}
                        onChange={(event) => {
                          setWarehouse(event.target.value);
                          let w = warehouses.find(
                            (c) =>
                              c.name.toLowerCase() ==
                              event.target.value.toLowerCase()
                          );
                          if (!!w) {
                            field.onChange(w.id);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                      {wFocused && (
                        <div
                          tabIndex={2}
                          id="war-select"
                          className="absolute bg-green flex flex-col justify-start top-12 w-full rounded-md z-10"
                        >
                          {warehouses.map((w, indx) => (
                            <div
                              onClick={(e) => {
                                field.onChange(w.id);
                                setWarehouse(w.name);
                                setWFocused(false);
                              }}
                              key={indx}
                              className={`text-left p-2 cursor-pointer hover:bg-white ${
                                indx == 0 ? "rounded-t-md" : ""
                              }`}
                            >
                              {w.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.warehouse && (
                  <span className="text-sm text-red-700 absolute top-16">
                    {t("INVALID_WAREHOUSE")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">
                  {t("AMOUNT") + "/"}
                  {unit}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                  value={amount}
                  disabled
                  {...register("amount", {
                    required: false,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">
                  {t("QUANTITY")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-64 add-user-input`}
                  {...register("quantity", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  onBlur={updateTotal}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="green normal-size mb-1">
                  {t("PRODUCT_TOTAL")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-48 add-user-input`}
                  value={total}
                  disabled
                  {...register("total", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">{t("FEE_1")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-48 add-user-input`}
                  {...register("fee1", {
                    required: false,
                    valueAsNumber: true,
                  })}
                  onBlur={updateTotal}
                />
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">{t("FEE_2")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-48 add-user-input`}
                  {...register("fee2", {
                    required: false,
                    valueAsNumber: true,
                  })}
                  onBlur={updateTotal}
                />
              </div>
              <div className="flex flex-col">
                <label className="green normal-size mb-1">{t("FEE_3")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-48 add-user-input`}
                  {...register("fee3", {
                    required: false,
                    valueAsNumber: true,
                  })}
                  onBlur={updateTotal}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-row justify-center items-center">
              <div className="flex flex-col mr-4">
                <label className="green normal-size mb-1">
                  {t("FINAL_AMOUNT")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-48 add-user-input`}
                  value={finalAmount}
                  disabled
                />
              </div>
              <div className="flex flex-col ml-4">
                <label className="green normal-size mb-1">
                  {t("AVAILABLE_REWARD_POINTS")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none border-green w-48 add-user-input`}
                  value={arp}
                  disabled
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                className="rounded-full px-8 py-2 bg-green main-text"
              >
                <span className="font-bold">{t("CREATE_TRANSACTION")}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
