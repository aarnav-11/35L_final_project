
//make a logout button
//when clicked, it should logout the user

import React, {useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import "./LogoutButton.css";

function LogoutButton(){
    const {logout, loading} = useContext(AuthContext);
    return(
        <button className="logout-button" onClick={logout} disabled={loading}>Logout</button>
    );
}

export default LogoutButton;