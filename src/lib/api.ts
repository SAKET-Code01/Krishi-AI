const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredBaseUrl
  ? trimTrailingSlashes(configuredBaseUrl)
  : "https://krishi-ai-tasn.onrender.com";

export const getApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export async function sendMessage(message: string, systemPrompt?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        systemPrompt != null && systemPrompt !== ""
          ? { message, systemPrompt }
          : { message }
      ),
    });

    if (response.status === 429) {
      return "Too many requests. Please wait a moment.";
    }

    const data = await response.json();

    console.log("API RESPONSE:", data);

    return data.text || "No response from AI";
  } catch (error) {
    console.error("API ERROR:", error);
    return "Error connecting to AI";
  }
}
