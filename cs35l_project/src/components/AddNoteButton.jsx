import React, { useState } from "react";
import "./AddNoteButton.css";

const API_BASE = "http://localhost:3000";

export default function AddNoteButton({ onNoteCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveNote() {
    if (!text.trim()) return setError("Note text cannot be empty");

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, text }),
      });

      const data = await res.json();
      onNoteCreated && onNoteCreated(data);

      setTitle("");
      setText("");
      setOpen(false);
    } catch {
      setError("Failed to save note");
    }
    setSaving(false);
  }

  return (
    <>
      <button className="add-note-btn" onClick={() => setOpen(true)}>+</button>

      {open && (
        <div className="modal">
          <input
            placeholder="Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your note..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          {error && <p className="err">{error}</p>}

          <button disabled={saving} onClick={saveNote}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}
