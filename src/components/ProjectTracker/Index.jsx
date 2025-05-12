import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

const ProjectTracker = ({ wallet }) => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const addProject = () => {
    if (!wallet || !newProject.title.trim()) return;
    
    const project = {
      ...newProject,
      id: Date.now().toString(),
      status: 'On Progress',
      createdAt: new Date().toISOString(),
      tasks: []
    };

    setProjects([...projects, project]);
    setNewProject({ title: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Tambah Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link
            key={project.id}
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
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Project Baru
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Project
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul project"
                  className="w-full p-2 border rounded-lg"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Masukkan deskripsi project"
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={addProject}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProjectTracker;