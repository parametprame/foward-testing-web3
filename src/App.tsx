import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Navbar } from "./navigation/Navbar";
import { ContractProvider } from "../src/context/useContract";
import { AccountProvider } from "./context/useAccount";
import { WbnbProvider } from "./context/useWBNB";
import { SmartcontractProvider } from "./context/useSmartContract";
import { Homepage } from "./pages/Homepage";
import { ToastProvider } from "react-toast-notifications";

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WbnbProvider>
          <SmartcontractProvider>
            <ContractProvider>
              <AccountProvider>
                <ToastProvider>
                  <Navbar />
                  <Homepage />
                </ToastProvider>
              </AccountProvider>
            </ContractProvider>
          </SmartcontractProvider>
        </WbnbProvider>
      </Web3ReactProvider>
    </>
  );
}

export default App;
