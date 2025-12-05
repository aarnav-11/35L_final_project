// src/components/Searchbar.jsx
import "./Searchbar.css";

export default function Searchbar({ value, onChange }) {
  return (
    <div className="search-shell">
      <div className="search-card">
        <div className="search-icon-wrapper">
          <span className="search-icon">⌕</span>
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search your mind…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
