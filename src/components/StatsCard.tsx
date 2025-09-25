import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  gradient: string;
  change: string;
  index: number;
}

export default function StatsCard({ title, value, icon, gradient, change, index }: StatsCardProps) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${gradient} shadow-lg`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {change}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}