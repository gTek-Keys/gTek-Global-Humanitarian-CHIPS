import { Project } from '../types';

export const calculateStats = (projects: Project[]) => {
  const totalBeneficiaries = projects.reduce((sum, project) => sum + project.beneficiaries, 0);
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const totalProjects = projects.length;
  const avgImpact = projects
    .filter(p => p.impact !== '--')
    .reduce((sum, p) => sum + parseFloat(p.impact), 0) /
    projects.filter(p => p.impact !== '--').length;

  return {
    beneficiaries: totalBeneficiaries.toLocaleString(),
    activeProjects,
    totalProjects,
    avgImpact: avgImpact.toFixed(1) + '%'
  };
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Planning': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const sortProjects = (
  projects: Project[], 
  sortBy: 'name' | 'beneficiaries' | 'status', 
  sortOrder: 'asc' | 'desc'
) => {
  return [...projects].sort((a, b) => {
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
};

export const filterProjects = (projects: Project[], searchTerm: string) => {
  return projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
};