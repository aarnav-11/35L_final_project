import React from "react";

const NoteCard = ({ note }) => {
  return (
    <div className="note-card">
      <h3>{note.name}</h3>
      <p>Uploaded: {note.uploadedAt}</p>
    </div>
  );
};

export default NoteCard;
