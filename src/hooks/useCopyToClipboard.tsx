import { useState, useCallback, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

export const useCopyToClipboard = (
  container: HTMLDivElement | null,
  dataAttributeSelector: string
) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => setIsOpen(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!container) return;

    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText) copyToClipboard(selectedText);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const target = event.target as HTMLElement;
        const fullText = target.textContent || "";
        copyToClipboard(fullText.trim());
      }
    };

    const subscribeToElements = () => {
      const currentElements = Array.from(
        container.querySelectorAll<HTMLElement>(`[${dataAttributeSelector}]`)
      );

      currentElements.forEach((el) => {
        el.addEventListener("keydown", handleKeyDown);
      });

      return currentElements;
    };

    const unsubscribeFromElements = (elements: HTMLElement[]) => {
      elements.forEach((el) => {
        el.removeEventListener("keydown", handleKeyDown);
      });
    };

    let observedElements = subscribeToElements();

    const observer = new MutationObserver(() => {
      unsubscribeFromElements(observedElements);
      observedElements = subscribeToElements();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    container.addEventListener("mouseup", handleSelection);
    container.addEventListener("touchend", handleSelection);

    return () => {
      observer.disconnect();
      unsubscribeFromElements(observedElements);
      container.removeEventListener("mouseup", handleSelection);
      container.removeEventListener("touchend", handleSelection);
    };
  }, [container, copyToClipboard, dataAttributeSelector]);

  const Notification = () => (
    <Snackbar
      open={isOpen}
      autoHideDuration={1000}
      onClose={() => setIsOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success">Текст успешно скопирован!</Alert>
    </Snackbar>
  );

  return { Notification };
};
