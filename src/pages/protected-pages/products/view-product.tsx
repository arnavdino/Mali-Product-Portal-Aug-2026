import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ActionButton, Product } from "./products";
import { useAuth } from "../../../providers/auth";
import { get } from "../../../util/generalActions";
import { Breadcrumbs, Toolbar } from "@mui/material";

export const ViewProduct: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const { token, profile, hasPermissions } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && profile) {
      get<{ data: { product: Product } }>(`/products/${id}`, token).then(
        (res) => setProduct(res.data.product)
      );
    }
    //get product.
  }, [token, profile]);
  return (
    <div className="relative" style={{ marginTop: 78 }}>
      {" "}
      <Toolbar
        style={{ height: 80 }}
        className="bg-main border-b-4 border-green"
      >
        <div className="flex flex-row justify-between green w-full">
          <div className="flex flex-row justify-between green w-full">
            <Breadcrumbs aria-label="breadcrumb" className="green">
              <span
                color="inherit"
                className="green hover:underline cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Products
              </span>
              <span className="green cursor-pointer"> Product Details</span>
            </Breadcrumbs>
          </div>
          {hasPermissions({ action: "create", resource: "product" }) && (
            <ActionButton
              name="EDIT"
              action={() => navigate(`/products/products/edit/${id}`)}
              active={true}
              width={"w-24"}
            />
          )}
        </div>
      </Toolbar>
      <div className="bottom-height p-4">
        <div className="border border-green p-4  rounded-md md:w-1/2 w-full ml-auto mr-auto flex flex-col">
          <div className="text-center green font-bold text-20">
            {product?.name}
          </div>
          <div className="flex flex-row justify-start mt-4">
            <div
              className="p-4 rounded-2xl border border-green flex-shrink-0"
              style={{ width: 150, height: 150 }}
            >
              <div className="bg-green rounded-2xl w-full h-full p-4 flex flex-col justify-center items-center">
                {product?.imageUrl ? (
                  <img src={product?.imageUrl} />
                ) : (
                  <img src="/upload.svg" />
                )}
              </div>
            </div>
            <div className="flex flex-col font-16 ml-4 justify-between green">
              <div className="mb-4 text-left mt-2">{product?.description}</div>
              <div className="mb-4 text-left mt-2">
                {product?.longDescription}
              </div>
              <span className="text-left">${product?.price}</span>
            </div>
          </div>
          <div className="font-20 font-bold mt-4 text-left green ">
            General Info{" "}
          </div>

          <div className="font-20 font-bold mt-4 text-left green pl-4 grid grid-cols-8 w-80 ">
            <span className="col-span-4">Category</span><div className="col-span-4 text-left">{product?.parent?.name}</div>
          </div>
          <div className="font-20 font-bold mt-4 text-left green pl-4 grid grid-cols-8 w-80">
          <span className="col-span-4">Status</span><div className="col-span-4 text-left">{product?.status}</div>
          </div>
          <div className="font-20 font-bold mt-4 text-left green pl-4 grid grid-cols-8 w-80">
          <span className="col-span-4">Featured</span><div className="col-span-4 text-left">{product?.presentation == "featured"?"Yes":"No"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
