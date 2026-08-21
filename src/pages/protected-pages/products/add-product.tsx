import { Breadcrumbs, Toolbar, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { ActionButton, Product } from "./products";
import { useAuth } from "../../../providers/auth";
import {
  get,
  getMessageFromError,
  post,
  put,
} from "../../../util/generalActions";
import { Controller, useForm } from "react-hook-form";
import { useDialog } from "../../../components/common/appDialog";
import { FaWindowClose } from "react-icons/fa";
import { Button } from "../../../components/common/button";
import { UNITS } from "../../../util/config";

export const AddProuct: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<{ file: any; img: any }>();
  const theme = useTheme();
  const { showDialog } = useDialog();
  const { token, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [status, setStatus] = useState("active");
  const [presentation, setPresentation] = useState("none");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subs, setSubs] = useState<{ id: string; name: string }[]>([]);
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
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      rewardRatio: 0,
      unit: UNITS[0],
      category: "",
      long: "",
      sub: "",
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
        `/admin/products/${product.id}`,
        {
          name: data.name,
          description: data.description,
          longDescription: data.long,
          status: status,
          price: data.price,
          rewardRatio: data.rewardRatio,
          unit: data.unit,
          parent: { id: data.sub || data.category },
          imageUrl: product.imageUrl,
          presentation,
          level: "product",
        },
        token || ""
      )
        .then((res) => {
          if (file?.file) {
            post(`admin/products/image/${product.id}`, formData, token ?? "")
              .then((res) => navigate("/products/products"))
              .catch((error) => navigate("/products/products"));
          } else {
            navigate("/products/products");
          }
        })
        .catch((error) => {
          setLoading(false);
          showDialog(
            <div>{getMessageFromError(error)}</div>,

            "Invalid Product",
            false
          );
        });
      return;
    }
    post<{ data: { id: string } }>(
      "/admin/products",
      {
        name: data.name,
        description: data.description,
        longDescription: data.long,
        status,
        price: data.price,
        rewardRatio: data.rewardRatio,
        unit: data.unit,
        parent: { id: data.sub || data.category },
        presentation,
        level: "product",
      },
      token || ""
    )
      .then((res) => {
        if (file?.file) {
          post(
            `admin/products/image/${res.data.data.id}`,
            formData,
            token ?? ""
          )
            .then((res) => navigate("/products/products"))
            .catch((error) => navigate("/products/products"));
        } else {
          navigate("/products/products");
        }
      })
      .catch((error) => {
        setLoading(false);
        showDialog(
          <div>{getMessageFromError(error)}</div>,
          "Invalid Product",
          false
        );
      });
  };

  useEffect(() => {
    if (product) {
      const category = product.parent.parent?.id || product.parent.id;
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        rewardRatio: product.rewardRatio,
        unit: product.unit,
        category: category,
        long: product.longDescription,
        sub: product.parent.id || "",
      });
      setFile({ img: product.imageUrl, file: undefined });
      setStatus(product.status);
      setPresentation(product.presentation);
      get<{ data: { id: string; name: string }[] }>(
        `/admin/products/categories?parentId=${category}`,
        token
      ).then((res) => setSubs(res.data));
    }
  }, [product]);

  useEffect(() => {
    if (token && profile) {
      get<{ data: { id: string; name: string }[] }>(
        "/admin/products/categories",
        token || ""
      ).then((res) => {
        setCategories(res.data);
      });
      if (id) {
        get<{ data: { product: Product } }>(`/products/${id}`, token).then(
          (res) => setProduct(res.data.product)
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
              Products
            </span>
            <span className="green cursor-pointer">
              {" "}
              {!product ? "Add" : "Edit"} Product
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
        <span className="text-20 font-bold green mb-4">Product Image</span>
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
            You must select an image for the product
          </span>
        )}
        <span className="text-20 font-bold green mb-4 my-4">
          Product Information
        </span>
        <div className="lg:w-2/3 xl:w-1/2  w-full ml-auto mr-auto flex flex-col border border-green rounded-lg p-12">
          <form>
            <div className=" flex flex-row justify-start">
              <div className="flex flex-col w-1/2 pr-8">
                <label className="  green normal-size mb-1 text-left text-14 font-bold">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  style={{ height: 36 }}
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  add-user-input border-green`}
                  placeholder="Product Name"
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    Product Name required
                  </span>
                )}
              </div>
              <div className="flex flex-col w-1/2 pl-8">
                <label className="  green normal-size mb-1 text-left text-14 font-bold">
                  Category <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      style={{ height: 36 }}
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green  add-user-input`}
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(event.currentTarget.value);
                        get<{ data: { id: string; name: string }[] }>(
                          `/admin/products/categories?parentId=${event.currentTarget.value}`,
                          token
                        ).then((res) => {
                          setSubs(res.data);
                          setValue("sub", "");
                        });
                      }}
                    >
                      <option value="">Category</option>
                      {categories.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.category && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Category
                  </span>
                )}
              </div>
            </div>
            {subs.length > 0 && (
              <div className="flex flex-col w-1/2  mt-6">
                <label className="  green normal-size mb-1 text-left text-14 font-bold">
                  Sub Category
                </label>
                <Controller
                  control={control}
                  name="sub"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <select
                      style={{ height: 36 }}
                      className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  border-green  add-user-input`}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                    >
                      <option value="">Sub Category</option>
                      {subs.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.category && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Category
                  </span>
                )}
              </div>
            )}
            <div className="mt-6 flex flex-col items-start">
              <label className="font-bold mt-4 green  text-14">
                Short Description
              </label>
              <input
                className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  add-user-input border-green w-full mt-2`}
                placeholder="Type your description..."
                {...register("description", {
                  required: false,
                })}
              />
            </div>
            <div className="mt-6 flex flex-col items-start">
              <label className="font-bold mt-4 green  text-14">
                Product Description
              </label>
              <textarea
                rows={10}
                className="descrip-prod w-full border-green border rounded-md outline-none p-4 bg-main mt-2 green resize-none"
                placeholder="Type your description..."
                {...register("long", {
                  required: false,
                })}
              />
            </div>
            <div className="mt-12 flex flex-row justify-start">
              <div className="flex flex-col w-1/3 pr-8">
                <label className="font-bold green text-14 text-left">
                  Product Price <span className="text-red-600">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    type="number"
                    style={{ height: 36 }}
                    className={`text-12 border-solid text-white bg-main border rounded-md p-2 text-sm outline-none  add-user-input border-green w-full mt-2`}
                    {...register("price", {
                      required: true,
                    })}
                  />
                  <span
                    style={{ width: 50, height: 36 }}
                    className="absolute bg-green right-0 rounded-r-lg top-2  text-12 flex flex-col items-center justify-center"
                  >
                    USD
                  </span>
                </div>
                {errors.price && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    price is required
                  </span>
                )}
              </div>
              <div className="flex flex-col w-1/3 pl-8 pr-8">
                <label className="font-bold green text-14 text-left">
                  Unit <span className="text-red-600">*</span>
                </label>
                <div className="relative w-full">
                  <Controller
                    control={control}
                    name="unit"
                    render={({ field }) => (
                      <select
                        className={`text-12 border-solid text-white bg-main border rounded-md p-2 text-sm outline-none add-user-input border-green w-full mt-2`}
                        onChange={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                        value={field.value}
                      >
                        {UNITS.map(x => {
                          return <option value={x}>{x}</option>;
                        })}
                      </select>
                    )}
                  />
                </div>
                {errors.price && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    unit is required
                  </span>
                )}
              </div>
              <div className="flex flex-col w-1/3 pl-8">
                <label className="font-bold green text-14 text-left">
                  Reward Ratio <span className="text-red-600">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    type="number"
                    style={{ height: 36 }}
                    className={`text-12 border-solid text-white bg-main border rounded-md p-2 text-sm outline-none add-user-input border-green w-full mt-2`}
                    {...register("rewardRatio", {
                      required: true,
                    })}
                  />
                </div>
                {errors.rewardRatio && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    Reward ratio is required
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="flex flex-col mr-8">
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
              <div className="flex flex-col">
                <div className="font-bold text-16 mt-4 mb-2 green ">
                  Featured Product
                </div>
                <div className="flex flex-row justify-center">
                  <div className="green mr-4">
                    <input
                      type="radio"
                      className="bg-main radio-active"
                      onChange={() => setPresentation("featured")}
                      checked={presentation == "featured"}
                    />{" "}
                    Yes
                  </div>
                  <div className="orage">
                    <input
                      type="radio"
                      onChange={() => setPresentation("none")}
                      className="bg-main radio-inactive"
                      checked={presentation == "none"}
                    />{" "}
                    No
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
