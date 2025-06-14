import React from "react";
import Input from "@mui/material/Input";
import Button from '@mui/material/Button';

import styles from "./form.module.css";

export function Form() {
  return (
    <form className={styles.form}>
      <Input placeholder='AR-ND...'/>
      <Input placeholder='AR-ND...'/>
      <Button variant="text">Выравнивание</Button>
    </form>
  );
}
