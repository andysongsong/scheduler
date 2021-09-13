import axios from "axios";
import { useEffect, useState } from "react";

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  //useEffect hook to get data from the api
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // console.log('state', state);
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => {
        setState((prev) => ({
          ...prev,
          appointments,
        }));
      })
      .then(() => {
        const filteredDay = state.days.filter((el) => {
          return el.name === state.day;
        });

        const updatedDay = {
          ...filteredDay[0],
          spots: filteredDay[0].spots - 1,
        };

        const daysToUpdateIndex = state.days.findIndex(
          (days) => days.name === state.day
        );

        const updatedDays = [
          ...state.days.slice(0, daysToUpdateIndex),
          updatedDay,
          ...state.days.slice(daysToUpdateIndex + 1),
        ];

        setState((prev) => ({
          ...prev,
          days: updatedDays,
        }));
      });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments,
        });
      })
      .then(() => {
        const filteredDay = state.days.filter((el) => {
          return el.name === state.day;
        });

        const updatedDay = {
          ...filteredDay[0],
          spots: filteredDay[0].spots + 1,
        };
        const daysToUpdateIndex = state.days.findIndex(
          (days) => days.name === state.day
        );

        const updatedDays = [
          ...state.days.slice(0, daysToUpdateIndex),
          updatedDay,
          ...state.days.slice(daysToUpdateIndex + 1),
        ];

        setState((prev) => ({
          ...prev,
          days: updatedDays,
        }));
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
