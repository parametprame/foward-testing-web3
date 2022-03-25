import React, { useState } from "react";
import { injected } from "../utils/wallet/connector";
import { useWeb3React } from "@web3-react/core";
import { useContractContext } from "../context/useContract";
import { IoWallet } from "react-icons/io5";

export const ButtonConnect = () => {
  const { activate, setError, chainId, error } = useWeb3React();
  const { isConnecting, setErrMsg, setIsConnecting } = useContractContext();

  async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      if (!error) {
        setIsConnecting(true);
        try {
          await activate(injected);
          setIsConnecting(false);
          if (chainId && chainId.toString() !== "97") {
            setErrMsg(`Supported chain ids are: 97.`);
          }
        } catch (error) {
          if (error instanceof Error) setError(error);
          setIsConnecting(false);
        }
      } else {
        setErrMsg(`Supported chain ids are: 97`);
      }
    } else {
      setErrMsg("Please install MetaMask.");
    }
  }

  return (
    <>
      {isConnecting ? (
        <button className="flex  bg-gradient-to-r from-zinc-500 via-zinc-600 to-zinc-900  rounded-2xl text-white font-bold py-2 px-4 border-white border-2 border-solid ">
          Connecting...
        </button>
      ) : (
        <button
          className="flex bg-gradient-to-r from-zinc-500 via-zinc-600 to-zinc-900  rounded-2xl text-white font-bold py-2 px-4 border-white border-2 border-solid "
          onClick={connectMetaMask}
        >
          <div className="mt-1 px-1">
            <IoWallet />
          </div>
          Connect Wallet
        </button>
      )}
    </>
  );
};
