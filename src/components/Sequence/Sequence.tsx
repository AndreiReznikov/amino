import React, { useEffect } from "react";
import styles from "./Sequence.module.css";

interface SequenceProps {
  sequence: string;
  isLastSequence?: boolean;
  onLastRender?: () => void;
}

export const Sequence: React.FC<SequenceProps> = (
  ({ sequence, isLastSequence, onLastRender }) => {
    useEffect(() => {
      if (!isLastSequence) return;

      onLastRender?.();
    }, [onLastRender, isLastSequence]);

    return (
      <div
        className={styles.sequence}
        tabIndex={0}
        data-copy-on-enter
      >
        {sequence}
      </div>
    );
  }
);
