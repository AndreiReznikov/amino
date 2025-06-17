import React from "react";
import { CssBaseline } from "@mui/material";
import { SequencesPage } from "./pages/SequencesPage";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.app}>
      <CssBaseline />
      <SequencesPage />
    </div>
  );
}

export default App;
