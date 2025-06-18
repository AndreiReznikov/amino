import React, { useEffect } from "react";
import styles from "./Sequence.module.css";

interface SequenceProps {
  sequence: string;
  index: number;
  isLastSequence?: boolean;
  onLastRender?: () => void;
}

export const Sequence = React.forwardRef<HTMLDivElement, SequenceProps>(
  ({ sequence, index, isLastSequence, onLastRender }, ref) => {
    useEffect(() => {
      if (!isLastSequence) return;

      onLastRender?.();
    }, [onLastRender, isLastSequence]);

    return (
      <div
        ref={ref}
        className={`${styles.sequence} ${
          index === 0 ? styles.referenceSequence : ""
        }`}
        tabIndex={0}
        data-copy-on-enter
      >
        {sequence}
      </div>
    );
  }
);
