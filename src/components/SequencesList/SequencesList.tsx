import React, { memo } from "react";
import { Sequence } from "./Sequence";
import styles from "./SequencesList.module.css";

interface SequencesListProps {
  sequences: string[];
  sequenceElements: (HTMLElement | null)[];
  onLastRender?: () => void;
}

export const SequencesList: React.FC<SequencesListProps> = memo(
  ({ sequences, sequenceElements, onLastRender }) => (
    <ul className={styles.sequencesList}>
      {sequences?.map((sequence, index) => (
        <Sequence
          key={`${sequence}-${index}`}
          ref={(node) => {
            if (node) {
              sequenceElements[index] = node;
            }
          }}
          sequence={sequence}
          isRefSequence={index === 0}
          isLastSequence={index === sequences.length - 1}
          onLastRender={onLastRender}
        />
      ))}
    </ul>
  )
);

Sequence.displayName = "Sequence";