import { AminoAcidGroup } from "../../../pages/SequencesPage/SequencesPage.types";

export const AMINO_GROUPS: Record<AminoAcidGroup, string> = {
  cysteine: "Цистеин",
  glycine: "Глицин",
  hydrophobic: "Гидрофобные",
  negativelyCharged: "Отрицательно заряженные",
  positivelyCharged: "Положительно заряженные",
  polarUncharged: "Полярные незаряженные",
};

export const AMINO_ACIDS = [
  { symbol: "A", name: "Аланин (A)" },
  { symbol: "R", name: "Аргинин (R)" },
  { symbol: "N", name: "Аспарагин (N)" },
  { symbol: "D", name: "Аспарагиновая кислота (D)" },
  { symbol: "V", name: "Валин (V)" },
  { symbol: "H", name: "Гистидин (H)" },
  { symbol: "G", name: "Глицин(G)" },
  { symbol: "E", name: "Глутаминовая кислота(E)" },
  { symbol: "Q", name: "Глутамин (Q)" },
  { symbol: "I", name: "Изолейцин (I)" },
  { symbol: "L", name: "Лейцин (L)" },
  { symbol: "K", name: "Лизин (K)" },
  { symbol: "M", name: "Метионин (M)" },
  { symbol: "P", name: "Пролин (P)" },
  { symbol: "S", name: "Серин (S)" },
  { symbol: "Y", name: "Тирозин (Y)" },
  { symbol: "T", name: "Треонин (T)" },
  { symbol: "W", name: "Триптофан (W)" },
  { symbol: "F", name: "Фенилаланин (F)" },
  { symbol: "C", name: "Цистеин (C)" },
];
