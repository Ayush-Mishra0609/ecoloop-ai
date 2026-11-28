import { analyzeDevice, saveDevice } from "../services/deviceService";
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
  const [analysis, setAnalysis] = useState(null);
  const [correctedCategory, setCorrectedCategory] = useState("");
  const [categoryConfirmed, setCategoryConfirmed] = useState(false);
  const [saving, setSaving] = useState(false); 

  const [formData, setFormData] = useState({
  deviceName: "",
  category: "",
  brand: "",
  model: "",
  purchaseYear: "",
  condition: "",
  workingStatus: "",
  performance: "",
  batteryHealth: "",
  physicalDamage: "",
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
    setAnalysis(null);
    setCorrectedCategory("");
    setCategoryConfirmed(false);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  
const removeImage = () => {
  if (preview) URL.revokeObjectURL(preview);

  setImage(null);
  setPreview("");
  setAnalysis(null);
  setCorrectedCategory("");
  setCategoryConfirmed(false);
  setMessage("");
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
    data.append("performance", formData.performance);
    data.append("battery_health", formData.batteryHealth);
    data.append("physical_damage", formData.physicalDamage);
    data.append("description", formData.description);

    const result = await analyzeDevice(data);

    setAnalysis(result.analysis);
    setCorrectedCategory(result.analysis.classification);
    setCategoryConfirmed(false);
    setMessage(result.message);

    console.log("API response:", result);

  } catch (error) {
    console.error("Device API error:", error);
    setMessage(error.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

const handleSaveDevice = async () => {
  if (!categoryConfirmed) {
    setMessage("Please confirm the device category first.");
    return;
  }

  if (!image || !analysis) {
    setMessage("Please analyze your device first.");
    return;
  }

  setSaving(true);
  setMessage("");

  try {
    const savedDevice = await saveDevice({
      image,
      formData,
      analysis,
      correctedCategory,
    });

    setMessage("Device saved successfully!");

    console.log("Saved device:", savedDevice);
  } catch (error) {
    console.error("Save device error:", error);
    setMessage(error.message || "Failed to save device.");
  } finally {
    setSaving(false);
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
              <div className="form-field">
  <label>Device Performance *</label>

  <select
    name="performance"
    value={formData.performance}
    onChange={handleChange}
    required
  >
    <option value="">Select performance</option>
    <option value="Normal">Works normally</option>
    <option value="Slow">Runs slowly</option>
    <option value="Frequently hangs">Frequently hangs or freezes</option>
    <option value="Not tested">Not tested</option>
  </select>
</div>
<div className="form-field">
  <label>Battery Health</label>

  <select
    name="batteryHealth"
    value={formData.batteryHealth}
    onChange={handleChange}
  >
    <option value="">Select battery health</option>
    <option value="Good">Good</option>
    <option value="Drains quickly">Drains quickly</option>
    <option value="Not working">Not working</option>
    <option value="Not applicable">Not applicable</option>
    <option value="Not tested">Not tested</option>
  </select>
</div>
<div className="form-field">
  <label>Physical Damage *</label>

  <select
    name="physicalDamage"
    value={formData.physicalDamage}
    onChange={handleChange}
    required
  >
    <option value="">Select damage level</option>
    <option value="None">No visible damage</option>
    <option value="Minor">Minor scratches or dents</option>
    <option value="Moderate">Cracks or noticeable damage</option>
    <option value="Severe">Severe physical damage</option>
    <option value="Not sure">Not sure</option>
  </select>
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
          
{analysis && (
  <section className="ai-analysis-card">
    <div className="ai-analysis-heading">
      <div>
        <span className="ai-analysis-tag">
          <CheckCircle size={15} />
          AI ANALYSIS COMPLETED
        </span>

        <h2>EcoLoop AI Results</h2>
      </div>
    </div>

    <div className="ai-result-main">
      <span>Detected Device Category</span>

      <h3>{analysis.classification}</h3>

      <p>
        Model confidence:{" "}
        {(analysis.confidence * 100).toFixed(2)}%
      </p>
    </div>
    
{/* Gemini Description Analysis */}
<div className="gemini-analysis-card">
  <div className="gemini-analysis-heading">
    <h3>Gemini AI Description Analysis</h3>
    <span>AI Powered</span>
  </div>

  <p className="gemini-summary">
    {analysis.description_analysis?.summary ||
      "No additional description analysis available."}
  </p>

  <h4>Extracted Device Issues</h4>

  {analysis.description_analysis?.issues?.length > 0 ? (
    <ul className="gemini-issues-list">
      {analysis.description_analysis.issues.map((issue, index) => (
        <li key={index}>{issue}</li>
      ))}
    </ul>
  ) : (
    <p>No additional issues detected from the description.</p>
  )}

  <div className="gemini-issue-flags">
    <span>
      Performance: {analysis.description_analysis?.performance_issue ? "Detected" : "Not detected"}
    </span>
    <span>
      Battery: {analysis.description_analysis?.battery_issue ? "Detected" : "Not detected"}
    </span>
    <span>
      Functional: {analysis.description_analysis?.functional_issue ? "Detected" : "Not detected"}
    </span>
    <span>
      Physical Damage: {analysis.description_analysis?.physical_damage_issue ? "Detected" : "Not detected"}
    </span>
  </div>
</div>

    

<div className="condition-assessment-card">

  <div className="condition-assessment-heading">
    <div>
      <span className="ai-analysis-tag">
        CONDITION ASSESSMENT
      </span>
      <h3>Device Health Score</h3>
    </div>

    <div className="condition-score">
      <strong>{analysis.condition_score}/100</strong>
      <span>{analysis.condition_category}</span>
    </div>
  </div>

  <div className="condition-progress-track">
    <div
      className="condition-progress-fill"
      style={{
        width: `${analysis.condition_score}%`
      }}
    />
  </div>

  <div className="identified-issues">
    <h4>Identified Issues</h4>

    {analysis.identified_issues?.length > 0 ? (
      <ul>
        {analysis.identified_issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    ) : (
      <p>No major issues reported.</p>
    )}
  </div>

  <div className="recovery-recommendation">
    <span>Recommended Recovery Pathway</span>
    <h3>{analysis.recommended_pathway}</h3>
    <p>{analysis.recommendation_reason}</p>
  </div>

{/* Environmental Impact Card */}
<div className="environmental-impact-card">
  <div className="environmental-impact-heading">
    <h3>Environmental Impact</h3>
    <span>Eco Impact</span>
  </div>

  {analysis.estimated_co2_kg !== null &&
   analysis.estimated_co2_kg !== undefined ? (
    <>
      <div className="co2-impact-value">
        <strong>{analysis.estimated_co2_kg}</strong>
        <span>kg CO₂e</span>
      </div>

      <p>
        Estimated potential emissions benefit through{" "}
        {analysis.recommended_pathway.toLowerCase()}.
      </p>

      <div className="environmental-impact-details">
        <span>
          Device: <strong>{analysis.classification}</strong>
        </span>
        <span>
          Recovery: <strong>{analysis.recommended_pathway}</strong>
        </span>
      </div>
    </>
  ) : (
    <p>
      Environmental impact estimate is currently unavailable
      for this device or recovery pathway.
    </p>
  )}

  <small>
    Illustrative estimate based on EcoLoop AI project assumptions,
    not a verified lifecycle assessment.
  </small>
</div>


</div>


    <div className="ai-predictions">
      <h3>Top Predictions</h3>

      {analysis.top_predictions?.map((item, index) => (
        <div className="ai-prediction-row" key={item.category}>
          <div>
            <span>{index + 1}. {item.category}</span>
            <strong>
              {(item.confidence * 100).toFixed(2)}%
            </strong>
          </div>

          <div className="ai-progress-track">
            <div
              className="ai-progress-fill"
              style={{
                width: `${item.confidence * 100}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>

<div className="category-correction">
  <h3>Is this classification correct?</h3>

  <p>
    Please verify the AI prediction or select the correct
    device category.
  </p>

  <label htmlFor="correctedCategory">
    Confirm Device Category
  </label>

  <select
    id="correctedCategory"
    value={correctedCategory}
    onChange={(e) => {
      setCorrectedCategory(e.target.value);
      setCategoryConfirmed(false);
    }}
  >
    <option value="Battery">Battery</option>
    <option value="Cable">Cable</option>
    <option value="Keyboard">Keyboard</option>
    <option value="Laptop">Laptop</option>
    <option value="Mobile">Mobile</option>
    <option value="Mouse">Mouse</option>
    <option value="PCB">PCB</option>
  </select>

  <button
    type="button"
    className="confirm-category-button"
    onClick={() => {
      setCategoryConfirmed(true);
      setMessage("Device category confirmed successfully!");
    }}
  >
    Confirm Category
  </button>

  {categoryConfirmed && (
    <div className="category-confirmation">
      <CheckCircle size={17} />
      Confirmed category: {correctedCategory}
    </div>
  )}
</div>
{categoryConfirmed && (
  <button
    type="button"
    className="confirm-category-button"
    onClick={handleSaveDevice}
    disabled={saving}
  >
    {saving ? "Saving Device..." : "Save Device"}
  </button>
)}


    <p className="ai-disclaimer">
      AI predictions are estimates. Please verify the detected
      category before proceeding with recovery recommendations.
    </p>
  </section>
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
