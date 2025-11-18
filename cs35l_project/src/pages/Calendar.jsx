import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState({});
  const [inputValue, setInputValue] = useState("");

  const formattedDate = date.toDateString();

  const handleAddReminder = () => {
    if (!inputValue.trim()) return;

    setReminders(prev => ({
      ...prev,
      [formattedDate]: [
        ...(prev[formattedDate] || []),
        { text: inputValue, done: false }
      ]
    }));

    setInputValue("");
  };

  const toggleReminder = (index) => {
    setReminders(prev => ({
      ...prev,
      [formattedDate]: prev[formattedDate].map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    }));
  };

  return (
    <div className="calendar-page">
      <h1>My Calendar</h1>

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