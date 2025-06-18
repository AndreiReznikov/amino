import React from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from "@mui/material";
import { SEQUENCE_FONT_OPTIONS } from "./ActionsPanel.constants";
import styles from "./ActionsPanel.module.css";

type SequenceSize = keyof typeof SEQUENCE_FONT_OPTIONS;

interface ActionsPanelProps {
  onReset: () => void;
  onSwitch: () => void;
  onSelect: (event: SelectChangeEvent<SequenceSize>) => void;
  size: keyof typeof SEQUENCE_FONT_OPTIONS;
  checked: boolean;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({
  onReset,
  onSelect,
  onSwitch,
  size,
  checked,
}) => {
  return (
    <div className={styles.actionsPanelContainer}>
      <Button onClick={onReset} type="reset" variant="outlined">
        Очистить
      </Button>
      <Select
        className={styles.fontOptionsSelector}
        value={size}
        onChange={onSelect}
      >
        {Object.entries(SEQUENCE_FONT_OPTIONS).map(([key, option]) => (
          <MenuItem key={key} value={key}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormControlLabel
        control={
          <Switch
            onClick={onSwitch}
            checked={checked}
          />
        }
        label="Фон"
      />
    </div>
  );
};
