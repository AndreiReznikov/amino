import React, { useCallback } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from "@mui/material";
import { SEQUENCE_FONT_OPTIONS } from "../../pages/SequencesPage/SequencesPage.constants";
import { SequenceSize } from "../../pages/SequencesPage/SequencesPage.types";
import styles from "./ActionsPanel.module.css";

interface ActionsPanelProps {
  onReset: () => void;
  onSwitch: () => void;
  onSelect: (event: SelectChangeEvent<SequenceSize>) => void;
  size: keyof typeof SEQUENCE_FONT_OPTIONS;
  checked: boolean;
  valid: boolean;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({
  onReset,
  onSelect,
  onSwitch,
  size,
  checked,
  valid,
}) => {
  const handleSwitchKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      onSwitch();
    },
    [onSwitch]
  );

  return (
    <div className={styles.actionsPanelContainer}>
      <Button className={styles.resetButton} onClick={onReset} type="reset" variant="outlined" disabled={!valid}>
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
            onKeyDown={handleSwitchKeydown}
            checked={checked}
          />
        }
        label="Фон"
      />
    </div>
  );
};
