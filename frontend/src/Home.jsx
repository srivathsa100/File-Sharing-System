import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, tuploadFile } from './service/api';
import NavBar from "./Components/NavBar";
import QRCode from 'qrcode.react';
import { useDropzone } from 'react-dropzone';

const Chatbot = () => {
  const navigate = useNavigate();
  const [sendOnce, setSendOnce] = useState(true);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const expiryDate = localStorage.getItem("expiryDate");
  if (expiryDate === "null") {
    navigate("/signup");
  }

  useEffect(() => {
    console.log("useEffect - Checking persisted state");
    let a = localStorage.getItem('persist:root');
  }, []);

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        console.log("Uploading file", file);
        const data = new FormData();
        let uid = localStorage.getItem('uid');
        data.append("name", file.name);
        data.append("file", file);
        data.append("uid", uid);

        const response = sendOnce ? await tuploadFile(data) : await uploadFile(data);
        console.log("Response from API", response);
        setResult(response.path);
      }
    };

    getImage();
  }, [file, sendOnce]);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Files dropped", acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleShare = async () => {
    if (result && navigator.share) {
      const qrCodeCanvas = document.getElementById('qr-code');
      qrCodeCanvas.toBlob(async (blob) => {
        const filesArray = [
          new File([blob], 'qrcode.png', { type: blob.type }),
        ];

        try {
          await navigator.share({
            title: 'Share Pynapple Share Link',
            text: 'Here is the link to the file:',
            url: result,
            files: filesArray,
          });
          console.log('Successful share');
        } catch (error) {
          console.error('Error sharing', error);
        }
      });
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  const renderUploadButton = () => {
    if (!result) {
      return (
        <button
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-800 transition duration-300 shadow-lg"
          onClick={() => fileInputRef.current.click()}
        >
          Upload
        </button>
      );
    }
    return null;
  };

  const fileInputRef = useRef();

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/bg.png')" }}
      ></div>
      <div className="absolute inset-0 bg-yellow-300 bg-opacity-90"></div>
      <div className="relative flex flex-col flex-grow">
        <NavBar />
        <div className="w-full h-full flex items-center justify-center flex-grow ">
          <div className="max-w-4xl bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-lg p-10 border border-orange-900 transform perspective-1000 rotate-x-1">
            <div className="text-center mt-4 mx-10">
              <p className="text-black mt-2">Upload and share the download link.</p>
              {!result ? (
                <div
                  {...getRootProps()}
                  className={`my-5 w-64 h-64 bg-yellow-100 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-8 border-dotted border-2 border-orange-600 ${isDragActive ? 'border-dotted border-2 border-green-500' : ''} flex items-center justify-center`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop your files here ...</p>
                  ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  )}
                </div>
              ) : (
                <>
                  {file && (
                    <p className="text-black mt-2 text-center font-bold">{file.name}</p>
                  )}
                  <div className="py-4 bg-white rounded-lg flex justify-center">
                    <QRCode id="qr-code" value={result} size={128} />
                  </div>
                  <div className="mt-4 flex justify-center items-center">
                    <div className="bg-yellow-500 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg px-4 py-2 flex items-center">
                      <a
                        href={result}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-900 transition duration-300 truncate max-w-[300px]"
                      >
                        {result}
                      </a>
                      <button
                        className="ml-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-full hover:from-orange-900 hover:to-orange-900 transition duration-300 shadow-lg flex items-center justify-center"
                        onClick={handleShare}
                      >share
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.11 12.53L16 15.42 12.6 18.82 9.18 15.4 12.07 12.53 3.11 12.53 3.11 10.53 12.11 10.53 9.24 7.66 12.64 4.26 16.03 7.66 13.11 10.53 21.11 10.53 21.11 12.53zM13.11 15.18z" />
                        </svg> */}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-white m-2 flex justify-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="ml-2 form-checkbox h-6 w-6 text-orange-500 focus:ring-2 focus:ring-orange-500"
                        checked={sendOnce}
                        onChange={(e) => setSendOnce(e.target.checked)}
                      />
                      <span className="text-lg text-orange-800">Send Once</span>
                    </label>
                  </div>
                  <div>
                    {
                      sendOnce?<p className="text-lg text-orange-800">Link is valid till 5 mins</p>:null
                    }
                    
                  </div>
                </>
              )}
              {renderUploadButton()}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
