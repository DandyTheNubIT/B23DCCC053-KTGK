import React, { createContext, useContext, ReactNode } from 'react';

export function createLocalModel<T>(useModelHook: () => T) {
  const ModelContext = createContext<T | null>(null);

  const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const model = useModelHook();
    return <ModelContext.Provider value={model}>{children}</ModelContext.Provider>;
  };

  const useModel = () => {
    const context = useContext(ModelContext);
    if (!context) {
      throw new Error('useModel must be used within a Provider');
    }
    return context;
  };

  return { Provider, useModel };
}

export default createLocalModel;