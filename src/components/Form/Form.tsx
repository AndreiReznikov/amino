import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./form.module.css";
import { applyComplexGradient } from "./Form.utils";

type FormData = {
  field1: string;
  field2: string;
};

const allowedCharsRegex = /^[ARNDCEQGHILKMFPSTWYV\-]+$/i;

const FONT_SIZE = 24;
const LETTER_WIDTH = 13.19;
const AMINO_COLORS: Record<string, string> = {
  A: "blue",
  R: "green",
  N: "orange",
  D: "red",
  C: "yellow",
  E: "pink",
  Q: "purple",
  G: "orange",
  H: "pink",
  I: "purple",
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
  const [isAllSequencesMounted, setIsAllSequencesMounted] =
    useState<boolean>(false);
  const sequenceElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const updateSequencesBackground = useCallback(() => {
    const sequencesCount = sequenceElementsRef.current?.length;
    const lineHeight = FONT_SIZE * sequencesCount;
    const referenceSequenceAminoChain = sequences[0]?.split("");
    const referenceSequenceColors = referenceSequenceAminoChain.map(
      (amino) => AMINO_COLORS[amino] ?? "transparent"
    );

    sequenceElementsRef.current.forEach((sequenceElement, index) => {
      sequenceElement?.style.setProperty("font-size", `${FONT_SIZE}px`);
      sequenceElement?.style.setProperty("line-height", `${lineHeight}px`);
      sequenceElement?.style.setProperty("top", `${index * FONT_SIZE}px`);

      const sequence = sequences[index].split("");
      const sequenceWidth = sequenceElement?.clientWidth ?? 0;
      const sequenceLettersRatio = sequenceWidth / LETTER_WIDTH;
      const rowLettersNumber =
        sequenceLettersRatio - Math.floor(sequenceLettersRatio) > 0.95
          ? Math.ceil(sequenceLettersRatio)
          : Math.floor(sequenceLettersRatio);
      const rowsNumber = Math.ceil(sequence.length / rowLettersNumber);
      console.log(LETTER_WIDTH * sequence.length, sequenceWidth);
      const sequenceColors =
        index === 0
          ? referenceSequenceColors
          : sequence?.map((amino, index) =>
              amino === referenceSequenceAminoChain[index]
                ? "transparent"
                : AMINO_COLORS[amino]
            );

      applyComplexGradient(sequenceElement, {
        colorStep: LETTER_WIDTH,
        gradientCount: rowsNumber,
        colorsPerGradient: rowLettersNumber,
        rowHeight: FONT_SIZE,
        colorSets: sequenceColors,
        initialY: (lineHeight - FONT_SIZE) / 2,
        yStep: lineHeight,
      });
    });
  }, [sequences]);

  useEffect(() => {
    if (!isAllSequencesMounted) return;

    updateSequencesBackground();

    const handleResize = () => updateSequencesBackground();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isAllSequencesMounted, sequences, updateSequencesBackground]);

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

      setIsAllSequencesMounted(() => false);
      setSequences(() =>
        Object.values(data).map((value) => value.toUpperCase())
      );
    },
    [setError]
  );

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                  value: allowedCharsRegex,
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
                  value: allowedCharsRegex,
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
