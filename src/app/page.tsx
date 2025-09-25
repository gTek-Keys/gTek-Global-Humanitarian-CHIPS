'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { projectsData } from '../data';
import { calculateStats, getStatusColor, sortProjects, filterProjects } from '../lib/project-utils';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';

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
    const filtered = filterProjects(projectsData, searchTerm);
    return sortProjects(filtered, sortBy, sortOrder);
  }, [searchTerm, sortBy, sortOrder]);

  const stats = useMemo(() => calculateStats(projectsData), []);

  const handleSort = (field: 'name' | 'beneficiaries' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <span className="text-2xl">🌍</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  gTek Global Humanitarian CHIPS
                </h1>
                <p className="text-sm text-gray-600 font-medium">Blockchain-Powered Impact Platform</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search projects, locations, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-80 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-2 bg-green-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200/50"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Network</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Overview', icon: '📊', color: 'from-blue-500 to-cyan-500' },
              { key: 'projects', label: 'Projects', icon: '🏗️', color: 'from-purple-500 to-pink-500' },
              { key: 'impact', label: 'Impact', icon: '📈', color: 'from-green-500 to-emerald-500' },
              { key: 'analytics', label: 'Analytics', icon: '🔍', color: 'from-orange-500 to-red-500' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-4 rounded-t-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-t-xl shadow-lg`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Beneficiaries Reached',
                    value: stats.beneficiaries,
                    icon: '👥',
                    gradient: 'from-blue-500 to-cyan-500',
                    change: '+12%'
                  },
                  {
                    title: 'Active Projects',
                    value: stats.activeProjects,
                    icon: '🚀',
                    gradient: 'from-green-500 to-emerald-500',
                    change: '+3'
                  },
                  {
                    title: 'Total Projects',
                    value: stats.totalProjects,
                    icon: '📋',
                    gradient: 'from-purple-500 to-pink-500',
                    change: '+2'
                  },
                  {
                    title: 'Average Impact',
                    value: stats.avgImpact,
                    icon: '⚡',
                    gradient: 'from-orange-500 to-red-500',
                    change: '+5%'
                  }
                ].map((stat, index) => (
                  <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    gradient={stat.gradient}
                    change={stat.change}
                    index={index}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Recent Projects
                      </h2>
                      <p className="text-gray-600 mt-1">Latest humanitarian initiatives making impact</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live Updates</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Beneficiaries</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAndSortedProjects.slice(0, 4).map((project, index) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedProject(project)}
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-xl bg-gradient-to-r ${project.color} shadow-lg`}>
                                <span className="text-lg">{project.icon}</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{project.name}</div>
                                <div className="text-sm text-gray-500">{project.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-900 font-medium">{project.location}</td>
                          <td className="px-8 py-6 text-sm text-gray-900 font-semibold">{project.beneficiaries.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
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
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    All Projects
                  </h2>
                  <p className="text-gray-600 mt-2">Comprehensive view of our humanitarian initiatives</p>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value as 'name' | 'beneficiaries' | 'status')}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm font-medium shadow-lg focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={setSelectedProject}
                  />
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
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  Impact Dashboard
                </h2>
                <p className="text-gray-600">Real-time analytics and impact measurements</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span>📊</span>
                    <span>Impact by Category</span>
                  </h3>
                  <div className="space-y-6">
                    {['Infrastructure', 'Education', 'Healthcare', 'Agriculture', 'Economic Development', 'Environment'].map((category) => {
                      const categoryProjects = projectsData.filter(p => p.category === category);
                      const avgImpact = categoryProjects
                        .filter(p => p.impact !== '--')
                        .reduce((sum, p) => sum + parseFloat(p.impact), 0) /
                        categoryProjects.filter(p => p.impact !== '--').length;

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">{category}</span>
                            <span className="text-sm font-bold text-gray-900">
                              {avgImpact ? avgImpact.toFixed(0) + '%' : '--'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${avgImpact || 0}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span>🌍</span>
                    <span>Regional Impact</span>
                  </h3>
                  <div className="space-y-6">
                    {[
                      { region: 'East Africa', color: 'from-blue-500 to-cyan-500' },
                      { region: 'South Asia', color: 'from-purple-500 to-pink-500' },
                      { region: 'West Africa', color: 'from-green-500 to-emerald-500' },
                      { region: 'Southeast Asia', color: 'from-orange-500 to-amber-500' },
                      { region: 'South America', color: 'from-red-500 to-pink-500' }
                    ].map(({ region, color }) => {
                      const regionProjects = projectsData.filter(p => p.location.includes(region));
                      const totalBeneficiaries = regionProjects.reduce((sum, p) => sum + p.beneficiaries, 0);

                      return (
                        <div key={region} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${color}`}></div>
                            <span className="font-medium text-gray-900">{region}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{totalBeneficiaries.toLocaleString()}</span>
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
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  Analytics & Insights
                </h2>
                <p className="text-gray-600">Advanced analytics and performance metrics</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span>📈</span>
                    <span>Project Status Distribution</span>
                  </h3>
                  <div className="space-y-6">
                    {[
                      { status: 'Active', color: 'from-green-500 to-emerald-500', count: projectsData.filter(p => p.status === 'Active').length },
                      { status: 'In Progress', color: 'from-blue-500 to-cyan-500', count: projectsData.filter(p => p.status === 'In Progress').length },
                      { status: 'Planning', color: 'from-amber-500 to-orange-500', count: projectsData.filter(p => p.status === 'Planning').length }
                    ].map(({ status, color, count }) => {
                      const percentage = (count / projectsData.length) * 100;

                      return (
                        <div key={status} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">{status}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-gray-900">{count} projects</span>
                              <span className="text-xs text-gray-500">({percentage.toFixed(0)}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className={`h-full bg-gradient-to-r ${color} rounded-full shadow-sm`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span>🔍</span>
                    <span>Search Analytics</span>
                  </h3>
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: searchTerm ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-2xl">🔍</span>
                    </motion.div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm ? `Search Results` : 'Smart Search Engine'}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {searchTerm
                        ? `Found ${filteredAndSortedProjects.length} projects matching "${searchTerm}"`
                        : 'Search across projects, locations, categories, and descriptions'
                      }
                    </p>
                    {searchTerm && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Infrastructure', 'Education', 'Healthcare', 'Agriculture'].map((category) => (
                          <span key={category} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className={`h-32 bg-gradient-to-r ${selectedProject.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedProject(null)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                    >
                      ✕
                    </motion.button>
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">{selectedProject.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                      <p className="text-white/80">{selectedProject.category}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Description</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-gray-900 mb-1">{selectedProject.beneficiaries.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Beneficiaries</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-gray-900 mb-1">{selectedProject.impact}</div>
                          <div className="text-sm text-gray-600">Impact Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Location</span>
                            <span className="font-medium text-gray-900">{selectedProject.location}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Category</span>
                            <span className="font-medium text-gray-900">{selectedProject.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Status</span>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedProject.status)}`}>
                              {selectedProject.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      💝 Donate to Project
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                    >
                      📖 Learn More
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
