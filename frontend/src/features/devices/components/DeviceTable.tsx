import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import { filterAndSort } from "../list.ts";
import type { SortField, SortOrder } from "../list.ts";
import type { Device } from "../types.ts";

interface DeviceTableProps {
  devices: Device[];
  readOnly?: boolean;
}
export default function DeviceTable({
  devices,
  readOnly = false,
}: DeviceTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (devices.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" component="p">
          No devices yet
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}>
          {readOnly
            ? "No devices are assigned to your account."
            : "Create the first device to see it in this list."}
        </Typography>
        {!readOnly && (
          <Button variant="contained" component={Link} to="/devices/new">
            New Device
          </Button>
        )}
      </Paper>
    );
  }

  const matches = filterAndSort(devices, search, sortField, sortOrder);
  const lastPage = Math.max(0, Math.ceil(matches.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);
  const rows = matches.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage,
  );

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  return (
    <Paper variant="outlined">
      <Box sx={{ p: 2 }}>
        <TextField
          type="search"
          label="Search by name"
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          sx={{ maxWidth: { sm: 320 } }}
        />
      </Box>
      <TableContainer>
        <Table aria-label="Devices">
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={sortField === "name" ? sortOrder : false}
              >
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sortDirection={
                  sortField === "maximum_consumption" ? sortOrder : false
                }
              >
                <TableSortLabel
                  active={sortField === "maximum_consumption"}
                  direction={
                    sortField === "maximum_consumption" ? sortOrder : "asc"
                  }
                  onClick={() => handleSort("maximum_consumption")}
                >
                  Maximum consumption
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell align="right">
                <Box
                  component="span"
                  sx={{ position: "absolute", left: -9999 }}
                >
                  Actions
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((device) => (
              <TableRow key={device.id} hover>
                <TableCell>{device.name}</TableCell>
                <TableCell align="right">
                  {device.maximum_consumption}
                </TableCell>
                <TableCell>{device.description}</TableCell>
                <TableCell>{device.userId ?? "Not assigned"}</TableCell>
                <TableCell align="right">
                  {!readOnly && (
                    <Button
                      size="small"
                      component={Link}
                      to={`/devices/${device.id}`}
                    >
                      Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ py: 4, textAlign: "center", color: "text.secondary" }}
                >
                  No device matches “{search.trim()}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={matches.length}
        page={currentPage}
        onPageChange={(_event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        labelRowsPerPage="Rows"
      />
    </Paper>
  );
}
