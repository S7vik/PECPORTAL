import React from 'react';
import { ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const CourseCard = ({ course, onClick }) => {
    // Function to generate a color based on course code
    const generateColor = (courseCode) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-emerald-500 to-emerald-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-amber-500 to-amber-600',
            'from-indigo-500 to-indigo-600',
            'from-teal-500 to-teal-600'
        ];

        // Generate a simple hash from the course code
        let hash = 0;
        for (let i = 0; i < courseCode.length; i++) {
            hash = (hash + courseCode.charCodeAt(i)) % colors.length;
        }

        return colors[hash];
    };

    const colorClass = generateColor(course.courseCode);

    return (
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className={`h-2 rounded-t-xl bg-gradient-to-r ${colorClass}`} />
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{course.courseName}</h3>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
            {course.courseCode}
          </span>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                    {course.description
                        ? (course.description.length > 100
                            ? course.description.slice(0, 100) + '...'
                            : course.description)
                        : 'No description available'}
                </p>

                <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {course.instructor ? `Instructor: ${course.instructor}` : 'Semester ' + course.semester}
          </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
};

CourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.string.isRequired,
        courseCode: PropTypes.string.isRequired,
        courseName: PropTypes.string.isRequired,
        instructor: PropTypes.string,
        description: PropTypes.string,
        semester: PropTypes.number
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default CourseCard;