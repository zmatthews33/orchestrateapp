import React, { useState } from "react";
import moment from "moment";
import "./Styles/index.scss";
import CalendarNavigation from "./Components/CalenderNav/CalendarNavigation";
import CalendarHeader from "./Components/CalendarHeaders/WeekDayHeaders";
import DaySlot from "./Components/DaySlot/DaySlot";
import { Link } from "react-router-dom";

function CalendarWeek({ events, toggleModal }) {
  const [DateContext, setDateContext] = useState(moment());
  const MonthNum = DateContext.month();
  const Month = DateContext.format("MMMM");
  const Year = DateContext.format("Y");
  const WeekdaysShort = moment.weekdaysShort();
  const CurrentDate = moment().get("date");

  const updateMonth = dir => {
    let weekNum = DateContext.week();
    if (dir === "inc") {
      setDateContext(moment(DateContext).set("week", weekNum + 1));
    } else if (dir === "dec") {
      setDateContext(moment(DateContext).set("week", weekNum - 1));
    } else {
      setDateContext(moment());
    }
  };

  const AddEvent = dateData => {
    toggleModal();
  };

  const calendarDays = [];

  for (let i = 0; i < 7; i++) {
    const currDay = moment(DateContext).weekday(i);
    const thisDate = moment(currDay).get("date");
    const thisMonth = moment(currDay).month();

    let myClass = thisMonth !== MonthNum ? "empty" : "day";
    myClass = thisDate === CurrentDate ? "day currentDay" : myClass;

    const DayEvents = events.filter(ev => {
      const utcDate = moment.utc(ev.start_date);
      if (moment(utcDate).format("YYYYMM") === DateContext.format("YYYYMM")) {
        if (parseInt(moment(utcDate).format("D")) === thisDate) {
          return ev;
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

    const currentTime = date => {
      const utcTime = moment.utc(date);
      return moment(utcTime).format("h:mm a");
    };

    calendarDays.push(
      <DaySlot
        key={thisDate}
        classToUse={myClass}
        data={{
          month: thisMonth,
          day: thisDate,
          year: moment(currDay).format("Y")
        }}
        addEvent={AddEvent}
      >
        {DayEvents.map(event => (
          <Link
            to={`/events/${event._id}`}
            key={event._id}
            className="eventThumb"
          >
            <span className="time">{currentTime(event.start_date)}</span>
            <h2>{event.title}</h2>
          </Link>
        ))}
      </DaySlot>
    );
  }

  return (
    <div className="calendar">
      <CalendarNavigation month={Month} year={Year} updateMonth={updateMonth} />
      <CalendarHeader headers={WeekdaysShort} />
      <div className="calendarDays">
        <div className="calendarRow">{calendarDays.map(day => day)}</div>
      </div>
    </div>
  );
}

export default CalendarWeek;
