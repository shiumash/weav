import { createContext, useContext, ReactNode } from 'react';

interface SharedContextType {
  pid: string;
}

export const SharedContext = createContext<SharedContextType | undefined>(undefined);

interface SharedProviderProps {
  children: ReactNode;
  pid: string;
}

export function SharedProvider({ children, pid }: SharedProviderProps) {
  return (
    <SharedContext.Provider value={{ pid }}>
      {children}
    </SharedContext.Provider>
  );
}

export function useShared() {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error('useShared must be used within a SharedProvider');
  }
  return context;
}