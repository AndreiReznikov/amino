import React, { memo } from "react";
import { Sequence } from "../Sequence";
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
        <li
          ref={(node) => {
            if (node) {
              sequenceElements[index] = node;
            }
          }}
          className={`${styles.sequence} ${
            index === 0 ? styles.referenceSequence : ""
          }`}
        >
          <Sequence
            key={`${sequence}-${index}`}
            sequence={sequence}
            isLastSequence={index === sequences.length - 1}
            onLastRender={onLastRender}
          />
        </li>
      ))}
    </ul>
  )
);
