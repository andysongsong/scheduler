import React from "react";
import "./styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";

const Appointment = (props) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((err) => console.log("err in save", err));
  };

  const deleting = () => {
    transition(DELETING);
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
    });
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => {
            transition(CONFIRM);
          }}
          onEdit={() => {
            transition(EDIT);
          }}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
      {mode === SAVING && <Status message={SAVING} />}
      {mode === DELETING && <Status message={DELETING} />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={() => back()}
          onConfirm={deleting}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
          name={props.interview.student}
          value={props.interview.interviewer.id}
        />
      )}
    </article>
  );
};

export default Appointment;
