import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../../components/Kanban/KanbanBoard';
import Layout from '../../components/Layout/Layout';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Nanti akan diambil dari blockchain
    setProject({
      id: '1',
      title: 'Website E-commerce',
      description: 'Pengembangan website e-commerce dengan fitur pembayaran cryptocurrency',
      createdAt: '2025-04-20T00:00:00.000Z',
      tasks: [],
      status: 'On Progress'
    });
  }, [id]);

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {project.status}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID')}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Task Board</h2>
          <KanbanBoard projectId={id} />
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
