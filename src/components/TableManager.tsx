"use client";

import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from "@mui/material";

import UploadIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { RootState } from "@/redux/store";
import {
  addRows,
  computeView,
  deleteRow,
  editCell,
  setPage,
  setRowsPerPage,
  setSort
} from "@/redux/tableSlice";

import ManageColumnsModal from "./ManageColumnsModal";
import SearchBar from "./SearchBar";

import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toCSV } from "@/utils/csv";

export default function TableManager() {
  const dispatch = useDispatch();
  const table = useSelector((s: RootState) => s.table);

  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const fileRef = useRef<HTMLInputElement | null>(null);

  const allData = useMemo(() => computeView(table), [table]);
  const start = table.page * table.rowsPerPage;
  const end = start + table.rowsPerPage;
  const pageRows = allData.slice(start, end);

  const visibleCols = useMemo(
    () => Object.entries(table.visibleColumns).filter(([_, v]) => v).map(([k]) => k),
    [table.visibleColumns]
  );

  const allColumns = useMemo(() => {
    const keys = new Set<string>(Object.keys(table.visibleColumns));
    table.rows.forEach(row => Object.keys(row).forEach(k => keys.add(k)));
    return Array.from(keys);
  }, [table.visibleColumns, table.rows]);

  const triggerCSVImport = () => fileRef.current?.click();

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = (res.data as any[]).map(r => {
          if (r.age !== undefined && r.age !== null && r.age !== "") {
            const num = Number(r.age);
            r.age = Number.isNaN(num) ? r.age : num;
          }
          return r;
        });
        dispatch(addRows(rows as any));
      },
      error: (err) => alert("CSV parse error: " + err.message)
    });
  };

  const exportCSV = () => {
    const csv = toCSV(allData, visibleCols);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "table_export.csv");
  };

  const beginEdit = (index: number, row: Record<string, any>) => {
    setEditingRow(index);
    setDraft({ ...row });
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setDraft({});
  };

  const saveEdit = (absoluteIndex: number) => {
    Object.entries(draft).forEach(([field, value]) => {
      dispatch(editCell({ index: absoluteIndex, field, value }));
    });
    setEditingRow(null);
  };

  const absIndex = (localIndex: number) => start + localIndex;

  return (
    <Stack gap={2}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <SearchBar />

        <Stack direction="row" gap={1}>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />

          <Button
            variant="outlined"
            onClick={triggerCSVImport}
            startIcon={<UploadIcon />}
          >
            Import CSV
          </Button>

          <Button
            variant="outlined"
            onClick={exportCSV}
            startIcon={<DownloadIcon />}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => setOpen(true)}
          >
            Manage Columns
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {allColumns.map(col =>
                table.visibleColumns[col] ? (
                  <TableCell
                    key={col}
                    onClick={() => dispatch(setSort({ field: col }))}
                    sx={{ cursor: "pointer", fontWeight: 700 }}
                    title="Click to sort"
                  >
                    {col}
                    {table.sort?.field === col ? ` (${table.sort.direction})` : ""}
                  </TableCell>
                ) : null
              )}
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((row, i) => {
              const isEditing = editingRow === i;
              return (
                <TableRow key={i} hover>
                  {allColumns.map(col =>
                    table.visibleColumns[col] ? (
                      <TableCell key={col}>
                        {isEditing ? (
                          <input
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              padding: 4
                            }}
                            value={draft[col] ?? ""}
                            onChange={(e) =>
                              setDraft(prev => ({
                                ...prev,
                                [col]:
                                  col === "age"
                                    ? Number(e.target.value) || ""
                                    : e.target.value
                              }))
                            }
                          />
                        ) : (
                          String(row[col] ?? "")
                        )}
                      </TableCell>
                    ) : null
                  )}

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton onClick={() => saveEdit(absIndex(i))} size="small">
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Cancel">
                          <IconButton onClick={cancelEdit} size="small">
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => beginEdit(i, row as any)} size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => dispatch(deleteRow(absIndex(i)))}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={allData.length}
          page={table.page}
          onPageChange={(_, p) => dispatch(setPage(p))}
          rowsPerPage={table.rowsPerPage}
          onRowsPerPageChange={(e) =>
            dispatch(setRowsPerPage(parseInt(e.target.value, 10)))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <ManageColumnsModal open={open} onClose={() => setOpen(false)} />
    </Stack>
  );
}
