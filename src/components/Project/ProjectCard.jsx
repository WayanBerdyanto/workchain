import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/project/${project.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID')}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {project.tasks.length} tasks
            </span>
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
