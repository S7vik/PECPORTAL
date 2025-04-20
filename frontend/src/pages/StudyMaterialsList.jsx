import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, Search, Calendar, Clock, Eye } from 'lucide-react';
import PropTypes from 'prop-types';
import McqGenerator from "../components/McqGenerator.jsx";

const StudyMaterialsList = ({ materials = [], course, onBackClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [downloading, setDownloading] = useState(null);
    const [viewingFile, setViewingFile] = useState(null);

    // Filter materials based on search
    const filteredMaterials = materials.filter(material =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle download
    const handleDownload = (material) => {
        if (!material || !material.filePath) {
            console.error('Invalid material or missing file path');
            return;
        }

        setDownloading(material.id);

        // Create the download link
        const backendUrl = 'https://pecportal.store'; // Change to your backend URL
        const downloadUrl = `${backendUrl}/api/materials/direct-download/${material.filePath}`;

        // Direct approach - open in a new window/tab
        window.open(downloadUrl, '_blank');

        // Reset downloading state after a delay
        setTimeout(() => setDownloading(null), 1500);
    };

    // Handle file viewing
    const handleViewFile = (material) => {
        if (!material || !material.fileUrl) {
            console.error('Invalid material or missing file path');
            return;
        }

        // Create the file URL for viewing
        const backendUrl = 'https://pecportal.store'; // Change to your backend URL
        const fileUrl = `${backendUrl}/api/materials/view/${material.id}`;

        // Set the viewing file
        setViewingFile({
            url: fileUrl,
            title: material.title,
            fileName: material.fileName,
            fileType: material.fileType
        });
    };

    // Close file viewer
    const closeFileViewer = () => {
        setViewingFile(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                    <button
                        onClick={onBackClick}
                        className="p-2 mr-3 hover:bg-gray-100 rounded-full"
                        disabled={!!viewingFile}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {course.courseName}
                        </h2>
                        <p className="text-gray-600 text-sm flex items-center mt-1">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 mr-2">
                {course.courseCode}
              </span>
                            {course.instructor && (
                                <span>Instructor: {course.instructor}</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">Study Materials</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Materials list or file viewer */}
            {viewingFile ? (
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{viewingFile.title}</h3>
                        <button
                            onClick={closeFileViewer}
                            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            Close
                        </button>
                    </div>

                    <div className="border rounded-lg overflow-hidden h-[70vh]">
                        {viewingFile.fileType === 'pdf' ? (
                            <iframe
                                src={viewingFile.url}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                                title={viewingFile.fileName || "Document viewer"}
                            ></iframe>
                        ) : viewingFile.fileType === 'jpg' || viewingFile.fileType === 'jpeg' || viewingFile.fileType === 'png' ? (
                            <img
                                src={viewingFile.url}
                                alt={viewingFile.title}
                                className="max-w-full max-h-full mx-auto"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                                <div className="text-center p-6">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 mb-4">This file type cannot be previewed directly</p>
                                    <button
                                        onClick={() => window.open(viewingFile.url, '_blank')}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Download to View
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {filteredMaterials.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">
                                {searchQuery
                                    ? `No materials found matching "${searchQuery}"`
                                    : "No study materials available for this course"}
                            </p>
                        </div>
                    ) : (
                        filteredMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => handleViewFile(material)}
                                    >
                                        <h4 className="font-medium text-gray-900">{material.title}</h4>
                                        {material.description && (
                                            <p className="text-gray-600 text-sm mt-1">{material.description}</p>
                                        )}
                                        <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Uploaded: {formatDate(material.uploadDate)}
                      </span>
                                            <span className="flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                                                {material.fileName || 'Unnamed file'}
                      </span>
                                            {material.fileType && (
                                                <span className="uppercase">{material.fileType}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewFile(material)}
                                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                                            title="View file"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(material)}
                                            className={`p-2 rounded-full ${
                                                downloading === material.id
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                            disabled={downloading === material.id}
                                            title="Download file"
                                        >
                                            {downloading === material.id ? (
                                                <Clock className="w-5 h-5" />
                                            ) : (
                                                <Download className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <McqGenerator courseId={course.id} courseName={course.courseName} />
        </div>
    );
};

StudyMaterialsList.propTypes = {
    materials: PropTypes.array,
    course: PropTypes.shape({
        id: PropTypes.string.isRequired,
        courseCode: PropTypes.string.isRequired,
        courseName: PropTypes.string.isRequired,
        instructor: PropTypes.string
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};

export default StudyMaterialsList;