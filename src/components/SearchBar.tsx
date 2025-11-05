"use client";

import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";

import { RootState } from "@/redux/store";
import { setSearch } from "@/redux/tableSlice";

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchValue = useSelector((s: RootState) => s.table.search);

  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search all fields…"
      value={searchValue}
      onChange={(e) => dispatch(setSearch(e.target.value))}
    />
  );
}
