"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  IconButton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { RootState } from "@/redux/store";
import {
  addDynamicColumn,
  deleteDynamicColumn,
  reorderColumns,
  toggleColumn
} from "@/redux/tableSlice";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ManageColumnsModal({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const visible = useSelector((s: RootState) => s.table.visibleColumns);
  const order = useSelector((s: RootState) => s.table.columnOrder);

  const [newCol, setNewCol] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleAdd = () => {
    if (!newCol.trim()) return;
    dispatch(addDynamicColumn(newCol.trim()));
    setNewCol("");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = order.indexOf(active.id);
      const newIndex = order.indexOf(over.id);
      dispatch(reorderColumns(arrayMove(order, oldIndex, newIndex)));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Columns</DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={order}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap={1}>
                {order.map((col) => (
                  <Box
                    key={col}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      p: 1
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <DragIndicatorIcon />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!visible[col]}
                            onChange={() => dispatch(toggleColumn(col))}
                          />
                        }
                        label={col}
                      />
                    </Box>

                    {!["name", "email", "age", "role"].includes(col) && (
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => dispatch(deleteDynamicColumn(col))}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Box>

        <Stack direction="row" mt={2} gap={1}>
          <TextField
            label="Add new column"
            value={newCol}
            onChange={(e) => setNewCol(e.target.value)}
            fullWidth
            size="small"
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
