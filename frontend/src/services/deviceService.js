
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const analyzeDevice = async (formData) => {
  const response = await fetch(
    `${API_URL}/api/devices/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Device analysis request failed.");
  }

  return data;
};
