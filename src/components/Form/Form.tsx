import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./form.module.css";

type FormData = {
  field1: string;
  field2: string;
};

const allowedCharsRegex = /^[ARNDCEQGHILKMFPSTWYV\-]+$/i;

const LETTER_WIDTH = 13.19;
const FONT_SIZE = 24;
const AMINO_COLORS = {
  A: "blue",
  B: "green",
  C: "orange",
  D: "red",
  E: "yellow",
  F: "pink",
  G: "purple",
  K: "orange",
  M: "pink",
  L: "purple",
};

interface SequenceProps {
  sequence: string;
  index: number;
  setIsReferenceMounted?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sequence = React.forwardRef<HTMLDivElement, SequenceProps>(
  ({ sequence, index, setIsReferenceMounted }, ref) => {
    useEffect(() => {
      setIsReferenceMounted?.(() => true);
    }, [setIsReferenceMounted]);

    return (
      <div
        ref={index === 0 ? ref : null}
        className={`sequence ${index === 0 ? "reference" : ""}`}
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
  const [isReferenceMounted, setIsReferenceMounted] = useState<boolean>(false);
  const referenceSequenceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReferenceMounted) return;

    console.log(referenceSequenceRef.current?.clientWidth);
  }, [isReferenceMounted]);

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

      setIsReferenceMounted(() => false);
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
              ref={index === 0 ? referenceSequenceRef : null}
              sequence={sequence}
              index={index}
              setIsReferenceMounted={setIsReferenceMounted}
            />
          ))}
        </div>
      </div>
    </>
  );
}
