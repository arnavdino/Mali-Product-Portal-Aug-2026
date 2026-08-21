import { Breadcrumbs, Toolbar, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Product } from "./products";
import { useAuth } from "../../../providers/auth";
import {
  get,
  getMessageFromError,
  post,
  put,
} from "../../../util/generalActions";
import { Controller, useForm } from "react-hook-form";
import { useDialog } from "../../../components/common/appDialog";
import { FaCross, FaWindowClose } from "react-icons/fa";
import { Button } from "../../../components/common/button";
import { Promotion } from "./promotions";

export const AddPromotion: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<{ file: any; img: any }>();
  const theme = useTheme();
  const { showDialog } = useDialog();
  const { token, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState<Promotion>();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [fileError, setFileError] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Loop through accepted files
    acceptedFiles.map((file: any) => {
      // Initialize FileReader browser API
      const reader = new FileReader();
      // onload callback gets called after the reader reads the file data
      reader.onload = function (e) {
        // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it.
        setFile({ img: e.target?.result || "", file });
        setFileError(false);
      };
      // Read the file as Data URL (since we accept only images)
      reader.readAsDataURL(file);
      return file;
    });
  }, []);
  const {
    register,
    handleSubmit,

    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      discount: 0,
      product: "",
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    if (!file) {
      setFileError(true);
      return;
    }
    // Update the formData object
    setLoading(true);
    formData.append("upload", file?.file);
    if (product) {
      put<{ data: { id: string } }>(
        `/admin/promotions/${product.id}`,
        {
          name: data.name,
          description: data.description,
          status: status,
          discount: data.discount,
          product: { id: data.product },
          imageUrl: product.imageUrl,
        },
        token || ""
      )
        .then((res) => {
          if (file?.file) {
            post(`admin/promotions/image/${product.id}`, formData, token ?? "")
              .then((res) => navigate("/products/promotions"))
              .catch((error) => navigate("/products/promotions"));
          } else {
            navigate("/products/promotions");
          }
        })
        .catch((error) => {
          setLoading(false);
          showDialog(
            <div>{getMessageFromError(error)}</div>,

            "Invalid Promotion",
            false
          );
        });
      return;
    }
    post<{ data: { id: string } }>(
      "/admin/promotions",
      {
        name: data.name,
        description: data.description,
        status,
        discount: data.discount,
        product: { id: data.product },
      },
      token || ""
    )
      .then((res) => {
        if (file?.file) {
          post(
            `admin/promotions/image/${res.data.data.id}`,
            formData,
            token ?? ""
          )
            .then((res) => navigate("/products/promotions"))
            .catch((error) => navigate("/products/promotions"));
        } else {
          navigate("/products/promotions");
        }
      })
      .catch((error) => {
        setLoading(false);
        showDialog(
          <div>{getMessageFromError(error)}</div>,

          "Invalid Promotions",
          false
        );
      });
  };

  useEffect(() => {
    if (search) {
      get<{ data: { id: string; name: string }[] }>(
        `/admin/promotions/product/search?filter=${search}`,
        token || ""
      ).then((res) => setCategories(res.data));
    } else {
      setCategories([]);
    }
  }, [search]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        discount: product.discount,
        product: product.product.id,
      });
      setFile({ img: product.imageUrl, file: undefined });
      setStatus(product.status);
      setSearch(product.product.name);
    }
  }, [product]);

  useEffect(() => {
    if (token && profile) {
      if (id) {
        get<{ data: Promotion }>(`/promotions/${id}`, token).then((res) =>
          setProduct(res.data)
        );
      }
    }
    //get product.
  }, [token, profile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpg": [".jpg"],
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
    },
  });
  return (
    <div className="relative" style={{ marginTop: 78 }}>
      {" "}
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green"
      >
        <div className="flex flex-row justify-between green w-full">
          <Breadcrumbs aria-label="breadcrumb" className="green">
            <span
              color="inherit"
              className="green hover:underline cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Promotions
            </span>
            <span className="green cursor-pointer">
              {" "}
              {!product ? "Add" : "Edit"} Promotion
            </span>
          </Breadcrumbs>
          <Button
            className="main bg-green py-1 px-6 rounded-xl normal-size"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </Toolbar>
      <div
        className="overflow-auto style-1 bottom-height items-center flex flex-col p-4"
        style={{ padding: theme.spacing(3) }}
      >
        <span className="text-20 font-bold green mb-4">Promotion Image</span>
        <div
          className="border border-green rounded-lg  relative flex flex-col items-center justify-center mb-4 flex-shrink-0"
          style={{ width: 80, height: 80 }}
        >
          {!file ? (
            <div
              className="flex flex-col  bg-green    justify-center rounded-md cursor-pointer outline-none"
              {...getRootProps()}
              style={{ width: 60, height: 60 }}
            >
              <input className="dropzone-input" {...getInputProps()} />
              <div className="flex flex-col justify-center items-center">
                <img src="/upload.svg" style={{ width: 30, height: 30 }} />
              </div>
              <div className="text-12">Upload</div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center  bg-green   rounded-md  outline-none p-2"
              style={{ width: 50, height: 50 }}
            >
              <FaWindowClose
                className="green w-2  top-0 left-2 cursor-pointer absolute"
                onClick={() => setFile(undefined)}
              />

              <img src={file?.img} className="max-w-full max-h-44" />
            </div>
          )}
        </div>
        {fileError && (
          <span className="text-red-600">
            You must select an image for the promotion
          </span>
        )}
        <span className="text-20 font-bold green mb-4 my-4">
          Promotion Information
        </span>
        <div className="lg:w-2/3 xl:w-1/2  w-full ml-auto mr-auto flex flex-col border border-green rounded-lg p-12">
          <form>
            <div className=" flex flex-row justify-start">
              <div className="flex flex-col w-full pr-8">
                <label className="  green normal-size mb-1 text-left text-14 font-bold">
                  Promotion Title <span className="text-red-600">*</span>
                </label>
                <input
                  style={{ height: 36 }}
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  add-user-input border-green`}
                  placeholder="Promotion Title"
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    Promotion Title required
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row mt-8">
              <div className="flex flex-col w-1/2 pr-4">
                <label className="  green normal-size mb-2 text-left text-14 font-bold">
                  Product <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="product"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div
                      className="relative"
                      onFocus={() => setFocused(true)}
                      onBlur={(e) => {
                        (e.relatedTarget == null ||
                          e.relatedTarget.id != "multi-select") &&
                          setFocused(false);
                      }}
                    >
                      <input
                        tabIndex={1}
                        value={search}
                        className={`w-full border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green  add-user-input`}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          let cat = categories.find(
                            (c) =>
                              c.name.toLowerCase() ==
                              event.target.value.toLowerCase()
                          );
                          if (!!cat) {
                            field.onChange(cat.id);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                      {focused && (
                        <div
                          tabIndex={2}
                          id="multi-select"
                          className="absolute bg-green flex flex-col justify-start  top-12 w-full rounded-md"
                        >
                          {categories.map((cat, indx) => (
                            <div
                              onClick={(e) => {
                                field.onChange(cat.id);
                                setSearch(cat.name);
                                setFocused(false);
                              }}
                              className={`text-left p-2 cursor-pointer hover:bg-white ${
                                indx == 0 ? "rounded-t-md" : ""
                              }`}
                            >
                              {cat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.product && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Product
                  </span>
                )}
              </div>
              <div className=" flex flex-col items-start relative w-1/2 pl-4">
                <label className="font-bold green text-14">
                  Discount <span className="text-red-600">*</span>
                </label>

                <div className="relative w-full">
                  <span className="absolute green top-4 left-2 text-12">
                    Discount
                  </span>
                  <input
                    type="number"
                    style={{ height: 36 }}
                    className={`pl-24 text-12  border-solid text-white bg-main border rounded-md p-2 text-sm outline-none  add-user-input border-green w-full mt-2`}
                    {...register("discount", {
                      required: true,
                    })}
                  />
                  <span
                    style={{ width: 50, height: 36 }}
                    className="absolute bg-green right-0 rounded-r-lg top-2  text-12 flex flex-col items-center justify-center"
                  >
                    %
                  </span>
                </div>
                {errors.discount && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    discount is required
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col items-start">
              <label className="font-bold mt-4 green  text-14">
                Promotion Description
              </label>
              <textarea
                rows={10}
                className="descrip-prod w-full border-green border rounded-md outline-none p-4 bg-main mt-2 green resize-none"
                placeholder="Type your description..."
                {...register("description", {
                  required: false,
                })}
              />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-16 mt-4 mb-2 green ">Status</div>
              <div className="flex flex-row justify-center">
                <div className="green mr-4">
                  <input
                    type="radio"
                    className="bg-main radio-active"
                    onChange={() => setStatus("active")}
                    checked={status == "active"}
                  />{" "}
                  Active
                </div>
                <div className="orage">
                  <input
                    type="radio"
                    onChange={() => setStatus("inactive")}
                    className="bg-main radio-inactive"
                    checked={status == "inactive"}
                  />{" "}
                  Inactive
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
