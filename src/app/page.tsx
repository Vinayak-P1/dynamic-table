"use client";

import { Container, Stack, Typography, Divider, Box } from "@mui/material";
import TableManager from "@/components/TableManager";

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4" fontWeight={700}>
          Dynamic Data Table Manager
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box>
        <TableManager />
      </Box>
    </Container>
  );
}
