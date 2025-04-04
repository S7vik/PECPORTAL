import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Users,  Filter } from 'lucide-react';
import api from '../api/axios';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    // Derived data
    const [departments, setDepartments] = useState([]);
    const [batches, setBatches] = useState([]);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/admin/users');
                setUsers(response.data);
                setFilteredUsers(response.data);

                // Extract unique departments and batches
                const depts = [...new Set(response.data
                    .filter(user => user.department)
                    .map(user => user.department))];

                const batchYears = [...new Set(response.data
                    .filter(user => user.batchYear)
                    .map(user => user.batchYear))];

                setDepartments(depts);
                setBatches(batchYears);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search query and selected filters
    useEffect(() => {
        let filtered = [...users];

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                user =>
                    user.name?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query) ||
                    user.department?.toLowerCase().includes(query)
            );
        }

        // Apply department filter
        if (selectedDepartment) {
            filtered = filtered.filter(user => user.department === selectedDepartment);
        }

        // Apply batch filter
        if (selectedBatch) {
            filtered = filtered.filter(user => user.batchYear === selectedBatch);
        }

        // Apply role filter
        if (selectedRole) {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        setFilteredUsers(filtered);
    }, [searchQuery, selectedDepartment, selectedBatch, selectedRole, users]);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedDepartment('');
        setSelectedBatch('');
        setSelectedRole('');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Manage Users</h3>
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Manage Users</h3>
                <div className="flex items-center">
          <span className="text-gray-500 mr-2">
            <Users className="inline-block w-5 h-5 mr-1" />
              {filteredUsers.length} users
          </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-700 hover:text-red-900"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Search and filters */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept.toUpperCase()}</option>
                            ))}
                        </select>

                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Batches</option>
                            {batches.map((batch) => (
                                <option key={batch} value={batch}>Batch {batch}</option>
                            ))}
                        </select>

                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Roles</option>
                            <option value="USER">Student</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        <button
                            onClick={resetFilters}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                        >
                            <Filter className="w-4 h-4 mr-1" />
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Users table */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No users match your filters</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Batch
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Semester
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Student'}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.department ? user.department.toUpperCase() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.batchYear ? `20${user.batchYear}` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.currentSemester || '-'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;