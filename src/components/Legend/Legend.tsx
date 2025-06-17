import React, { useRef, useCallback, useState, memo } from "react";
import { Box, Button } from "@mui/material";
import { LegendPopover } from "./LegendPopover";

export const Legend: React.FC = memo(() => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLegendButtonClick = useCallback(() => {
    setAnchorEl(buttonRef.current);
  }, []);

  const handleLegendButtonClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Box>
        <Button
          ref={buttonRef}
          variant="outlined"
          onClick={handleLegendButtonClick}
        >
          Легенда
        </Button>
        <LegendPopover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleLegendButtonClose}
        />
      </Box>
    </>
  );
});
