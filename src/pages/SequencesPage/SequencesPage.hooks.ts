import { useCallback, useEffect, useRef } from "react";
import {
  AMINO_ACID_GROUP_COLORS,
  AMINO_ACID_GROUPS,
  DEFAULT_SEQUENCE_Z_INDEX,
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
      (amino) =>
        AMINO_ACID_GROUP_COLORS[AMINO_ACID_GROUPS[amino]] ?? "transparent"
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
                : AMINO_ACID_GROUP_COLORS[AMINO_ACID_GROUPS[amino]]
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

  return {
    sequencesBackgroundsRef,
    setSequencesBackground,
    updateSequencesBackground,
  };
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

export const useSequenceInteraction = (
  sequenceElements: (HTMLElement | null)[]
) => {
  let activeElement: HTMLElement | null = null;

  const resetZIndices = () => {
    sequenceElements.forEach((el) => {
      if (!el) return;

      el.style.zIndex = "";
    });
  };

  const activateElement = (element: HTMLElement) => {
    resetZIndices();
    element.style.zIndex = "10";
    activeElement = element;
  };

  const isOverText = (element: HTMLElement, x: number, y: number) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const rects = range.getClientRects();

    return Array.from(rects).some(
      (rect) =>
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const handlePointerMove = (x: number, y: number) => {
    for (let i = sequenceElements.length - 1; i >= 0; i--) {
      const element = sequenceElements[i];

      if (!element) continue;

      if (isOverText(element, x, y)) {
        if (activeElement !== element) {
          activateElement(element);
        }
        return;
      }
    }

    if (activeElement !== null) {
      resetZIndices();
      activeElement = null;
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("touchmove", handleTouchMove);

  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchmove", handleTouchMove);
  };
};

