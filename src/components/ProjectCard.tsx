import { motion } from 'framer-motion';
import { Project } from '../types';
import { getStatusColor } from '../lib/project-utils';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: (project: Project) => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${project.color} shadow-lg`}>
              <span className="text-2xl">{project.icon}</span>
            </div>
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Location</span>
              <span className="text-sm font-semibold text-gray-900">{project.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Beneficiaries</span>
              <span className="text-sm font-semibold text-gray-900">{project.beneficiaries.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Impact</span>
              <span className="text-sm font-semibold text-gray-900">{project.impact}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View Full Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}