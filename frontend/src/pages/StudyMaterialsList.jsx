import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, Search, Calendar, Clock } from 'lucide-react';
import PropTypes from 'prop-types';


const StudyMaterialsList = ({ materials = [], course, onBackClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [downloading, setDownloading] = useState(null);

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
    const handleDownload = async (materialId) => {
        try {
            setDownloading(materialId);
            // The API endpoint should respond with the file for download
            window.open(`/api/materials/download/${materialId}`, '_blank');
        } catch (error) {
            console.error('Error downloading material:', error);
            // Show error message
        } finally {
            setTimeout(() => setDownloading(null), 1000); // Show download status for a second
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                    <button
                        onClick={onBackClick}
                        className="p-2 mr-3 hover:bg-gray-100 rounded-full"
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

            {/* Materials list */}
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
                                <div className="flex-1">
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
                                <button
                                    onClick={() => handleDownload(material.id, material.title)}
                                    className={`ml-4 p-2 rounded-full ${
                                        downloading === material.id
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    disabled={downloading === material.id}
                                >
                                    {downloading === material.id ? (
                                        <Clock className="w-5 h-5" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
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