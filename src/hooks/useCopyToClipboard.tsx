import React, { useCallback, useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export const useCopyToClipboard = (container: HTMLDivElement | null) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsOpen(true);
        setTimeout(() => setIsOpen(false), 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }, []);

  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText) {
        copyToClipboard(selectedText);
      }
    };

    container?.addEventListener("mouseup", handleSelection);
    container?.addEventListener("touchend", handleSelection);
    return () => {
      container?.removeEventListener("mouseup", handleSelection);
      container?.removeEventListener("touchend", handleSelection);
    };
  }, [container, copyToClipboard]);

  const Notification = () => (
    <Snackbar
      open={isOpen}
      autoHideDuration={1000}
      onClose={() => setIsOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success" sx={{ width: "100%" }}>
        Текст скопирован в буфер обмена!
      </Alert>
    </Snackbar>
  );

  return { Notification };
};
