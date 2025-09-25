export interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  beneficiaries: number;
  status: 'Active' | 'In Progress' | 'Planning';
  impact: string;
  category: string;
  icon: string;
  color: string;
}