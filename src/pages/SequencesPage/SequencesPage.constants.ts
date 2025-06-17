import { AminoAcid, AminoAcidGroup } from "./SequencesPage.types";

export const ALLOWED_CHARS_REGEX = /^[ARNDCEQGHILKMFPSTWYV\-]+$/i;

export const aminoAcidGroups: Record<AminoAcid, AminoAcidGroup> = {
  C: "cysteine", // Cysteine (special case)
  G: "glycine", // Glycine (special case)

  // Hydrophobic
  A: "hydrophobic", // Alanine
  V: "hydrophobic", // Valine
  I: "hydrophobic", // Isoleucine
  L: "hydrophobic", // Leucine
  M: "hydrophobic", // Methionine
  F: "hydrophobic", // Phenylalanine
  P: "hydrophobic", // Proline
  W: "hydrophobic", // Tryptophan
  Y: "hydrophobic", // Tyrosine

  // Negatively charged
  D: "negativelyCharged", // Aspartic acid
  E: "negativelyCharged", // Glutamic acid

  // Positively charged
  R: "positivelyCharged", // Arginine
  K: "positivelyCharged", // Lysine

  // Polar uncharged
  S: "polarUncharged", // Serine
  T: "polarUncharged", // Threonine
  N: "polarUncharged", // Asparagine
  Q: "polarUncharged", // Glutamine
  H: "polarUncharged", // Histidine
};

export const aminoAcidGroupColors: Record<AminoAcidGroup, string> = {
  cysteine: "#FFEA00",
  glycine: "#C4C4C4",
  hydrophobic: "#67E4A6",
  negativelyCharged: "#FC9CAC",
  positivelyCharged: "#BB99FF",
  polarUncharged: "#80BFFF",
};

export const FIELDS_OPTIONS = [
  {
    name: "field1",
    variant: "standard",
    label: "Эталонная последовательность",
    helperTextFontSize: "18px",
    placeholder: "GIVEQ-CCTSI...",
    required: "Это поле обязательно",
    message: "Допустимы только латинские буквы аминокислот и символ -",
  },
  {
    name: "field2",
    variant: "standard",
    label: "Целевая последовательность",
    helperTextFontSize: "18px",
    placeholder: "GIVEQ-CCTSI...",
    required: "Это поле обязательно",
    message: "Допустимы только латинские буквы аминокислот и символ -",
  },
];
