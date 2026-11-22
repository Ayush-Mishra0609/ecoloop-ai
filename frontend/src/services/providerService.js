
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const searchProviders = async (location, centreType) => {
  const params = new URLSearchParams({
    location,
    centre_type: centreType,
  });

  const response = await fetch(
    `${API_URL}/api/providers/search?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Unable to search recovery centres."
    );
  }

  return data;
};
