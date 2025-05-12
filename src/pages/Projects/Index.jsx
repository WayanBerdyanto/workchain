import React, { useState } from 'react';
import ProjectCard from '../../components/Project/ProjectCard';
import { Dialog } from '@headlessui/react';
import Layout from '../../components/Layout/Layout';

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
  });
  const [projects, setProjects] = useState([
    // Contoh data, nanti akan diambil dari blockchain
    {
      id: '1',
      title: 'Website E-commerce',
      description: 'Pengembangan website e-commerce dengan fitur pembayaran cryptocurrency',
      createdAt: '2025-04-20T00:00:00.000Z',
      tasks: [],
      status: 'On Progress'
    }
  ]);

  const handleCreateProject = (e) => {
    e.preventDefault();
    const project = {
      id: Date.now().toString(),
      ...newProject,
      createdAt: new Date().toISOString(),
      tasks: [],
      status: 'New'
    };

    setProjects([...projects, project]);
    setNewProject({ title: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Tambah Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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

              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Project
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
