import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null); // State for upload error message

  useEffect(() => {
    
    fetch('https://gallery-z533.onrender.com/images')
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  const handleImageUpload = () => {
    if (!file) {
      
      setUploadError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    
    fetch('https://gallery-z533.onrender.com/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
       
        fetch('https://gallery-z533.onrender.com/images')
          .then((response) => response.json())
          .then((data) => setImages(data))
          .catch((error) => console.error('Error fetching images:', error));
      })
      .catch((error) => console.error('Error uploading image:', error));


    setUploadError(null);
  };

  const handleImageDelete = (id) => {
    
    fetch(`https://gallery-z533.onrender.com/images/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
       
        fetch('https://gallery-z533.onrender.com/images')
          .then((response) => response.json())
          .then((data) => {
            setImages(data);
            setSelectedImage(null);
          })
          .catch((error) => console.error('Error fetching images:', error));
      })
      .catch((error) => console.error('Error deleting image:', error));
  };

  return (
    <div className="App">
      <h1>Image Gallery</h1>
      <div className="upload-container">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleImageUpload} className="upload-button">
          Upload
        </button>
        {uploadError && <p className="upload-error">{uploadError}</p>} {/* Display error message */}
      </div>
      <div className="image-list">
        {images.map((image) => (
          <div key={image._id} className="image-item">
            <img
              src={`https://gallery-z533.onrender.com/${image.path}`} 
              alt={image.filename}
              onClick={() => setSelectedImage(image)}
              className="image-thumbnail"
            />
            <button onClick={() => handleImageDelete(image._id)} className="delete-button">
              Delete
            </button>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="selected-image">
          <img
            src={`https://gallery-z533.onrender.com/${selectedImage.path}`} 
            alt={selectedImage.filename}
            className="selected-image"
          />
        </div>
      )}
    </div>
  );
}

export default App;
