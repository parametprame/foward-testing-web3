import { ethers } from "ethers";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import ABI from "../smartcontract/ABI.json";
import WBNB from "../smartcontract/WBNB.json";
import { useContractContext } from "../context/useContract";
import { useAccount } from "../context/useAccount";
import { useWbnb } from "../context/useWBNB";
import { useSmartcontract } from "../context/useSmartContract";
import { useToasts } from "react-toast-notifications";

export const Lending = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { errMsg, isPending, setIsPending } = useContractContext();
  const { balanceBNB, balanceWBNB, isApprove, setIsApprove } = useAccount();
  const { apr } = useSmartcontract();
  const { totalSupply } = useWbnb();
  const [token, setToken] = useState<string>("bnb");
  const [amount, setAmount] = useState<string>("0");
  const [value, setValue] = useState<number>(0);
  const { addToast } = useToasts();
  const address: string = process.env.REACT_APP_WBNB_CONTRACT as string; // WBNB Contract
  const { account, active } = useWeb3React();
  const contractAddress: string = process.env
    .REACT_APP_CONTRACT_ADDRESS as string;

  const lendwithBNB = async (e: any) => {
    e.preventDefault();
    if (active && account && !errMsg && parseFloat(amount) > 0) {
      setIsPending(true);
      try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        const transaction = await contract.mintWithEther(account, {
          value: ethers.utils.parseEther(amount),
        });
        await transaction.wait();
        addToast("Transaction Success", { appearance: "success" });
        setIsPending(false);
      } catch (err: any) {
        setIsPending(false);
      }
    } else {
      addToast("The number of BNB/WBNB must greater than 0.", {
        appearance: "error",
      });
    }
  };

  const lendwithWBNB = async (e: any) => {
    e.preventDefault();
    if (!isApprove) {
      if (active && account && !errMsg) {
        setIsPending(true);
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(address, WBNB, signer);
          const transaction = await contract.approve(
            contractAddress,
            ethers.utils.parseEther(totalSupply)
          );
          await transaction.wait();
          addToast("Approved", { appearance: "success" });
          setIsApprove(true)
          setIsPending(false);
        } catch (err: any) {
          setIsPending(false);
        }
      }
    } else {
      if (active && account && !errMsg && parseFloat(amount) > 0) {
        setIsPending(true);
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, ABI, signer);
          const transaction = await contract.mint(
            account,
            ethers.utils.parseEther(amount)
          );
          await transaction.wait();
          addToast("Transaction Success", { appearance: "success" });
          setIsPending(false);
        } catch (err: any) {
          setIsPending(false);
        }
      } else {
        addToast("The number of BNB/WBNB must greater than 0.", {
          appearance: "error",
        });
      }
    }
  };

  const selectAmount = (_value: string) => {
    if (token === "bnb") {
      if (_value === "100") {
        const _amount = (
          (parseFloat(balanceBNB) * parseInt(_value)) / 100 -
          0.01
        ).toFixed(6);
        setAmount(_amount.toString());
        setValue(parseInt(_value));
      } else {
        const _amount = (
          (parseFloat(balanceBNB) * parseInt(_value)) /
          100
        ).toFixed(6);
        setAmount(_amount.toString());
        setValue(parseInt(_value));
      }
    } else {
      const _amount = (
        (parseFloat(balanceWBNB) * parseInt(_value)) /
        100
      ).toFixed(6);
      setAmount(_amount.toString());
      setValue(parseInt(_value));
    }
  };

  const formatInput = () => {
    const num = amount;
    setAmount(parseFloat(num).toFixed(6));
  };

  const onChange = (number: string) => {
    if (token === "bnb") {
      const _value = (parseFloat(number) / parseFloat(balanceBNB)) * 100;
      setValue(_value);
      setAmount(number);
    } else {
      const _value = (parseFloat(number) / parseFloat(balanceWBNB)) * 100;
      setValue(_value);
      setAmount(number);
    }
  };

  return (
    <>
      <div className="bg-[#23262e] w-100 rounded-2xl border shadow-lg p-5 w-full h-full  border-white border-2 border-solid ">
        <div className="grid grid-cols-4 ">
          <div className="col-span-3">
            <p className="text-white text-3xl font-['Sofia Pro'] font-bold ">
              Lend
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-white text-lg font-['Sofia Pro'] font-bold mt-10">
              Lending amount
            </p>
          </div>
          <div className="col-span-2 text-white text-right text-lg font-['Sofia Pro'] font-bold mt-10">
            <p className="tracking-widest">
              Balance:{" "}
              <span className="text-slate-400 text-sm tracking-widest">
                {token === "bnb"
                  ? `${isNaN(parseInt(balanceBNB)) ? '0.0000' : parseFloat(balanceBNB).toFixed(4)} BNB`
                  : `${isNaN(parseInt(balanceWBNB)) ? '0.0000' : parseFloat(balanceWBNB).toFixed(4)} WBNB`}
              </span>
            </p>
          </div>
          <div className="col-span-4  mt-8">
            <form onSubmit={token === "bnb" ? lendwithBNB : lendwithWBNB}>
              <div className="grid grid-cols-4">
                <div className="col-span-2">
                  <button
                    className={
                      token === "bnb"
                        ? "bg-pink-600 hover:bg-pink-600 active:bg-pink-600 z-10 ring-4 ring-gray-200 ring-gray-700 rounded-2xl text-white font-bold py-2 px-4 mr-2"
                        : "bg-[#2F3241] hover:bg-pink-600 active:bg-pink-600 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-2xl text-white font-bold py-2 px-4 mr-2"
                    }
                    type={"button"}
                    onClick={() => setToken("bnb")}
                  >
                    BNB
                  </button>
                  <button
                    className={
                      token === "wbnb"
                        ? "bg-pink-600 hover:bg-pink-600 active:bg-pink-600 z-10 ring-4 ring-gray-200 ring-gray-700 rounded-2xl text-white font-bold py-2 px-4 mr-2"
                        : "bg-[#2F3241] hover:bg-pink-600 active:bg-pink-600 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-2xl text-white font-bold py-2 px-4 mr-2"
                    }
                    type={"button"}
                    onClick={() => setToken("wbnb")}
                  >
                    WBNB
                  </button>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Amoung BNB / WBNB"
                    className="rounded-lg h-10 bg-[#2F3241] text-center text-white   font-bold w-full"
                    name="price"
                    value={amount}
                    onBlur={formatInput}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-span-4 mt-10">
                <input
                  type="range"
                  className="form-range appearance-none w-full h-1 p-0 bg-[#5D6588] focus:outline-none focus:ring-0 focus:shadow-none"
                  id="customRange1"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => selectAmount(e.target.value)}
                />
              </div>
              <div className="col-span-4 mt-10 text-center">
                <button
                  className="bg-[#2F3241] hover:bg-pink-600 rounded-2xl text-white font-bold py-2 px-6 ocus:outline-none  focus:bg-pink-600  mx-1 "
                  type={"button"}
                  onClick={() => selectAmount("25")}
                >
                  25 %
                </button>
                <button
                  className="bg-[#2F3241] hover:bg-pink-600 rounded-2xl text-white font-bold py-2 px-6 ocus:outline-none  focus:bg-pink-600  mx-1"
                  type={"button"}
                  onClick={() => selectAmount("50")}
                >
                  50 %
                </button>
                <button
                  className="bg-[#2F3241] hover:bg-pink-600 rounded-2xl text-white font-bold py-2 px-6 ocus:outline-none  focus:bg-pink-600  mx-1"
                  type={"button"}
                  onClick={() => selectAmount("75")}
                >
                  75 %
                </button>
                <button
                  className="bg-[#2F3241] hover:bg-pink-600 rounded-2xl text-white font-bold py-2 px-6 ocus:outline-none  focus:bg-pink-600 mx-1 "
                  type={"button"}
                  onClick={() => selectAmount("100")}
                >
                  100 %
                </button>
              </div>
              <div className="grid grid-cols-4 mt-10">
                <div className="col-span-2">
                  <p className="text-white text-lg font-['Sofia Pro'] font-bold">
                    Total APR
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-white text-right text-lg font-['Sofia Pro'] font-bold">
                    {isNaN(parseInt(apr)) ? '0.00' : parseFloat(apr).toFixed(2)} %
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 mt-10">
                {isPending ? (
                  <button
                    className="bg-pink-400  shadow-lg  w-full  rounded-2xl text-white font-bold py-2 px-6 mx-1"
                    disabled={true}
                  >
                    <span
                      className="spinner-border spinner-border-sm mr-3"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {"  "}
                    {isPending && "Pending..."}
                    {!isPending && "Processing.."}
                  </button>
                ) : (
                  <button
                    className="bg-pink-700 hover:bg-pink-600 shadow-lg shadow-pink-700/50 w-full  rounded-2xl text-white font-bold py-2 px-6 mx-1"
                    type={"submit"}
                  >
                    Confirm Lending
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
