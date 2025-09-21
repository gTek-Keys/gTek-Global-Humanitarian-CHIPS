'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  beneficiaries: number;
  status: 'Active' | 'In Progress' | 'Planning';
  impact: string;
  category: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    name: 'Clean Water Initiative',
    description: 'Water infrastructure development',
    location: 'Kenya, East Africa',
    beneficiaries: 45000,
    status: 'Active',
    impact: '92%',
    category: 'Infrastructure'
  },
  {
    id: 2,
    name: 'Education for All',
    description: 'Digital learning platform',
    location: 'Bangladesh, South Asia',
    beneficiaries: 120000,
    status: 'In Progress',
    impact: '87%',
    category: 'Education'
  },
  {
    id: 3,
    name: 'Healthcare Access',
    description: 'Mobile clinic deployment',
    location: 'Rural Brazil',
    beneficiaries: 25000,
    status: 'Planning',
    impact: '--',
    category: 'Healthcare'
  },
  {
    id: 4,
    name: 'Food Security Program',
    description: 'Agricultural development',
    location: 'Mali, West Africa',
    beneficiaries: 78000,
    status: 'Active',
    impact: '89%',
    category: 'Agriculture'
  },
  {
    id: 5,
    name: 'Digital Literacy',
    description: 'Technology training program',
    location: 'Philippines, Southeast Asia',
    beneficiaries: 95000,
    status: 'In Progress',
    impact: '76%',
    category: 'Education'
  },
  {
    id: 6,
    name: 'Renewable Energy Access',
    description: 'Solar power installation',
    location: 'Ghana, West Africa',
    beneficiaries: 35000,
    status: 'Active',
    impact: '95%',
    category: 'Infrastructure'
  },
  {
    id: 7,
    name: 'Women Empowerment',
    description: 'Skills training and microfinance',
    location: 'India, South Asia',
    beneficiaries: 85000,
    status: 'In Progress',
    impact: '83%',
    category: 'Economic Development'
  },
  {
    id: 8,
    name: 'Climate Resilience',
    description: 'Disaster preparedness training',
    location: 'Indonesia, Southeast Asia',
    beneficiaries: 67000,
    status: 'Planning',
    impact: '--',
    category: 'Environment'
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'beneficiaries' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projectsData.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      if (sortBy === 'beneficiaries') {
        aValue = a.beneficiaries;
        bValue = b.beneficiaries;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const totalBeneficiaries = projectsData.reduce((sum, project) => sum + project.beneficiaries, 0);
    const activeProjects = projectsData.filter(p => p.status === 'Active').length;
    const totalProjects = projectsData.length;
    const avgImpact = projectsData
      .filter(p => p.impact !== '--')
      .reduce((sum, p) => sum + parseFloat(p.impact), 0) /
      projectsData.filter(p => p.impact !== '--').length;

    return {
      beneficiaries: totalBeneficiaries.toLocaleString(),
      activeProjects,
      totalProjects,
      avgImpact: avgImpact.toFixed(1) + '%'
    };
  }, []);

  const handleSort = (field: 'name' | 'beneficiaries' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"
          />
          <h2 className="text-xl font-semibold text-gray-700">Loading Humanitarian Platform...</h2>
          <p className="text-gray-500">Connecting to global impact network</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
              >
                <span className="text-white text-xl">❤️</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">gTek Global Humanitarian CHIPS</h1>
                <p className="text-sm text-gray-600">Blockchain-Powered Impact Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search projects, locations, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-200"
              />
              <div className="flex items-center space-x-2 text-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span className="text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'projects', label: 'Projects', icon: '🏗️' },
              { key: 'impact', label: 'Impact', icon: '📈' },
              { key: 'analytics', label: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Beneficiaries Reached</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.beneficiaries}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Projects</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Projects</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Avg Impact</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.avgImpact}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                  <p className="text-sm text-gray-600">Latest humanitarian initiatives</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiaries</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedProjects.slice(0, 3).map((project) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: project.id * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.beneficiaries.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedProject(project)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              View Details
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value as 'name' | 'beneficiaries' | 'status')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    title="Sort projects by"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="beneficiaries">Sort by Beneficiaries</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: project.id * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{project.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Beneficiaries:</span>
                        <span className="font-medium">{project.beneficiaries.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Impact:</span>
                        <span className="font-medium">{project.impact}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Impact Dashboard</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-4">Impact by Category</h3>
                  <div className="space-y-3">
                    {['Infrastructure', 'Education', 'Healthcare', 'Agriculture', 'Economic Development', 'Environment'].map((category) => {
                      const categoryProjects = projectsData.filter(p => p.category === category);
                      const avgImpact = categoryProjects
                        .filter(p => p.impact !== '--')
                        .reduce((sum, p) => sum + parseFloat(p.impact), 0) /
                        categoryProjects.filter(p => p.impact !== '--').length;

                      return (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${avgImpact || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {avgImpact ? avgImpact.toFixed(0) + '%' : '--'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-4">Regional Impact</h3>
                  <div className="space-y-3">
                    {['East Africa', 'South Asia', 'West Africa', 'Southeast Asia', 'South America'].map((region) => {
                      const regionProjects = projectsData.filter(p => p.location.includes(region));
                      const totalBeneficiaries = regionProjects.reduce((sum, p) => sum + p.beneficiaries, 0);

                      return (
                        <div key={region} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{region}</span>
                          <span className="text-sm font-medium">{totalBeneficiaries.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
                  <div className="space-y-3">
                    {['Active', 'In Progress', 'Planning'].map((status) => {
                      const count = projectsData.filter(p => p.status === status).length;
                      const percentage = (count / projectsData.length) * 100;

                      return (
                        <div key={status} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{status}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${status === 'Active' ? 'bg-green-600' : status === 'In Progress' ? 'bg-blue-600' : 'bg-yellow-600'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-4">Search Insights</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-gray-600">
                      {searchTerm ? `Found ${filteredAndSortedProjects.length} projects matching "${searchTerm}"` : 'Enter a search term to see insights'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedProject.name}</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedProject.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedProject.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category:</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedProject.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Beneficiaries:</span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{selectedProject.beneficiaries.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProject.status)}`}>
                          {selectedProject.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Impact:</span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{selectedProject.impact}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Donate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
