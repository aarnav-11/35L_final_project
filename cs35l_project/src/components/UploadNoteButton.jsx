
import React, {useState, useRef} from "react";
import "./UploadNoteButton.css";
import './AddNoteButton.jsx'

function UploadNoteButton({ onUploadNote }){
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleUploadClick = (event) => {
        if (selectedFile) {
          console.log('Uploading file:', selectedFile.name);;
            return;
        }
        else{
          alert('Please select a file');
        }
      };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        onUploadNote(file);
        handleUploadClick;
    };

    
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return(
        <div className="uploadnote-wrapper">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <button className="uploadnote" onClick={triggerFileInput}>
                Upload File
            </button>
        </div>
    );
}

export default UploadNoteButton;