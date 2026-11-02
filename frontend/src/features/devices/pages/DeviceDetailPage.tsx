import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { RequestState } from "../../../shared/api/types.ts";
import ErrorMessage from "../../../shared/ui/ErrorMessage.tsx";
import LoadingIndicator from "../../../shared/ui/LoadingIndicator.tsx";
import { getDevice, deleteDevice, updateDevice } from "../api.ts";
import type { Device, NewDevice } from "../types.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import DeviceForm from "../components/DeviceForm.tsx";
export default function DeviceDetailPage() {
  const { id = "" } = useParams();
  return <DeviceDetails key={id} id={id} />;
}

function DeviceDetails({ id }: { id: string }) {
  const [state, setState] = useState<RequestState<Device>>({
    status: "loading",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const canDelete = user?.role === "ADMIN";
  const [editing, setEditing] = useState(false);

  const canEdit = user?.role === "ADMIN";
  async function handleDelete() {
    if (!canDelete || state.status !== "success" || deleting) {
      return;
    }

    const device = state.data;

    if (!window.confirm(`Do you want to delete "${device.name}"?`)) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteDevice(device.id);
      navigate("/devices", { replace: true });
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Operation failed.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdate(values: NewDevice) {
    if (!canEdit || state.status !== "success") {
      throw new Error("Modificarea nu este permisă.");
    }

    const updatedDevice = await updateDevice(state.data.id, values);

    setState({
      status: "success",
      data: updatedDevice,
    });

    setEditing(false);
  }

  useEffect(() => {
    let ignore = false;
    getDevice(id)
      .then((data) => {
        if (!ignore) setState({ status: "success", data });
      })
      .catch((error: Error) => {
        if (!ignore) setState({ status: "error", message: error.message });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (editing && canEdit && state.status === "success") {
    return (
      <>
        <Typography variant="h1" sx={{ mb: 3 }}>
          Edit device
        </Typography>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <DeviceForm
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
        Device details
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
              Maximum consumption
            </Typography>
            <Typography component="dd" sx={{ m: 0, mb: { xs: 1.5, sm: 0 } }}>
              {state.data.maximum_consumption}
            </Typography>
            <Typography component="dt" sx={{ color: "text.secondary" }}>
              Description
            </Typography>
            <Typography component="dd" sx={{ m: 0, mb: { xs: 1.5, sm: 0 } }}>
              {state.data.description}
            </Typography>
            <Typography component="dt" sx={{ color: "text.secondary" }}>
              User ID
            </Typography>
            <Typography
              component="dd"
              sx={{ m: 0, mb: { xs: 1.5, sm: 0 }, wordBreak: "break-all" }}
            >
              {state.data.userId ?? "Not assigned"}
            </Typography>
          </Box>
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
          disabled={deleting}
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
          disabled={deleting}
          sx={{ mt: 3, mr: 2 }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      )}
      <Button variant="outlined" component={Link} to="/" sx={{ mt: 3 }}>
        Back home
      </Button>
    </>
  );
}
