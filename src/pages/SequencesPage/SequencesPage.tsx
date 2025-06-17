import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SequencesPage.module.css";
import { SequencesList } from "../../components/SequencesList";
import { SequencesForm } from "../../components/SequencesForm";
import {
  useSequencesBackground,
  useSequencesPosition,
} from "./SequencesPage.hooks";
import { SelectChangeEvent } from "@mui/material";
import { SEQUENCE_FONT_OPTIONS } from "../../components/ActionsPanel/ActionsPanel.constants";

type FormData = {
  field1: string;
  field2: string;
};

type SequenceSize = keyof typeof SEQUENCE_FONT_OPTIONS;

export const SequencesPage: React.FC = () => {
  const [sequences, setSequences] = useState<string[]>([]);
  const [isBackgroundShown, setIsBackgroundShown] = useState<boolean>(true);
  const [isAllSequencesMounted, setIsAllSequencesMounted] =
    useState<boolean>(false);
  const [sequenceSize, setSequenceSize] = useState<SequenceSize>("small");

  const sequenceElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const fontSize = SEQUENCE_FONT_OPTIONS[sequenceSize].fontSize;
  const letterWidth = SEQUENCE_FONT_OPTIONS[sequenceSize].letterWidth;

  const { sequencesBackgroundsRef, updateSequencesBackground } =
    useSequencesBackground({
      sequences,
      isBackgroundShown,
      isAllSequencesMounted,
      fontSize,
      letterWidth,
      sequenceElementsRef,
    });

  const { setSequencesPosition } = useSequencesPosition({
    fontSize,
    isAllSequencesMounted,
    sequenceElementsRef,
  });

  const handleFormSubmit = useCallback((data: FormData) => {
    setSequences(() => Object.values(data).map((value) => value.toUpperCase()));
  }, []);

  const handleToggleBackground = useCallback(
    () => setIsBackgroundShown((prev) => !prev),
    []
  );

  const handleSequenceSizeChange = useCallback(
    (event: SelectChangeEvent<SequenceSize>) => {
      setSequenceSize(event.target.value);

      sequencesBackgroundsRef.current = null;
    },
    [sequencesBackgroundsRef]
  );

  const handleResetSequences = useCallback(() => {
    setSequences([]);
    setIsAllSequencesMounted(false);
    sequencesBackgroundsRef.current = null;
  }, [sequencesBackgroundsRef]);

  const onLastSequenceRender = useCallback(() => {
    setIsAllSequencesMounted(true);
  }, []);

  useEffect(() => {
    if (!isAllSequencesMounted) return;

    setSequencesPosition();

    if (sequencesBackgroundsRef?.current) {
      sequenceElementsRef?.current?.forEach((sequenceElement, index) => {
        if (!sequenceElement) return;

        sequenceElement.style.background = !isBackgroundShown
          ? "transparent"
          : sequencesBackgroundsRef.current?.[index] ?? "";
      });
    } else {
      updateSequencesBackground();
    }

    const handleResize = () => updateSequencesBackground();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    isAllSequencesMounted,
    isBackgroundShown,
    sequenceElementsRef,
    sequences,
    sequencesBackgroundsRef,
    setSequencesPosition,
    updateSequencesBackground,
  ]);

  return (
    <>
      <SequencesForm
        onSubmit={handleFormSubmit}
        onSelect={handleSequenceSizeChange}
        onReset={handleResetSequences}
        onSwitch={handleToggleBackground}
        size={sequenceSize}
        checked={isBackgroundShown}
        backgroundsRef={sequencesBackgroundsRef}
      />
      <div className={styles.sequencesContainer}>
        <div className={styles.sequencesWrapper}>
          <SequencesList
            sequences={sequences}
            sequenceElements={sequenceElementsRef?.current}
            onLastRender={onLastSequenceRender}
          />
        </div>
      </div>
    </>
  );
};
