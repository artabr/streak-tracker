import { eq } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { db } from "src/db/drizzle";
import { userSettingsTable } from "src/db/schema";
import { DEFAULT_HABIT_ID } from "./useHabitData";

export const DEFAULT_USER_ID = "defaultUserId";

export function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentHabitId, setCurrentHabitId] = useState<string>();

  const getSettings = useCallback(async () => {
    try {
      const result = await db
        .select()
        .from(userSettingsTable)
        .where(eq(userSettingsTable.userId, DEFAULT_USER_ID));

      return {
        hasCompletedOnboarding: !!result[0]?.hasCompletedOnboarding,
        currentHabitId: result[0]?.currentHabitId ?? DEFAULT_HABIT_ID,
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
        setCurrentHabitId(settings.currentHabitId);
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
        .where(eq(userSettingsTable.userId, DEFAULT_USER_ID));
    } catch (error) {
      console.error("Error updating onboarding status:", error);

      throw error;
    }
  }, []);

  const updateCurrentHabitId = useCallback(async (habitId?: string) => {
    try {
      setCurrentHabitId(habitId);
      await db
        .update(userSettingsTable)
        .set({ currentHabitId: habitId })
        .where(eq(userSettingsTable.userId, DEFAULT_USER_ID));
    } catch (error) {
      console.error("Error updating current habit:", error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    hasCompletedOnboarding,
    completeOnboarding,
    currentHabitId,
    updateCurrentHabitId,
  };
}
