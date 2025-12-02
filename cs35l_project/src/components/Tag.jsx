
import "./Tag.css";

export default function Tag({ tagValue }){

    return(
        <div className="tag-body">
            <p className="tag-value">{tagValue}</p>
        </div>
    );
}