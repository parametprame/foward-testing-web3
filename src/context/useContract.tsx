import {
    createContext,
    useContext,
    useState,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
  } from 'react';
  
  type ContextProps = {
    message: string;
    errMsg: string;
    isConnecting: boolean;
    isPending: boolean;
    setMessage: Dispatch<SetStateAction<string>>;
    setErrMsg: Dispatch<SetStateAction<string>>;
    setIsPending: Dispatch<SetStateAction<boolean>>;
    setIsConnecting: Dispatch<SetStateAction<boolean>>;
  };
  
  type Props = {
    children: ReactNode;
  };
  
  const ContractContext = createContext({} as ContextProps);
  
  export function ContractProvider({ children }: Props): ReactElement {
    const [message, setMessage] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);
  
    return (
      <ContractContext.Provider
        value={{
          message,
          errMsg,
          isConnecting,
          isPending,
          setMessage,
          setErrMsg,
          setIsConnecting,
          setIsPending
        }}
      >
        {children}
      </ContractContext.Provider>
    );
  }
  
  export function useContractContext(): ContextProps {
    return useContext(ContractContext);
  }