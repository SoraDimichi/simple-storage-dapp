"use client";

import React from "react";
import { Alert, Container, Typography, Button } from "@mui/material";
import { FallbackProps } from "react-error-boundary";

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="h6">Something went wrong:</Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Alert>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </Container>
  );
};

export default ErrorFallback;
