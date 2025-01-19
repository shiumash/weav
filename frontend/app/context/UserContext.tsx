import { createContext, useContext, ReactNode } from 'react';

interface UserData {
  id: string
  firstName: string;
  lastName: string;
  username: string;
  pfp: string;
  email: string;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_family?: boolean;
}

export interface UserContextType {
  userData: UserData;
}

const UserContext = createContext<UserContextType>({ 
  userData: {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    pfp: '',
    email: ''
  }
});

export function UserProvider({ children, userData }: { 
  children: ReactNode;
  userData: UserData;
}) {
  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}