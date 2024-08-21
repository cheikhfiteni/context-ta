import { getUserPreferences, postUserPreferences } from './message.service';
import { ApiResponse } from '../models/api-response';

const LOCAL_STORAGE_KEY = 'userPreferences';
let isUpdatingPreferences: boolean = false;

const fetchAndSyncPreferences = async (accessToken: string): Promise<void> => {
  try {
    if (isUpdatingPreferences) {
        return;
    }
    // Fetch user preferences from the server
    const serverResponse: ApiResponse = await getUserPreferences(accessToken);
    const serverPreferences = serverResponse.data;

    // Retrieve preferences from local storage
    const localPreferencesJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localPreferences = localPreferencesJSON ? JSON.parse(localPreferencesJSON) : {};

    // Check for differences and update if necessary
    if (JSON.stringify(serverPreferences) !== JSON.stringify(localPreferences)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverPreferences));
    }
  } catch (error) {
    console.error('Error syncing preferences:', error);
  }
};

const updatePreferences = async (accessToken: string, preferences: Record<string, any>): Promise<void> => {
  try {
    isUpdatingPreferences = true;
    // Update preferences on the server
    const serverResponse: ApiResponse = await postUserPreferences(accessToken, preferences);

    // If successful, update local storage
    if (!serverResponse.error) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
  } finally {
    isUpdatingPreferences = false;
  }
};



// EVENTUALLY THESE FUNCTIONS WILL BUNDLE ALL THE SYNCS IN ONE USEEFFECT IF THAT EVER MAKES SENSE
// RIGHT NOW, SYNC EVERYTHING INDIVIDUALLY SO WE CAN RETURN THE CHANGE AND UPDATE THE STATE IF A CHANGE

export const syncPreferences = async (accessToken: string): Promise<void> => {
  await fetchAndSyncPreferences(accessToken);
};

export const savePreferences = async (accessToken: string, preferences: Record<string, any>): Promise<void> => {
  await updatePreferences(accessToken, preferences);
};