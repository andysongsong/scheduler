import DayList from "./DayList";
import React, { useState, useEffect } from "react";
import Appointment from "./Appointment";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

import "components/Application.scss";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       },
//     },
//   },
//   {
//     id: 3,
//     time: "7pm",
//     interview: {
//       student: "Jason",
//       interviewer: {
//         id: 2,
//         name: "Mildred Nazir",
//         avatar: "https://i.imgur.com/T2WwVfS.png ",
//       },
//     },
//   },

//   {
//     id: 4,
//     time: "5pm",
//     interview: {
//       student: "Tom",
//       interviewer: {
//         id: 3,
//         name: "Tori Malcolm ",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       },
//     },
//   },

//   {
//     id: 5,
//     time: "4pm",
//   },
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const Appointments = dailyAppointments.map((appointment) => {
    return <Appointment key={appointment.id} {...appointment} />;
  });
  const setDay = (day) => setState({ ...state, day });
  // const setDays = (days) => setState((prev) => ({ ...prev, days }));

  useEffect(() => {
    const getDaysURL = "http://localhost:8001/api/days";
    const getAppointmentsURL = "http://localhost:8001/api/appointments";
    const getInterviewersURL = "http://localhost:8001/api/interviewers";

    Promise.all([
      axios.get(getDaysURL),
      axios.get(getAppointmentsURL),
      axios.get(getInterviewersURL),
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      // console.log("Appointment DATA", appointments.data);
      setState((prev) => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      }));
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
          <DayList days={state.days} day={state.day} setDay={setDay} />
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
