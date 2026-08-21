import { Breadcrumbs, Toolbar, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AppInput, inputClassName } from "../../../components/common/appInput";
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
import { FaCross, FaWindowClose } from "react-icons/fa";
import { Button } from "../../../components/common/button";

export const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<{ file: any; img: any }>();
  const theme = useTheme();
  const { showDialog } = useDialog();
  const { token, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
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
      type: "",
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
          description: "",
          status: status,
          parent: { id: data.type },
          level: data.type ? "sub_category" : "category",
          imageUrl: product.imageUrl,
          unit: "n/a"
        },
        token || ""
      )
        .then((res) => {
          if (file?.file) {
            post(`admin/products/image/${product.id}`, formData, token ?? "")
              .then((res) => navigate("/products/categories"))
              .catch((error) => navigate("/products/categories"));
          } else {
            navigate("/products/categories");
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
        description: "",
        status,
        parent: { id: data.type },
        level: data.type ? "sub_category" : "category",
        unit: "n/a"
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
            .then((res) => navigate("/products/categories"))
            .catch((error) => navigate("/products/categories"));
        } else {
          navigate("/products/categories");
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
      reset({
        name: product.name,
        type: product.parent?.id || "",
      });
      setFile({ img: product.imageUrl, file: undefined });
      setStatus(product.status);
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
              Categories
            </span>
            <span className="green cursor-pointer">
              {" "}
              {!product ? "Add" : "Edit"} Category
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
        <span className="text-20 font-bold green mb-4">Category Image</span>
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
          Category Information
        </span>
        <div className="lg:w-2/3 xl:w-1/2  w-full ml-auto mr-auto flex flex-col border border-green rounded-lg p-12">
          <form>
            <div className=" flex flex-row justify-between">
              <div className="flex flex-col w-1/2 pr-8">
                <label className="  green normal-size mb-1 text-left text-14 font-bold">
                  Category Name <span className="text-red-600">*</span>
                </label>
                <input
                  style={{ height: 36 }}
                  className={`border-solid green bg-main border rounded-md p-2 text-sm outline-none  add-user-input border-green`}
                  placeholder="Category Name"
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    Category Name required
                  </span>
                )}
              </div>
              <div className="flex flex-col w-1/2 pr-8">
                <label className="  green normal-size mb-1 text-left text-14 font-bold">
                  Category Type
                </label>
                <Controller
                  control={control}
                  name="type"
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
                      <option value="">Category Type</option>
                      {categories.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center mt-6">
              <div className="font-bold text-16  mb-2 green ">Status</div>
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
