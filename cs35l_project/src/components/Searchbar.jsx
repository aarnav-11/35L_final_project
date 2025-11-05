
import "./Searchbar.css";
import React, { useState } from "react";
import {FaSearch} from "react-icons/fa";

function Searchbar({ value, onChange }) {
    return(
        <>
            <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  placeholder="Search your mind"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </>
    );
}

export default Searchbar;