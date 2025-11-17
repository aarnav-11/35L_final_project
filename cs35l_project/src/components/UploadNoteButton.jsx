
import React, {useState, useRef} from "react";
import "./UploadNoteButton";

function UploadNoteButton({ onUploadNote }){
    const [selectedFile, setSelected] = useState(null);
    const fileInputRef = useRef(null);
   
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUploadClick = (event) => {
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);;
          return;
      }
      else{
        alert('Please select a file');
      }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current.click(); // Programmatically click the hidden input
    };

    return(
        <div className="uploadnote-wrapper">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <button onClick={triggerFileInput}>
                Upload File
            </button>
            {/* {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            <button onClick={handleUploadClick} disabled={!selectedFile}>
                Upload File
            </button> */}
        </div>
    );
}

export default UploadNoteButton;