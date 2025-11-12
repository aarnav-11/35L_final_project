import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";


function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const[reminders, setReminders] = useState({});
    const[inputValue, setInputValue] = useState("");

    const formattedDate = date.toDateString();

    const handleAddReminder = () => {
        if (!inputValue.trim()) return;
    
        setReminders(prev => ({
          ...prev,
          [formattedDate]: [...(prev[formattedDate] || []), inputValue]
        }));
    
        setInputValue("");
      };
    
      return (
        <div className="calendar-container">
          <h1>My Calendar</h1>
          <Calendar onChange={setDate} value={date} />
    
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
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    
    export default CalendarPage;