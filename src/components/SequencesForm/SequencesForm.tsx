import React, { useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, SelectChangeEvent } from "@mui/material";
import { ActionsPanel } from "../ActionsPanel";
import { Legend } from "../Legend";
import { SequenceInputFields } from "../SequenceInputFields";
import {
  FIELDS_OPTIONS,
  SEQUENCE_FONT_OPTIONS,
} from "../../pages/SequencesPage/SequencesPage.constants";
import {
  FormData,
  SequenceSize,
} from "../../pages/SequencesPage/SequencesPage.types";
import styles from "./SequencesForm.module.css";

interface SequencesFormProps {
  onReset: () => void;
  onSwitch: () => void;
  onSubmit: (data: FormData) => void;
  onSelect: (event: SelectChangeEvent<SequenceSize>) => void;
  size: keyof typeof SEQUENCE_FONT_OPTIONS;
  checked: boolean;
  backgroundsRef: React.RefObject<string[] | null>;
}

export const SequencesForm: React.FC<SequencesFormProps> = ({
  onReset,
  onSelect,
  onSubmit,
  onSwitch,
  size,
  checked,
  backgroundsRef,
}) => {
  const methods = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, setError, watch, reset } = methods;

  const fieldValues = watch();

  const isFormValid = useMemo(
    () =>
      FIELDS_OPTIONS.every(
        (field) => fieldValues[field.name as keyof FormData]?.length > 0
      ),
    [fieldValues]
  );

  const onFormSubmit = useCallback(
    (data: FormData) => {
      if (data.field1.length !== data.field2.length) {
        FIELDS_OPTIONS.forEach((field) => {
          setError(field.name as keyof FormData, {
            type: "validate",
            message: "Длины строк должны быть одинаковыми",
          });
        });

        return;
      }

      onSubmit(data);
      backgroundsRef.current = null;
    },
    [backgroundsRef, onSubmit, setError]
  );

  const onFormReset = useCallback(() => {
    reset();
    onReset();
  }, [reset, onReset]);

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
        <div className={styles.configurationPanelContainer}>
          <Legend />
          <ActionsPanel
            onReset={onFormReset}
            onSelect={onSelect}
            onSwitch={onSwitch}
            size={size}
            checked={checked}
            valid={isFormValid}
          />
        </div>
        <div className={styles.inputsContainer}>
          <SequenceInputFields fields={FIELDS_OPTIONS} />
        </div>

        <Button type="submit" variant="contained" disabled={!isFormValid}>
          Выравнивание
        </Button>
      </form>
    </FormProvider>
  );
};
