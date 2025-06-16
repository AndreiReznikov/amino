import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Switch,
  TextField,
} from "@mui/material";
import styles from "./Form.module.css";
import { applyComplexGradient } from "./Form.utils";
import {
  ALLOWED_CHARS_REGEX,
  aminoAcidGroupColors,
  aminoAcidGroups,
  FONT_SIZE,
  LETTER_WIDTH,
} from "./Form.constants";
import { AminoAcid } from "./Form.types";

type FormData = {
  field1: string;
  field2: string;
};

interface SequenceProps {
  sequence: string;
  index: number;
  isLastSequence?: boolean;
  setIsAllSequencesMounted?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sequence = React.forwardRef<HTMLDivElement, SequenceProps>(
  ({ sequence, index, isLastSequence, setIsAllSequencesMounted }, ref) => {
    useEffect(() => {
      if (!isLastSequence) return;

      setIsAllSequencesMounted?.(() => true);
    }, [setIsAllSequencesMounted, isLastSequence]);

    return (
      <div
        ref={ref}
        className={`${styles.sequence} ${
          index === 0 ? styles.referenceSequence : ""
        }`}
      >
        {sequence}
      </div>
    );
  }
);

export function Form() {
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
  const [sequenceFontOptions, setSequenceFontOptions] = useState<number>(18);
  const sequenceElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const setSequencesPosition = useCallback(() => {
    if (!isAllSequencesMounted) return;

    const sequencesCount = sequenceElementsRef?.current.length;

    sequenceElementsRef?.current?.forEach((sequenceElement, index) => {
      sequenceElement?.style.setProperty("top", `${index * FONT_SIZE}px`);
      sequenceElement?.style.setProperty("font-size", `${FONT_SIZE}px`);
      sequenceElement?.style.setProperty("line-height", `${sequencesCount}`);
    });
  }, [isAllSequencesMounted]);

  const getSequencesBackgrounds = useCallback(() => {
    if (!isAllSequencesMounted) return null;

    const sequencesCount = sequenceElementsRef.current?.length;
    const lineHeight = FONT_SIZE * sequencesCount;
    const referenceSequenceAminoChain = sequences[0]?.split("") as AminoAcid[];
    const referenceSequenceColors = referenceSequenceAminoChain.map(
      (amino) => aminoAcidGroupColors[aminoAcidGroups[amino]] ?? "transparent"
    );
    return sequenceElementsRef?.current?.map((sequenceElement, index) => {
      const sequence = sequences[index].split("") as AminoAcid[];
      const sequenceWidth = sequenceElement?.clientWidth ?? 0;
      const sequenceModelWidth = LETTER_WIDTH * sequence.length;
      const sequenceRatioWidth =
        sequenceWidth === Math.floor(sequenceModelWidth)
          ? sequenceModelWidth
          : sequenceWidth;

      const sequenceLettersRatio =
        Math.round((sequenceRatioWidth / LETTER_WIDTH) * 100) / 100;
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

      return applyComplexGradient(sequenceElement, {
        colorStep: LETTER_WIDTH,
        gradientCount: rowsNumber,
        colorsPerGradient: rowLettersNumber,
        rowHeight: FONT_SIZE,
        colorSets: sequenceColors,
        initialY: (lineHeight - FONT_SIZE) / 2,
        yStep: lineHeight,
      });
    });
  }, [isAllSequencesMounted, sequences]);

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

  const handleSequenceFontOptionsChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      setSequenceFontOptions(event?.target.value);
    },
    []
  );

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.configurationPanelContainer}>
          <Select
            className={styles.fontOptionsSelector}
            value={sequenceFontOptions}
            onChange={handleSequenceFontOptionsChange}
          >
            <MenuItem value={18}>Небольшой</MenuItem>
            <MenuItem value={36}>Средний</MenuItem>
            <MenuItem value={72}>Крупный</MenuItem>
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
                formHelperText: { style: { fontSize: "16px" } },
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
          {sequences?.map((sequence, index) => (
            <Sequence
              key={`${sequence}-${index}`}
              ref={(node) => {
                if (node) {
                  sequenceElementsRef.current[index] = node;
                }
              }}
              sequence={sequence}
              index={index}
              isLastSequence={index === sequences.length - 1}
              setIsAllSequencesMounted={setIsAllSequencesMounted}
            />
          ))}
        </div>
      </div>
    </>
  );
}
