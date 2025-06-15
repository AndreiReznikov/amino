import React from "react";
import { useForm } from "react-hook-form";
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
    formState: { errors },
    setError,
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const allowedCharsRegex = /^[ARNDCEQGHILKMFPSTWYV\-]+$/i;

  const onSubmit = (data: FormData) => {
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

    console.log("Форма отправлена:", data);
  };

  return (
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
  );
}
