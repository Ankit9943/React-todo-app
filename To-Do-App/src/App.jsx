import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Todo from "./components/Todo";

function App() {
  return (
    <>
      <div className="relative w-full h-screen background">
        <Todo />
      </div>
    </>
  );
}

export default App;
