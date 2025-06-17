import React, { memo } from "react";
import { Sequence } from "../Sequence";

interface SequencesListProps {
  sequences: string[];
  sequenceElements: (HTMLDivElement | null)[];
  onLastRender?: () => void;
}

export const SequencesList: React.FC<SequencesListProps> = memo(
  ({ sequences, sequenceElements, onLastRender }) => (
    <>
      {sequences?.map((sequence, index) => (
        <Sequence
          key={`${sequence}-${index}`}
          ref={(node) => {
            if (node) {
              sequenceElements[index] = node;
            }
          }}
          sequence={sequence}
          index={index}
          isLastSequence={index === sequences.length - 1}
          onLastRender={onLastRender}
        />
      ))}
    </>
  )
);
