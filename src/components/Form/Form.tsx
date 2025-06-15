import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./form.module.css";

type FormData = {
  field1: string;
  field2: string;
};

export function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    trigger,
    clearErrors,
    control,
  } = useForm<FormData>();

  const [field1Value, field2Value] = useWatch({
    control,
    name: ["field1", "field2"],
  });

  useEffect(() => {
    if (
      errors.field1?.type === "validate" ||
      errors.field2?.type === "validate"
    ) {
      if (field1Value?.length === field2Value?.length) {
        clearErrors(["field1", "field2"]);
      }
    }
  }, [field1Value, field2Value, errors, clearErrors]);

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const allowedCharsRegex = /^[ARNDCEQGHILKMFPSTWYV\-]+$/i;

  const validateLength = (value: string) => {
    if (!isSubmitted) return true;
    return (
      field1Value?.length === field2Value?.length ||
      "Длины строк должны быть одинаковыми"
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        variant="standard"
        label="Эталонная последовательность"
        placeholder="GIVEQ-CCTSI..."
        slotProps={{
          inputLabel: { shrink: true },
        }}
        {...register("field1", {
          required: "Это поле обязательно",
          pattern: {
            value: allowedCharsRegex,
            message: "Допустимы только латинские буквы аминокислот и символ -",
          },
          validate: validateLength,
        })}
        error={!!errors.field1 && isSubmitted}
        onBlur={() => trigger("field2")}
      />
      {errors.field1 && isSubmitted && (
        <span style={{ color: "red" }}>{errors.field1.message}</span>
      )}

      <TextField
        variant="standard"
        label="Целевая последовательность"
        placeholder="GIVEQ-CCTSI..."
        slotProps={{
          inputLabel: { shrink: true },
        }}
        {...register("field2", {
          required: "Это поле обязательно",
          pattern: {
            value: allowedCharsRegex,
            message: "Допустимы только латинские буквы аминокислот и символ -",
          },
          validate: validateLength,
        })}
        error={!!errors.field2 && isSubmitted}
        onBlur={() => trigger("field1")}
      />
      {errors.field2 && isSubmitted && (
        <span style={{ color: "red" }}>{errors.field2.message}</span>
      )}

      <Button type="submit" variant="outlined">
        Выравнивание
      </Button>
    </form>
  );
}
