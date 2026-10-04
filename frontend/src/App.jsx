import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
        .then((res) => res.text())
        .then((data) => setMessage(data))
        .catch(() => setMessage("Cannot reach backend"));
  }, []);

  return (
      <div>
        <h1>ServiceBid</h1>
        <p>Backend says: {message}</p>
      </div>
  );
}

export default App;