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

interface DifferencesModalProps {
  open: boolean;
  onClose: () => void;
  differences: Record<number, string[]>;
}

export const DifferencesModal: React.FC<DifferencesModalProps> = ({
  open,
  onClose,
  differences,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle variant="h6" component="h2">Результат выравнивания</DialogTitle>
      <DialogContent>
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            maxHeight: "60vh",
            overflow: "auto",
            borderBottom: "1px solid lighgray",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderBottom: "2px solid lighgray",
                  }}
                >
                  Индекс
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderBottom: "2px solid lighgray",
                  }}
                >
                  Эталонная посл.
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderBottom: "2px solid lighgray",
                  }}
                >
                  Целевая посл.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(differences).map(
                ([index, [reference, target]]) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid lighgray",
                      }}
                    >
                      {index}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid lighgray",
                        fontFamily: "monospace",
                      }}
                    >
                      {reference}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid lighgray",
                        fontFamily: "monospace",
                      }}
                    >
                      {target}
                    </TableCell>
                  </TableRow>
                )
              )}
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
};
