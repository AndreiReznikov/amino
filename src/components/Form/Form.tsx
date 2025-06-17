import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import styles from "./Form.module.css";
import { createSequenceGradient } from "./Form.utils";
import {
  ALLOWED_CHARS_REGEX,
  aminoAcidGroupColors,
  aminoAcidGroups,
  SEQUENCE_FONT_OPTIONS,
} from "./Form.constants";
import { AminoAcid } from "./Form.types";
import { AminoAcidLegendPopover } from "../Popover";
import { SequencesList } from "../SequencesList";

type FormData = {
  field1: string;
  field2: string;
};

type SequenceSize = keyof typeof SEQUENCE_FONT_OPTIONS;

export const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

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
          <div className={styles.textFieldContainer}>
            <TextField
              variant="standard"
              label="Эталонная последовательность"
              placeholder="GIVEQ-CCTSI..."
              sx={{ width: "100%" }}
              {...register("field1", {
                required: "Это поле обязательно",
                pattern: {
                  value: ALLOWED_CHARS_REGEX,
                  message:
                    "Допустимы только латинские буквы аминокислот и символ -",
                },
              })}
              error={!!errors.field1}
              helperText={errors.field1?.message}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: { style: { fontSize: "16px" } },
              }}
            />
          </div>

          <div className={styles.textFieldContainer}>
            <TextField
              variant="standard"
              label="Целевая последовательность"
              placeholder="GIVEQ-CCTSI..."
              sx={{ width: "100%" }}
              {...register("field2", {
                required: "Это поле обязательно",
                pattern: {
                  value: ALLOWED_CHARS_REGEX,
                  message:
                    "Допустимы только латинские буквы аминокислот и символ -",
                },
              })}
              error={!!errors.field2}
              helperText={errors.field2?.message}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: { style: { fontSize: "18px" } },
              }}
            />
          </div>
        </div>

        <Button type="submit" variant="outlined">
          Выравнивание
        </Button>
      </form>
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
