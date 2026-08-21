import { Route, Routes } from "react-router";
import { Header } from "../../components/header";
import { Products } from "./products/products";
import { AddProuct } from "./products/add-product";
import { Roles } from "./roles/roles";
import { useAuth } from "../../providers/auth";
import { Main } from "./main";
import { Users } from "./users/users";
import { AddUser } from "./users/add-user";
import { ViewProduct } from "./products/view-product";
import { Categories } from "./products/categories";
import { AddCategory } from "./products/add-category";
import { Promotions } from "./products/promotions";
import { AddPromotion } from "./products/add-promotion";
import { Transactions } from "./transactions/transaction";
import { CreateTransaction } from "./transactions/create-transaction";
import { TransactionRefunds } from "./transactions/transaction-refunds";
import { AddWarehouse } from "./warehouse/add-warehouse";
import { AddVendor } from "./vendors/add-vendor";
import { Vendors } from "./vendors/vendors";
import { Warehouses } from "./warehouse/warehouses";
import { AddManager } from "./warehouse/add-manager";
import { Managers } from "./warehouse/managers";

export const Dashboard = () => {
  const { hasPermissions } = useAuth();
  return (
    <Header>
      <Routes>
        <Route path="" element={<Main />} />
        {hasPermissions({ action: "read", resource: "role" }) && (
          <Route path="manage/roles" element={<Roles />} />
        )}

        {hasPermissions({ action: "read", resource: "user" }) && (
          <Route path="manage/users" element={<Users />} />
        )}
        {hasPermissions({ action: "read", resource: "user" }) && (
          <Route path="manage/customers" element={<Users />} />
        )}
        {hasPermissions({ action: "create", resource: "user" }) && (
          <Route path="manage/users/add" element={<AddUser />} />
        )}
        {hasPermissions({ action: "create", resource: "user" }) && (
          <Route path="manage/customers/add" element={<AddUser />} />
        )}

        {hasPermissions({ action: "edit", resource: "user" }) && (
          <Route path="manage/users/edit/:id" element={<AddUser />} />
        )}
        {hasPermissions({ action: "edit", resource: "user" }) && (
          <Route path="manage/customers/edit/:id" element={<AddUser />} />
        )}
        {hasPermissions({ action: "read", resource: "product" }) && (
          <Route path="products/products" element={<Products />} />
        )}
        {hasPermissions({ action: "read", resource: "transaction" }) && (
          <Route path="transactions/all" element={<Transactions />} />
        )}
        {hasPermissions({ action: "create", resource: "transaction" }) && (
          <Route path="transactions/create" element={<CreateTransaction />} />
        )}
        {hasPermissions({
          action: "refund_confirming",
          resource: "transaction",
        }) && (
          <Route path="transactions/refunds" element={<TransactionRefunds />} />
        )}
        {hasPermissions({ action: "read", resource: "product" }) && (
          <Route path="products/categories" element={<Categories />} />
        )}
        {hasPermissions({ action: "read", resource: "promotion" }) && (
          <Route path="products/promotions" element={<Promotions />} />
        )}
        {hasPermissions({ action: "create", resource: "product" }) && (
          <Route path="products/products/add" element={<AddProuct />} />
        )}
        {hasPermissions({ action: "create", resource: "promotion" }) && (
          <Route path="products/promotions/add" element={<AddPromotion />} />
        )}
        {hasPermissions({ action: "update", resource: "promotion" }) && (
          <Route
            path="products/promotions/edit/:id"
            element={<AddPromotion />}
          />
        )}
        {hasPermissions({ action: "create", resource: "product" }) && (
          <Route path="products/categories/add" element={<AddCategory />} />
        )}
        {hasPermissions({ action: "create", resource: "product" }) && (
          <Route path="products/products/view/:id" element={<ViewProduct />} />
        )}
        {hasPermissions({ action: "update", resource: "product" }) && (
          <Route path="products/products/edit/:id" element={<AddProuct />} />
        )}
        {hasPermissions({ action: "update", resource: "product" }) && (
          <Route
            path="products/categories/edit/:id"
            element={<AddCategory />}
          />
        )}
        {hasPermissions({ action: "create", resource: "warehouse" }) && (
          <Route path="manage/warehouses/add" element={<AddWarehouse />} />
        )}
        {hasPermissions({ action: "create", resource: "vendor" }) && (
          <Route path="manage/vendors/add" element={<AddVendor />} />
        )}
        {hasPermissions({ action: "edit", resource: "warehouse" }) && (
          <Route path="manage/warehouses/edit/:id" element={<AddWarehouse />} />
        )}
        {hasPermissions({ action: "edit", resource: "vendor" }) && (
          <Route path="manage/vendors/edit/:id" element={<AddVendor />} />
        )}
        {hasPermissions({ action: "read", resource: "vendor" }) && (
          <Route path="manage/vendors" element={<Vendors />} />
        )}
        {hasPermissions({ action: "read", resource: "warehouse" }) && (
          <Route path="manage/warehouses" element={<Warehouses />} />
        )}
        {hasPermissions({ action: "create", resource: "manager" }) && (
          <Route path="manage/managers/add" element={<AddManager />} />
        )}
         {hasPermissions({ action: "edit", resource: "manager" }) && (
          <Route path="manage/managers/edit/:id" element={<AddManager />} />
        )}
        {hasPermissions({ action: "read", resource: "manager" }) && (
          <Route path="manage/managers" element={<Managers />} />
        )}
      </Routes>
    </Header>
  );
};
