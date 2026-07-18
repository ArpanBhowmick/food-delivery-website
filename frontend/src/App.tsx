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
          {/* <Route element={<UserLayout />}>

            <Route element={<RequireRole allowedRoles={["user"]} />}>
              <Route path="/" element={<UserDashboard />} />
            </Route>

          </Route> */}

          {/* owner route */}
          <Route element={<RequireRole allowedRoles={["owner"]} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
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
