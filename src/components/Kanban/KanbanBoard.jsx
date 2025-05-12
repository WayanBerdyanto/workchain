import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    taskIds: [],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: [],
  },
  done: {
    id: 'done',
    title: 'Selesai',
    taskIds: [],
  },
};

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState({});
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    // Nanti akan diambil dari blockchain berdasarkan projectId
    // Untuk sementara menggunakan localStorage
    const savedData = localStorage.getItem(`kanban_${projectId}`);
    if (savedData) {
      const { tasks: savedTasks, columns: savedColumns } = JSON.parse(savedData);
      setTasks(savedTasks);
      setColumns(savedColumns);
    }
  }, [projectId]);

  useEffect(() => {
    // Simpan ke localStorage setiap kali ada perubahan
    // Nanti akan disimpan ke blockchain
    localStorage.setItem(
      `kanban_${projectId}`,
      JSON.stringify({ tasks, columns })
    );
  }, [tasks, columns, projectId]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: newTaskTitle,
      description: newTaskDescription,
      createdAt: new Date().toISOString(),
      projectId,
    };

    setTasks(prev => ({
      ...prev,
      [newTaskId]: newTask
    }));

    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        taskIds: [...prev.todo.taskIds, newTaskId]
      }
    }));

    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      };

      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds,
      };

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 bg-white rounded-lg p-4 shadow">
        <h3 className="font-semibold mb-4">Tambah Task Baru</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Task
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Masukkan judul task"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Masukkan deskripsi task"
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Tambah Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {Object.values(columns).map((column) => (
            <div
              key={column.id}
              className="bg-gray-100 p-4 rounded-lg w-80"
            >
              <h2 className="font-bold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] ${
                      snapshot.isDraggingOver ? 'bg-gray-200' : ''
                    }`}
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-2 rounded-lg bg-white shadow ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <p className="font-medium">{task.content}</p>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {task.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(task.createdAt).toLocaleString('id-ID')}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
