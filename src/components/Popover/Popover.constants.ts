import { AminoAcidGroup } from "../Form/Form.types";

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
  { symbol: "C", name: "Цистеин" },
  { symbol: "E", name: "Глутаминовая кислота" },
  { symbol: "Q", name: "Глутамин" },
  { symbol: "G", name: "Глицин" },
  { symbol: "H", name: "Гистидин" },
  { symbol: "I", name: "Изолейцин" },
  { symbol: "L", name: "Лейцин" },
  { symbol: "K", name: "Лизин" },
  { symbol: "M", name: "Метионин" },
  { symbol: "F", name: "Фенилаланин" },
  { symbol: "P", name: "Пролин" },
  { symbol: "S", name: "Серин" },
  { symbol: "T", name: "Треонин" },
  { symbol: "W", name: "Триптофан" },
  { symbol: "Y", name: "Тирозин" },
  { symbol: "V", name: "Валин" },
];
