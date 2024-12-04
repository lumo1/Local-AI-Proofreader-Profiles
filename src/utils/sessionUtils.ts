// utils/sessionUtils.ts

let session: any = null;

export const createSession = async ({ systemPrompt }: { systemPrompt: string }) => {
  try {
    if (!session) {
      // @ts-ignore - Chrome experimental API
      console.log("Attempting to create session with system prompt:", systemPrompt);
      session = await chrome.aiOriginTrial.languageModel.create({ systemPrompt });
      console.log("Session created successfully:", session);
    }
    return session;
  } catch (error) {
    console.error('Error creating AI session:', error);
    throw error; // Ensure we throw this error to handle it properly in the calling function
  }
};

export const promptSession = async (session: any, prompt: string) => {
  try {
    console.log("Sending prompt to session:", prompt);
    const response = await session.prompt(prompt);
    console.log("Full response from AI model:", response);

    // Assuming the AI returns a string directly instead of an object
    if (response && typeof response === 'string') {
      return response; // Return the response as it is
    } else {
      console.error('Unexpected response structure from AI model:', response);
      return null;
    }
  } catch (error) {
    console.error('Error prompting AI session:', error);
    return null;
  }
};

// Added resetSession function to handle destroying the session
export const resetSession = async () => {
  try {
    if (session) {
      console.log("Destroying the current session.");
      await session.destroy();
      session = null;
      console.log("Session destroyed successfully.");
    }
  } catch (error) {
    console.error('Error destroying the AI session:', error);
    throw error; // Throw the error to ensure that the calling function handles it
  }
};
