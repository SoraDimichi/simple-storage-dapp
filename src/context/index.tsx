import React, { useState, useEffect, ReactNode, createContext } from "react";
import { ethers } from "ethers";
import { useErrorBoundary } from "react-error-boundary";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
}

interface Web3ContextProps extends Web3State {
  connectWallet: () => Promise<void>;
}

export const Web3Context = createContext<Web3ContextProps>({
  provider: null,
  signer: null,
  account: null,
  connectWallet: async () => {},
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>({
    provider: null,
    signer: null,
    account: null,
  });

  const { showBoundary } = useErrorBoundary();

  const connectWallet = async () => {
    if (
      typeof window === "undefined" ||
      typeof window.ethereum === "undefined"
    ) {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      const tempSigner = await tempProvider.getSigner();
      const address = await tempSigner.getAddress();
      setWeb3State({
        provider: tempProvider,
        signer: tempSigner,
        account: address,
      });
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (error) {
      showBoundary(error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWeb3State({ provider: null, signer: null, account: null });
    } else {
      setWeb3State((prevState) => ({
        ...prevState,
        account: accounts[0],
      }));
    }
  };

  const handleChainChanged = (chainId: string) => {
    window.location.reload();
  };

  useEffect(() => {
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      )
        return;

      const accounts: string[] = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        connectWallet();
      }
    };

    checkIfWalletIsConnected();
  }, []);

  return (
    <Web3Context.Provider value={{ ...web3State, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
