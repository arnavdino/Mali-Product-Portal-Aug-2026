import { Toolbar, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import moment from "moment-timezone";
import { Role, User, useAuth } from "../../../providers/auth";
import {
  get,
  getMessageFromError,
  post,
  put,
} from "../../../util/generalActions";
import DatePicker from "react-date-picker";
import { useCreditCardValidator, images } from "react-creditcard-validator";
import { Button } from "../../../components/common/button";
import { Country, State, City } from "country-state-city";

// Import Interfaces`
import { ICountry, IState, ICity } from "country-state-city";
import { useTranslation } from "react-i18next";

export interface Card {
  digits: string;
  expiry: string;
  csv: string;
  id: string;
}

export const AddUser: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const navigate = useNavigate();
  const [screen, setScreen] = useState("profile");
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const { token, profile } = useAuth();
  const [user, setUser] = useState<User>();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const formRef = useRef();

  useEffect(() => {
    if (token && profile) {
      get<{ data: Role[] }>("/roles", token)
        .then((res) => {
          if (!id) {
            setLoading(false);
          }
          setRoles(res.data);
        })

        .catch((error) => {});
      if (id) {
        get<{ data: User }>(`admin/user/${id}`, token).then((res) => {
          setUser(res.data);
          setLoading(false);
        });
      }
    }
  }, [token, profile]);

  useEffect(() => {
    if (user) {
      reset({ ...user, ...user.location, role: user.role.id });
    }
  }, [user]);

  const bottomHeight = window.screen.availHeight - 200;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      role: "",
      fname: "",
      lname: "",
      dob: "",
      gender: "",
      language: "",
      rewardPoints: 0,
      village: "",
      common: "",
      circle: "",
      region: "",
      country: "Mali",
      phone: "",
      maritalStatus: "",
      numOfChildren: 0,
      age: "",
      nina: "",
      organization: "",
      status: "inactive",
      mainCrop: "",
      secondaryCrop: "",
      otherProducts: "",
      activities: "",
      liveStockFarming: "",
      smallTrade: "",
      profession: "",
      meansOfProduction: "",
      meansOfTransport: "",
      financialEducation: "",
      accessToCredit: "",
      accessToInsurance: "",
      accessToGap: "",
      totalArea: 0,
      totalUsedArea: 0,
      cultivatedArea: 0,
      actualArea: 0,
      propertyStatus: "",
      longitude: 0,
      latitude: 0,
      forecastedSurfaceArea: 0,
      authorizedSurfaceArea: 0,
      literacyLevel: "",
    },
  });
  const theme = useTheme();

  const onSubmit = (data: any) => {
    setLoading(true);
    if (window.location.href.includes("customers")) {
      data.role = roles.find((r) => r.name == "Farmer")?.id;
      data.email = `${data.phone}@jaabi-sugu.com`;
    }
    if (id) {
      put(
        `/admin/user/${id}`,
        {
          ...data,
          role: { id: data.role },
          password: "NORmal@133",
          location: {
            circle: data.circle,
            region: data.region,
            village: data.village,
            country: data.country,
            common: data.common,
          },
        },
        token || ""
      )
        .then((res) => {
          navigate(
            `/manage/${
              window.location.href.includes("customers") ? "customers" : "users"
            }`
          );
        })
        .catch((error) => {
          setErrorMessage(getMessageFromError(error));
          setLoading(false);
        });

      return;
    }
    post(
      "/admin/user",
      {
        ...data,
        role: { id: data.role },
        password: "NORmal@133",
        location: {
          circle: data.circle,
          region: data.region,
          village: data.village,
          country: data.country,
          common: data.common,
        },
      },
      token || ""
    )
      .then((res) => {
        navigate(
          `/manage/${
            window.location.href.includes("customers") ? "customers" : "users"
          }`
        );
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
            <span className="font-bold ">Manage Users &nbsp;</span> / &nbsp;
            <span
              className="underline underline-offset-4 cursor-pointer"
              onClick={() => navigate("/manage/users")}
            >
              Users
            </span>{" "}
            &nbsp; / &nbsp;
            <span className="text-white">{!id ? "Add" : "Edit"} User</span>
          </div>
          <Button
            className="main bg-green py-1 px-6 rounded-xl normal-size"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </Toolbar>
      <div className="flex flex-col items-center overflow-auto style-1 overflow-x-hidden bottom-height p-1">
        {window.location.href.includes("customers") && (
          <div className="border border-green rounded-3xl   mt-4 px-6 green flex flex-row items-center justify-between normal-size relative ">
            {" "}
            <div
              className="   cursor-pointer h-14 flex flex-row items-center justify-between mr-2"
              onClick={() => setScreen("profile")}
            >
              <span
                className={` top-4  flex flex-row ml-2 px-1 py-1 ${
                  screen == "profile" ? "bg-green rounded-2xl main " : ""
                }`}
              >
                {screen != "profile" ? (
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
              onClick={() => setScreen("product")}
            >
              <span
                className={` top-4  flex flex-row ml-2 px-1 py-1 ${
                  screen == "product" ? "bg-green rounded-2xl main " : ""
                }`}
              >
                {" "}
                {screen != "product" ? (
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
                {t("PRODUCT_INFO")}
              </span>
            </div>
            <div
              className="    cursor-pointer h-14 flex flex-row items-center justify-between mr-2"
              onClick={() => setScreen("farm")}
            >
              <span
                className={` top-4  flex flex-row ml-2 px-1 py-1 ${
                  screen == "farm" ? "bg-green rounded-2xl main " : ""
                }`}
              >
                {" "}
                {screen != "farm" ? (
                  <img
                    src="/location.svg"
                    className="w-3 h-3 mr-2 "
                    style={{ marginTop: 3 }}
                  />
                ) : (
                  <img
                    src="/location-selected.svg"
                    className="w-3 h-3 mr-2 "
                    style={{ marginTop: 3 }}
                  />
                )}
                {t("FARM_INFO")}
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="font-bold text-red-600 my-4">{errorMessage}</div>
        )}
        <form className="border border-green rounded-lg xl:w-2/3 w-full  px-10 py-4 text-left mt-10 mb-12">
          <div className={`${screen == "profile" ? "block" : "hidden"}`}>
            <div className="flex flex-row mt-4 justify-between">
              {!window.location.pathname.includes("customers") && (
                <div className="flex flex-col">
                  <label className="  green normal-size mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none   w-56 add-user-input ${
                      !id ? "border-green" : ""
                    }`}
                    placeholder="Email"
                    readOnly={!!id}
                    {...register("email", {
                      required: true,
                      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    })}
                  />
                  {errors.email && (
                    <span className="text-sm text-red-700 ml-3 my-2">
                      invalid email format
                    </span>
                  )}
                </div>
              )}

              {!window.location.href.includes("customers") ? (
                <div className="flex flex-col">
                  <label className="  green normal-size mb-1">
                    {t("USER")} {t("ROLE")}{" "}
                    <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    control={control}
                    name="role"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <select
                        className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                      >
                        <option value="">
                          {t("USER")} {t("ROLE")}
                        </option>
                        {roles.map((role) => (
                          <option value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    )}
                  />

                  {errors.role && (
                    <span className="text-sm text-red-700 ml-3 my-2">
                      {t("INVALID")} {t("ROLE")}
                    </span>
                  )}
                </div>
              ) : (
                <div></div>
              )}
            </div>
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
                        format="y-MM-dd"
                        calendarIcon={<img src="/calendar.svg" />}
                        className={`date-picker border-solid  bg-main border rounded-md p-2 py-1  text-sm outline-none  border-green w-56 add-user-input`}
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD").toDate()
                            : null
                        }
                        onChange={(date) => {
                          field.onChange(
                            moment(date?.valueOf()).format("YYYY-MM-DD")
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
                  {t("OG_PRODUCERS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("OG_PRODUCERS")}
                  {...register("organization", {
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
                  disabled={true}
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("AGE")}
                  {...register("age", {
                    required: false,
                  })}
                />
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
          <div className={`${screen == "product" ? "block" : "hidden"}`}>
            {" "}
            <div className=" flex flex-row justify-between">
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
                  {t("MAIN_CROP")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MAIN_CROP")}
                  {...register("mainCrop", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("SECONDARY_CROP")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SECONDARY_CROP")}
                  {...register("secondaryCrop", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("OTHER_PRODUCTS")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("OTHER_PRODUCTS")}
                  {...register("otherProducts", {
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
                  {t("OTHER_INCOME_GENERATING_ACTIVITIES")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("OTHER_INCOME_GENERATING_ACTIVITIES")}
                  {...register("activities", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LIVE_STOCK_FARMING")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LIVE_STOCK_FARMING")}
                  {...register("liveStockFarming", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("SMALL_TRADE")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("SMALL_TRADE")}
                  {...register("smallTrade", {
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
                  {t("PROFESSION")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PROFESSION")}
                  {...register("profession", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MEANS_OF_PRODUCTION")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MEANS_OF_PRODUCTION")}
                  {...register("meansOfProduction", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MEANS_OF_TRANSPORT")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MEANS_OF_TRANSPORT")}
                  {...register("meansOfTransport", {
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
                  {t("FINANCIAL_EDUCATION")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FINANCIAL_EDUCATION")}
                  {...register("financialEducation", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("ACCESS_TO_CREDIT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("ACCESS_TO_CREDIT")}
                  {...register("accessToCredit", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("ACCESS_TO_INSURANCE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("ACCESS_TO_INSURANCE")}
                  {...register("accessToInsurance", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("ACCESS_TO_GAP")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("ACCESS_TO_GAP")}
                  {...register("accessToGap", {
                    required: false,
                  })}
                />
              </div>
            </div>
          </div>

          <div className={`${screen == "farm" ? "block" : "hidden"}`}>
            {" "}
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("TOTAL_AREA")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("TOTAL_AREA")}
                  type="number"
                  {...register("totalArea", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("TOTAL_USED_AREA")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("TOTAL_USED_AREA")}
                  type="number"
                  {...register("totalUsedArea", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("CULTIVATED_AREA")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("CULTIVATED_AREA")}
                  type="number"
                  {...register("cultivatedArea", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("ACTUAL_AREA_SOWN_WITH_SESAME")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("ACTUAL_AREA_SOWN_WITH_SESAME")}
                  type="number"
                  {...register("actualArea", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("PROPERTY_STATUS")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("PROPERTY_STATUS")}
                  {...register("propertyStatus", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LONGITUDE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LONGITUDE")}
                  {...register("longitude", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LATITUDE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LATITUDE")}
                  {...register("latitude", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("FORECAST_SURFACE_AREA")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FORECAST_SURFACE_AREA")}
                  type="number"
                  {...register("forecastedSurfaceArea", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("AUTHORIZED_SURFACE_AREA")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("AUTHORIZED_SURFACE_AREA")}
                  type="number"
                  {...register("authorizedSurfaceArea", {
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
