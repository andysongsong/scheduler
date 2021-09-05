import DayList from "./DayList";
import React, { useState, useEffect } from "react";
import Appointment from "./Appointment";
import axios from "axios";

import "components/Application.scss";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      },
    },
  },
  {
    id: 3,
    time: "7pm",
    interview: {
      student: "Jason",
      interviewer: {
        id: 2,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png ",
      },
    },
  },

  {
    id: 4,
    time: "5pm",
    interview: {
      student: "Tom",
      interviewer: {
        id: 3,
        name: "Tori Malcolm ",
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      },
    },
  },

  {
    id: 5,
    time: "4pm",
  },
];

export default function Application(props) {
  const [days, setDays] = useState([]);
  const [day, setDay] = useState("Monday");
  const [interviewer, setInterviewer] = useState(null);
  const Appointments = appointments.map((appointment) => {
    return <Appointment key={appointment.id} {...appointment} />;
  });

  useEffect(() => {
    axios.get("http://localhost:8001/api/days").then((res) => {
      console.log("res --->", res.data);
      setDays([...res.data]);
    });
  }, []);
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} day={day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
      </section>
      <section className="schedule">
        {Appointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
