"use client";

import { useState } from "react";
import Table from "../../components/ui/Table";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function DepartmentTasksPage() {
  const columns = [
    { key: "department", label: "Department" },
    { key: "task", label: "Task" },
    { key: "status", label: "Status" },
  ];

  // GET TASKS AND ACTIONS FROM DASHBOARD STORE
  const { departmentTasks, addDepartmentTask, updateTaskStatus, deleteTask } = useDashboardStore();

  const [form, setForm] = useState({
    department: "",
    task: "",
  });

  // Add task
  const handleAddTask = () => {
    if (!form.department || !form.task) return;

    addDepartmentTask({
      department: form.department,
      task: form.task,
    });
    setForm({ department: "", task: "" });
  };

  // Cycle status
  const handleUpdateStatus = (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Done"
        : "Pending";
    updateTaskStatus(id, newStatus);
  };

  // Delete task
  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Department Tasks</h1>

      {/* Add Task */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">

        <div className="grid md:grid-cols-3 gap-3">

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 text-sm"
          />

          <input
            type="text"
            placeholder="Task"
            value={form.task}
            onChange={(e) =>
              setForm({ ...form, task: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 text-sm"
          />

          <button
            onClick={handleAddTask}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            <Plus size={16} />
            Add Task
          </button>

        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Task List</h2>
          <span className="text-sm text-gray-400">Live updates enabled</span>
        </div>

        {/* UI TABLE USED HERE */}
        <Table
          columns={columns}
          data={departmentTasks.map((t) => ({
            ...t,
            status: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    t.status === "Done"
                      ? "bg-green-100 text-green-700"
                      : t.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {t.status}
              </span>
            ),
          }))}
        />

        {/* Actions (separate row controls) */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">

          {departmentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span className="text-xs text-gray-600">
                {task.department}
              </span>

              <button
                onClick={() => handleUpdateStatus(task.id, task.status)}
                className="text-blue-600 hover:text-blue-800"
                title="Change status"
              >
                <CheckCircle2 size={16} />
              </button>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}