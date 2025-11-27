
import "./Tag.css";

export default function Tag({ tagValue }){

    return(
        <div className="tag-body">
            <h3 className="tag-value">{tagValue}</h3>
        </div>
    );
}