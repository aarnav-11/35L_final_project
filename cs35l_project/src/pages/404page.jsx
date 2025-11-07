
import "./404page.css";
import mindBlown from "../assets/mind_blown.avif"


function ErrorPage(){
    return(
        <div className="errorPage">
            <h1>404 page not found</h1>
            <p2>Our mind went blank :(</p2>
            <b></b>
            <img src={ mindBlown } height={250}></img>
        </div>
    )
}

export default ErrorPage;