import { AminoAcidGroup } from "../../../pages/SequencesPage/SequencesPage.types";

export const AMINO_GROUP_NAMES: Record<AminoAcidGroup, string> = {
  cysteine: "Цистеин",
  glycine: "Глицин",
  hydrophobic: "Гидрофобные",
  negativelyCharged: "Отрицательно заряженные",
  positivelyCharged: "Положительно заряженные",
  polarUncharged: "Полярные незаряженные",
};

export const AMINO_ACID_NAMES = [
  { symbol: "A", name: "Аланин" },
  { symbol: "R", name: "Аргинин" },
  { symbol: "N", name: "Аспарагин" },
  { symbol: "D", name: "Аспарагиновая кислота" },
  { symbol: "V", name: "Валин" },
  { symbol: "H", name: "Гистидин" },
  { symbol: "G", name: "Глицин" },
  { symbol: "E", name: "Глутаминовая кислота" },
  { symbol: "Q", name: "Глутамин" },
  { symbol: "I", name: "Изолейцин" },
  { symbol: "L", name: "Лейцин" },
  { symbol: "K", name: "Лизин" },
  { symbol: "M", name: "Метионин" },
  { symbol: "P", name: "Пролин" },
  { symbol: "S", name: "Серин" },
  { symbol: "Y", name: "Тирозин" },
  { symbol: "T", name: "Треонин" },
  { symbol: "W", name: "Триптофан" },
  { symbol: "F", name: "Фенилаланин" },
  { symbol: "C", name: "Цистеин" },
];
