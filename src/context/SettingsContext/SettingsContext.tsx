import { type ReactNode, createContext, useContext } from "react";
import { useSettings } from "src/hooks/useSettings";

interface SettingsContextType {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const { isLoading, hasCompletedOnboarding, completeOnboarding } =
    useSettings();

  return (
    <SettingsContext.Provider
      value={{
        hasCompletedOnboarding,
        completeOnboarding,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsContext must be used within a SettingsContextProvider",
    );
  }
  return context;
}
