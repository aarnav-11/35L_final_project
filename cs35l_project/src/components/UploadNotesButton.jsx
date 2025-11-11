import React, { useState } from "react";

const UploadNotesButton = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // replace with your backend route later
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const newNote = await res.json();
      onUpload(newNote);

      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-notes-container">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        id="file-upload"
        style={{ display: "none" }}
      />
      <label htmlFor="file-upload" className="upload-label">
        Choose PDF
      </label>
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {file && <p className="file-name">Selected: {file.name}</p>}
    </div>
  );
};

export default UploadNotesButton;
