import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Background from "../components/Background";
import "./Spaces.css";

const API_BASE_URL = "http://localhost:3000";

function Spaces() {
  const [spaces, setSpaces] = useState([]); // [{ tag, notes: [...] }]
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state for creating a new note
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);

  // ---- helper that fetches notes and builds spaces ----
  const loadSpacesFromNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/notes`, {
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to load notes");
      }

      const notes = await res.json(); // backend already gives tags array

      // group notes by tag
      const map = new Map(); // tag -> [notes]

      notes.forEach((note) => {
        const tags = Array.isArray(note.tags) ? note.tags : [];

        if (tags.length === 0) {
          const key = "Untagged";
          if (!map.has(key)) map.set(key, []);
          map.get(key).push(note);
        } else {
          tags.forEach((rawTag) => {
            const key = (rawTag || "").trim() || "Untagged";
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(note);
          });
        }
      });

      const spacesArray = Array.from(map.entries()).map(([tag, notes]) => ({
        tag,
        notes,
      }));

      setSpaces(spacesArray);

      // if nothing selected yet, select first space (if any)
      if (!selectedTag && spacesArray.length > 0) {
        setSelectedTag(spacesArray[0].tag);
      }
    } catch (err) {
      console.error("Error loading spaces:", err);
      setError(err.message || "Failed to load spaces");
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    loadSpacesFromNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- create new note from Spaces ----
  const handleSaveNewNote = async () => {
    if (!newText.trim()) return; // don't allow empty note

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle.trim() || "Untitled Thought",
          text: newText.trim(),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create note");
      }

      // reload spaces so new note + tags show up
      await loadSpacesFromNotes();

      // reset modal
      setNewTitle("");
      setNewText("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating note:", err);
      setError(err.message || "Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  // notes for the currently selected space
  const selectedSpace = spaces.find((s) => s.tag === selectedTag) || null;

  return (
    <div className="spaces-page">
      <Background
        colors={[
          "#9BF267",
          "#C6FF8A",
          "#7AF2FF",
          "#4BC8FF",
          "#5570FF",
          "#A56BFF",
          "#FF76D6",
          "#FFB470",
        ]}
        rotation={30}
        speed={0.3}
        scale={1.2}
        frequency={1.4}
        warpStrength={1.2}
        mouseInfluence={0.8}
        parallax={0.6}
        noise={0.08}
        transparent
      />

      <Navigation />

      <div className="spaces-main">
        <h1 className="spaces-title">Spaces</h1>
        <p className="spaces-subtitle">
          Spaces group your notes by AI-generated tags.
        </p>
        <hr className="spaces-divider" />

        {error && <div className="spaces-error">{error}</div>}

        <div className="spaces-layout">
          {/* LEFT: list of spaces */}
          <div className="spaces-list-card">
            <h2 className="spaces-card-title">All Spaces</h2>
            {loading ? (
              <p className="spaces-muted">Loading…</p>
            ) : spaces.length === 0 ? (
              <p className="spaces-muted">
                No spaces yet. Create notes and let AI tagging generate them.
              </p>
            ) : (
              <ul className="spaces-list">
                {spaces.map((space) => (
                  <li
                    key={space.tag}
                    className={
                      "spaces-list-item" +
                      (space.tag === selectedTag ? " spaces-list-item--active" : "")
                    }
                    onClick={() => setSelectedTag(space.tag)}
                  >
                    <span className="spaces-list-tag">{space.tag}</span>
                    <span className="spaces-list-count">
                      {space.notes.length} note
                      {space.notes.length !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RIGHT: notes in selected space */}
          <div className="spaces-notes-card">
            {selectedSpace ? (
              <>
                <h2 className="spaces-card-title">{selectedSpace.tag}</h2>
                {selectedSpace.notes.length === 0 ? (
                  <p className="spaces-muted">
                    No notes with this tag yet. Try creating a new one.
                  </p>
                ) : (
                  <ul className="spaces-notes-list">
                    {selectedSpace.notes.map((note) => (
                      <li key={note.id} className="spaces-note">
                        <h3 className="spaces-note-title">
                          {note.title || "Untitled Thought"}
                        </h3>
                        <p className="spaces-note-text">{note.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="spaces-muted">
                Select a space on the left to see its notes.
              </p>
            )}
          </div>

          {/* PLUS BUTTON: opens modal to add a note */}
          <button
            type="button"
            className="spaces-add-button"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        </div>
      </div>

      {/* MODAL FOR NEW NOTE */}
      {isModalOpen && (
        <div className="spaces-modal-backdrop">
          <div className="spaces-modal">
            <input
              className="spaces-modal-title"
              placeholder="Add a title…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className="spaces-modal-textarea"
              placeholder="Add a new note…"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <div className="spaces-modal-actions">
              <button
                type="button"
                className="spaces-modal-cancel"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewTitle("");
                  setNewText("");
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="spaces-modal-save"
                onClick={handleSaveNewNote}
                disabled={saving || !newText.trim()}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Spaces;