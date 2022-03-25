import {
    createContext,
    useContext,
    useState,
    ReactElement,
    ReactNode,
    useEffect,
  } from "react";
  import { ethers } from "ethers";
  import ABI from "../smartcontract/ABI.json";

  type ContextProps = {
    apr: string;
  };
  
  type Props = {
    children: ReactNode;
  };
  
  const SmartcontractContext = createContext({} as ContextProps);
  
  export function SmartcontractProvider({ children }: Props): ReactElement {
    const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    const [apr, setApr] = useState<string>("");
    const contractAddress: string = process.env.REACT_APP_CONTRACT_ADDRESS as string;

    useEffect(() => {
        async function supplyInterestRate() {
          const contract = new ethers.Contract(contractAddress, ABI, provider);
          const interrestRate3 = await contract.supplyInterestRate();
          setApr(ethers.utils.formatEther(interrestRate3));
        }
        supplyInterestRate();
      }, []);
  
    return (
      <SmartcontractContext.Provider
        value={{
          apr,
        }}
      >
        {children}
      </SmartcontractContext.Provider>
    );
  }
  
  export function useSmartcontract(): ContextProps {
    return useContext(SmartcontractContext);
  }
  