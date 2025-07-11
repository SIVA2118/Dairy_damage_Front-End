import React, { useRef, useState } from 'react';
import './ExtraDamagePage.css';

const ExtraDamagePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [formData, setFormData] = useState({
    agency_name: "",
    milk_1_liter: "",
    milk_500_ml: "",
    milk_250_ml: "",
    milk_120_ml: "",
    curd_1_liter: "",
    curd_500_ml: "",
    curd_400_ml: "",
    curd_200_ml: "",
    curd_110_ml: "",
    other_product: "",
    other_product_quantity: "",
    submittedAt: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Start Camera
  const startCamera = () => {
    setIsCameraOn(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        alert("❌ Unable to access camera");
      });
  };

  // Capture Image
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const maxWidth = 640;
    const maxHeight = 480;

    // Calculate aspect ratio
    const aspectRatio = videoWidth / videoHeight;

    // Resize the canvas
    if (videoWidth > videoHeight) {
      canvas.width = Math.min(videoWidth, maxWidth);
      canvas.height = canvas.width / aspectRatio;
    } else {
      canvas.height = Math.min(videoHeight, maxHeight);
      canvas.width = canvas.height * aspectRatio;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImageData(blob);
    }, 'image/jpeg', 0.7); // 0.7 is the quality
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Submit to backend
  const handleSubmit = async () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("agency_name", formData.agency_name);
    formDataToSubmit.append("milk_1_liter", formData.milk_1_liter);
    formDataToSubmit.append("milk_500_ml", formData.milk_500_ml);
    formDataToSubmit.append("milk_250_ml", formData.milk_250_ml);
    formDataToSubmit.append("milk_120_ml", formData.milk_120_ml);
    formDataToSubmit.append("curd_1_liter", formData.curd_1_liter);
    formDataToSubmit.append("curd_500_ml", formData.curd_500_ml);
    formDataToSubmit.append("curd_400_ml", formData.curd_400_ml);
    formDataToSubmit.append("curd_200_ml", formData.curd_200_ml);
    formDataToSubmit.append("curd_110_ml", formData.curd_110_ml);
    formDataToSubmit.append("other_product", formData.other_product);
    formDataToSubmit.append("other_product_quantity", formData.other_product_quantity);
    formDataToSubmit.append("submittedAt", new Date().toISOString());

    if (imageData) {
      formDataToSubmit.append("image", imageData, "image.jpg");
    }

    try {
      const response = await fetch("http://localhost:5000/api/image/upload", {
        method: "POST",
        body: formDataToSubmit,
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Data and photo uploaded successfully!");
        setImageData(null);
        stopCamera();
        setFormData({
          agency_name: "",
          milk_1_liter: "",
          milk_500_ml: "",
          milk_250_ml: "",
          milk_120_ml: "",
          curd_1_liter: "",
          curd_500_ml: "",
          curd_400_ml: "",
          curd_200_ml: "",
          curd_110_ml: "",
          other_product: "",
          other_product_quantity: "",
          submittedAt: "",
        });
      } else {
        alert("❌ Upload failed: " + result.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Something went wrong while uploading.");
    }
  };

  return (
    <div className="extra-damage-container">
      <h2>📷 Extra Damage Photo Capture + Form</h2>

      <div className="form-section">
        <input type="text" name="agency_name" placeholder="Agency Name" value={formData.agency_name} onChange={handleChange} />
        <input type="text" name="milk_1_liter" placeholder="Milk 1L" value={formData.milk_1_liter} onChange={handleChange} />
        <input type="text" name="milk_500_ml" placeholder="Milk 500ml" value={formData.milk_500_ml} onChange={handleChange} />
        <input type="text" name="milk_250_ml" placeholder="Milk 250ml" value={formData.milk_250_ml} onChange={handleChange} />
        <input type="text" name="milk_120_ml" placeholder="Milk 120ml" value={formData.milk_120_ml} onChange={handleChange} />
        <input type="text" name="curd_1_liter" placeholder="Curd 1L" value={formData.curd_1_liter} onChange={handleChange} />
        <input type="text" name="curd_500_ml" placeholder="Curd 500ml" value={formData.curd_500_ml} onChange={handleChange} />
        <input type="text" name="curd_400_ml" placeholder="Curd 400ml" value={formData.curd_400_ml} onChange={handleChange} />
        <input type="text" name="curd_200_ml" placeholder="Curd 200ml" value={formData.curd_200_ml} onChange={handleChange} />
        <input type="text" name="curd_110_ml" placeholder="Curd 110ml" value={formData.curd_110_ml} onChange={handleChange} />
        <input type="text" name="other_product" placeholder="Other Product" value={formData.other_product} onChange={handleChange} />
        <input type="text" name="other_product_quantity" placeholder="Other Product Qty" value={formData.other_product_quantity} onChange={handleChange} />
      </div>

      {!isCameraOn ? (
        <button onClick={startCamera} className="start-btn">Start Camera</button>
      ) : (
        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline></video>
          <button onClick={captureImage} className="capture-btn">📸 Capture</button>
          <button onClick={stopCamera} className="stop-btn">❌ Stop</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {imageData && (
        <div className="preview-section">
          <h4>📎 Preview:</h4>
          <img src={URL.createObjectURL(imageData)} alt="Captured" />
        </div>
      )}

      <button onClick={handleSubmit} className="submit-btn">💾 Save All Data</button>
    </div>
  );
};

export default ExtraDamagePage;
