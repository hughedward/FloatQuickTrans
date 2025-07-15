import React, { createContext, useContext, useState } from 'react'
import { AIProvider } from '../../../model/aiApi'

type ProviderContextType = {
  currentProvider: AIProvider
  setCurrentProvider: (p: AIProvider) => void
}

const ProviderContext = createContext<ProviderContextType>({
  currentProvider: AIProvider.DEEPSEEK,
  setCurrentProvider: () => {}
})

export const ProviderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProvider, setCurrentProvider] = useState<AIProvider>(() => {
    const saved = localStorage.getItem('quick-trans-current-provider')
    return (saved as AIProvider) || AIProvider.DEEPSEEK
  })

  const setAndPersist = (p: AIProvider) => {
    setCurrentProvider(p)
    localStorage.setItem('quick-trans-current-provider', p)
  }

  return (
    <ProviderContext.Provider value={{ currentProvider, setCurrentProvider: setAndPersist }}>
      {children}
    </ProviderContext.Provider>
  )
}

export const useProvider = () => useContext(ProviderContext)
