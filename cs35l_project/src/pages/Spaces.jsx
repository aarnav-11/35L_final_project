
import AddNoteButton from "../components/AddNoteButton";
import Navigation from "../components/Navigation";
import "./Spaces.css";
import Background from "../components/Background";
import Tag from "../components/Tag";

function Spaces(){

    return (
        <div className="spaces-container">
            <Background />
            <Navigation/>
            <h1 className="title">Spaces</h1>
            <hr></hr>
            <Tag tagValue="Spaces" />
        </div>
    );
}

export default Spaces;