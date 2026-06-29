import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ModalContext } from "../context/modalContext";
import { toast } from "sonner";
const AddTask = () => {
  const taskAddFormRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const {
    setOpenAddTaskForm,
    setRefreshEmployee,
    editingTask,
    setEditingTask,
    refreshEmployee,
    error,
    setError,
  } = useContext(ModalContext);
  const [employees, setEmployees] = useState([]);
  const initialFormData = {
    title: "",
    description: "",
    assignTo: [],
    startDate: "",
    dueDate: "",
    status: "New",
    priority: "Medium",
  };
  const showError = (message) => {
    setError(message);

    setTimeout(() => {
      setError("");
    }, 3000);
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        assignTo:
          editingTask.assignTo?.map((user) =>
            typeof user === "object" ? user._id : user,
          ) || [],
        startDate: editingTask.startDate
          ? editingTask.startDate.split("T")[0]
          : "",
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
        status: editingTask.status || "New",
        priority: editingTask.priority || "Medium",
      });
    }
  }, [editingTask]);
  const handleAssignChange = (userId) => {
    setFormData((prev) => ({
      ...prev,
      assignTo: prev.assignTo.includes(userId)
        ? prev.assignTo.filter((id) => id !== userId)
        : [...prev.assignTo, userId],
    }));
  };
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // console.log(formData);
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/employee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEmployees(response.data.employees);
    } catch (error) {
      console.log(error.message);
      showError(error.response.data.message);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [refreshEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTask) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/${editingTask._id}`,
          formData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Task Updated Succesfully");

        setRefreshEmployee((prev) => !prev);
        setFormData(initialFormData);
        setOpenAddTaskForm(false);
        setEditingTask(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Task Created Succesfully");
        setRefreshEmployee((prev) => !prev);
        setFormData(initialFormData);

        setOpenAddTaskForm(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error(error);
      showError(error.response.data.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clickOutsideFunction = (event) => {
      if (
        taskAddFormRef.current &&
        !taskAddFormRef.current.contains(event.target)
      ) {
        setOpenAddTaskForm(false);
        setEditingTask(null);
      }
    };

    document.addEventListener("mousedown", clickOutsideFunction);

    return () => {
      document.removeEventListener("mousedown", clickOutsideFunction);
    };
  }, [setOpenAddTaskForm]);
  return (
    <div
      ref={taskAddFormRef}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">
        {editingTask ? "Edit Task" : "Create New Task"}
      </h2>
      {error && <p className="text-xs  text-red-500">*{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2 ">
        {/* Title */}
        <div>
          <label className="block mb-1  text-sm font-medium">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 placeholder:text-sm text-sm focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="3"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 placeholder:text-sm text-sm focus:ring-blue-500"
            required
          />
        </div>

        {/* Assign Users */}
        <div>
          <label className="block mb-3 text-sm font-medium">Assign Users</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 border rounded-lg p-4 max-h-60 overflow-y-auto">
            {employees?.map((employee) => (
              <label
                key={employee._id}
                className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={formData.assignTo.includes(employee._id)}
                  onChange={() => handleAssignChange(employee._id)}
                  className="w-4 h-4"
                />

                <img
                  src={employee.profilePhoto}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                </div>
              </label>
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Selected Users: {formData.assignTo.length}
          </p>
        </div>
        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg text-sm p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">End Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border rounded-lg text-sm p-3"
              required
            />
          </div>
        </div>
        <div className="w-full flex justify-between gap-5 items-center mt-2">
          {/* Status */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border cursor-pointer rounded-lg text-sm p-3"
            >
              <option value="New">New</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {/* Priority */}

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-lg cursor-pointer text-sm p-3"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Submit */}

        <button
          disabled={loading}
          type="submit"
          className={`w-full cursor-pointer  mt-4 text-white py-3 ${editingTask ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} rounded-lg  transition`}
        >
          {loading ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
