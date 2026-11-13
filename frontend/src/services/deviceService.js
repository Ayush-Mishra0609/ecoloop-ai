
import { supabase } from "./supabase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Existing AI analysis function
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
    throw new Error(
      data.detail || "Device analysis request failed."
    );
  }

  return data;
};

// Upload image and save device details
export const saveDevice = async ({
  image,
  formData,
  analysis,
  correctedCategory,
}) => {
  // Get logged-in user
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Please log in before saving your device.");
  }

  const user = userData.user;

  // Generate unique storage path
  const filePath =
    `${user.id}/${crypto.randomUUID()}-${image.name}`;

  // Upload image to private bucket
  const { error: uploadError } = await supabase.storage
    .from("device-images")
    .upload(filePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Save device details in database
  const { data, error: insertError } = await supabase
    .from("devices")
    .insert({
      user_id: user.id,
      device_name: formData.deviceName,
      category: formData.category,
      brand: formData.brand,
      model: formData.model || null,
      purchase_year: formData.purchaseYear
        ? Number(formData.purchaseYear)
        : null,
      condition: formData.condition,
      working_status: formData.workingStatus,
      description: formData.description || null,

      ai_classification: analysis.classification,
      ai_confidence: analysis.confidence,
      confirmed_category: correctedCategory,
      top_predictions: analysis.top_predictions,

      image_url: filePath,
    })
    .select()
    .single();

  if (insertError) {
    // Remove uploaded image if database insertion fails
    await supabase.storage
      .from("device-images")
      .remove([filePath]);

    throw new Error(insertError.message);
  }

  return data;
};
