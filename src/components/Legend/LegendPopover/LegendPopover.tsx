import React from "react";
import { Popover, Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  AMINO_ACID_GROUP_COLORS,
  AMINO_ACID_GROUPS,
} from "../../../pages/SequencesPage/SequencesPage.constants";
import {
  AminoAcidGroup,
  AminoAcid,
} from "../../../pages/SequencesPage/SequencesPage.types";

import { AMINO_ACID_NAMES, AMINO_GROUP_NAMES } from "./LegendPopover.constants";
import styles from "./LegendPopover.module.css";

interface LegendPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const LegendPopover: React.FC<LegendPopoverProps> = ({
  open,
  anchorEl,
  onClose,
}) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    slotProps={{
      paper: { className: styles.popoverPaper },
    }}
  >
    <Box className={styles.container}>
      <Box className={styles.aminoGroupContainer}>
        <Typography className={styles.title} gutterBottom>
          Группы аминокислот
        </Typography>

        <IconButton onClick={onClose} size="small" aria-label="Закрыть">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className={styles.groupsContainer}>
        {Object.entries(AMINO_ACID_GROUP_COLORS).map(([group, color]) => (
          <Box key={group} className={styles.groupItem}>
            <Paper
              className={styles.colorSquare}
              style={{ backgroundColor: color }}
            />
            <Typography>
              {AMINO_GROUP_NAMES[group as AminoAcidGroup]}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography className={styles.title} gutterBottom>
        Все аминокислоты
      </Typography>

      <div className={styles.aminoAcidsContainer}>
        {AMINO_ACID_NAMES.map((aa) => (
          <div key={aa.symbol} className={styles.aminoAcidItem}>
            <Paper
              className={styles.aminoAcidSymbol}
              style={{
                backgroundColor:
                  AMINO_ACID_GROUP_COLORS[
                    AMINO_ACID_GROUPS[aa.symbol as AminoAcid]
                  ],
              }}
            >
              {aa.symbol}
            </Paper>
            <Typography>{aa.name}</Typography>
          </div>
        ))}
      </div>
    </Box>
  </Popover>
);
