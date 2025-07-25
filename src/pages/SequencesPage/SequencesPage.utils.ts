import { DEFAULT_COLOR } from "./SequencesPage.constants";
import {
  AminoAcid,
  AminoAcidDifference,
  AminoAcidGroup,
  DifferenceType,
  SequenceGradientOptions,
} from "./SequencesPage.types";

export const createSequenceGradient = (
  options: SequenceGradientOptions
): string => {
  const {
    colorStep,
    gradientCount,
    colorsPerGradient,
    rowHeight,
    colorSets = [],
    initialY,
    yStep,
    defaultColor = DEFAULT_COLOR,
  } = options;
  const requiredColorsCount = gradientCount * colorsPerGradient;

  const paddedColorSets = [...colorSets];

  while (paddedColorSets.length < requiredColorsCount) {
    paddedColorSets.push(defaultColor);
  }

  const finalColorSets = paddedColorSets.slice(0, requiredColorsCount);

  let backgroundValue = "";

  for (let i = 0; i < gradientCount; i++) {
    const currentY = initialY + i * yStep;

    const startIdx = i * colorsPerGradient;
    const endIdx = startIdx + colorsPerGradient;
    const currentColors = finalColorSets.slice(startIdx, endIdx);

    let gradientParts = [];

    for (let j = 0; j < colorsPerGradient; j++) {
      const start = j * colorStep;
      const end = (j + 1) * colorStep;

      if (
        i === 1 &&
        j === colorsPerGradient - 1 &&
        currentColors[j] === DEFAULT_COLOR
      ) {
        gradientParts.push(`${DEFAULT_COLOR} ${start}px`);
      } else {
        gradientParts.push(`${currentColors[j]} ${start}px ${end}px`);
      }
    }

    const gradient = `linear-gradient(90deg, ${gradientParts.join(", ")})`;
    const position = `0px ${currentY}px`;
    const size = `${colorStep * colorsPerGradient}px ${rowHeight}px`;

    backgroundValue += `${gradient} ${position} / ${size} no-repeat`;

    if (i < gradientCount - 1) {
      backgroundValue += ", ";
    }
  }

  return backgroundValue;
};

export const getSequenceColors = ({
  index,
  sequence,
  referenceSequenceAminoChain,
  referenceSequenceColors,
  sequencesDifferencesRef,
  groupColors,
  groups,
}: {
  index: number;
  sequence: AminoAcid[];
  referenceSequenceAminoChain: AminoAcid[];
  referenceSequenceColors: string[];
  sequencesDifferencesRef: React.RefObject<Record<number, AminoAcidDifference>>;
  groupColors: Record<AminoAcidGroup, string>;
  groups: Record<AminoAcid, AminoAcidGroup>;
}) => {
  if (index === 0) {
    return referenceSequenceColors;
  }

  return sequence?.map((amino, i) =>
    getAminoColor({
      amino,
      index: i,
      referenceSequenceAminoChain,
      sequencesDifferencesRef,
      groupColors,
      groups,
    })
  );
};

const getAminoColor = ({
  index,
  amino,
  referenceSequenceAminoChain,
  sequencesDifferencesRef,
  groupColors,
  groups,
}: {
  index: number;
  amino: AminoAcid;
  referenceSequenceAminoChain: AminoAcid[];
  sequencesDifferencesRef: React.RefObject<Record<number, AminoAcidDifference>>;
  groupColors: Record<AminoAcidGroup, string>;
  groups: Record<AminoAcid, AminoAcidGroup>;
}) => {
  updateDifferencesRef(
    amino,
    referenceSequenceAminoChain[index],
    index,
    sequencesDifferencesRef
  );

  if (amino === referenceSequenceAminoChain[index]) {
    return DEFAULT_COLOR;
  }

  return groupColors[groups[amino]] ?? DEFAULT_COLOR;
};

const getDifferencesType = (
  refAmino: AminoAcid | "-",
  amino: AminoAcid | "-"
): string => {
  switch (true) {
    case amino === refAmino:
      return DifferenceType.MATCH;
    case refAmino === "-":
      return `${DifferenceType.INSERTION} ${refAmino} → ${amino}`;
    case amino === "-":
      return `${DifferenceType.DELETION} ${amino} → ${refAmino}`;
    default:
      return `${DifferenceType.SUBSTITUTION} ${refAmino} → ${amino}`;
  }
};

const updateDifferencesRef = (
  amino: AminoAcid,
  refAmino: AminoAcid,
  index: number,
  sequencesDifferencesRef: React.RefObject<Record<number, AminoAcidDifference>>
) => {
  if (!sequencesDifferencesRef.current[index]) {
    sequencesDifferencesRef.current[index] = {
      refAmino,
    };
  }

  sequencesDifferencesRef.current[index].targetAmino = amino;
  sequencesDifferencesRef.current[index].diffType = getDifferencesType(
    refAmino,
    amino
  );
};
