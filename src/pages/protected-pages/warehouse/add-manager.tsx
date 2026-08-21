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
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import moment from "moment-timezone";
import DatePicker from "react-date-picker";

// Import Interfaces`
import { useTranslation } from "react-i18next";
import { Manager } from "./managers";


export const AddManager: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const navigate = useNavigate();
  const [screen, setScreen] = useState("basic");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, profile } = useAuth();
  const [manager, setManager] = useState<Manager>();
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
        get<{ data: Manager }>(`admin/managers/${id}`, token).then((res) => {
          setManager(res.data);
          setLoading(false);
        });
      }
    }
  }, [token, profile]);

  useEffect(() => {
    if (manager) {
      reset({
        ...manager,
        ...manager.location,
        warehouse: manager.warehouse.id,
      });
    }
  }, [manager]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      village: "",
      common: "",
      circle: "",
      region: "",
      country: "Mali",
      id: "",

      externalId: "",

      fname: "",

      lname: "",

      phone: "",

      dob: "",
      warehouse: "",

      age: "",

      schooled: false,

      organization: 0,

      gender: "",

      nina: "",

      numOfChildren: 0,

      headquarters: "",

      maritalStatus: "",

      language: "",

      //   Literacy Level

      literacyLevel: "",
      // Total Products

      totalProducts: 0,
      // Other Income Activites

      otherIncomActivities: "",
      // Faciliation Activity

      facilitationActivity: "",
      // Other Suppliers

      otherSuppliers: "",

      localOrganizations: 0,

      infrastructure: "",

      logisticsAndProductionMeans: "",

      surfaceAreaOfFarm: 0,

      status: "inactive",
    },
  });

  const onSubmit = (data: any) => {
    setLoading(true);

    if (id) {
      put(
        `/admin/managers/${id}`,
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
          navigate(`/manage/managers`);
        })
        .catch((error) => {
          setErrorMessage(getMessageFromError(error));
          setLoading(false);
        });

      return;
    }
    post(
      "/admin/managers",
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
        navigate(`/manage/managers`);
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
              {t("MANAGE")} {t("MANAGERS")} &nbsp;
            </span>{" "}
            / &nbsp;
            <span
              className="underline underline-offset-4 cursor-pointer"
              onClick={() => navigate("/manage/managers")}
            >
              {t("MANAGERS")}
            </span>{" "}
            &nbsp; / &nbsp;
            <span className="text-white">
              {!id ? t("ADD") : t("EDIT")} {t("MANAGER")}
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
                  {t("FIRST_NAME")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FIRST_NAME")}
                  {...register("fname", {
                    required: true,
                  })}
                />
                {errors.fname && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("FIRST_NAME")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LAST_NAME")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LAST_NAME")}
                  {...register("lname", {
                    required: true,
                  })}
                />
                {errors.lname && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("LAST_NAME")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("GENDER")}
                </label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <select
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                    >
                      <option value="">{t("SELECT")}</option>
                      <option value="HOMME">{t("MALE")}</option>
                      <option value="FEMME">{t("FEMALE")}</option>
                      <option value="AUTRE">{t("OTHER")}</option>
                    </select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between mt-8">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  Date of Birth <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="dob"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        clearIcon={null}
                        dayPlaceholder="DD"
                        monthPlaceholder="MM"
                        yearPlaceholder="YYYY"
                        format="dd-MM-y"
                        calendarIcon={<img src="/calendar.svg" />}
                        className={`date-picker border-solid  bg-main border rounded-md p-2 py-1  text-sm outline-none  border-green w-56 add-user-input`}
                        value={
                          field.value
                            ? moment(field.value, "DD-MM-YYYY").toDate()
                            : null
                        }
                        onChange={(date) => {
                          field.onChange(
                            moment(date?.valueOf()).format("DD-MM-YYYY")
                          );
                        }}
                      />
                    </>
                  )}
                />
                {errors.dob && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Date of Birth
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LANGUAGE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LANGUAGE")}
                  {...register("language", {
                    required: false,
                  })}
                />
              </div>

              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MARITAL_STATUS")}
                </label>
                <Controller
                  control={control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <select
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                      value={field.value}
                    >
                      <option value="">{t("SELECT")}</option>
                      <option value="Mari(e)">{t("MARRIED")} </option>
                      <option value="Veuf / Veuve"> {t("WIDOW")}</option>
                      <option value="Clibataire">{t("SINGLE")}</option>
                      <option value="Autre">{t("OTHER")}</option>
                    </select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row mt-8 justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("CHILDREN")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("CHILDREN")}
                  {...register("numOfChildren", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">{t("NINA")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("NINA_NUNBER")}
                  {...register("nina", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                      placeholder="Enter phone number"
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                    />
                  )}
                />
                {errors.phone && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Phone
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-row mt-8 justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("HEADQUARTERS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("HEADQUARTERS")}
                  {...register("headquarters", {
                    required: false,
                  })}
                />
              </div>
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
                  {t("COMMON")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("COMMON")}
                  {...register("common", {
                    required: true,
                  })}
                />
                {errors.common && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("COMMON")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row mt-8 justify-between">
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
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">{t("AGE")}</label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  disabled={true}
                  placeholder={t("AGE")}
                  {...register("age", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("SCHOOL")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SCHOOL")}
                  {...register("schooled", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LITERACY_LEVEL")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LITERACY_LEVEL")}
                  {...register("literacyLevel", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="flex flex-row mt-8 justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("STATUS")} <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: true }}
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
                {errors.status && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("STATUS")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("WAREHOUSE")} <span className="text-red-600">*</span>
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
            </div>
          </div>
          <div className={`${screen == "additional" ? "block" : "hidden"}`}>
            {" "}
            <div className=" flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("TOTAL_PRODUCTS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("TOTAL_PRODUCTS")}
                  {...register("totalProducts", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("OTHER_INCOME_ACTIVITIES")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("OTHER_INCOME_ACTIVITIES")}
                  {...register("otherIncomActivities", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("FACILITATION_ACTIVITY")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FACILITATION_ACTIVITY")}
                  {...register("facilitationActivity", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("OTHER_SUPPLIER")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("OTHER_SUPPLIER")}
                  {...register("otherSuppliers", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("NUMBER_OF_ORGANIZATIONS_PM")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("HERBICIDE")}
                  {...register("localOrganizations", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("INFRASTRUCTURE")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("INFRASTRUCTURE")}
                  {...register("infrastructure", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              {/* <div className="flex flex-col">
                  <label className="  green normal-size mb-1">{t("MAIN_CROP")}</label>
                  <input
                    className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                    placeholder={t("MAIN_CROP")}
                    {...register("mainCrop", {
                      required: false,
                    })}
                  />
                </div> */}
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LOGISTICS_AND_PRODUCTION_MEANS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LOGISTICS_AND_PRODUCTION_MEANS")}
                  {...register("logisticsAndProductionMeans", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("SURFACE_AREA_OF_FARM")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SURFACE_AREA_OF_FARM")}
                  {...register("surfaceAreaOfFarm", {
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
