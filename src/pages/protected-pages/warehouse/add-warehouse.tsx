import { Toolbar, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import moment from "moment-timezone";
import { Role, User, useAuth } from "../../../providers/auth";
import {
  get,
  getMessageFromError,
  post,
  put,
} from "../../../util/generalActions";
import { Button } from "../../../components/common/button";

// Import Interfaces`
import { useTranslation } from "react-i18next";
import { Warehouse } from "./warehouses";

export const AddWarehouse: React.FC = () => {
  const { t } = useTranslation(["main"]);
  const navigate = useNavigate();
  const [screen, setScreen] = useState("basic");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, profile } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse>();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    if (token && profile) {
      if (id) {
        setLoading(true);
        get<{ data: Warehouse }>(`admin/warehouses/${id}`, token).then(
          (res) => {
            setWarehouse(res.data);
            setLoading(false);
          }
        );
      }
    }
  }, [token, profile]);

  useEffect(() => {
    if (warehouse) {
      reset({ ...warehouse, ...warehouse.location });
    }
  }, [warehouse]);

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

      name: "",

      legalForm: "",

      headOffice: "",

      capital: "",

      legalRep: "",

      phone: "",

      receiptNumber: "",

      members: 0,

      villagesSummary: 0,

      membersSummary: 0,

      potentialAreaSummary: 0,

      cultivatedAreaSummary: 0,

      forecastCampaignAreasSummary: 0,

      areaForecastCountrySideSummary: 0,

      areaOfForecastCollectiveFields: 0,

      areaOfCollectiveFieldsExploited: 0,

      totalProduction: 0,

      collectivesExploited: 0,

      storage: 0,

      weighingEquipment: "",

      blowingEquipment: "",

      meansOfTransportation: "",

      distanceFromCentralizationLocation: 0,

      distanceFromFactory: 0,

      marketedProduction: 0,

      turnOver: 0,

      fixedChargeWithTax: 0,

      netMargin: 0,

      managementOfCommitments: 0,

      accessToFinancing: 0,

      otherProducts: "",

      otherAgr: "",
    },
  });

  const onSubmit = (data: any) => {
    setLoading(true);

    if (id) {
      put(
        `/admin/warehouses/${id}`,
        {
          ...data,
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
          navigate(`/manage/warehouses`);
        })
        .catch((error) => {
          setErrorMessage(getMessageFromError(error));
          setLoading(false);
        });

      return;
    }
    post(
      "/admin/warehouses",
      {
        ...data,
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
        navigate(`/manage/warehouses`);
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
              {t("MANAGE")} {t("WAREHOUSES")} &nbsp;
            </span>{" "}
            / &nbsp;
            <span
              className="underline underline-offset-4 cursor-pointer"
              onClick={() => navigate("/manage/warehouses")}
            >
              {t("WAREHOUSE")}
            </span>{" "}
            &nbsp; / &nbsp;
            <span className="text-white">
              {!id ? "Add" : "Edit"} {t("WAREHOUSE")}
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
                  {t("NAME")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("NAME")}
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("NAME")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("LEGAL_FORM")} <span className="text-red-600">*</span>
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("LEGAL_FORM")}
                  {...register("legalForm", {
                    required: true,
                  })}
                />
                {errors.legalForm && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    {t("INVALID")} {t("LEGAL_FORM")}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("HEAD_OFFICE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("HEAD_OFFICE")}
                  {...register("headOffice", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between mt-8">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("CAPITAL")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("CAPITAL")}
                  {...register("capital", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("IDENTITY_OF_REPRESENTATIVE")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("IDENTITY_OF_REPRESENTATIVE")}
                  {...register("legalRep", {
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
                  {t("RCCM_NUMBER")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("RCCM_NUMBER")}
                  {...register("receiptNumber", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("NUMBER_OF_MEMBERS")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  type="number"
                  placeholder={t("NUMBER_OF_MEMBERS")}
                  {...register("members", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("NUMBER_OF_VILLAGES")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("NUMBER_OF_VILLAGES")}
                  {...register("villagesSummary", {
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
                  {t("MEMBERS_SUMMARY")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MEMBERS_SUMMARY")}
                  type="number"
                  {...register("membersSummary", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("POTENTIAL_AREA")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("POTENTIAL_AREA")}
                  type="number"
                  {...register("potentialAreaSummary", {
                    required: false,
                  })}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("CULTIVATED_AREA")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("CULTIVATED_AREA")}
                  type="number"
                  {...register("cultivatedAreaSummary", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("FORECAST_CAMPAIGN_AREAS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FORECAST_CAMPAIGN_AREAS")}
                  type="number"
                  {...register("forecastCampaignAreasSummary", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("AREAS_EXPLOITED_COUNTRY")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("AREAS_EXPLOITED_COUNTRY")}
                  type="number"
                  {...register("areaForecastCountrySideSummary", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("AREA_FORECAST_COLLECTIVE_FIELDS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("AREA_FORECAST_COLLECTIVE_FIELDS")}
                  type="number"
                  {...register("areaOfForecastCollectiveFields", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("AREA_COLLECTIVE_FIELDS")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("AREA_COLLECTIVE_FIELDS")}
                  type="number"
                  {...register("areaOfCollectiveFieldsExploited", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("TOTAL_PRODUCTION")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("TOTAL_PRODUCTION")}
                  type="number"
                  {...register("totalProduction", {
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
          </div>
          <div className={`${screen == "additional" ? "block" : "hidden"}`}>
            {" "}
            <div className=" flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("STORAGE_WAREHOUSE")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("STORAGE_WAREHOUSE")}
                  {...register("storage", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("WEIGHING_EQUIPMENT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("WEIGHING_EQUIPMENT")}
                  {...register("weighingEquipment", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("BLOWING_EQUIPMENT")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("BLOWING_EQUIPMENT")}
                  {...register("blowingEquipment", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MEANS_OF_TRANSPORT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MEANS_OF_TRANSPORT")}
                  {...register("meansOfTransportation", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("DISTANCE_FROM_CENTRAL")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("DISTANCE_FROM_CENTRAL")}
                  type="number"
                  {...register("distanceFromCentralizationLocation", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("DISTANCE_FROM_FACTORY")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("DISTANCE_FROM_FACTORY")}
                  {...register("distanceFromFactory", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MARKETED_PRODUCTION")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MARKETED_PRODUCTION")}
                  {...register("marketedProduction", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("TURN_OVER")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("TURN_OVER")}
                  {...register("turnOver", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("FIXED_CHARGE_INCLUDING_TAXES")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("FIXED_CHARGE_INCLUDING_TAXES")}
                  {...register("fixedChargeWithTax", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("NET_MARGIN")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("NET_MARGIN")}
                  {...register("netMargin", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("MANAGEMENT_OF_COMMITMENT")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("MANAGEMENT_OF_COMMITMENT")}
                  {...register("managementOfCommitments", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("ACCESS_TO_FINANCING")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("ACCESS_TO_FINANCING")}
                  {...register("accessToFinancing", {
                    required: false,
                  })}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-row justify-between">
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
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("OTHER_AGR")}
                </label>

                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("OTHER_AGR")}
                  {...register("otherAgr", {
                    required: false,
                  })}
                />
              </div>
              <div className="flex flex-col">
                <label className="  green normal-size mb-1">
                  {t("HARVESTED_PRODUCTS")}
                </label>
                <input
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green w-56 add-user-input`}
                  placeholder={t("HARVESTED_PRODUCTS")}
                  {...register("accessToFinancing", {
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
