import React, { useCallback, useEffect, useRef, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import styles from "./SequencesPage.module.css";
import { createSequenceGradient } from "./SequencesPage.utils";
import { aminoAcidGroupColors, aminoAcidGroups } from "./SequencesPage.constants";
import { AminoAcid } from "./SequencesPage.types";
import { SequencesList } from "../../components/SequencesList";
import { SEQUENCE_FONT_OPTIONS } from "../../components/ActionsPanel/ActionsPanel.constants";
import { SequencesForm } from "../../components/SequencesForm";

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
  const sequencesBackgroundsRef = useRef<string[] | null>(null);

  const fontSize = SEQUENCE_FONT_OPTIONS[sequenceSize].fontSize;
  const letterWidth = SEQUENCE_FONT_OPTIONS[sequenceSize].letterWidth;

  const setSequencesPosition = useCallback(() => {
    if (!isAllSequencesMounted) return;

    const sequencesCount = sequenceElementsRef?.current.length;

    sequenceElementsRef?.current?.forEach((sequenceElement, index) => {
      sequenceElement?.style.setProperty("top", `${index * fontSize}px`);
      sequenceElement?.style.setProperty("font-size", `${fontSize}px`);
      sequenceElement?.style.setProperty("line-height", `${sequencesCount}`);
    });
  }, [fontSize, isAllSequencesMounted]);

  const getSequencesBackgrounds = useCallback(() => {
    if (!isAllSequencesMounted) return null;

    const sequencesCount = sequenceElementsRef.current?.length;
    const lineHeight = fontSize * sequencesCount;
    const referenceSequenceAminoChain = sequences[0]?.split("") as AminoAcid[];
    const referenceSequenceColors = referenceSequenceAminoChain?.map(
      (amino) => aminoAcidGroupColors[aminoAcidGroups[amino]] ?? "transparent"
    );
    return sequenceElementsRef?.current?.map((sequenceElement, index) => {
      const sequence = sequences[index].split("") as AminoAcid[];
      const sequenceWidth = sequenceElement?.clientWidth ?? 0;
      const sequenceModelWidth = letterWidth * sequence.length;
      const sequenceRatioWidth =
        sequenceWidth === Math.floor(sequenceModelWidth)
          ? sequenceModelWidth
          : sequenceWidth;

      const sequenceLettersRatio =
        Math.round((sequenceRatioWidth / letterWidth) * 100) / 100;
      const rowLettersNumber = Math.floor(sequenceLettersRatio);
      const rowsNumber = Math.ceil(sequence.length / rowLettersNumber);

      const sequenceColors =
        index === 0
          ? referenceSequenceColors
          : sequence?.map((amino, index) =>
              amino === referenceSequenceAminoChain[index]
                ? "transparent"
                : aminoAcidGroupColors[aminoAcidGroups[amino]]
            );

      return createSequenceGradient({
        colorStep: letterWidth,
        gradientCount: rowsNumber,
        colorsPerGradient: rowLettersNumber,
        rowHeight: fontSize,
        colorSets: sequenceColors,
        initialY: (lineHeight - fontSize) / 2,
        yStep: lineHeight,
      });
    });
  }, [fontSize, isAllSequencesMounted, letterWidth, sequences]);

  const handleToggleBackground = useCallback(
    () => setIsBackgroundShown((prev) => !prev),
    []
  );

  const updateSequencesBackground = useCallback(() => {
    if (!isBackgroundShown) {
      sequencesBackgroundsRef.current = null;
      return;
    }

    const currentBackgrounds = getSequencesBackgrounds();

    sequenceElementsRef?.current?.forEach((sequenceElement, index) => {
      if (!sequenceElement) return;

      sequenceElement.style.background = currentBackgrounds?.[index] ?? "";
      sequencesBackgroundsRef.current = currentBackgrounds;
    });
  }, [getSequencesBackgrounds, isBackgroundShown]);

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
    sequences,
    setSequencesPosition,
    updateSequencesBackground,
  ]);

  const handleFormSubmit = useCallback((data: FormData) => {
    setSequences(() => Object.values(data).map((value) => value.toUpperCase()));
  }, []);

  const handleSequenceSizeChange = useCallback(
    (event: SelectChangeEvent<SequenceSize>) => {
      setSequenceSize(event.target.value);

      sequencesBackgroundsRef.current = null;
    },
    []
  );

  const handleResetSequences = useCallback(() => {
    setSequences([]);
    setIsAllSequencesMounted(false);
    sequencesBackgroundsRef.current = null;
  }, []);

  const onLastSequenceRender = useCallback(() => {
    setIsAllSequencesMounted(true);
  }, []);

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
