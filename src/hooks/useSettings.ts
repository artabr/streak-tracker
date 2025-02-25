import { eq } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import { userSettingsTable } from "src/db/schema";

export function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const getSettings = useCallback(async () => {
    try {
      const result = await db
        .select()
        .from(userSettingsTable)
        .where(eq(userSettingsTable.userId, "defaultUserId"));

      return {
        hasCompletedOnboarding: !!result[0]?.hasCompletedOnboarding,
      };
    } catch (error) {
      console.error("Error getting settings:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const settings = await getSettings();
        setHasCompletedOnboarding(settings.hasCompletedOnboarding);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadSettings();
  }, [getSettings]);

  const completeOnboarding = useCallback(async () => {
    try {
      setHasCompletedOnboarding(true);
      await db
        .update(userSettingsTable)
        .set({ hasCompletedOnboarding: true })
        .where(eq(userSettingsTable.userId, "defaultUserId"));
    } catch (error) {
      console.error("Error updating onboarding status:", error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    hasCompletedOnboarding,
    completeOnboarding,
  };
}
