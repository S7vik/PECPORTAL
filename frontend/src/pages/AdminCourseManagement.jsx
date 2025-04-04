import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import Modal from "./Modal.jsx";
import AdminCourseForm from "./AdminCourseForm.jsx";

const AdminCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/api/courses/admin/all');
                setCourses(response.data);
                setFilteredCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter courses based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = courses.filter(
                course =>
                    course.courseCode.toLowerCase().includes(query) ||
                    course.courseName.toLowerCase().includes(query) ||
                    course.instructor?.toLowerCase().includes(query) ||
                    course.department.toLowerCase().includes(query)
            );
            setFilteredCourses(filtered);
        }
    }, [searchQuery, courses]);

    // Handle course creation
    const handleAddCourse = async (newCourse) => {
        try {
            const response = await api.post('/api/courses/admin', newCourse);
            setCourses(prevCourses => [...prevCourses, response.data]);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    // Handle course update
    const handleUpdateCourse = (updatedCourse) => {
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.id === updatedCourse.id ? updatedCourse : course
            )
        );
        setIsEditModalOpen(false);
        setSelectedCourse(null);
    };

    // Handle course deletion
    const handleDeleteCourse = async (courseId) => {
        try {
            await api.delete(`/api/courses/admin/${courseId}`);
            setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // Open edit modal with selected course
    const openEditModal = (course) => {
        setSelectedCourse(course);
        setIsEditModalOpen(true);
    };

    // Open delete confirmation modal
    const openDeleteModal = (course) => {
        setSelectedCourse(course);
        setIsDeleteModalOpen(true);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Manage Courses</h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Manage Courses</h3>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Course
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
                        placeholder="Search courses by name, code, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        {searchQuery ? 'No courses match your search' : 'No courses available'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Semester
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Batch Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCourses.map((course) => (
                            <tr key={course.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {course.courseCode}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {course.courseName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {course.department}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {course.semester}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {course.batchYear}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => openEditModal(course)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(course)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Course Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Course"
            >
                <AdminCourseForm
                    onSubmit={handleAddCourse}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Modal>

            {/* Edit Course Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Course"
            >
                <AdminCourseForm
                    course={selectedCourse}
                    onSubmit={handleUpdateCourse}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </Modal>

            {/* Delete Course Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Course"
            >
                <div className="p-6">
                    <div className="flex items-center text-red-600 mb-4">
                        <AlertTriangle className="w-6 h-6 mr-2" />
                        <h3 className="text-lg font-medium">Are you sure?</h3>
                    </div>
                    <p className="mb-6 text-gray-600">
                        Are you sure you want to delete the course {'"${selectedCourse?.courseName}" ({selectedCourse?.courseCode})'}? This action cannot be undone, and all associated materials will also be deleted.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteCourse}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminCourseManagement;