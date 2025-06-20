import React from "react";
import { Popover, Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  AMINO_ACID_GROUP_COLORS,
  AMINO_ACID_GROUP_SYMBOLS,
  AMINO_ACID_GROUPS,
} from "../../../pages/SequencesPage/SequencesPage.constants";
import {
  AminoAcidGroup,
  AminoAcid,
} from "../../../pages/SequencesPage/SequencesPage.types";

import { AMINO_ACIDS, AMINO_GROUPS } from "./LegendPopover.constants";
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
      <section aria-labelledby="amino-groups-title">
        <Box className={styles.aminoGroupContainer}>
          <Typography
            variant="h6"
            component="h2"
            className={styles.title}
            id="amino-groups-title"
            gutterBottom
          >
            Группы аминокислот
          </Typography>

          <IconButton onClick={onClose} size="small" aria-label="Закрыть">
            <CloseIcon />
          </IconButton>
        </Box>

        <ul className={styles.groupsContainer}>
          {Object.entries(AMINO_ACID_GROUP_COLORS).map(([group, color]) => (
            <li key={group} className={styles.groupItem}>
              <Paper
                className={styles.aminoGroupSymbol}
                style={{ backgroundColor: color }}
              >
                {AMINO_ACID_GROUP_SYMBOLS[group]}
              </Paper>
              <Typography>{AMINO_GROUPS[group as AminoAcidGroup]}</Typography>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="amino-list-title">
        <Typography
          variant="h6"
          component="h2"
          className={styles.title}
          id="amino-list-title"
          gutterBottom
        >
          Все аминокислоты
        </Typography>

        <ul className={styles.aminoAcidsContainer}>
          {AMINO_ACIDS.map((aa) => (
            <li key={aa.symbol} className={styles.aminoAcidItem}>
              <Paper
                className={styles.aminoGroupSymbol}
                style={{
                  backgroundColor:
                    AMINO_ACID_GROUP_COLORS[
                      AMINO_ACID_GROUPS[aa.symbol as AminoAcid]
                    ],
                }}
              >
                {
                  AMINO_ACID_GROUP_SYMBOLS[
                    AMINO_ACID_GROUPS[aa.symbol as AminoAcid]
                  ]
                }
              </Paper>
              <Typography>{aa.name}</Typography>
            </li>
          ))}
        </ul>
      </section>
    </Box>
  </Popover>
);
