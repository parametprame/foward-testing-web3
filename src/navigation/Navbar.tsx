import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContractContext } from "../context/useContract";
import { injected } from "../utils/wallet/connector";
import { ButtonConnect } from "../components/ButtonConnect";
import { IoWallet } from "react-icons/io5";

export const Navbar = () => {
  const { activate, setError, chainId, account, active } = useWeb3React();
  const { errMsg, setErrMsg } = useContractContext();

  useEffect(() => {
    async function loadInjectedWallet() {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        await activate(injected);
      }
    }
    if (typeof window.ethereum !== "undefined") {
      try {
        loadInjectedWallet();
      } catch (error) {
        if (error instanceof Error) setError(error);
      }
    }
  }, [activate, setError]);

  useEffect(() => {
    if (active) {
      if (chainId && chainId.toString() !== "97") {
        setErrMsg(`Change the network to Binansesmartchain Testnet.`);
      } else {
        setErrMsg("");
      }
    } else {
      setErrMsg("");
    }
  }, [active, chainId, setErrMsg]);

  return (
    <nav className="bg-black py-2">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/">
                {" "}
                <img
                  className="hidden lg:block h-8 w-auto"
                  src="https://media.discordapp.net/attachments/839107739786543137/956189613448380416/Logo_1.png"
                />
              </a>
            </div>
            <div>
              <div className="ml-10 mt-1 flex items-baseline space-x-4">
                <a
                  href="/#"
                  className="hover:text-white text-slate-500 no-underline hover:underline w-full decoration-pink-500  text-sm font-['Sofia Pro'] font-bold"
                >
                  Trade
                </a>
              </div>
            </div>
            <div>
              <div className="ml-10 mt-1 flex items-end space-x-4">
                <a
                  href="/#"
                  className="hover:text-white text-slate-500  no-underline hover:underline w-full decoration-pink-500  text-sm font-['Sofia Pro'] font-bold"
                >
                  Stake
                </a>
              </div>
            </div>
            <div>
              <div className="ml-10 mt-1 flex items-baseline space-x-4">
                <a
                  href="/#"
                  className=" hover:text-white text-slate-500  no-underline hover:underline w-full decoration-pink-500 text-sm  font-['Sofia Pro'] font-bold"
                >
                  Borrow
                </a>
              </div>
            </div>
            <div>
              <div className="ml-10 mt-1 flex items-baseline space-x-4">
                <a
                  href="/#"
                  className=" hover:text-white text-slate-500  no-underline hover:underline w-full decoration-pink-500 text-sm  font-['Sofia Pro'] font-bold"
                >
                  Farm
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {active && account && !errMsg ? (
              <button className="flex bg-gradient-to-r from-zinc-500 via-zinc-600 to-zinc-900  rounded-2xl text-white font-bold py-2 px-4 border-white border-2 border-solid ">
                <div className="mt-1 px-1">
                  <IoWallet />
                </div>
                <span>
                  {`${account.substring(0, 6)}...${account.substring(
                    account.length - 4
                  )}`}
                </span>
              </button>
            ) : errMsg ? (
              <button className="flex bg-red-500  rounded-2xl text-white font-bold py-2 px-4 border-white border-2 border-solid ">
                <span>Change the network to BSC Testnet </span>
              </button>
            ) : (
              <ButtonConnect />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
