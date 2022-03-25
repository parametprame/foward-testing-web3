import {
  createContext,
  useContext,
  useState,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
} from "react";

import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import ABI from "../smartcontract/ABI.json";
import WBNB from "../smartcontract/WBNB.json";

type ContextProps = {
  balanceBNB: string;
  balanceWBNB: string;
  isApprove: boolean;
  balance: string;
  profit: string;
  balanceIBNB: string;
  setIsApprove: Dispatch<SetStateAction<boolean>>;

};

type Props = {
  children: ReactNode;
};

const AccountContext = createContext({} as ContextProps);

export function AccountProvider({ children }: Props): ReactElement {
  const address: string = process.env.REACT_APP_WBNB_CONTRACT as string; // WBNB Contract
  const [balanceBNB, setBalanceBNB] = useState<string>("");
  const [balanceWBNB, setBalanceWBNB] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [profit, setProfit] = useState<string>("");
  const [balanceIBNB, setIBNB] = useState<string>("");
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const contractAddress: string = process.env
    .REACT_APP_CONTRACT_ADDRESS as string;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const { account } = useWeb3React();

  useEffect(() => {
    async function getBalanceBNB(account: string | any) {
      const balance = await provider.getBalance(account);
      setBalanceBNB(ethers.utils.formatEther(balance));
    }

    getBalanceBNB(account);

    const intervalId = setInterval(() => {
      getBalanceBNB(account);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [account]);

  useEffect(() => {
    async function getBalanceWBNB(account: string | any) {
      const contract = new ethers.Contract(address, WBNB, provider);
      const balance = await contract.balanceOf(account);
      setBalanceWBNB(ethers.utils.formatEther(balance));
    }
    getBalanceWBNB(account);

    const intervalId = setInterval(() => {
      getBalanceWBNB(account);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [account]);

  useEffect(() => {
    async function checkApprove() {
      const contract = new ethers.Contract(address, WBNB, provider);
      const limitApprove = await contract.allowance(account, contractAddress);
      if (parseInt(ethers.utils.formatEther(limitApprove)) > 0) {
        setIsApprove(true);
      }
      else {
        setIsApprove(false);
      }
    }
    checkApprove();
  }, [account, isApprove]);

  useEffect(() => {
    async function getBalance() {
      const contract = new ethers.Contract(contractAddress, ABI, provider);
      const balance = await contract.assetBalanceOf(account);
      setBalance(ethers.utils.formatEther(balance));
    }
    const intervalId = setInterval(() => {
      getBalance();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [account]);

  useEffect(() => {
    async function getBalanceIBNB() {
      const contract = new ethers.Contract(contractAddress, ABI, provider);
      const balanceIBNB = await contract.balanceOf(account);
      setIBNB(ethers.utils.formatEther(balanceIBNB));
    }
    getBalanceIBNB();
    const intervalId = setInterval(() => {
      getBalanceIBNB();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [account]);

  useEffect(() => {
    async function getProfit() {
      const contract = new ethers.Contract(contractAddress, ABI, provider);
      const profit = await contract.profitOf(account);
      setProfit(ethers.utils.formatEther(profit));
    }
    getProfit();
  }, [account]);

  return (
    <AccountContext.Provider
      value={{
        balanceBNB,
        balanceWBNB,
        isApprove,
        balance,
        profit,
        balanceIBNB,
        setIsApprove
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(): ContextProps {
  return useContext(AccountContext);
}
