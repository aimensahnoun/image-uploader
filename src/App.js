import axios from "axios";
import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [file, setFile] = useState(null);
  const [draggedEnter, setDraggedEnter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [typeError , setTypeError] = useState(false);
  const input = useRef(null);

  const onButtonClick = () => {
    input.current.click();
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    setDraggedEnter(true);
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (e) => {
    setTypeError(false);
    e.preventDefault();
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (e.dataTransfer.files[0]["type"] && acceptedImageTypes.includes(e.dataTransfer.files[0]["type"])) {
      setFile(e.dataTransfer.files[0]);
    }else{
      setTypeError(true);
    }
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDraggedEnter(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    toast("Link copied clipboard", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const submitImage = async () => {
    setIsLoading(true);
    let body = new FormData();
    body.set("key", process.env.REACT_APP_IMGBB);
    body.append("image", file);
    const res = await axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    });

    setImageUrl(res.data.data.display_url);
    setIsLoading(false);
  };
  const clearImage = () => {
    setFile(null);
  };

  return (
    <div id="app-container">
      <Helmet>
        <title>
          {isLoading
            ? "Uplading..."
            : imageUrl
            ? "Uploaded Sucessfully"
            : "Image Uploader"}
        </title>
      </Helmet>
      <div id="uploader-container" className={isLoading ? "uploading" : ""}>
        {isLoading ? (
          <div id="loading-container">
            <span>Uploading...</span>
            <div id="loader">
              <div></div>
            </div>
          </div>
        ) : imageUrl ? (
          <>
            <span>Uploaded successfully!</span>
            <div className="uploaded-preview">
              <img src={imageUrl} alt="uploaded" className="image-preview" />
            </div>
            <div className="url-container">
              <span style={{
                textOverflow : "ellipsis"
              }}>{imageUrl}</span>
              <button className="button copy-button" onClick={copyToClipboard}>
                Copy Link
              </button>
            </div>
          </>
        ) : (
          <>
            <span>Upload your image</span>
            <span>File should be Jpeg, Png,...</span>
            {typeError ? <span className="error">Not a valid file</span> : <></>}
            <div
              id="uploader"
              className={`${draggedEnter || file ? "solid-border" : ""}`}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragLeave={onDragLeave}
            >
              {!file ? (
                <>
                  <img src="/image.svg" alt="image-icon" />
                  <span>Drag & Drop your image here</span>
                </>
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  alt="input"
                  className="image-preview"
                />
              )}
            </div>
            <span>OR</span>
            <input
              id="input"
              type="file"
              ref={input}
              accept="image/png, image/jpeg"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            {!file ? (
              <button className="button" onClick={onButtonClick}>
                Choose a file
              </button>
            ) : (
              <div>
                <button className="button clear-image" onClick={clearImage}>
                  Clear Image
                </button>
                <button className="button submit-button" onClick={submitImage}>
                  Submit
                </button>
              </div>
            )}
          </>
        )}
        <ToastContainer />
        <div id="footer">
          <span>created by Aimen Sahnoun - devChallenges.io</span>
        </div>
      </div>
    </div>
  );
}

const UploaderBox = () => {
  return <></>;
};

export default App;
