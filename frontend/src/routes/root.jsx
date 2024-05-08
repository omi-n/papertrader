import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { is_logged_in, log_out } from "../../../glue/auth_utils";

export default function Root() {
  const location = useLocation();
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const loginStatus = async () =>{
        try{
          const value = await is_logged_in();
          setAuth(value);
        }
        catch(error){
          console.error("Error getting logged in:", error);
        }
      }
      loginStatus()
  }, [location]);

    console.log("Root Auth:", auth);
    return (
      <>
        <div id="sidebar">
          <h1>PaperTrader</h1>
          <div>
            <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </form>
            <form method="post">
              <button type="submit">New</button>
            </form>
          </div>
          <nav>
          {!auth ? 
          (
            <ul>
              <li>
                <a href={`/Home/`}>Home</a>
              </li>
              <li>
                <a href={`/Sign Up/`}>Sign Up</a>
              </li>
              <li>
                <a href={`/Login/`}>Login</a>
              </li>
            </ul>) :
          (
            <ul>
            <li>
              <a href={`/Home/`}>Home</a>
            </li>
            <li>
              <a href={`/Profile/`}>Profile</a>
            </li>
            <li>
              <a href={`/Portfolio/`}>Portfolio</a>
            </li>
            <li>
              <a href={`/Ticker/`}>Tickers</a>
            </li>
            <li>
            <a href={`/Log Out/`}>Log Out</a>
            </li>
          </ul>
          ) }
          </nav>
        </div>
        <div id="detail">
            <Outlet />
        </div>
      </>
    );
  }