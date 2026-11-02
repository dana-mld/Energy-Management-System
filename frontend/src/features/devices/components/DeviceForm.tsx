import { Box, Button, CircularProgress, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { ApiError } from "../../../shared/api/errors.ts";
import type { FieldErrors } from "../../../shared/api/types.ts";
import type { FormField, NewDevice } from "../types.ts";
import { toNewDevice, validate } from "../validation.ts";
import type { FormValues } from "../validation.ts";
import ErrorMessage from "../../../shared/ui/ErrorMessage.tsx";
import { listPersons } from "../../persons/api.ts";
import type { Person } from "../../persons/types.ts";

interface DeviceFormProps {
  onSubmit: (device: NewDevice) => Promise<void>;
  initialValues?: NewDevice;
  submitLabel?: string;
  onCancel?: () => void;
}

const EMPTY: FormValues = {
  name: "",
  maximum_consumption: "",
  description: "",
  userId: "",
};

const LABELS: Record<FormField, string> = {
  name: "Name",
  maximum_consumption: "Maximum consumption",
  description: "Description",
  userId: "Assigned user",
};

const HINTS: Record<FormField, string> = {
  name: "Enter the device name.",
  maximum_consumption: "Enter the maximum consumption.",
  description: "Enter a description.",
  userId: "Choose a user, or select Not assigned to remove the assignment.",
};

export default function DeviceForm({
  onSubmit,
  initialValues,
  submitLabel = "Create Device",
  onCancel,
}: DeviceFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    initialValues
      ? {
          name: initialValues.name,
          maximum_consumption: String(initialValues.maximum_consumption),
          description: initialValues.description,
          userId: initialValues.userId ?? "",
        }
      : { ...EMPTY },
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<Person[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setUsersLoading(true);
    setUsersError("");

    listPersons()
      .then((persons) => {
        if (active) {
          setUsers(
            [...persons].sort(
              (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
            ),
          );
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setUsersError(
            error instanceof Error ? error.message : "Users could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setUsersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const selectedUserMissing =
    values.userId !== "" && !users.some((person) => person.id === values.userId);

  function handleChange(field: keyof FormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(toNewDevice(values));
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

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        {(
          ["name", "maximum_consumption", "description"] as const
        ).map((field) => (
          <TextField
            key={field}
            id={field}
            label={LABELS[field]}
            type={field === "maximum_consumption" ? "number" : "text"}
            slotProps={
              field === "maximum_consumption"
                ? { htmlInput: { step: "any" } }
                : undefined
            }
            value={values[field]}
            onChange={(event) => handleChange(field, event.target.value)}
            error={errors[field] !== undefined}
            helperText={errors[field] ?? HINTS[field]}
          />
        ))}
        <TextField
          select
          id="userId"
          label={LABELS.userId}
          value={values.userId}
          onChange={(event) => handleChange("userId", event.target.value)}
          disabled={usersLoading || usersError !== "" || submitting}
          error={errors.userId !== undefined || usersError !== ""}
          helperText={
            errors.userId ??
            (usersLoading
              ? "Loading users..."
              : usersError
                ? "User selection is unavailable. The current assignment is preserved."
                : users.length === 0
                  ? "No users available. The device can remain unassigned."
                  : HINTS.userId)
          }
        >
          <MenuItem value="">Not assigned</MenuItem>
          {selectedUserMissing && (
            <MenuItem value={values.userId}>
              Current assignment ({values.userId})
            </MenuItem>
          )}
          {users.map((person) => (
            <MenuItem key={person.id} value={person.id}>
              {person.name} ({person.id})
            </MenuItem>
          ))}
        </TextField>
        {usersError && (
          <Stack spacing={1}>
            <ErrorMessage>{usersError}</ErrorMessage>
            <Button
              type="button"
              onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              disabled={submitting}
              sx={{ alignSelf: "flex-start" }}
            >
              Retry loading users
            </Button>
          </Stack>
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
            {submitting ? "Saving…" : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          ) : (
            <Button component={Link} to="/devices" disabled={submitting}>
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
