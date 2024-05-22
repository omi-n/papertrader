import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Logout from './pages/Logout.jsx'
import Ticker from './pages/Ticker.jsx'
import Buy from './pages/Buy.jsx'
import Sell from './pages/Sell.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./pages/ErrorPage.jsx";
import TickerDetails from './pages/TickerDetails.jsx'
import Support from './pages/Support.jsx'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Sign Up",
        element: <Register />,
      },
      {
        path: "Home",
        element: <Home />,
      },
      {
        path: "Profile",
        element: <Profile />,
      },
      {
        path: "Portfolio",
        element: <Portfolio />,
      },
      {
        path: "Ticker",
        element: <Ticker />,
      },
      {
        path:"/tickerdetails/:tickerSymbol",
        element: <TickerDetails />,
      },
      {
        path:"/buy/:tickerSymbol",
        element: <Buy />,
      },
      {
        path:"/sell/:tickerSymbol",
        element: <Sell />,
      },
      {
        path: "Support",
        element: <Support />,
      },
      {
        path: "Log Out",
        element: <Logout />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
