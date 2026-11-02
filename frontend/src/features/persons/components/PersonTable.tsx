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
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router'
import { filterAndSort } from '../list.ts'
import type { SortField, SortOrder } from '../list.ts'
import type { Person } from '../types.ts'

interface PersonTableProps {
  persons: Person[]
}

export default function PersonTable({ persons }: PersonTableProps) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  if (persons.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" component="p">
          No persons yet
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>
          Create the first person to see it in this list.
        </Typography>
        <Button variant="contained" component={Link} to="/persons/new">
          New person
        </Button>
      </Paper>
    )
  }

  const matches = filterAndSort(persons, search, sortField, sortOrder)
  const lastPage = Math.max(0, Math.ceil(matches.length / rowsPerPage) - 1)
  const currentPage = Math.min(page, lastPage)
  const rows = matches.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
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
            setSearch(event.target.value)
            setPage(0)
          }}
          sx={{ maxWidth: { sm: 320 } }}
        />
      </Box>
      <TableContainer>
        <Table aria-label="Persons">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortField === 'name' ? sortOrder : false}>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sortDirection={sortField === 'age' ? sortOrder : false}>
                <TableSortLabel
                  active={sortField === 'age'}
                  direction={sortField === 'age' ? sortOrder : 'asc'}
                  onClick={() => handleSort('age')}
                >
                  Age
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <Box component="span" sx={{ position: 'absolute', left: -9999 }}>
                  Actions
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((person) => (
              <TableRow key={person.id} hover>
                <TableCell>{person.name}</TableCell>
                <TableCell align="right">{person.age}</TableCell>
                <TableCell align="right">
                  <Button size="small" component={Link} to={`/persons/${person.id}`}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No person matches “{search.trim()}”.
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
          setRowsPerPage(Number(event.target.value))
          setPage(0)
        }}
        labelRowsPerPage="Rows"
      />
    </Paper>
  )
}
