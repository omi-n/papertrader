import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in, log_out } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";

function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        log_out();
        navigate("/");
    }, []);

    return(
        <>
        <div>Logging out....</div>
        </>
    );
};

export default Logout;