
import "./Note.css";
import RemoveNoteButton from "./RemoveNoteButton";
import Tag from "./Tag";
import React from 'react';

function Note({ note, onRemoveNote }){
    // Parse text and convert both Markdown and HTML links to React elements
    const renderText = (text) => {
        if (!text) return '';
        
        const parts = [];
        let lastIndex = 0;
        let key = 0;
        
        // First, try to match HTML anchor tags: <a href="url">text</a>
        const htmlLinkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
        htmlLinkRegex.lastIndex = 0;
        let htmlMatch;
        
        // Then, try to match Markdown links: [text](url)
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        markdownLinkRegex.lastIndex = 0;
        let markdownMatch;
        
        // Collect all matches with their positions
        const matches = [];
        
        // Find HTML links
        while ((htmlMatch = htmlLinkRegex.exec(text)) !== null) {
            matches.push({
                index: htmlMatch.index,
                length: htmlMatch[0].length,
                href: htmlMatch[1],
                text: htmlMatch[2],
                type: 'html'
            });
        }
        
        // Find Markdown links
        while ((markdownMatch = markdownLinkRegex.exec(text)) !== null) {
            matches.push({
                index: markdownMatch.index,
                length: markdownMatch[0].length,
                href: markdownMatch[2],
                text: markdownMatch[1],
                type: 'markdown'
            });
        }
        
        // Sort matches by position
        matches.sort((a, b) => a.index - b.index);
        
        // Process matches in order
        matches.forEach((match) => {
            // Add text before the link
            if (match.index > lastIndex) {
                const beforeText = text.substring(lastIndex, match.index);
                const lines = beforeText.split('\n');
                lines.forEach((line, i) => {
                    if (i > 0) parts.push(<br key={`br-${key++}`} />);
                    if (line) parts.push(line);
                });
            }
            
            // Add the link as a React element
            parts.push(
                <a 
                    key={`link-${key++}`} 
                    href={match.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                    {match.text}
                </a>
            );
            
            lastIndex = match.index + match.length;
        });
        
        // Add remaining text after the last link
        if (lastIndex < text.length) {
            const afterText = text.substring(lastIndex);
            const lines = afterText.split('\n');
            lines.forEach((line, i) => {
                if (i > 0) parts.push(<br key={`br-${key++}`} />);
                if (line) parts.push(line);
            });
        }
        
        // If no links were found, return the original text (with newlines converted)
        if (parts.length === 0) {
            const lines = text.split('\n');
            return lines.map((line, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                </React.Fragment>
            ));
        }
        
        return parts;
    };
    // Safely get tags - ensure it's an array
    const tags = Array.isArray(note.tags) ? note.tags : [];
    
    return(
        <div className="note-card">
            <div className="note-header">
                <RemoveNoteButton onRemoveNote={onRemoveNote} />
                <h1>
                    {note.text && (note.text.startsWith("http://") || note.text.startsWith("https://"))
                    ? note.title.replace(/\.[^/.]+$/, "")
                    : note.title || "Untitled Thought"}
                </h1>

            </div>
            {/* if note is uploaded file show link, otherwise show text */}
            {note.text && (note.text.startsWith("http://") || note.text.startsWith("https://")) ? (
                // <a 
                //     href={note.text} 
                //     target="_blank" 
                //     rel="noopener noreferrer"
                //     style={{ color: "blue", textDecoration: "underline" }}
                // >
                //     Open Uploaded File
                // </a>
                <a href={note.text} target="_blank" rel="noopener noreferrer">
                    Click to Open
                </a>
            ) : (
                <p className="note-text">{renderText(note.text)}</p>
            )}
            {tags.length > 0 && (
                <div className="note-tags">
                    {tags.map((tag, index) => (
                        <Tag key={index} tagValue={tag} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Note;