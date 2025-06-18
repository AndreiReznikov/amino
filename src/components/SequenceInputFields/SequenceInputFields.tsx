import React from "react";
import { TextField, TextFieldVariants } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormData } from "../../pages/SequencesPage/SequencesPage.types";
import { ALLOWED_CHARS_REGEX } from "./SequenceInputFields.constants";
import styles from "./SequenceInputFields.module.css";

type SequenceInputFieldsProps = {
  fields: {
    name: string;
    variant?: string;
    label?: string;
    helperTextFontSize?: string;
    helperTextMinHeight?: string;
    placeholder?: string;
    required?: string;
    message?: string;
    defaultMessage?: string;
  }[];
};

export const SequenceInputFields: React.FC<SequenceInputFieldsProps> = ({
  fields,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <>
      {fields.map((field) => (
        <div key={field.name} className={styles.textFieldContainer}>
          <TextField
            className={styles.textField}
            variant={field.variant as TextFieldVariants}
            label={field.label}
            placeholder={field.placeholder}
            {...register(field.name as keyof FormData, {
              required: field.required,
              pattern: {
                value: ALLOWED_CHARS_REGEX,
                message: field.message ?? "",
              },
            })}
            error={!!errors[field.name as keyof FormData]}
            helperText={
              errors[field.name as keyof FormData]?.message ??
              field.defaultMessage
            }
            slotProps={{
              inputLabel: { shrink: true },
              formHelperText: {
                style: {
                  fontSize: field.helperTextFontSize,
                  minHeight: field.helperTextMinHeight,
                },
              },
            }}
          />
        </div>
      ))}
    </>
  );
};
