// Create a new file called SimpleUploadForm.jsx
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import PropTypes from 'prop-types';

const SimpleUploadForm = ({ courseId, onSuccess, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filePreview, setFilePreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview({
                name: selectedFile.name,
                size: formatFileSize(selectedFile.size),
            });
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const resetFileInput = () => {
        setFile(null);
        setFilePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        setError('');

        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        if (!title) {
            setError('Please provide a title for the material');
            return;
        }

        setLoading(true);

        try {
            console.log("Preparing form data");
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('description', description || '');
            formData.append('courseId', courseId);

            console.log("Making API request");
            // Use fetch instead of axios to rule out axios configuration issues
            const response = await fetch(`https://pecportal.store/api/materials/admin/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    // Don't set Content-Type, let browser handle it
                }
            });

            console.log("Response received:", response.status);

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);
            onSuccess(data);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || 'Failed to upload material');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Upload Study Material</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title*
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Material title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Brief description about the material"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        File*
                    </label>

                    {filePreview ? (
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-md">
                            <div>
                                <p className="font-medium text-sm">{filePreview.name}</p>
                                <p className="text-xs text-gray-500">{filePreview.size}</p>
                            </div>
                            <button
                                type="button"
                                onClick={resetFileInput}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-1">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    PDF, DOC, PPT, XLS, TXT up to 10MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 text-red-500 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {loading ? 'Uploading...' : 'Upload Material'}
                    </button>
                </div>
            </form>
        </div>
    );
};

SimpleUploadForm.propTypes = {
    courseId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default SimpleUploadForm;