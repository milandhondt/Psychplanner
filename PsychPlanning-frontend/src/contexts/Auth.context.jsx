import { createContext, useCallback, useMemo, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import * as api from '../api';
import useSWR from 'swr';

export const JWT_TOKEN_KEY = 'jwtToken';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));

  const { data: user, error: userError, loading: userLoading } =
    useSWR(token ? 'users/me' : null, api.getById);

  const { trigger: doLogin, error: loginError, isMutating: loginLoading } =
    useSWRMutation('sessions', api.post);

  const { trigger: doRegister, error: registerError, isMutating: registerLoading } =
    useSWRMutation('users', api.post);

  const setSession = useCallback((token) => {
    setToken(token);
    localStorage.setItem(JWT_TOKEN_KEY, token);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { token } = await doLogin({ email, password });
      setSession(token);
      localStorage.setItem(JWT_TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [doLogin, setSession]);

  const register = useCallback(async (data) => {
    try {
      const { token } = await doRegister(data);
      setSession(token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [doRegister, setSession]);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(JWT_TOKEN_KEY);
  }, []);

  const value = useMemo(() => ({
    user, login, logout, register, isAuthed: Boolean(token), ready: !loginLoading,
    error: loginError || userError || registerError, loading: loginLoading || userLoading || registerLoading,
  }), [user, userLoading, userError, login, loginError, loginLoading, token,
    logout, register, registerError, registerLoading]);

  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};
