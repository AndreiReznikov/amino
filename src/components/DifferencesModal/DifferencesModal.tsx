import React from "react";
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

interface DifferencesModalProps {
  open: boolean;
  onClose: () => void;
  differences: Record<number, AminoAcidDifference>;
}

export const DifferencesModal: React.FC<DifferencesModalProps> = ({
  open,
  onClose,
  differences,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle variant="h6" component="h2">
      Результат выравнивания
    </DialogTitle>
    <DialogContent>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          maxHeight: "60vh",
          overflow: "auto",
          borderBottom: "1px solid lightgray",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderBottom: "2px solid lightgray",
                }}
              >
                Индекс
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderBottom: "2px solid lightgray",
                }}
              >
                Эталонная посл.
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderBottom: "2px solid lightgray",
                }}
              >
                Целевая посл.
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderBottom: "2px solid lightgray",
                }}
              >
                Тип различия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(differences).map(([index, difference]) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    borderBottom: "1px solid lightgray",
                  }}
                >
                  {index}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid lightgray",
                    fontFamily: "monospace",
                  }}
                >
                  {difference.refAmino}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid lightgray",
                    fontFamily: "monospace",
                  }}
                >
                  {difference.targetAmino}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid lightgray",
                  }}
                >
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
);
