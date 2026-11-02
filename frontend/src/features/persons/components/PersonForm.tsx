import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { ApiError } from "../../../shared/api/errors.ts";
import type { FieldErrors } from "../../../shared/api/types.ts";
import type { FormField, NewPerson, UpdatePerson } from "../types.ts";
import {
  toNewPerson,
  toUpdatePerson,
  validate,
  validateProfile,
} from "../validation.ts";
import type { FormValues } from "../validation.ts";
import ErrorMessage from "../../../shared/ui/ErrorMessage.tsx";

type PersonFormProps = {
  submitLabel?: string;
  onCancel?: () => void;
} & (
  | {
      mode?: "create";
      onSubmit: (person: NewPerson) => Promise<void>;
    }
  | {
      mode: "edit";
      initialValues: UpdatePerson;
      onSubmit: (person: UpdatePerson) => Promise<void>;
    }
);
const EMPTY: FormValues = {
  name: "",
  address: "",
  age: "",
  username: "",
  password: "",
  role: "CLIENT",
};

const LABELS: Record<FormField, string> = {
  name: "Name",
  address: "Address",
  age: "Age",
  username: "Username",
  password: "Password",
  role: "Role",
};
const HINTS: Partial<Record<FormField, string>> = {
  age: "Must be greater than 18.",
};

export default function PersonForm(props: PersonFormProps) {
  const editing = props.mode === "edit";

  const [values, setValues] = useState<FormValues>(() =>
    props.mode === "edit"
      ? {
          ...EMPTY,
          name: props.initialValues.name,
          address: props.initialValues.address,
          age: String(props.initialValues.age),
        }
      : { ...EMPTY },
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof FormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const found = editing ? validateProfile(values) : validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      if (props.mode === "edit") {
        await props.onSubmit(toUpdatePerson(values));
      } else {
        await props.onSubmit(toNewPerson(values));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors);
        setFormError(error.message);
      } else {
        setFormError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  }
  const fields = editing
    ? (["name", "address", "age"] as const)
    : (["name", "address", "age", "username", "password"] as const);
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        {fields.map((field) => (
          <TextField
            key={field}
            id={field}
            label={LABELS[field]}
            type={
              field === "age"
                ? "number"
                : field === "password"
                  ? "password"
                  : "text"
            }
            autoComplete={
              field === "password"
                ? "new-password"
                : field === "username"
                  ? "username"
                  : undefined
            }
            value={values[field]}
            onChange={(event) => handleChange(field, event.target.value)}
            error={errors[field] !== undefined}
            helperText={errors[field] ?? HINTS[field]}
          />
        ))}

        {!editing && (
          <TextField
            select
            id="role"
            label="Role"
            value={values.role}
            onChange={(event) => {
              const role = event.target.value;

              if (role === "CLIENT" || role === "ADMIN") {
                setValues((previous) => ({ ...previous, role }));
              }
            }}
            error={errors.role !== undefined}
            helperText={errors.role}
          >
            <MenuItem value="CLIENT">Client</MenuItem>
            <MenuItem value="ADMIN">Administrator</MenuItem>
          </TextField>
        )}

        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <Stack direction="row" spacing={1.5}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {submitting ? "Saving…" : (props.submitLabel ?? "Create person")}
          </Button>
          {props.onCancel ? (
            <Button
              type="button"
              onClick={props.onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          ) : (
            <Button component={Link} to="/persons" disabled={submitting}>
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
