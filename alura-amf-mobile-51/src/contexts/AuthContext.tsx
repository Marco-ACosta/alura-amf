import { createContext, useContext, useState } from "react";
import { Screen } from "../components/base/Screen";
import Loading from "../components/base/Loading";
import { loginBody } from "../types/authTypes";
import AuthService from "../services/api/AuthService";
import { LocalStorage } from "../utils/LocalStorage";

type AuthContextProps = {
  children: JSX.Element | JSX.Element[];
};

type AuthContextType = {
  isLogged: boolean;
  /** Usando com o hook useTransition, pode não realizar um refresh no componente se necessário */
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  signIn: (data: loginBody) => Promise<any>;
  logOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/** Context de autenticação, realiza o refresh do token de autenticação e valida credenciais no localStorage */
export default function AuthContextComponent({ children }: AuthContextProps) {
  const [loading, setLoading] = useState<boolean>(false); // TODO: definir regra de negócio para loading
  const [isLogged, setIsLogged] = useState<boolean>(false);

  async function signIn(data: loginBody) {
    const response = await AuthService.Login(data);
    if (response.Success) {
      setIsLogged(true);
      setLoading(false);
      await LocalStorage.login(response.Data.data.token, data);
      await LocalStorage.userId.set(response.Data.data.userId);
    }
    return response;
  }

  async function logOut() {
    const response = await AuthService.LogOut();
    if (response?.Success) {
      setIsLogged(false);
      await LocalStorage.logoff();
    }
    return response;
  }

  if (loading) {
    return <Screen>{Loading()}</Screen>;
  }

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthContextProvider() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("AuthContext chamado fora do provider.");
  return context;
}
