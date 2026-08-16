import React from "react";
import { useState } from "react";
import "./css/App.css";
import OfficeScene from "./components/OfficeScene";
import OpeningPage from "./mainPages/OpeningPage";
import tilIcon from "./assets/images/tilIcon.svg";
import bahad11Icon from "./assets/images/bahad11Icon.svg";
import office from "./assets/images/backgrounds/office.svg"

function App() {

  return (
    <>
      <div className="app">
      <OpeningPage/>
      <OfficeScene />
      <img src={tilIcon} alt="tilIcon" className="til-icon" />
      <img src={bahad11Icon} alt="tilIcon" className="bahad11-icon" />


      </div>
    </>
  );
}

export default App;
