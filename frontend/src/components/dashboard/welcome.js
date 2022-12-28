import React from "react";
import "./welcome.css";
import image from "../dashboard/mainsss.png";
import { connect } from "react-redux";

const admin_powers = [
  "Create/Update/Remove new Subjects",
  "Create/Remove/Update Teacher's Data",
];

const teacher_powers = [
  "Create/Update/Remove Questions",
  "Create Test Papers from the created questions",
  "Performance analysis of the students",
  "Get the list of students who have attempted the test",
  "Control the start and end time for the test",
  "Send Test Paper's link (test ID) to the students",
];

const student_powers = [
  "Attempt the test papers",
  "View the results and Paper Analysis",
  "Give Feedback to the teacher",
];

function welcome(props) {
  const { type, name, emailid, contact } = props.user.userDetails;
  const isLoggedIn = props.user.isLoggedIn;

  if (!isLoggedIn) {
    return <div className="welcome_main_container"></div>;
  }

  const powers =
    type === "ADMIN"
      ? admin_powers
      : type === "TRAINER"
      ? teacher_powers
      : student_powers;

  const typeToShow =
    type === "TRAINER" ? "TEACHER" : type === "ADMIN" ? "ADMIN" : "STUDENT";

  return (
    <div className="welcome_main_container">
      <div className="welcome_left">
        <h1>Name: {name}</h1>
        <h2>Email: {emailid}</h2>
        <h2>Contact: {contact}</h2>
        <h2>Logged In As: {typeToShow}</h2>

        <br />
        <div className="admin_powers">
          <h2>What you can do as {typeToShow}:</h2>
          <ul>
            {powers.map((power, index) => (
              <li key={index}>{power}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="welcome_right">
        <img src={image} alt="img"></img>
        <h1>Examination Portal</h1>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(welcome);
