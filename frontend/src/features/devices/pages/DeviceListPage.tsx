import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { RequestState } from "../../../shared/api/types.ts";
import ErrorMessage from "../../../shared/ui/ErrorMessage.tsx";
import LoadingIndicator from "../../../shared/ui/LoadingIndicator.tsx";
import { listDevices, listMyDevices } from "../api.ts";
import DeviceTable from "../components/DeviceTable.tsx";
import type { Device } from "../types.ts";

export default function DeviceListPage({
  currentUser = false,
}: {
  currentUser?: boolean;
}) {
  const [state, setState] = useState<RequestState<Device[]>>({
    status: "loading",
  });

  useEffect(() => {
    let ignore = false;
    const request = currentUser ? listMyDevices() : listDevices();

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
  }, [currentUser]);

  return (
    <>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
      >
        <Typography variant="h1">
          {currentUser ? "My devices" : "Devices"}
        </Typography>

        {!currentUser && (
          <Button variant="contained" component={Link} to="/devices/new">
            New Device
          </Button>
        )}
      </Stack>
      {state.status === "loading" && <LoadingIndicator />}
      {state.status === "error" && <ErrorMessage>{state.message}</ErrorMessage>}
      {state.status === "success" && (
        <DeviceTable devices={state.data} readOnly={currentUser} />
      )}{" "}
    </>
  );
}
