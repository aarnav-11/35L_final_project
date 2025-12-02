
import AddNoteButton from "../components/AddNoteButton";
import Navigation from "../components/Navigation";
import "./Spaces.css";
import Background from "../components/Background";
import Tag from "../components/Tag";

function Spaces(){

    return (
        <div className="spaces-container">
            <Background colors={["#9BF267", "#C6FF8A", "#7AF2FF", "#4BC8FF", "#5570FF", "#A56BFF", "#FF76D6", "#FFB470"]} rotation={30} speed={0.3} scale={1.2} frequency={1.4} warpStrength={1.2} mouseInfluence={0.8} parallax={0.6} noise={0.08} transparent/>
            <Navigation/>
            <h1 className="title">Spaces</h1>
            <hr></hr>
            <Tag tagValue="Spaces" />
        </div>
    );
}

export default Spaces;