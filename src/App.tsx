import React from "react";
import { SequencesPage } from "./pages/SequencesPage";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.app}>
      <SequencesPage />
    </div>
  );
}

export default App;
