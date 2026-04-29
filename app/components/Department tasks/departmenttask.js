"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "../../components/ui/Table";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { apiRequest } from "../../lib/apiClient";

export default function DepartmentTasksPage() {
  const columns = [
    { key: "department", label: "Department" },
    { key: "task", label: "Task" },
    { key: "status", label: "Status" },
  ];

  // GET TASKS AND ACTIONS FROM DASHBOARD STORE
  const departmentTasks = useDashboardStore((s) => s.departmentTasks);
  const addDepartmentTask = useDashboardStore((s) => s.addDepartmentTask);
  const updateTaskStatus = useDashboardStore((s) => s.updateTaskStatus);
  const deleteTask = useDashboardStore((s) => s.deleteTask);

  const [backendTasks, setBackendTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    department: "",
    task: "",
  });

  const endpoints = useMemo(
    () => ({
      list: [
        "/department-tasks/",
        "/department-tasks",
        "/tasks/",
        "/tasks",
        "/management/tasks/",
        "/management/tasks",
      ],
      create: [
        "/department-tasks/",
        "/department-tasks",
        "/tasks/",
        "/tasks",
        "/management/tasks/",
        "/management/tasks",
      ],
      updateById: (id) => [
        `/department-tasks/${id}`,
        `/department-tasks/${id}/`,
        `/tasks/${id}`,
        `/tasks/${id}/`,
        `/management/tasks/${id}`,
        `/management/tasks/${id}/`,
      ],
      deleteById: (id) => [
        `/department-tasks/${id}`,
        `/department-tasks/${id}/`,
        `/tasks/${id}`,
        `/tasks/${id}/`,
        `/management/tasks/${id}`,
        `/management/tasks/${id}/`,
      ],
    }),
    []
  );

  const safeArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      if (Array.isArray(value.items)) return value.items;
      if (Array.isArray(value.tasks)) return value.tasks;
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.results)) return value.results;
    }
    return null;
  };

  const tryFirst = async (paths, makeRequest) => {
    let last = null;
    for (const p of paths) {
      try {
        return await makeRequest(p);
      } catch (e) {
        if (e?.status && e.status !== 404 && e.status !== 405) {
          throw e;
        }
        last = e;
      }
    }
    if (last) throw last;
    return null;
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await tryFirst(endpoints.list, (p) => apiRequest(p));
        const arr = safeArray(res);
        if (!cancelled) {
          setBackendTasks(Array.isArray(arr) ? arr : []);
        }
      } catch (e) {
        if (!cancelled) {
          setBackendTasks(null);
          setError(e?.message || "Failed to load department tasks");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [endpoints]);

  const mergedTasks = useMemo(() => {
    const src = Array.isArray(backendTasks) && backendTasks.length ? backendTasks : departmentTasks;
    return Array.isArray(src) ? src : [];
  }, [backendTasks, departmentTasks]);

  // Add task
  const handleAddTask = async () => {
    if (!form.department || !form.task) return;

    const payload = {
      department: form.department,
      task: form.task,
      status: "Pending",
    };

    try {
      const created = await tryFirst(endpoints.create, (p) => apiRequest(p, { method: "POST", body: payload }));
      const createdId = created?._id || created?.id;
      const nextRow = {
        id: createdId || Date.now(),
        department: created?.department ?? payload.department,
        task: created?.task ?? payload.task,
        status: created?.status ?? payload.status,
      };

      setBackendTasks((prev) => {
        if (!Array.isArray(prev)) return [nextRow];
        return [nextRow, ...prev];
      });
    } catch (e) {
      // Fallback to local store if backend endpoints are missing
      addDepartmentTask({ department: payload.department, task: payload.task });
      setError(e?.message || "Could not create task in backend; stored locally");
    }

    setForm({ department: "", task: "" });
  };

  // Cycle status
  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Done"
        : "Pending";

    try {
      await tryFirst(endpoints.updateById(id), (p) => apiRequest(p, { method: "PUT", body: { status: newStatus } }));
      setBackendTasks((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((t) => {
          const tid = t?._id || t?.id;
          return String(tid) === String(id) ? { ...t, status: newStatus } : t;
        });
      });
    } catch (e) {
      updateTaskStatus(id, newStatus);
      setError(e?.message || "Could not update task in backend; updated locally");
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await tryFirst(endpoints.deleteById(id), (p) => apiRequest(p, { method: "DELETE" }));
      setBackendTasks((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.filter((t) => String(t?._id || t?.id) !== String(id));
      });
    } catch (e) {
      deleteTask(id);
      setError(e?.message || "Could not delete task in backend; deleted locally");
    }
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

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* UI TABLE USED HERE */}
        <Table
          columns={columns}
          data={(loading ? [] : mergedTasks).map((t) => ({
            ...t,
            id: t?.id || t?._id || t?.task_id || t?.taskId,
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

          {mergedTasks.map((task) => (
            <div
              key={task.id || task._id || task.task_id || task.taskId}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span className="text-xs text-gray-600">
                {task.department}
              </span>

              <button
                onClick={() => handleUpdateStatus(task.id || task._id || task.task_id || task.taskId, task.status)}
                className="text-blue-600 hover:text-blue-800"
                title="Change status"
              >
                <CheckCircle2 size={16} />
              </button>

              <button
                onClick={() => handleDeleteTask(task.id || task._id || task.task_id || task.taskId)}
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