import { SEQUENCE_FONT_OPTIONS } from "./SequencesPage.constants";

export type AminoAcid =
  | "A"
  | "R"
  | "N"
  | "D"
  | "C"
  | "E"
  | "Q"
  | "G"
  | "H"
  | "I"
  | "L"
  | "K"
  | "M"
  | "F"
  | "P"
  | "S"
  | "T"
  | "W"
  | "Y"
  | "V";

export type AminoAcidGroup =
  | "cysteine"
  | "hydrophobic"
  | "glycine"
  | "negativelyCharged"
  | "positivelyCharged"
  | "polarUncharged";

export type FormData = {
  field1: string;
  field2: string;
};

export type SequenceSize = keyof typeof SEQUENCE_FONT_OPTIONS;

export interface SequenceGradientOptions {
  colorStep: number;
  gradientCount: number;
  colorsPerGradient: number;
  rowHeight: number;
  initialY: number;
  yStep: number;
  colorSets?: string[];
  defaultColor?: string;
}

export interface AminoAcidDifference {
  refAmino?: string;
  targetAmino?: string;
  diffType?: string;
}

export enum DifferenceType {
  MATCH = "Совпадение",
  INSERTION = "Вставка",
  DELETION = "Делеция",
  SUBSTITUTION = "Замена",
}
