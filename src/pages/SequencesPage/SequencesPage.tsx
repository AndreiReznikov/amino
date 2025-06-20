import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, SelectChangeEvent } from "@mui/material";
import { SequencesList } from "../../components/SequencesList";
import { SequencesForm } from "../../components/SequencesForm";
import { useCopyToClipboard } from "../../hooks";
import {
  useSequenceInteraction,
  useSequencesBackground,
  useSequencesPosition,
} from "./SequencesPage.hooks";
import { FormData, SequenceSize } from "./SequencesPage.types";
import {
  SEQUENCE_FONT_OPTIONS,
  TEXT_COPY_DATA_ATTRIBUTE,
} from "./SequencesPage.constants";
import styles from "./SequencesPage.module.css";
import { DifferencesModal } from "../../components/DifferencesModal";

export const SequencesPage: React.FC = () => {
  const [sequences, setSequences] = useState<string[]>([]);
  const [isBackgroundShown, setIsBackgroundShown] = useState<boolean>(true);
  const [isAllSequencesMounted, setIsAllSequencesMounted] =
    useState<boolean>(false);
  const [sequenceSize, setSequenceSize] = useState<SequenceSize>("small");
  const [resultModalOpened, setResultModalOpened] = useState(false);

  const sequencesContainerRef = useRef<HTMLDivElement | null>(null);
  const sequenceElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const fontSize = SEQUENCE_FONT_OPTIONS[sequenceSize].fontSize;
  const letterWidth = SEQUENCE_FONT_OPTIONS[sequenceSize].letterWidth;

  useSequenceInteraction(sequenceElementsRef.current);

  const { Notification } = useCopyToClipboard(
    sequencesContainerRef.current,
    TEXT_COPY_DATA_ATTRIBUTE
  );

  const {
    sequencesBackgroundsRef,
    sequencesDifferencesRef,
    setSequencesBackground,
    updateSequencesBackground,
  } = useSequencesBackground({
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
      setSequencesBackground();
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
    setSequencesBackground,
    setSequencesPosition,
    updateSequencesBackground,
  ]);

  return (
    <div className={styles.container}>
      <SequencesForm
        onSubmit={handleFormSubmit}
        onSelect={handleSequenceSizeChange}
        onReset={handleResetSequences}
        onSwitch={handleToggleBackground}
        size={sequenceSize}
        checked={isBackgroundShown}
        backgroundsRef={sequencesBackgroundsRef}
      />
      <main
        ref={sequencesContainerRef}
        className={styles.sequencesContainer}
        aria-live="polite"
      >
        {sequences.length !== 0 && (
          <section>
            <Button
              variant="text"
              onClick={() => setResultModalOpened(true)}
              sx={{ marginTop: 2 }}
            >
              Результат
            </Button>

            <DifferencesModal
              open={resultModalOpened}
              onClose={() => setResultModalOpened(false)}
              differences={sequencesDifferencesRef.current}
            />
          </section>
        )}
        <section className={styles.sequencesWrapper}>
          <SequencesList
            sequences={sequences}
            sequenceElements={sequenceElementsRef?.current}
            onLastRender={onLastSequenceRender}
          />
        </section>
      </main>
      <Notification />
    </div>
  );
};
