import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import ICAL from "ical.js";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState({});
  const [inputValue, setInputValue] = useState("");

  const formattedDate = date.toDateString();

  const handleAddReminder = () => {
    if (!inputValue.trim()) return;

    setReminders((prev) => ({
      ...prev,
      [formattedDate]: [
        ...(prev[formattedDate] || []),
        { text: inputValue, done: false },
      ],
    }));

    setInputValue("");
  };

  const toggleReminder = (index) => {
    setReminders((prev) => ({
      ...prev,
      [formattedDate]: prev[formattedDate].map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      ),
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();

    let parsedEvents = [];

    if (file.name.endsWith(".json")) {
      try {
        const json = JSON.parse(text);
        parsedEvents = json;
      } catch (e) {
        alert("Invalid JSON file.");
        return;
      }
    }

    else if (file.name.endsWith(".ics")) {
      try {
        const jcal = ICAL.parse(text);
        const comp = new ICAL.Component(jcal);
        const vevents = comp.getAllSubcomponents("vevent");

        parsedEvents = vevents.map((ve) => {
          const ev = new ICAL.Event(ve);

          return {
            date: ev.startDate.toString().substring(0, 15), // e.g. "Mon Feb 17 2025"
            text: ev.summary,
          };
        });
      } catch (e) {
        alert("Invalid ICS file.");
        return;
      }
    } else {
      alert("Please upload a .json or .ics file.");
      return;
    }

    setReminders((prev) => {
      const newReminders = { ...prev };

      parsedEvents.forEach((ev) => {
        const key = new Date(ev.date).toDateString();

        if (!newReminders[key]) newReminders[key] = [];
        newReminders[key].push({ text: ev.text, done: false });
      });
      return newReminders;
    });
  };

  return (
    <div className="calendar-page">
      <h1>My Calendar</h1>

      <div className="upload-wrapper">
        <label className="upload-btn">
        Upload Calendar
    <input 
        type="file" 
        accept=".json,.ics"
        onChange={handleFileUpload}
        />
      </label>
    </div>

      <div className="calendar-layout">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={({ date }) => {
            const key = date.toDateString();
            const dayReminders = reminders[key] || [];

            if (dayReminders.length === 0) return null;

            return (
              <div className="tile-reminders">
                <div className="tile-reminder">
                  {dayReminders[0].text}
                </div>

                {dayReminders.length > 1 && (
                  <div className="tile-reminder more">
                    +{dayReminders.length - 1} more
                  </div>
                )}
              </div>
            );
          }}
        />

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
            {(reminders[formattedDate] || []).map((r, i) => (
              <li key={i} className={r.done ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={r.done}
                  onChange={() => toggleReminder(i)}
                />
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;