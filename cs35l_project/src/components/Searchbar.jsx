
import "./Searchbar.css";
import React, { useState } from "react";
import {FaSearch} from "react-icons/fa";

function Searchbar(){
    const [input, setInput] = useState("");
    
    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json()) // call the function here
        .then((json) => {
          const results = json.filter((user)=> {
            return value && user && user.name && user.name.toLowerCase().includes(value);
          })
          console.log(results)
        });
    }
    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    }

    return(
        <>
            <div className="input-wrapper">
                <FaSearch id = "search-icon"/>
                <input placeholder="Search your mind" value = {input} onChange={(e)=> handleChange(e.target.value)}></input>
            </div>
            
        </>
    );
}

export default Searchbar;