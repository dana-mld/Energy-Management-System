import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { RequestState } from "../../../shared/api/types.ts";
import ErrorMessage from "../../../shared/ui/ErrorMessage.tsx";
import LoadingIndicator from "../../../shared/ui/LoadingIndicator.tsx";
import {
  deletePerson,
  getPerson,
  getCurrentPerson,
  updatePerson,
  getAccountDetails,
  updateAccount,
} from "../api.ts";
import PersonForm from "../components/PersonForm.tsx";
import AccountForm from "../components/AccountForm.tsx";
import type { AccountDetails, Person, UpdatePerson } from "../types.ts";

import { useAuth } from "../../auth/AuthContext.tsx";
export default function PersonDetailPage({
  currentUser = false,
}: {
  currentUser?: boolean;
}) {
  const { id = "" } = useParams();

  return (
    <PersonDetails
      key={currentUser ? "current-user" : id}
      id={id}
      currentUser={currentUser}
    />
  );
}

function PersonDetails({
  id,
  currentUser,
}: {
  id: string;
  currentUser: boolean;
}) {
  const [state, setState] = useState<RequestState<Person>>({
    status: "loading",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const canDelete = user?.role === "ADMIN" && !currentUser;
  const [editing, setEditing] = useState(false);

  const canEdit = user?.role === "ADMIN" && !currentUser;
  const [accountState, setAccountState] = useState<RequestState<AccountDetails>>({ status: "loading" });
  const [editingAccount, setEditingAccount] = useState(false);
  const [accountLoadAttempt, setAccountLoadAttempt] = useState(0);

  useEffect(() => {
    if (!canEdit) return;
    let ignore = false;
    setAccountState({ status: "loading" });
    getAccountDetails(id)
      .then((data) => {
        if (!ignore) setAccountState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!ignore) setAccountState({
          status: "error",
          message: error instanceof Error ? error.message : "Could not load account details.",
        });
      });
    return () => { ignore = true; };
  }, [id, canEdit, accountLoadAttempt]);

  async function handleAccountUpdate(account: AccountDetails) {
    if (!canEdit || state.status !== "success") {
      throw new Error("Account updates are not allowed.");
    }
    await updateAccount(state.data.id, account);
    setAccountState({ status: "success", data: account });
    setEditingAccount(false);
  }

  async function handleDelete() {
    if (!canDelete || state.status !== "success" || deleting) {
      return;
    }

    const person = state.data;

    if (!window.confirm(`Delete person "${person.name}" and their account?`)) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deletePerson(person.id);
      navigate("/persons", { replace: true });
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Deletion failed.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdate(values: UpdatePerson) {
    if (!canEdit || state.status !== "success") {
      throw new Error("Editing is not allowed.");
    }

    const updatedPerson = await updatePerson(state.data.id, values);

    setState({
      status: "success",
      data: updatedPerson,
    });

    setEditing(false);
  }

  useEffect(() => {
    let ignore = false;
    const request = currentUser ? getCurrentPerson() : getPerson(id);

    request
      .then((data) => {
        if (!ignore) setState({ status: "success", data });
      })
      .catch((error: Error) => {
        if (!ignore) setState({ status: "error", message: error.message });
      });
    return () => {
      ignore = true;
    };
  }, [id, currentUser]);
  if (editing && canEdit && state.status === "success") {
    return (
      <>
        <Typography variant="h1" sx={{ mb: 3 }}>
          Edit person
        </Typography>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <PersonForm
            mode="edit"
            initialValues={state.data}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </Paper>
      </>
    );
  }
  return (
    <>
      <Typography variant="h1" sx={{ mb: 3 }}>
        {currentUser ? "My details" : "Person details"}
      </Typography>
      {state.status === "loading" && <LoadingIndicator />}
      {state.status === "error" && <ErrorMessage>{state.message}</ErrorMessage>}
      {state.status === "success" && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "9rem 1fr" },
              columnGap: 3,
              rowGap: { sm: 1.5 },
            }}
          >
            <Typography component="dt" sx={{ color: "text.secondary" }}>
              Identifier
            </Typography>
            <Typography
              component="dd"
              sx={{ m: 0, mb: { xs: 1.5, sm: 0 }, wordBreak: "break-all" }}
            >
              {state.data.id}
            </Typography>
            <Typography component="dt" sx={{ color: "text.secondary" }}>
              Name
            </Typography>
            <Typography component="dd" sx={{ m: 0, mb: { xs: 1.5, sm: 0 } }}>
              {state.data.name}
            </Typography>
            <Typography component="dt" sx={{ color: "text.secondary" }}>
              Address
            </Typography>
            <Typography component="dd" sx={{ m: 0, mb: { xs: 1.5, sm: 0 } }}>
              {state.data.address}
            </Typography>
            <Typography component="dt" sx={{ color: "text.secondary" }}>
              Age
            </Typography>
            <Typography component="dd" sx={{ m: 0, mb: { xs: 1.5, sm: 0 } }}>
              {state.data.age}
            </Typography>
          </Box>
        </Paper>
      )}

      {canEdit && state.status === "success" && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Account</Typography>
          {accountState.status === "loading" && <LoadingIndicator />}
          {accountState.status === "error" && (
            <>
              <ErrorMessage>{accountState.message}</ErrorMessage>
              <Button onClick={() => setAccountLoadAttempt((attempt) => attempt + 1)}>Retry</Button>
            </>
          )}
          {accountState.status === "success" && (
            editingAccount ? (
              <AccountForm
                initialValues={accountState.data}
                onSubmit={handleAccountUpdate}
                onCancel={() => setEditingAccount(false)}
              />
            ) : (
              <>
                <Typography sx={{ overflowWrap: "anywhere" }}>Username: {accountState.data.username}</Typography>
                <Typography>Role: {accountState.data.role}</Typography>
                <Button variant="outlined" onClick={() => setEditingAccount(true)} disabled={deleting || editingAccount} sx={{ mt: 2 }}>
                  Edit account
                </Button>
              </>
            )
          )}
        </Paper>
      )}

      {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
      {canEdit && state.status === "success" && (
        <Button
          variant="contained"
          onClick={() => {
            setDeleteError("");
            setEditing(true);
          }}
          disabled={deleting || editingAccount}
          sx={{ mt: 3, mr: 2 }}
        >
          Edit
        </Button>
      )}
      {canDelete && state.status === "success" && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={deleting || editingAccount}
          sx={{ mt: 3, mr: 2 }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      )}
      {!currentUser && (
        <Button
          variant="outlined"
          component={Link}
          to="/"
          sx={{ mt: 3 }}
        >
          Back home
        </Button>
      )}
    </>
  );
}
