import React from "react";
import Comments from "./Components/Comments";
import "./App.css";

function App() {
  const currentUser = {
    image: {
      png: "./images/avatars/image-juliusomo.png",
      webp: "./images/avatars/image-juliusomo.webp",
    },
    username: "juliusomo",
  };

  return (
    <div className="App">
      <Comments currentUser={currentUser} />
    </div>
  );
}

export default App;
