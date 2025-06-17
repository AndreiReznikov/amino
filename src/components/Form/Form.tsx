import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import styles from "./Form.module.css";
import { createSequenceGradient } from "./Form.utils";
import {
  aminoAcidGroupColors,
  aminoAcidGroups,
  SEQUENCE_FONT_OPTIONS,
} from "./Form.constants";
import { AminoAcid } from "./Form.types";
import { AminoAcidLegendPopover } from "../Popover";
import { SequencesList } from "../SequencesList";
import { SequenceInputFields } from "../SequenceInputFields";

type FormData = {
  field1: string;
  field2: string;
};

type SequenceSize = keyof typeof SEQUENCE_FONT_OPTIONS;

const FIELDS_OPTIONS = [
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

export const Form: React.FC = () => {
  const methods = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, setError } = methods;

  const [sequences, setSequences] = useState<string[]>([]);
  const [isBackgroundShown, setIsBackgroundShown] = useState<boolean>(true);
  const [isAllSequencesMounted, setIsAllSequencesMounted] =
    useState<boolean>(false);
  const [sequenceSize, setSequenceSize] = useState<SequenceSize>("small");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const sequenceElementsRef = useRef<(HTMLDivElement | null)[]>([]);
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

  const sequencesBackgroundsRef = useRef<string[] | null>(null);

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

  const onSubmit = useCallback(
    (data: FormData) => {
      if (data.field1.length !== data.field2.length) {
        setError("field1", {
          type: "validate",
          message: "Длины строк должны быть одинаковыми",
        });
        setError("field2", {
          type: "validate",
          message: "Длины строк должны быть одинаковыми",
        });

        return;
      }

      setSequences(() =>
        Object.values(data).map((value) => value.toUpperCase())
      );
      sequencesBackgroundsRef.current = null;
    },
    [setError]
  );

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

  const handleLegendButtonClick = useCallback(() => {
    setAnchorEl(buttonRef.current);
  }, []);

  const handleLegendButtonClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onLastSequenceRender = useCallback(() => {
    setIsAllSequencesMounted(true);
  }, []);

  return (
    <>
      <FormProvider {...methods}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.configurationPanelContainer}>
            <div className={styles.legendContainer}>
              <Button
                ref={buttonRef}
                variant="outlined"
                onClick={handleLegendButtonClick}
              >
                Легенда
              </Button>

              <AminoAcidLegendPopover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleLegendButtonClose}
              />
            </div>
            <div className={styles.panelActionsContainer}>
              <Button
                onClick={handleResetSequences}
                type="reset"
                variant="contained"
              >
                Очистить
              </Button>
              <Select
                className={styles.fontOptionsSelector}
                value={sequenceSize}
                onChange={handleSequenceSizeChange}
              >
                {Object.entries(SEQUENCE_FONT_OPTIONS).map(([key, option]) => (
                  <MenuItem key={key} value={key}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormControlLabel
                control={
                  <Switch
                    onClick={handleToggleBackground}
                    checked={isBackgroundShown}
                  />
                }
                label="Фон"
              />
            </div>
          </div>
          <div className={styles.inputsContainer}>
            <SequenceInputFields fields={FIELDS_OPTIONS} />
          </div>

          <Button type="submit" variant="outlined">
            Выравнивание
          </Button>
        </form>
      </FormProvider>
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
