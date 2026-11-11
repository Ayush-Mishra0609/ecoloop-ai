
import { analyzeDevice } from "../services/deviceService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Smartphone,
  Laptop,
  Monitor,
  Camera,
  X,
  Recycle,
  ArrowRight,
  CheckCircle
} from "lucide-react";

function Upload() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    deviceName: "",
    category: "",
    brand: "",
    model: "",
    purchaseYear: "",
    condition: "",
    workingStatus: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      return;
    }

    setMessage("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview("");
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!image) {
    setMessage("Please upload a device image.");
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();

    data.append("image", image);
    data.append("device_name", formData.deviceName);
    data.append("category", formData.category);
    data.append("brand", formData.brand);
    data.append("model", formData.model);
    data.append("purchase_year", formData.purchaseYear);
    data.append("condition", formData.condition);
    data.append("working_status", formData.workingStatus);
    data.append("description", formData.description);

    const result = await analyzeDevice(data);

    setMessage(
      `${result.message} Device: ${result.device.device_name}. API status: ${result.analysis.status}.`
    );

    console.log("API response:", result);

  } catch (error) {
    console.error("Device API error:", error);
    setMessage(error.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="upload-page">

      <header className="upload-header">
        <button
          className="upload-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="upload-brand">
          <Recycle size={25} />
          EcoLoop AI
        </div>
      </header>

      <main className="upload-container">

        <div className="upload-heading">
          <span className="upload-tag">
            <Camera size={15} /> SMART DEVICE ANALYSIS
          </span>

          <h1>Give Your Device a Second Life.</h1>

          <p>
            Upload your electronic device details and let
            EcoLoop AI help identify its recovery potential.
          </p>
        </div>

        <form className="device-form" onSubmit={handleSubmit}>

          <section className="form-section">

            <div className="form-section-heading">
              <div>
                <h2>Device Image</h2>
                <p>Upload a clear image of your electronic device.</p>
              </div>
            </div>

            {!preview ? (
              <label className="upload-dropzone">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImage}
                  hidden
                />

                <div className="upload-icon">
                  <UploadCloud size={35} />
                </div>

                <h3>Drag and drop your image here</h3>
                <p>or click to browse files</p>

                <span>PNG, JPG or WEBP · Maximum 5 MB</span>
              </label>
            ) : (
              <div className="image-preview">
                <img src={preview} alt="Uploaded device" />

                <button
                  type="button"
                  className="remove-image"
                  onClick={removeImage}
                >
                  <X size={18} />
                </button>

                <div className="image-success">
                  <CheckCircle size={16} />
                  Image uploaded successfully
                </div>
              </div>
            )}

          </section>

          <section className="form-section">

            <div className="form-section-heading">
              <div>
                <h2>Device Information</h2>
                <p>Tell us about the electronic device.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-field">
                <label>Device Name *</label>
                <input
                  name="deviceName"
                  placeholder="e.g. Dell Inspiron"
                  value={formData.deviceName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Device Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Television">Television</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Printer">Printer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>Brand *</label>
                <input
                  name="brand"
                  placeholder="e.g. Dell, HP, Samsung"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Model</label>
                <input
                  name="model"
                  placeholder="Enter model number"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Purchase Year</label>
                <select
                  name="purchaseYear"
                  value={formData.purchaseYear}
                  onChange={handleChange}
                >
                  <option value="">Select purchase year</option>
                  {Array.from(
                    { length: 20 },
                    (_, i) => new Date().getFullYear() - i
                  ).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Device Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div className="form-field full-width">
                <label>Is the device currently working? *</label>

                <div className="working-options">
                  <label>
                    <input
                      type="radio"
                      name="workingStatus"
                      value="Yes"
                      checked={formData.workingStatus === "Yes"}
                      onChange={handleChange}
                      required
                    />
                    Yes, fully working
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="workingStatus"
                      value="Partially"
                      checked={formData.workingStatus === "Partially"}
                      onChange={handleChange}
                    />
                    Partially working
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="workingStatus"
                      value="No"
                      checked={formData.workingStatus === "No"}
                      onChange={handleChange}
                    />
                    Not working
                  </label>
                </div>
              </div>

              <div className="form-field full-width">
                <label>Additional Description</label>
                <textarea
                  name="description"
                  placeholder="Mention any issues, damaged components or additional details..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

            </div>

          </section>

          {message && (
            <div className="upload-message">
              {message}
            </div>
          )}

          <div className="upload-submit-section">
            <p>
              <Recycle size={17} />
              Help us give electronic devices a second life.
            </p>

            <button
              type="submit"
              className="analyze-button"
              disabled={loading}
            >
              {loading ? "Validating..." : "Analyze My Device"}
              <ArrowRight size={19} />
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}

export default Upload;
