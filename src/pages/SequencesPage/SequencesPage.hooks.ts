import { useCallback, useRef } from "react";
import {
  aminoAcidGroupColors,
  aminoAcidGroups,
} from "./SequencesPage.constants";
import { AminoAcid } from "./SequencesPage.types";
import { createSequenceGradient } from "./SequencesPage.utils";

export const useSequencesBackground = ({
  sequences,
  isBackgroundShown,
  isAllSequencesMounted,
  fontSize,
  letterWidth,
  sequenceElementsRef,
}: {
  sequences: string[];
  isBackgroundShown: boolean;
  isAllSequencesMounted: boolean;
  fontSize: number;
  letterWidth: number;
  sequenceElementsRef: React.RefObject<(HTMLDivElement | null)[]>;
}) => {
  const sequencesBackgroundsRef = useRef<string[] | null>(null);

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
  }, [
    fontSize,
    isAllSequencesMounted,
    letterWidth,
    sequenceElementsRef,
    sequences,
  ]);

  const setSequencesBackground = useCallback(() => {
    sequenceElementsRef?.current?.forEach((sequenceElement, index) => {
      if (!sequenceElement) return;

      sequenceElement.style.background = !isBackgroundShown
        ? "transparent"
        : sequencesBackgroundsRef.current?.[index] ?? "";
    });
  }, [isBackgroundShown, sequenceElementsRef]);

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
  }, [
    getSequencesBackgrounds,
    isBackgroundShown,
    sequenceElementsRef,
    sequencesBackgroundsRef,
  ]);

  return { sequencesBackgroundsRef, setSequencesBackground, updateSequencesBackground };
};

export const useSequencesPosition = ({
  isAllSequencesMounted,
  fontSize,
  sequenceElementsRef,
}: {
  isAllSequencesMounted: boolean;
  fontSize: number;
  sequenceElementsRef: React.RefObject<(HTMLDivElement | null)[]>;
}) => {
  const setSequencesPosition = useCallback(() => {
    if (!isAllSequencesMounted) return;

    const sequencesCount = sequenceElementsRef?.current.length;

    sequenceElementsRef?.current?.forEach((sequenceElement, index) => {
      sequenceElement?.style.setProperty("top", `${index * fontSize}px`);
      sequenceElement?.style.setProperty("font-size", `${fontSize}px`);
      sequenceElement?.style.setProperty("line-height", `${sequencesCount}`);
    });
  }, [fontSize, isAllSequencesMounted, sequenceElementsRef]);

  return { setSequencesPosition };
};
