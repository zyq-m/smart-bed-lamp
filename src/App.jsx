import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { ref, getDatabase, onValue, update } from "firebase/database";

import "./App.css";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_DOMAIN,
  databaseURL: import.meta.env.VITE_DB,
  projectId: import.meta.env.VITE_PROJECT_ID,
};

initializeApp(firebaseConfig);
const db = getDatabase();

function App() {
  const [isOn, setIsOn] = useState(undefined);

  function updateLight(isManual) {
    update(ref(db, "light/"), {
      manual: { isManual: isManual, isOn: !isOn },
    }).catch(err => {
      console.error(err);
    });
  }

  useEffect(() => {
    const starCountRef = ref(db, "light/");
    onValue(starCountRef, snapshot => {
      const data = snapshot.val();

      if (data?.manual.isManual) {
        setIsOn(data?.manual.isOn);
      } else {
        setIsOn(data?.auto.isOn);
      }
    });
  }, []);

  return (
    <>
      <h1>Smart Bed Lamp</h1>
      <div className="card">
        <p>Light now is {isOn ? "On" : "Off"}</p>
        <button onClick={() => updateLight(false)}>Auto</button>
        <button onClick={() => updateLight(true)}>
          Turn {isOn ? "Off" : "On"}
        </button>
      </div>
      <p className="read-the-docs">
        Coded by <a href="https://github.com/zyq-m">Haziq</a>
      </p>
    </>
  );
}

export default App;
