
import "./404page.css";
import mindBlown from "../assets/mind_blown.avif"
import Tag from "../components/Tag";
import Background from "../components/Background";

function ErrorPage(){
    return(
        <div className="errorPage">
            <Background />
            <h1>404 page not found</h1>
            <p2>Our mind went blank :(</p2>
            <b></b>
            <img src={ mindBlown } height={250}></img>
        </div>
    )
}

export default ErrorPage;