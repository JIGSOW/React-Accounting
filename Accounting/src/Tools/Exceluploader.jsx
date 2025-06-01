import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { refreshAccessToken } from './authService'
import { useTranslation } from 'react-i18next';


const ExcelUploader = ({ username }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {t} = useTranslation();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setUploadStatus('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError(t("excelerror1"));
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);


    setIsUploading(true);
    setError('');
    setUploadStatus('Uploading...');

    const newAccessToken = await refreshAccessToken();

    await axios.post(
      `${import.meta.env.VITE_API_URL_DATA_IMPORT}/${username}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${newAccessToken}`,
        }
      }
    ).then(response => setUploadStatus(t("importedDataSuccess"))).catch(err => {
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.results?.[0]?.message ||
        t("uploadFailed");
      setError(errorMessage);
    }).finally(() => {
      setIsUploading(false);
      setUploadStatus('');
      setTimeout(() => {
        setUploadStatus('');
        setError('');
      }, 10000);
    });
  };


  return (
    <UploaderStyle>
      <div className="upload-container">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="excel-upload"
            accept=".xlsx, .xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="excel-upload" className="upload-button">
            {selectedFile ? selectedFile.name : t("chooseExcelFile")}
          </label>
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="upload-submit-button"
          >
            {isUploading ? t("uploading") : t("uploadData")}
          </button>
        )}

        {uploadStatus && <div className="upload-status success">{uploadStatus}</div>}
        {error && <div className="upload-status error">{error}</div>}
      </div>
    </UploaderStyle>
  );
};

const UploaderStyle = styled.div`
  .upload-container {
          max-width: 500px;
          border-radius: 8px;
        }

        .file-input-wrapper {
         
        }

        .upload-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .upload-button:hover {
          background-color: #45a049;
        }

        .upload-submit-button {
          padding: 10px 20px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top:10px;
          transition: background-color 0.3s;
        }

        .upload-submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .upload-submit-button:hover:not(:disabled) {
          background-color: #1976D2;
        }

        .upload-status {
          display:inline;
          margin-top: 10px;
          margin-left:10px;
          padding: 10px;
          border-radius: 4px;
        }

        .success {
          color: #3c763d;
        }

        .error {
          margin-top:5px;
          color: #a94442;
        }
`;

export default ExcelUploader;