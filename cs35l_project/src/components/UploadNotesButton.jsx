import React, { useState } from "react";

const UploadNotesButton = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);

    // simulate upload delay
    setTimeout(() => {
      const placeholderNote = {
        id: Date.now(),
        title: "Uploaded Note Placeholder",
        text: "This is a placeholder note for testing.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onUpload(placeholderNote); // add note to grid
      setUploading(false);
      alert("Upload simulated! Placeholder note added.");
    }, 500); // half-second delay to simulate upload
  };

  return (
    <div className="upload-notes-container">
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadNotesButton;
