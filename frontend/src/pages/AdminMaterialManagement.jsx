import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, FileText, Download, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import Modal from "./Modal.jsx";
import PropTypes from 'prop-types';

const AdminMaterialUpload = ({ courses, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        file: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFormData(prev => ({
                ...prev,
                file: e.target.files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validate form
        if (!formData.title || !formData.courseId || !formData.file) {
            setError('Please fill all required fields and select a file');
            setLoading(false);
            return;
        }

        // Prepare form data for file upload
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description || '');
        uploadData.append('courseId', formData.courseId);

        try {
            const response = await api.post('/api/materials/admin/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Material uploaded successfully!');

            // Call the success callback
            if (onSuccess) {
                onSuccess(response.data);
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                courseId: '',
                file: null
            });

            // Reset file input by clearing the value
            const fileInput = document.getElementById('materialFile');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            console.error('Error uploading material:', err);
            setError(
                err.response?.data ||
                'Failed to upload material. Please check your connection and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit}>
                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                        {success}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title*
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course*
                        </label>
                        <select
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            File*
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <div className="flex justify-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                </div>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="materialFile" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input
                                            id="materialFile"
                                            name="file"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, etc.
                                </p>
                                {formData.file && (
                                    <p className="text-sm text-indigo-600">
                                        Selected: {formData.file.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400 flex items-center"
                    >
                        {loading ? (
                            <>Uploading...</>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Upload Material
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

AdminMaterialUpload.propTypes = {
    courses: PropTypes.array.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

const AdminMaterialManagement = ({ courses = [] }) => {
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Fetch all materials
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await api.get('/api/materials/admin/all');
                setMaterials(response.data);
                setFilteredMaterials(response.data);
            } catch (err) {
                console.error('Error fetching materials:', err);
                setError('Failed to load materials. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    // Filter materials based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMaterials(materials);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = materials.filter(
                material =>
                    material.title.toLowerCase().includes(query) ||
                    material.description?.toLowerCase().includes(query) ||
                    material.fileName?.toLowerCase().includes(query)
            );
            setFilteredMaterials(filtered);
        }
    }, [searchQuery, materials]);

    // Handle material upload success
    const handleMaterialUpload = (newMaterial) => {
        setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
        setIsAddModalOpen(false);
    };

    // Handle material update
    const handleUpdateMaterial = async (id, updatedDetails) => {
        try {
            const response = await api.put(`/api/materials/admin/${id}`, null, {
                params: updatedDetails
            });

            setMaterials(prevMaterials =>
                prevMaterials.map(material =>
                    material.id === id ? response.data : material
                )
            );

            setIsEditModalOpen(false);
            setSelectedMaterial(null);
        } catch (error) {
            console.error('Error updating material:', error);
            // Show error in UI
        }
    };

    // Handle material deletion
    const handleDeleteMaterial = async (id) => {
        try {
            await api.delete(`/api/materials/admin/${id}`);
            setMaterials(prevMaterials =>
                prevMaterials.filter(material => material.id !== id)
            );
            setIsDeleteModalOpen(false);
            setSelectedMaterial(null);
        } catch (error) {
            console.error('Error deleting material:', error);
            // Show error in UI
        }
    };

    // Get course name by id
    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.courseCode} - ${course.courseName}` : 'Unknown Course';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Study Materials</h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading materials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Study Materials</h3>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Material
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="mb-4 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search materials by title, description, or filename..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {filteredMaterials.length === 0 ? (
                <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                        {searchQuery
                            ? 'No materials match your search'
                            : 'No study materials available yet'}
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Upload your first material
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Upload Date
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMaterials.map((material) => (
                            <tr key={material.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {material.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {getCourseName(material.courseId)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {material.fileName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {material.uploadDate
                                        ? new Date(material.uploadDate).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => window.open(`/api/materials/download/${material.id}`, '_blank')}
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMaterial(material);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Edit Details"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMaterial(material);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Material Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Upload Study Material"
            >
                <AdminMaterialUpload
                    courses={courses}
                    onSuccess={handleMaterialUpload}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Modal>

            {/* Edit Material Modal */}
            {selectedMaterial && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Edit Material Details"
                >
                    <div className="p-6">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateMaterial(selectedMaterial.id, {
                                title: e.target.title.value,
                                description: e.target.description.value
                            });
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={selectedMaterial.title}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        defaultValue={selectedMaterial.description || ''}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course
                                    </label>
                                    <input
                                        type="text"
                                        value={getCourseName(selectedMaterial.courseId)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Course cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedMaterial.fileName || 'N/A'}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-gray-500">To change the file, delete this material and upload a new one</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Delete Material Confirmation Modal */}
            {selectedMaterial && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete Material"
                >
                    <div className="p-6">
                        <div className="flex items-center text-red-600 mb-4">
                            <AlertTriangle className="w-6 h-6 mr-2" />
                            <h3 className="text-lg font-medium">Are you sure?</h3>
                        </div>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete the study material {'"${selectedMaterial.title}"?'} This action cannot be undone, and the file will be permanently deleted.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteMaterial(selectedMaterial.id)}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

AdminMaterialManagement.propTypes = {
    courses: PropTypes.array
};

export default AdminMaterialManagement;