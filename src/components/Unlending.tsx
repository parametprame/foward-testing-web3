import { useAccount } from "../context/useAccount";
import { useState } from "react";
import { useContractContext } from "../context/useContract";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ABI from "../smartcontract/ABI.json";
import { useToasts } from "react-toast-notifications";

export const Unlending = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { balance, profit, balanceIBNB } = useAccount();
  const [amount, setAmount] = useState<string>("0");
  const { addToast } = useToasts();
  const [value, setValue] = useState<number>(0);
  const { errMsg, isPending, setIsPending } = useContractContext();
  const [token, setToken] = useState<string>("bnb");
  const { account, active } = useWeb3React();
  const contractAddress: string = process.env
    .REACT_APP_CONTRACT_ADDRESS as string;

  const selectAmount = (_value: string) => {
    const _amount = ((parseFloat(balance) * parseInt(_value)) / 100).toFixed(6);
    setAmount(_amount.toString());
    setValue(parseInt(_value));
  };

  const formatInput = () => {
    const num = amount;
    setAmount(parseFloat(num).toFixed(6));
  };

  const onChange = (number: string) => {
    const _value = (parseFloat(number) / parseFloat(balance)) * 100;
    setValue(_value);
    setAmount(number);
  };

  const UnlendingBNB = async (e: any) => {
    e.preventDefault();
    if (active && account && !errMsg && parseFloat(amount) > 0) {
      setIsPending(true);
      try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        if (parseFloat(amount) > parseFloat(balanceIBNB)) {
          const transaction = await contract.burnToEther(
            account,
            ethers.utils.parseEther(balanceIBNB)
          );
          await transaction.wait();
          addToast("Transaction Success", { appearance: "success" });
          setIsPending(false);
        } else {
          const transaction = await contract.burnToEther(
            account,
            ethers.utils.parseEther(amount)
          );
          await transaction.wait();
          addToast("Transaction Success", { appearance: "success" });
          setIsPending(false);
        }
      } catch (err: any) {
        setIsPending(false);
      }
    } else {
      addToast("The number of BNB/WBNB must greater than 0.", {
        appearance: "error",
      });
      setIsPending(false);
    }
  };

  const UnlendingWBNB = async (e: any) => {
    e.preventDefault();
    if (active && account && !errMsg && parseFloat(amount) > 0) {
      setIsPending(true);
      try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        if (parseFloat(amount) > parseFloat(balanceIBNB)) {
          const transaction = await contract.burn(
            account,
            ethers.utils.parseEther(balanceIBNB)
          );
          await transaction.wait();
          setIsPending(false);
        } else {
          const transaction = await contract.burn(
            account,
            ethers.utils.parseEther(amount)
          );
          await transaction.wait();
          addToast("Transaction Success", { appearance: "success" });
          setIsPending(false);
        }
      } catch (err: any) {
        setIsPending(false);
      }
    } else {
      addToast("The number of BNB/WBNB must greater than 0.", {
        appearance: "error",
      });
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="bg-[#23262e] w-100 rounded-2xl border shadow-lg p-5 w-full h-full  border-white border-2 border-solid ">
        <div className="grid grid-cols-4 ">
          <div className="col-span-3">
            <p className="text-white text-3xl font-['Sofia Pro'] font-bold ">
              Unlend
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-white text-lg font-['Sofia Pro'] font-bold mt-10">
              Unlending amount
            </p>
          </div>
          <div className="col-span-2 text-white text-right text-lg font-['Sofia Pro'] font-bold mt-10">
            <p className="tracking-widest">
              Lent:{" "}
              <span className="text-slate-400 text-sm tracking-widest">
                {isNaN(parseInt(balance)) ? '0.000000' : parseFloat(balance).toFixed(6)} BNB
              </span>
            </p>
          </div>
          <div className="col-span-4  mt-8">
            <form onSubmit={token === "bnb" ? UnlendingBNB : UnlendingWBNB}>
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
                    Interest Gained
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-white text-right text-lg font-['Sofia Pro'] font-bold">
                    {isNaN(parseInt(profit)) ? '0.00' : parseFloat(profit).toFixed(2)}
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
                    Confirm Unlending
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
