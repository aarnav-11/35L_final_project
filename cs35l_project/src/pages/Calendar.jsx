import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";


function CalendarPage() {
    const [date, setDate] = useState(new Date());
    return (
      <div className="calendar-container">
        <h1>My Calendar</h1>
        <Calendar onChange={setDate} value={date} />
        <p className="selected-date">Date: {date.toDateString()}</p>
      </div>
    );
  }

  export default CalendarPage;