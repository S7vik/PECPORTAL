import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PropTypes from "prop-types";

const AdminCourseForm = ({
                             course = null,
                             onSubmit,
                             onCancel
                         }) => {
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        instructor: '',
        description: '',
        department: '',
        semester: 1,
        batchYear: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If course is provided, it's an edit operation
    useEffect(() => {
        if (course) {
            setFormData({
                courseCode: course.courseCode || '',
                courseName: course.courseName || '',
                instructor: course.instructor || '',
                description: course.description || '',
                department: course.department || '',
                semester: course.semester || 1,
                batchYear: course.batchYear || '',
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'semester' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate form
            if (!formData.courseCode || !formData.courseName || !formData.department || !formData.batchYear) {
                throw new Error('Please fill all required fields');
            }

            let response;

            if (course) {
                // Update existing course
                response = await api.put(`/api/courses/admin/${course.id}`, formData);
            } else {
                // Create new course
                response = await api.post('/api/courses/admin', formData);
            }

            onSubmit(response.data);

        } catch (err) {
            console.error('Course form error:', err);
            setError(err.response?.data || err.message || 'Failed to save course');
        } finally {
            setLoading(false);
            onNavigate('/admin/courses'); // Redirect to courses page after submission
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">
                {course ? 'Edit Course' : 'Add New Course'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Code*
                        </label>
                        <input
                            type="text"
                            name="courseCode"
                            value={formData.courseCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="E.g. CS101"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Name*
                        </label>
                        <input
                            type="text"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="E.g. Introduction to Programming"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructor
                        </label>
                        <input
                            type="text"
                            name="instructor"
                            value={formData.instructor}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="E.g. Dr. John Smith"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department*
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="cseds">Computer Science & Engineering (Data Science)</option>
                            <option value="cseai">Computer Science & Engineering (AI)</option>
                            <option value="cse">Computer Science & Engineering</option>
                            <option value="ece">Electronics & Communication Engineering</option>
                            <option value="ele">Electrical Engineering</option>
                            <option value="mech">Mechanical Engineering</option>
                            <option value="civil">Civil Engineering</option>
                            <option value="meta">Metallurgy Engineering</option>
                            <option value="prod">Production Engineering</option>
                            <option value="vlsi">VLSI Engineering</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Semester*
                        </label>
                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>Semester {num}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Year*
                        </label>
                        <input
                            type="text"
                            name="batchYear"
                            value={formData.batchYear}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="E.g. 23 for 2023 batch"
                            maxLength="2"
                            pattern="[0-9]{2}"
                            title="Two-digit year (e.g., 23 for 2023)"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Course description"
                    />
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
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                    >
                        {loading ? 'Saving...' : (course ? 'Update Course' : 'Add Course')}
                    </button>
                </div>
            </form>
        </div>
    );
};

AdminCourseForm.propTypes = {
    course: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AdminCourseForm;