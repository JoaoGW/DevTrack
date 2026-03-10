import { OAuthCredential, User } from '@firebase/auth';
import { create } from 'zustand';

interface authUserFirebase {
  user: User | null,
  userMail: string,
  token: string | undefined,
  errorCode: number | undefined,
  errorMessage: string | undefined,
  credential: OAuthCredential | null,
  setUser: (user: User | null) => void;
  setToken: (token: string | undefined) => void;
  setCredential: (credential: OAuthCredential | null) => void;
  setErrorCode: (code: number | undefined) => void;
  setErrorMessage: (message: string | undefined) => void;
  setUserMail: (mail: string) => void;
};

export const useAuthUserFirebase = create<authUserFirebase>((set) => ({
  user: null,
  userMail: '',
  token: undefined,
  errorCode: undefined,
  errorMessage: undefined,
  credential: null,
  setUser: (user: authUserFirebase["user"]) =>
    set({ user, userMail: user?.email ?? '' }),
  setToken: (token: authUserFirebase["token"]) =>
    set({ token }),
  setErrorCode: (errorCode: authUserFirebase["errorCode"]) =>
    set({ errorCode }),
  setErrorMessage: (errorMessage: authUserFirebase["errorMessage"]) =>
    set({ errorMessage }),
  setCredential: (credential: authUserFirebase["credential"]) =>
    set({ credential }),
  setUserMail: (mail: authUserFirebase["userMail"]) =>
    set({ userMail: mail })
}));