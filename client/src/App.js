import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/me");
        const userData = response.data.user;

        if (userData) {
          setLoggedInUser(userData.username);
        }
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("http://localhost:5000/api/login", {
      username: name,
      password: password,
    });
    console.log(data.data);
    console.log("datad", name, password);
    const userData = data.data.user;
    setLoggedInUser(userData.username);
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/logout");
    setLoggedInUser(null);
  };

  return (
    <div>
      <form>
        <label>username</label>
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        ></input>
        <br />
        <label>password</label>
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        ></input>
        <br />
        <button onClick={handleSubmit}>button</button>
      </form>
      {loggedInUser && <div>Hello, {loggedInUser}</div>}
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default App;
