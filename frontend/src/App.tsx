import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
// import UserDashboard from "./pages/user/UserDashboard";
import { RequireAuth } from "./auth/RequireAuth";
import { RequireRole } from "./auth/RequireRole";
import PersistLogin from "./auth/PersistLogin";
import PublicRoute from "./auth/PublicRoute";
import UnAuthorized from "./pages/common/UnAuthorized";
import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import DeliveryBoy from "./pages/deliveryBoy/DeliveryBoy";
import ForgotPassword from "./pages/auth/ForgottonPassword";
import { UserLayout } from "./pages/user/UserLayout";
import OwnerLayout from "./pages/owner/OwnerLayout";
import CreateRestaurant from "./pages/owner/CreateRestaurent";
import EditRestaurant from "./pages/owner/EditRestaurent";
import ShopDetails from "./components/owner/ShopDetails";
import AddItem from "./pages/owner/AddItem";
import EditItem from "./pages/owner/EditItem";
import OrderSuccess from "./components/user/checkout/OrderSuccess";
import MyOrders from "./components/user/account/MyOrders";
import Account from "./pages/user/Account";
// import MyOrders from "./pages/user/MyOrders";

const App = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route element={<PersistLogin />}>
        <Route element={<UserLayout />}>
          {/* <Route element={<RequireRole allowedRoles={["user"]} />}> */}

          <Route path="/" element={<UserDashboard />} />
          {/* </Route> */}
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/unauthorized" element={<UnAuthorized />} />

        {/* protected routes */}

        <Route element={<RequireAuth />}>
          {/* user routes */}

          {/* Protected user pages */}
          <Route element={<UserLayout />}>
             <Route path="/orderSuccess" element={<OrderSuccess />} />

             <Route path="/account" element={<Account />} />
          </Route>

          <Route element={<OwnerLayout />}>
            {/* owner route */}
            <Route element={<RequireRole allowedRoles={["owner"]} />}>
              <Route path="/owner" element={<OwnerDashboard />} />

              <Route path="/owner/shop/create" element={<CreateRestaurant />} />
              <Route
                path="/owner/shop/edit/:shopId"
                element={<EditRestaurant />}
              />

              <Route path="/owner/shop/:shopId" element={<ShopDetails />} />
              <Route
                path="/owner/shop/:shopId/Item/add"
                element={<AddItem />}
              />

              <Route
                path="owner/shop/:shopId/item/edit/:itemId"
                element={<EditItem />}
              />
            </Route>
          </Route>

          {/* delivery boy route */}

          <Route element={<RequireRole allowedRoles={["deliveryBoy"]} />}>
            <Route path="/delivery" element={<DeliveryBoy />} />
          </Route>
        </Route>

        {/* 404 Page */}
        {/* <Route path="*" element={<Missing />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
