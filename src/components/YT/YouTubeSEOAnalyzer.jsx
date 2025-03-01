import { useState, useEffect } from "react"; // Added useEffect import
import axios from "axios";
import "./YT.css";

export default function YouTubeSEOAnalyzer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [extractedTitles, setExtractedTitles] = useState([]);
  const [Descriptions, setExtractedDescriptions] = useState([]);
  const [networkSpeed, setNetworkSpeed] = useState(null);
  const [internetQuality, setInternetQuality] = useState("Checking...");

  const analyzeSEO = async () => {
    setLoading(true);
    try {
      console.log("Analyzing SEO for:", videoUrl);

      const response = await axios.post("/api/analyze-seo", { url: videoUrl });
      setSeoData(response.data);
      console.log("SEO Data:", response.data);

      const titlesArray = [response.data.optimizedTitles[0]];

      // Ensure optimizedTitles exists and is an array before mapping
      console.log("Titlearray", titlesArray[0]);
      const extractedTitles = titlesArray[0].map((title) =>
        title.includes(",") ? title.split(",").map((part) => part.trim()) : [title]
      );
      console.log("title", extractedTitles[0]);
      setExtractedTitles(extractedTitles[0]);

      // Extract Descriptions
      const descriptionsArray = response.data.optimizedDescription || [];
      console.log("Descriptions:", descriptionsArray);
      setExtractedDescriptions(descriptionsArray);
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Measure network speed
    const testImage = new Image();
    const startTime = performance.now();

    testImage.src = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg?t=" + startTime;

    testImage.onload = () => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // in seconds
      const fileSize = 300; // KB (approximate size of test image)
      const speed = fileSize / duration; // KBps

      setNetworkSpeed(speed.toFixed(2) + " KBps");

      if (speed > 500) {
        setInternetQuality("🚀 Excellent Internet Speed");
      } else if (speed > 200) {
        setInternetQuality("👍 Good Internet Speed");
      } else if (speed > 50) {
        setInternetQuality("⚠️ Slow Internet, expect delays");
      } else {
        setInternetQuality("❌ Very Slow Internet");
      }
    };
  }, []);

  return (
    <div className="container">
      <h1 className="heading">🎯 YouTube SEO Analyzer</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="input-field"
        />
        <div className="analyze-container">
          <button
            onClick={analyzeSEO}
            className={`analyze-btn ${loading ? "loading" : ""}`}
            disabled={!videoUrl || loading}
          >
            {loading ? (
              <>
                <span className="loader"></span> Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </button>
          <p className="internet-status">{internetQuality} ({networkSpeed || "Checking..."})</p>
        </div>
      </div>

      {seoData && (
        <div className="result-container">
          <div className="result-box">
            <h2>📌 SEO Analysis</h2>

            <div className="content">
              <h3>Original Title</h3>
              <p>{seoData.title || "No title available"}</p>
            </div>

            <div className="content">
              <h3>📝 Extracted Optimized Titles</h3>
              <ul>
                {extractedTitles.length > 0 ? (
                  extractedTitles.map((title, index) => (
                    <li key={index}>{title}</li>
                  ))
                ) : (
                  <li>No extracted titles available</li>
                )}
              </ul>
            </div>

            <div className="content">
              <h3>📜 Extracted Optimized Descriptions</h3>
              <ul>
              {Descriptions ? (
    <li>{Descriptions}</li> // ✅ Directly rendering the string
  ) : (
    <li>No extracted descriptions available</li> // ✅ Fallback for empty description
  )}
              </ul>
            </div>
          </div>

          <div className="result-box">
            <div className="content">
              <h3>🔖 Best Tags</h3>
              <p>{seoData.tags?.length ? seoData.tags.join(", ") : "No tags available"}</p>
            </div>

            <div className="content">
              <h3>📌 Optimized Tags</h3>
              <p>{seoData.optimizedTags?.length ? seoData.optimizedTags.join(" ") : "No optimized tags available"}</p>
            </div>

            <div className="content" style={{ fontSize: "18.5px" }}>
              <h3>#️⃣ Hashtags</h3>
              <p>{seoData.optimizedHasTags?.length ? seoData.optimizedHasTags.join(" ") : "No optimized tags available"}</p>

            </div>

            

            <div className="seo-score">
              <h3>🔥 SEO Score</h3>
              <p>{seoData.seoScore}/100</p>
            </div>
            <button
              onClick={analyzeSEO}
              className={`analyze-btn ${loading ? "loading" : ""}`}
              disabled={!videoUrl || loading}
            >
              {loading ? (
                <>
                  <span className="loader"></span> Analyzing...
                </>
              ) : (
                "Re-Analyze"
              )}
            </button>``
          </div>
        </div>
      )}
    </div>
  );
}
