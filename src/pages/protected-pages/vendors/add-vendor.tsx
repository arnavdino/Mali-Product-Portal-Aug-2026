import { Toolbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useAuth } from "../../../providers/auth";
import {
  get,
  getMessageFromError,
  post,
  put,
} from "../../../util/generalActions";
import { Button } from "../../../components/common/button";

// Import Interfaces`
import { useTranslation } from "react-i18next";
import { Vendor } from "./vendors";

export const AddVendor: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const navigate = useNavigate();
  const [screen, setScreen] = useState("basic");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, profile } = useAuth();
  const [vendor, setVendor] = useState<Vendor>();
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    []
  );
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const formRef = useRef();

  useEffect(() => {
    if (token && profile) {
      get<{ data: { warehouses: { id: string; name: string }[] } }>(
        "/admin/warehouses?page=1&rowsPerPage=1000",
        token
      )
        .then((res) => {
          if (!id) {
            setLoading(false);
          }
          setWarehouses(res.data.warehouses);
        })

        .catch((error) => {});
      if (id) {
        get<{ data: Vendor }>(`admin/vendors/${id}`, token).then((res) => {
          setVendor(res.data);
          setLoading(false);
        });
      }
    }
  }, [token, profile]);

  useEffect(() => {
    if (vendor) {
      reset({ ...vendor, ...vendor.location, warehouse: vendor.warehouse.id });
    }
  }, [vendor]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      managerName: "",
      organization: "",
      methodOfPayment: "",
      methodOfDelivery: "",
      methodOfSupply: "",
      phone: "",
      createdAt: "",
      status: "inactive",
      village: "",
      common: "",
      circle: "",
      region: "",
      country: "Mali",
      transportContract: "",
      baseServices: "",
      seeds: "",
      fertilizer: "",
      herbicide: "",
      phytosanitaryProduct: "",
      plowing: "",
      semi: "",
      fertilizerSpreading: "",
      phytoTreatment: "",
      smallEquipment: "",
      insurance: "",
      productSupplied: "",
      productPurchased: "",
      warehouse: "",
    },
  });

  const onSubmit = (data: any) => {
    setLoading(true);

    if (id) {
      put(
        `/admin/vendors/${id}`,
        {
          ...data,
          location: {
            circle: data.circle,
            region: data.region,
            village: data.village,
            country: data.country,
            common: data.common,
          },
          warehouse: { id: data.warehouse },
        },
        token || ""
      )
        .then((res) => {
          navigate(`/manage/vendors`);
        })
        .catch((error) => {
          setErrorMessage(getMessageFromError(error));
          setLoading(false);
        });

      return;
    }
    post(
      "/admin/vendors",
      {
        ...data,
        location: {
          circle: data.circle,
          region: data.region,
          village: data.village,
          country: data.country,
          common: data.common,
        },
        warehouse: { id: data.warehouse },
      },
      token || ""
    )
      .then((res) => {
        navigate(`/manage/vendors`);
      })
      .catch((error) => {
        setErrorMessage(getMessageFromError(error));
        setLoading(false);
      });
  };

  return (
    <div className="relative " style={{ marginTop: 78 }}>
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green fixed block w-full"
      >
        <div className="flex flex-row justify-between green w-full ">
          <div>
            <span className="font-bold ">
              {t("MANAGE")} {t("VENDORS")} &nbsp;
            </span>{" "}
            / &nbsp;
            <span
              className="underline underline-offset-4 cursor-pointer"
              onClick={() => navigate("/manage/vendors")}
            >
              {t("VENDORS")}
            </span>{" "}
            &nbsp; / &nbsp;
            <span className="text-white">
              {!id ? "Add" : "Edit"} {t("VENDOR")}
            </span>
          </div>
          <Button
            className="main bg-green py-1 px-6 rounded-xl normal-size"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            {t("SAVE")}
          </Button>
        </div>
      </Toolbar>
      <div className="flex flex-col items-center overflow-auto style-1 overflow-x-hidden bottom-height p-1">
        <div className="border border-green rounded-3xl   mt-4 px-6 green flex flex-row items-center justify-between normal-size relative ">
          {" "}
          <div
            className="   cursor-pointer h-14 flex flex-row items-center justify-between mr-2"
            onClick={() => setScreen("basic")}
          >
            <span
              className={` top-4  flex flex-row ml-2 px-1 py-1 ${
                screen == "basic" ? "bg-green rounded-2xl main " : ""
              }`}
            >
              {screen != "basic" ? (
                <img
                  src="/person-outline.svg"
                  className="w-3 h-3 mr-2 "
                  style={{ marginTop: 3 }}
                />
              ) : (
                <img
                  src="/person-outline2.svg"
                  className="w-3 h-3 mr-2 "
                  style={{ marginTop: 3 }}
                />
              )}
              {t("BASIC_INFO")}
            </span>
          </div>
          <div
            className="    cursor-pointer h-14 flex flex-row items-center justify-between mr-2"
            onClick={() => setScreen("additional")}
          >
            <span
              className={` top-4  flex flex-row ml-2 px-1 py-1 ${
                screen == "additional" ? "bg-green rounded-2xl main " : ""
              }`}
            >
              {" "}
              {screen != "additional" ? (
                <img
                  src="/product-info.svg"
                  className="w-3 h-3 mr-2 "
                  style={{ marginTop: 3 }}
                />
              ) : (
                <img
                  src="/product-info-selected.svg"
                  className="w-3 h-3 mr-2 "
                  style={{ marginTop: 3 }}
                />
              )}
              {t("ADDITIONAL_INFO")}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="font-bold text-red-600 my-4">{errorMessage}</div>
        )}
        <form className="border border-green rounded-lg xl:w-2/3 w-full  px-10 py-4 text-left mt-10 mb-12">
          <div className={`${screen == "basic" ? "block" : "hidden"}`}>
            <div className="flex flex-row justify-between mt-4">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LEGAL_ENTITY_NAME")}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LEGAL_ENTITY_NAME")}
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("LEGAL_ENTITY_NAME")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MANAGER_NAME")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MANAGER_NAME")}
                  {...register("managerName", {
                    required: true,
                  })}
                />
                {errors.managerName && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("MANAGER_NAME")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PRODUCT_SUPPLIED")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PRODUCT_SUPPLIED")}
                  {...register("productSupplied", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between mt-8">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PRODUCT_PURCHASED")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PRODUCT_PURCHASED")}
                  {...register("productPurchased", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("AFFILIATION_TO_ORGANIZATION")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("AFFILIATION_TO_ORGANIZATION")}
                  {...register("organization", {
                    required: false,
                  })}
                />
              </div>

              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PHONE")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                      placeholder={t("PHONE")}
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                    />
                  )}
                />
                {errors.phone && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("PHONE")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row mt-8 justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("METHOD_OF_PAYMENT")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("METHOD_OF_PAYMENT")}
                  {...register("methodOfPayment", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("METHOD_OF_DELIVERY")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("METHOD_OF_DELIVERY")}
                  {...register("methodOfDelivery", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("METHOD_OF_DELIVERY")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("METHOD_OF_SUPPLY")}
                  {...register("methodOfSupply", {
                    required: false,
                  })}
                />
              </div>
            </div>

            <div className="flex flex-row mt-8 justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("VILLAGE")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("VILLAGE")}
                  {...register("village", {
                    required: true,
                  })}
                />
                {errors.village && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("VILLAGE")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("CIRCLE")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("CIRCLE")}
                  {...register("circle", {
                    required: true,
                  })}
                />
                {errors.circle && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("CIRCLE")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("REGION")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("REGION")}
                  {...register("region", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="flex flex-row mt-8 justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("COUNTRY")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("COUNTRY")}
                  {...register("country", {
                    required: true,
                  })}
                />
                {errors.country && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("COUNTRY")}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("WAREHOUSE")}
                </label>

                <Controller
                  control={control}
                  name="warehouse"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                    >
                      <option value="">{t("WAREHOUSE")}</option>
                      {warehouses.map((role) => (
                        <option value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  )}
                />

                {errors.warehouse && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("WAREHOUSE")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("STATUS")}
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <select
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                      value={field.value}
                    >
                      <option value="">{t("SELECT")}</option>
                      <option value="active">{t("ACTIVE")}</option>
                      <option value="inactive">{t("INACTIVE")}</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </div>
          <div className={`${screen == "additional" ? "block" : "hidden"}`}>
            {" "}
            <div className=" flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("TRANSPORT_CONTRACT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("TRANSPORT_CONTRACT")}
                  {...register("transportContract", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("BASIC_SERVICES")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("BASIC_SERVICES")}
                  {...register("baseServices", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">{t("SEEDS")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SEEDS")}
                  {...register("seeds", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("FERTILIZER")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FERTILIZER")}
                  {...register("fertilizer", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("HERBICIDE")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("HERBICIDE")}
                  {...register("herbicide", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PHYTOSANITARY_PRODUCT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PHYTOSANITARY_PRODUCT")}
                  {...register("phytosanitaryProduct", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PLOWING")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PLOWING")}
                  {...register("plowing", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">{t("SEMI")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SEMI")}
                  {...register("semi", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("FERTILIZER_SPREADING")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FERTILIZER_SPREADING")}
                  {...register("fertilizerSpreading", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PHYTO_TREATMENT")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PHYTO_TREATMENT")}
                  {...register("phytoTreatment", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("SMALL_EQUIPMENT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SMALL_EQUIPMENT")}
                  {...register("smallEquipment", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("INSURANCE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("INSURANCE")}
                  {...register("insurance", {
                    required: false,
                  })}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
