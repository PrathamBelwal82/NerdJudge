// src/components/FileUpload.jsx

import React, { useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';

function FileUpload({ userId, problemId }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('problemId', problemId);

        try {
            const response = await fetch('https://backend.nerdjudge.me/submissions/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            console.log('File uploaded successfully:', data);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Typography variant="h6">Upload your solution</Typography>
            <input type="file" onChange={handleFileChange} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                disabled={uploading}
            >
                {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
        </div>
    );
}

export default FileUpload;
