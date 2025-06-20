import React, { useEffect } from "react";
import styles from "./Sequence.module.css";

interface SequenceProps {
  sequence: string;
  isRefSequence?: boolean;
  isLastSequence?: boolean;
  onLastRender?: () => void;
}

export const Sequence = React.forwardRef<HTMLLIElement, SequenceProps>(
  (
    { sequence, isRefSequence = false, isLastSequence = false, onLastRender },
    ref
  ) => {
    useEffect(() => {
      if (isLastSequence) {
        onLastRender?.();
      }
    }, [onLastRender, isLastSequence]);

    return (
      <li
        ref={ref}
        className={`${styles.sequence} ${
          isRefSequence ? styles.referenceSequence : ""
        }`}
        tabIndex={0}
        data-copy-on-enter
      >
        {sequence}
      </li>
    );
  }
);
