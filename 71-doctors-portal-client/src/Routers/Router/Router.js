import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Main from "../../Layout/Main";
import Appointment from "../../Pages/Appointment/Appointment/Appoinment";
import Login from "../../Pages/Authentication/Login/Login";
import Signup from "../../Pages/Authentication/Signup/Signup";
import AddADoctor from "../../Pages/DashBoard/AddADoctor/AddADoctor";
import AllUsers from "../../Pages/DashBoard/AllUsers/AllUsers";
import ManageDoctors from "../../Pages/DashBoard/ManageDoctors/ManageDoctors";
import MyAppointment from "../../Pages/DashBoard/MyAppointment/MyAppointment";
import Payment from "../../Pages/DashBoard/Payment/Payment";
import Home from "../../Pages/Home/Home/Home";
import DisplayError from "../../Pages/Shared/DisplayError/DisplayError";
import AdminRoute from "../AdminRoute/AdminRoute";
import PrivateRouter from "../PrivateRouter/PrivateRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <DisplayError></DisplayError>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/appointment",
        element: <Appointment></Appointment>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <DisplayError></DisplayError>,
    element: (
      <PrivateRouter>
        <DashboardLayout></DashboardLayout>
      </PrivateRouter>
    ),
    children: [
      {
        path: "/dashboard",
        element: <MyAppointment></MyAppointment>,
      },
      {
        path: "/dashboard/allusers",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/addADoctor",
        element: (
          <AdminRoute>
            <AddADoctor></AddADoctor>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manageDoctors",
        element: (
          <AdminRoute>
            <ManageDoctors></ManageDoctors>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/payment/:id",
        element: (
          <AdminRoute>
            <Payment></Payment>
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:5000/bookings/${params.id}`),
      },
    ],
  },
]);

export default router;