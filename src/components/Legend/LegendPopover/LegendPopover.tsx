import React from "react";
import { Popover, Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AMINO_ACID_NAMES, AMINO_GROUP_NAMES } from "./LegendPopover.constants";
import styles from "./LegendPopover.module.css";
import {
  aminoAcidGroupColors,
  aminoAcidGroups,
} from "../../../pages/SequencesPage/SequencesPage.constants";
import { AminoAcidGroup, AminoAcid } from "../../../pages/SequencesPage/SequencesPage.types";

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Группы аминокислот
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{ marginLeft: 2 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className={styles.groupsContainer}>
        {Object.entries(aminoAcidGroupColors).map(([group, color]) => (
          <Box key={group} className={styles.groupItem}>
            <Paper
              className={styles.colorSquare}
              style={{ backgroundColor: color }}
            />
            <Typography variant="body1">
              {AMINO_GROUP_NAMES[group as AminoAcidGroup]}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="h6" gutterBottom>
        Все аминокислоты
      </Typography>

      <div className={styles.aminoAcidsContainer}>
        {AMINO_ACID_NAMES.map((aa) => (
          <div key={aa.symbol} className={styles.aminoAcidItem}>
            <Paper
              className={styles.aminoAcidSymbol}
              style={{
                backgroundColor:
                  aminoAcidGroupColors[aminoAcidGroups[aa.symbol as AminoAcid]],
              }}
            >
              {aa.symbol}
            </Paper>
            <Typography variant="body1">{aa.name}</Typography>
          </div>
        ))}
      </div>
    </Box>
  </Popover>
);
