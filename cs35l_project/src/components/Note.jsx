import React from "react";
import "./Note.css";
import RemoveNoteButton from "./RemoveNoteButton";

function Note({ note, onRemoveNote }) {
  // Render text with support for Markdown + HTML links
  const renderText = (text) => {
    if (!text) return "";

    const parts = [];
    let lastIndex = 0;
    let key = 0;

    const htmlLinkRegex =
      /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    const matches = [];

    // HTML links
    let m;
    htmlLinkRegex.lastIndex = 0;
    while ((m = htmlLinkRegex.exec(text)) !== null) {
      matches.push({
        index: m.index,
        length: m[0].length,
        href: m[1],
        text: m[2],
      });
    }

    // Markdown links
    markdownLinkRegex.lastIndex = 0;
    while ((m = markdownLinkRegex.exec(text)) !== null) {
      matches.push({
        index: m.index,
        length: m[0].length,
        href: m[2],
        text: m[1],
      });
    }

    matches.sort((a, b) => a.index - b.index);

    matches.forEach((match) => {
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        const lines = beforeText.split("\n");
        lines.forEach((line, i) => {
          if (i > 0) parts.push(<br key={`br-${key++}`} />);
          if (line) parts.push(line);
        });
      }

      parts.push(
        <a
          key={`link-${key++}`}
          href={match.href}
          target="_blank"
          rel="noopener noreferrer"
          className="note-link"
        >
          {match.text}
        </a>
      );

      lastIndex = match.index + match.length;
    });

    if (lastIndex < text.length) {
      const afterText = text.substring(lastIndex);
      const lines = afterText.split("\n");
      lines.forEach((line, i) => {
        if (i > 0) parts.push(<br key={`br-${key++}`} />);
        if (line) parts.push(line);
      });
    }

    if (parts.length === 0) {
      const lines = text.split("\n");
      return lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    }

    return parts;
  };

  // -------- TAG NORMALIZATION (single, deduped row) ----------
  let rawTags = [];
  if (Array.isArray(note.tags)) {
    rawTags = note.tags;
  } else if (typeof note.tags === "string") {
    try {
      rawTags = JSON.parse(note.tags);
    } catch {
      rawTags = note.tags.split(",").map((t) => t.trim());
    }
  }

  const uniqueTags = [
    ...new Set(
      rawTags
        .map((t) => (t || "").toString().trim())
        .filter(Boolean)
    ),
  ];

  const isFileLink =
    note.text &&
    (note.text.startsWith("http://") || note.text.startsWith("https://"));

  return (
    <div className="note-card">
      <div className="note-header">
        <h1 className="note-title">
          {note.title && note.title.trim()
            ? note.title
            : "Untitled Thought"}
        </h1>
        <RemoveNoteButton onRemoveNote={onRemoveNote} />
      </div>

      <div className="note-body">
        {isFileLink ? (
          <a
            href={note.text}
            target="_blank"
            rel="noopener noreferrer"
            className="note-link main-link"
          >
            Click to Open
          </a>
        ) : (
          <p className="note-text">{renderText(note.text)}</p>
        )}

        {uniqueTags.length > 0 && (
          <div className="note-tags">
            {uniqueTags.map((tag, i) => (
              <span key={i} className="note-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Note;
