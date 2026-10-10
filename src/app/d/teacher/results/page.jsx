"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    rollNumber: "",
    subject: "",
    examSession: "1st term",
    marks: "",
    totalMarks: "100",
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/results");
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch results.");
      }

      setResults(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingResult(null);
    setFormData({
      rollNumber: "",
      subject: "",
      examSession: "1st term",
      marks: "",
      totalMarks: "100",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingResult(item);
    setFormData({
      rollNumber: item.rollNumber || "",
      subject: item.subject || "",
      examSession: item.examSession || "1st term",
      marks: item.marks ?? "",
      totalMarks: item.totalMarks ?? "100",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingResult ? "PUT" : "POST";
      const payload = editingResult
        ? { resultId: editingResult.id, ...formData }
        : formData;

      const res = await fetch("/api/results", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Operation failed.");
      }

      setIsModalOpen(false);
      fetchResults(); // Refresh data list
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (!confirm("Are you sure you want to delete this result?")) return;

    setDeletingId(resultId);
    try {
      const res = await fetch("/api/results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete result.");
      }

      setResults((prev) => prev.filter((r) => r.id !== resultId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage Students</p>
        </div>
        <button
          onClick={fetchResults}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
        >
          Refresh List
        </button>
      </div>

      {/* Navigation Links before the table */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/d"
          className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm border border-blue-200"
        >
          Students
        </Link>
        <Link
          href="/d/teacher/results"
          className="px-4 py-2 bg-purple-50 text-purple-600 font-medium rounded-lg hover:bg-purple-100 transition-colors text-sm border border-purple-200"
        >
          Teacher Results
        </Link>
      </div>

      {/* Section Header & Add Result Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Student Results</h2>
          <p className="text-gray-500 text-sm">
            View, add, edit, or remove exam performance records.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
        >
          + Add New Result
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading results...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
                <th className="py-3 px-4 font-semibold">Roll No</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Exam Session</th>
                <th className="py-3 px-4 font-semibold">Marks</th>
                <th className="py-3 px-4 font-semibold">Percentage</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No result records found.
                  </td>
                </tr>
              ) : (
                results.map((item) => {
                  const percentage = Math.round(
                    (Number(item.marks) / Number(item.totalMarks)) * 100
                  );
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-medium text-gray-700">
                        {item.rollNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {item.subject}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {item.examSession}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        {item.marks} / {item.totalMarks}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {isNaN(percentage) ? "0%" : `${percentage}%`}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-medium rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-xs font-medium rounded transition"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingResult ? "Edit Result" : "Upload New Result"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1024"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Exam Session
                </label>
                <select
                  value={formData.examSession}
                  onChange={(e) =>
                    setFormData({ ...formData, examSession: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1st term">1st Term</option>
                  <option value="half yearly">Half Yearly</option>
                  <option value="year final">Year Final</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="85"
                    value={formData.marks}
                    onChange={(e) =>
                      setFormData({ ...formData, marks: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="100"
                    value={formData.totalMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, totalMarks: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium"
                >
                  {submitting
                    ? "Saving..."
                    : editingResult
                    ? "Update Result"
                    : "Upload Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}