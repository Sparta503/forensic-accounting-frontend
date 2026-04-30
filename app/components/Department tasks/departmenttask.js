"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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

  const toBackendStatus = (value) => {
    const k = String(value || "").trim().toLowerCase();
    if (k === "pending") return "pending";
    if (k === "in progress" || k === "in_progress" || k === "inprogress") return "in_progress";
    if (k === "done" || k === "completed" || k === "complete") return "completed";
    return "pending";
  };

  const toDisplayStatus = (value) => {
    const k = String(value || "").trim().toLowerCase();
    if (k === "pending") return "Pending";
    if (k === "in_progress" || k === "in progress") return "In Progress";
    if (k === "completed" || k === "done") return "Completed";
    return String(value || "Pending");
  };

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

  const isProbablyBackendId = (id) => {
    if (id === null || id === undefined) return false;
    const s = String(id);
    // Mongo ObjectId is 24 hex chars; UUIDs contain dashes; both are valid server ids.
    if (/^[0-9a-fA-F]{24}$/.test(s)) return true;
    if (/^[0-9a-fA-F-]{32,36}$/.test(s)) return true;
    // Purely numeric ids are often local placeholders in this app.
    if (/^\d+$/.test(s)) return false;
    // Fall back: if it's not purely numeric, treat as server id.
    return true;
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tryFirst(endpoints.list, (p) => apiRequest(p));
      const arr = safeArray(res);
      setBackendTasks(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setBackendTasks(null);
      setError(e?.message || "Failed to load department tasks");
    } finally {
      setLoading(false);
    }
  }, [endpoints]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTasks();
    })();
    return () => {
      cancelled = true;
      void cancelled;
    };
  }, [loadTasks]);

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
      title: form.task,
      description: form.task,
      name: form.task,
      status: "pending",
    };

    try {
      const created = await tryFirst(endpoints.create, (p) => apiRequest(p, { method: "POST", body: payload }));
      const createdId = created?._id || created?.id;
      if (createdId) {
        const nextRow = {
          id: createdId,
          department: created?.department ?? payload.department,
          task: created?.task ?? created?.title ?? created?.description ?? created?.name ?? payload.task,
          status: toBackendStatus(created?.status ?? payload.status),
        };

        setBackendTasks((prev) => {
          if (!Array.isArray(prev)) return [nextRow];
          return [nextRow, ...prev];
        });
      } else {
        // Backend created the task but didn't return an id; refetch list to get real ids.
        await loadTasks();
      }
    } catch (e) {
      // Fallback to local store if backend endpoints are missing
      addDepartmentTask({ department: payload.department, task: payload.task });
      setError(e?.message || "Could not create task in backend; stored locally");
    }

    setForm({ department: "", task: "" });
  };

  // Cycle status
  const handleUpdateStatus = async (id, currentStatus) => {
    const current = toBackendStatus(currentStatus);
    const newStatus =
      current === "pending"
        ? "in_progress"
        : current === "in_progress"
        ? "completed"
        : "pending";

    if (!isProbablyBackendId(id) || !Array.isArray(backendTasks)) {
      updateTaskStatus(id, newStatus);
      return;
    }

    try {
      await tryFirst(endpoints.updateById(id), (p) =>
        apiRequest(p, { method: "PATCH", body: { status: newStatus } })
      );
    } catch (e1) {
      try {
        await tryFirst(endpoints.updateById(id), (p) =>
          apiRequest(p, { method: "PUT", body: { status: newStatus } })
        );
      } catch (e2) {
        updateTaskStatus(id, newStatus);
        setError(e2?.message || e1?.message || "Could not update task in backend; updated locally");
        return;
      }
    }

    setBackendTasks((prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((t) => {
        const tid = t?._id || t?.id;
        return String(tid) === String(id) ? { ...t, status: newStatus } : t;
      });
    });
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!isProbablyBackendId(id) || !Array.isArray(backendTasks)) {
      deleteTask(id);
      return;
    }

    try {
      await tryFirst(endpoints.deleteById(id), (p) => apiRequest(p, { method: "DELETE" }));
      setBackendTasks((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.filter((t) => String(t?._id || t?.id) !== String(id));
      });
    } catch (e) {
      // Don't fall back to local delete if backend delete failed for a backend task.
      setError(e?.message || "Could not delete task in backend");
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
            task: t?.task ?? t?.title ?? t?.description ?? t?.name,
            status: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    toBackendStatus(t.status) === "completed"
                      ? "bg-green-100 text-green-700"
                      : toBackendStatus(t.status) === "in_progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {toDisplayStatus(t.status)}
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