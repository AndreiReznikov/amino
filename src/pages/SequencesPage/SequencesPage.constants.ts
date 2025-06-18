import { AminoAcid, AminoAcidGroup } from "./SequencesPage.types";

export const DEFAULT_SEQUENCE_Z_INDEX = "10";

export const SEQUENCE_FONT_OPTIONS = {
  small: { fontSize: 18, letterWidth: 11.02, label: "Масштаб - 1x" },
  medium: { fontSize: 36, letterWidth: 21.8, label: "Масштаб - 2x" },
  large: { fontSize: 54, letterWidth: 32.6, label: "Масштаб - 3x" },
  xlarge: { fontSize: 72, letterWidth: 43.4, label: "Масштаб - 4x" },
  huge: { fontSize: 90, letterWidth: 54.2, label: "Масштаб - 5x" },
} as const;

export const AMINO_ACID_GROUPS: Record<AminoAcid, AminoAcidGroup> = {
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

export const AMINO_ACID_GROUP_COLORS: Record<AminoAcidGroup, string> = {
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
    helperTextFontSize: "14px",
    helperTextMinHeight: "70px",
    placeholder: "GIVEQ-CCT...",
    required: "Это поле обязательно",
    message: "Допустимы только латинские буквы аминокислот и символ -",
    defaultMessage:
      "Только стандартные аминокислоты: A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y и символ - (в любом регистре)",
  },
  {
    name: "field2",
    variant: "standard",
    label: "Целевая последовательность",
    helperTextFontSize: "14px",
    helperTextMinHeight: "70px",
    placeholder: "GIVEQ-CCT...",
    required: "Это поле обязательно",
    message: "Допустимы только латинские буквы аминокислот и символ -",
    defaultMessage:
      "Только стандартные аминокислоты: A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y и символ - (в любом регистре)",
  },
];
