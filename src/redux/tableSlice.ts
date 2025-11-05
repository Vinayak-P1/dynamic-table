"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BaseRow = {
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: string | number | boolean;
};

type SortDir = "asc" | "desc";

export type TableState = {
  rows: BaseRow[];
  search: string;
  sort: { field: string; direction: SortDir } | null;
  page: number;
  rowsPerPage: number;
  visibleColumns: Record<string, boolean>;
  columnOrder: string[];
};

const DEFAULT_COLUMNS = ["name", "email", "age", "role"] as const;

const initialState: TableState = {
  rows: [
    { name: "Vinayak", email: "vinayak@example.com", age: 19, role: "Intern" },
    { name: "Aria", email: "aria@acme.io", age: 26, role: "Engineer" }
  ],
  search: "",
  sort: null,
  page: 0,
  rowsPerPage: 10,
  visibleColumns: {
    name: true,
    email: true,
    age: true,
    role: true
  },
  columnOrder: ["name", "email", "age", "role"]
};

function compare(a: any, b: any, dir: SortDir) {
  const va = a ?? "";
  const vb = b ?? "";

  const result =
    typeof va === "number" && typeof vb === "number"
      ? va - vb
      : String(va).localeCompare(String(vb));

  return dir === "asc" ? result : -result;
}

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<BaseRow[]>) {
      state.rows = action.payload;
    },
    addRows(state, action: PayloadAction<BaseRow[]>) {
      state.rows = [...state.rows, ...action.payload];
    },
    addRow(state, action: PayloadAction<BaseRow>) {
      state.rows.push(action.payload);
    },
    deleteRow(state, action: PayloadAction<number>) {
      state.rows.splice(action.payload, 1);
    },
    editCell(
      state,
      action: PayloadAction<{ index: number; field: string; value: string | number | boolean }>
    ) {
      const { index, field, value } = action.payload;
      const row = state.rows[index];
      if (row) row[field] = value;
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSort(state, action: PayloadAction<{ field: string }>) {
      const field = action.payload.field;
      if (!state.sort || state.sort.field !== field) {
        state.sort = { field, direction: "asc" };
      } else {
        state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
      }
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },

    toggleColumn(state, action: PayloadAction<string>) {
      const key = action.payload;
      state.visibleColumns[key] =
        state.visibleColumns[key] === undefined
          ? true
          : !state.visibleColumns[key];
    },
    reorderColumns(state, action: PayloadAction<string[]>) {
      state.columnOrder = action.payload;
    },

    addDynamicColumn(state, action: PayloadAction<string>) {
      const col = action.payload.trim();
      if (!col) return;

      if (state.visibleColumns[col] === undefined) {
        state.visibleColumns[col] = true;
        state.columnOrder.push(col);
      }

      state.rows = state.rows.map(r => ({
        ...r,
        [col]: r[col] ?? ""
      }));
    },
    deleteDynamicColumn(state, action: PayloadAction<string>) {
      const col = action.payload;
      if (DEFAULT_COLUMNS.includes(col as any)) return;

      delete state.visibleColumns[col];
      state.columnOrder = state.columnOrder.filter(c => c !== col);

      state.rows = state.rows.map(r => {
        const updated = { ...r };
        delete updated[col];
        return updated;
      });
    }
  }
});

export const {
  setRows,
  addRows,
  addRow,
  deleteRow,
  editCell,
  setSearch,
  setSort,
  setPage,
  setRowsPerPage,
  toggleColumn,
  reorderColumns,
  addDynamicColumn,
  deleteDynamicColumn
} = tableSlice.actions;

export default tableSlice.reducer;

export const computeView = (state: TableState) => {
  const q = state.search.trim().toLowerCase();
  let data = state.rows;

  if (q) {
    data = data.filter(row =>
      Object.values(row).some(v =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }

  if (state.sort) {
    const { field, direction } = state.sort;
    data = [...data].sort((a, b) => compare(a[field], b[field], direction));
  }

  return data;
};
