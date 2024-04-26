import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";

function Profile() {

    return(
        <>
        <div>Profile</div>
        </>
    );
};

export default Profile;