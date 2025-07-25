"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de idioma soportados
export type Language = 'en' | 'es' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  // Sincroniza el idioma con localStorage siempre que cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language');
      if (stored && (stored === 'en' || stored === 'es' || stored === 'pt')) {
        if (stored !== language) setLanguageState(stored);
      } else {
        localStorage.setItem('language', language);
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

// User context para nombre de usuario global
interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserNameState] = useState('');
  const [email, setEmailState] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      if (storedName) setUserNameState(storedName);
      if (storedEmail) setEmailState(storedEmail);
    }
  }, []);

  const setUserName = (name: string) => {
    if (name && name.trim()) {
    setUserNameState(name);
    if (typeof window !== 'undefined') localStorage.setItem('userName', name);
    }
  };

  const setEmail = (email: string) => {
    setEmailState(email);
    if (typeof window !== 'undefined') localStorage.setItem('userEmail', email);
    // Solo generar nombre si no existe uno válido
    if ((!userName || userName === '' || userName === 'User') && email) {
      const name = email.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  return (
    <UserContext.Provider value={{ userName, setUserName, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
