import React from "react";
import { useState } from "react";
import "./css/App.css";
import OfficeScene from "./components/OfficeScene";
import tilIcon from "./assets/images/tilIcon.svg"
import office from "./assets/images/backgrounds/office.svg"

function App() {

  return (
    <>
      <div className="app">
      <OfficeScene />
      <img src={tilIcon} alt="tilIcon" className="til-icon" />


      </div>
    </>
  );
}

export default App;
