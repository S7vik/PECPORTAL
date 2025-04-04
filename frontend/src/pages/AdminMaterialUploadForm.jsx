import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import api from '../api/axios';
import PropTypes from 'prop-types';

const AdminMaterialUploadForm = ({ courseId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filePreview, setFilePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Show file name
            setFilePreview({
                name: selectedFile.name,
                size: formatFileSize(selectedFile.size),
                type: selectedFile.type
            });
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        setError('');

        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        if (!formData.title) {
            setError('Please provide a title for the material');
            return;
        }

        setLoading(true);

        try {

            console.log("Uploading file:", file.name);
            console.log("Form data:", formData);
            console.log("Course ID:", courseId);
            // Create a FormData object to send the file and associated data
            const formDataObj = new FormData();
            formDataObj.append('file', file);
            formDataObj.append('title', formData.title);
            formDataObj.append('description', formData.description || '');
            formDataObj.append('courseId', courseId);

            console.log("About to make API call");

            const response = await api.post('/api/materials/admin/upload', formDataObj);
            console.log("API response:", response);

            onSuccess(response.data);
        } catch (err) {
            console.error("Detailed error:", err);
            console.error('Upload error:', err);
            setError(err.response?.data || 'Failed to upload material');
        } finally {
            setLoading(false);
        }
    };

    const resetFileInput = () => {
        setFile(null);
        setFilePreview(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Upload Study Material</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title*
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Material title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
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
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                    >
                        {loading ? 'Uploading...' : 'Upload Material'}
                    </button>
                </div>
            </form>
        </div>
    );
};

AdminMaterialUploadForm.propTypes = {
    courseId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};


export default AdminMaterialUploadForm;