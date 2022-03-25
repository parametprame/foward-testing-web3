import {
  createContext,
  useContext,
  useState,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import { ethers } from "ethers";
import WBNB from "../smartcontract/WBNB.json";

type ContextProps = {
  totalSupply: string;
};

type Props = {
  children: ReactNode;
};

const WbnbContext = createContext({} as ContextProps);

export function WbnbProvider({ children }: Props): ReactElement {
  const address: string = process.env.REACT_APP_WBNB_CONTRACT as string; // WBNB Contract
  const [totalSupply, setTotalsupply] = useState<string>("");
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

  useEffect(() => {
    async function getTotalSupply() {
      const contract = new ethers.Contract(address, WBNB, provider);
      const totalSupply = await contract.totalSupply();
      setTotalsupply(ethers.utils.formatEther(totalSupply));
    }
    getTotalSupply();
  }, []);

  return (
    <WbnbContext.Provider
      value={{
        totalSupply,
      }}
    >
      {children}
    </WbnbContext.Provider>
  );
}

export function useWbnb(): ContextProps {
  return useContext(WbnbContext);
}
