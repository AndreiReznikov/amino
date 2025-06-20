import React, { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { AminoAcidDifference } from "../../pages/SequencesPage/SequencesPage.types";
import styles from "./DifferencesModal.module.css";

interface DifferencesModalProps {
  open: boolean;
  onClose: () => void;
  differences: Record<number, AminoAcidDifference>;
}

export const DifferencesModal: React.FC<DifferencesModalProps> = memo(
  ({ open, onClose, differences }) => (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle variant="h6" component="h2">
        Результат выравнивания
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell className={styles.headCell}>Индекс</TableCell>
                <TableCell className={styles.headCell}>
                  Эталонная посл.
                </TableCell>
                <TableCell className={styles.headCell}>Целевая посл.</TableCell>
                <TableCell className={styles.headCell}>Тип различия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(differences).map(([index, difference]) => (
                <TableRow key={index}>
                  <TableCell className={styles.bodyCell}>{index}</TableCell>
                  <TableCell className={styles.bodyCell}>
                    {difference.refAmino}
                  </TableCell>
                  <TableCell className={styles.bodyCell}>
                    {difference.targetAmino}
                  </TableCell>
                  <TableCell className={styles.bodyCell}>
                    {difference.diffType}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="text">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
);
