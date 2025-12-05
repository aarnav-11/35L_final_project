import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import ICAL from "ical.js";
import Navigation from "../components/Navigation";
import Background from "../components/Background";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState({});
  const [inputValue, setInputValue] = useState("");

  const formattedDate = date.toDateString();

  // Load reminders from backend on page load
  useEffect(() => {
    fetch("http://localhost:3000/api/calendar", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};
        rows.forEach((r) => {
          const key = new Date(r.date).toDateString();
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({
            id: r.id,
            text: r.text,
            done: r.done,
          });
        });
        setReminders(grouped);
      })
      .catch((e) => console.error("Error loading reminders:", e));
  }, []);

  // Add reminder (POST to backend)
  const handleAddReminder = () => {
    if (!inputValue.trim()) return;

    fetch("http://localhost:3000/api/calendar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: formattedDate, text: inputValue }),
    })
      .then((res) => res.json())
      .then((newReminder) => {
        setReminders((prev) => ({
          ...prev,
          [formattedDate]: [
            ...(prev[formattedDate] || []),
            {
              id: newReminder.id,
              text: newReminder.text,
              done: newReminder.done,
            },
          ],
        }));
        setInputValue("");
      })
      .catch((e) => console.error("Error adding reminder:", e));
  };

  // Toggle Done Status (PATCH to backend)
  const toggleReminder = (reminderId) => {
    fetch(`http://localhost:3000/api/calendar/${reminderId}/toggle`, {
      method: "PATCH",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((updated) => {
        setReminders((prev) => {
          const day = formattedDate;
          return {
            ...prev,
            [day]: prev[day].map((r) =>
              r.id === reminderId ? { ...r, done: updated.done } : r
            ),
          };
        });
      })
      .catch((e) => console.error("Error toggling reminder:", e));
  };

  const handleDeleteReminder = async (reminderId, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Update UI immediately
    setReminders((prev) => {
      const updated = {};
      const idToDelete = Number(reminderId);
      for (const date in prev) {
        updated[date] = prev[date].filter((r) => Number(r.id) !== idToDelete);
      }
      return updated;
    });
    
    // Try to delete from backend
    try {
      const res = await fetch(`http://localhost:3000/api/calendar/${reminderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        console.error(`Backend delete failed: ${res.status} ${res.statusText}`);
      } else {
        console.log("Reminder deleted from database");
      }
    } catch (err) {
      console.error("Backend delete error:", err);
    }
  };

  // File Upload Handler (ICS or JSON)
  // Push uploaded events to backend
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    let parsedEvents = [];

    // JSON FILE
    if (file.name.endsWith(".json")) {
      try {
        parsedEvents = JSON.parse(text);
      } catch {
        alert("Invalid JSON file.");
        return;
      }
    }


    // ICS FILE
    else if (file.name.endsWith(".ics")) {
      try {
        const jcal = ICAL.parse(text);
        const comp = new ICAL.Component(jcal);
        const vevents = comp.getAllSubcomponents("vevent");

        parsedEvents = vevents.map((ve) => {
          const ev = new ICAL.Event(ve);
          return {
            date: new Date(ev.startDate.toJSDate()).toDateString(),
            text: ev.summary,
          };
        });
      } catch {
        alert("Invalid ICS file.");
        return;
      }
    } else {
      alert("Please upload a .json or .ics file.");
      return;
    }

    //Push each event into backend
    parsedEvents.forEach(async (ev) => {
      const res = await fetch("http://localhost:3000/api/calendar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ev),
      });

      const saved = await res.json();

      setReminders((prev) => {
        const key = ev.date;
        return {
          ...prev,
          [key]: [
            ...(prev[key] || []),
            { id: saved.id, text: saved.text, done: saved.done },
          ],
        };
      });
    });
  };

  return (
    <div className="calendar-page">
      <Background />
      <Navigation />
      <h1 className="title">My Calendar</h1>

      {/* Upload Button */}
      <div className="upload-wrapper">
        <label className="upload-btn">
          Upload Calendar
          <input
            type="file"
            accept=".json,.ics"
            onChange={handleFileUpload}
            hidden
          />
        </label>
      </div>

      <div className="calendar-layout">
        {/* Calendar Display */}
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={({ date }) => {
            const key = date.toDateString();
            const dayReminders = reminders[key] || [];
            if (dayReminders.length === 0) return null;

            return (
              <div className="tile-reminders">
                <div className="tile-reminder">{dayReminders[0].text}</div>
                {dayReminders.length > 1 && (
                  <div className="tile-reminder more">
                    +{dayReminders.length - 1} more
                  </div>
                )}
              </div>
            );
          }}
        />

        {/* Reminders Section */}
        <div className="reminder-section">
          <h2>{formattedDate}</h2>

          <div className="reminder-input">
            <input
              type="text"
              value={inputValue}
              placeholder="Add a reminder..."
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleAddReminder}>Add</button>
          </div>

          <ul className="reminder-list">
            {(reminders[formattedDate] || []).map((r) => (
              <li key={r.id} className={r.done ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={r.done}
                  onChange={() => toggleReminder(r.id)}
                />
                <span>{r.text}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteReminder(r.id, e)}
                  type="button"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;