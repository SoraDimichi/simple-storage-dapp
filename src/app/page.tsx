"use client";

import type { NextPage } from "next";
import { useContext, useEffect, useState, useCallback } from "react";
import ErrorFallback from "../fallback";

import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { Web3Context, Web3Provider } from "../context";
import { ethers } from "ethers";
import SimpleStorageABI from "../../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface AppState {
  contract: ethers.Contract | null;
  currentNumber: number;
  newNumber: string;
  isLoading: boolean;
  successMessage: string | null;
}

const Inner: NextPage = () => {
  const { showBoundary } = useErrorBoundary();
  const { signer, account, connectWallet } = useContext(Web3Context);
  const [state, setState] = useState<AppState>({
    contract: null,
    currentNumber: 0,
    newNumber: "",
    isLoading: false,
    successMessage: null,
  });

  const { contract, currentNumber, newNumber, isLoading, successMessage } =
    state;

  const contractAddress = "0x736b52346ac3F4c3C806EBFe699B4e17Fe09592A";

  const fetchCurrentNumber = useCallback(async () => {
    if (contract) {
      try {
        setState((prevState) => ({ ...prevState, isLoading: true }));

        const number = await contract.get();
        const parsedNumber = Number(BigInt(number));

        setState((prevState) => ({
          ...prevState,
          currentNumber: parsedNumber,
          isLoading: false,
        }));
      } catch (error) {
        showBoundary(error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    }
  }, [contract]);

  useEffect(() => {
    if (signer && contractAddress) {
      const simpleStorage = new ethers.Contract(
        contractAddress,
        SimpleStorageABI.abi,
        signer,
      );
      setState((prevState) => ({ ...prevState, contract: simpleStorage }));
    }
  }, [signer, contractAddress]);

  useEffect(() => {
    fetchCurrentNumber();
  }, [fetchCurrentNumber]);

  const handleStoreNumber = async () => {
    if (contract && newNumber) {
      try {
        setState((prevState) => ({
          ...prevState,
          isLoading: true,
          successMessage: null,
        }));
        const tx = await contract.store(newNumber);
        await tx.wait();

        await fetchCurrentNumber();

        setState((prevState) => ({
          ...prevState,
          newNumber: "",
          isLoading: false,
          successMessage: "Favorite number updated successfully!",
        }));
      } catch (error) {
        showBoundary(error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    }
  };

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
      <Typography variant="h4" gutterBottom>
        Simple Storage DApp
      </Typography>
      {!account ? (
        <Button onClick={connectWallet} sx={{ mt: 2 }}>
          Connect Wallet
        </Button>
      ) : (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mt: 2,
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            <strong>Connected Account:</strong> {account}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Typography variant="h5" component="div">
              Current Favorite Number: {currentNumber}
            </Typography>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchCurrentNumber}
                disabled={isLoading}
                sx={{ ml: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              type="number"
              value={newNumber}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  newNumber: e.target.value,
                }))
              }
              label="Enter new number"
              variant="outlined"
              sx={{ width: "200px" }}
            />
            <Button
              variant="contained"
              onClick={handleStoreNumber}
              disabled={isLoading || !newNumber}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {isLoading ? "Storing..." : "Set Favorite Number"}
            </Button>
          </Box>
        </Box>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
    </Container>
  );
};

const darkTheme = createTheme({ palette: { mode: "dark" } });

const Home = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Web3Provider>
      <ThemeProvider theme={darkTheme}>
        <Inner />
      </ThemeProvider>
    </Web3Provider>
  </ErrorBoundary>
);

export default Home;
