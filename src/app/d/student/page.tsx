"use client";

import { useEffect, useState } from "react";

export default function StudentDashboardPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");

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

  // Filter results based on search input and exam session dropdown
  const filteredResults = results.filter((item) => {
    const matchesSearch =
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSession =
      selectedSession === "all" || item.examSession === selectedSession;

    return matchesSearch && matchesSession;
  });

  // Calculate summary metrics
  const totalMarksEarned = results.reduce(
    (acc, item) => acc + (Number(item.marks) || 0),
    0
  );
  const totalPossibleMarks = results.reduce(
    (acc, item) => acc + (Number(item.totalMarks) || 0),
    0
  );
  const overallPercentage =
    totalPossibleMarks > 0
      ? Math.round((totalMarksEarned / totalPossibleMarks) * 100)
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-500 text-sm">
            View your academic performance and exam results
          </p>
        </div>
        <button
          onClick={fetchResults}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
        >
          Refresh Results
        </button>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-xs font-semibold text-blue-600 uppercase">
            Total Exams
          </p>
          <p className="text-2xl font-bold text-blue-900">{results.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <p className="text-xs font-semibold text-emerald-600 uppercase">
            Total Marks
          </p>
          <p className="text-2xl font-bold text-emerald-900">
            {totalMarksEarned} / {totalPossibleMarks}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <p className="text-xs font-semibold text-purple-600 uppercase">
            Overall Percentage
          </p>
          <p className="text-2xl font-bold text-purple-900">
            {results.length > 0 ? `${overallPercentage}%` : "N/A"}
          </p>
        </div>
      </div> */}

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by subject or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Sessions</option>
          <option value="1st term">1st Term</option>
          <option value="half yearly">Half Yearly</option>
          <option value="year final">Year Final</option>
        </select>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="text-gray-500">Loading results...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Results Table (Read-Only) */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
                <th className="py-3 px-4 font-semibold">Roll No</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Exam Session</th>
                <th className="py-3 px-4 font-semibold">Marks Obtained</th>
                <th className="py-3 px-4 font-semibold">Total Marks</th>
                <th className="py-3 px-4 font-semibold text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No results found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredResults.map((item) => {
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
                        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {item.examSession}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {item.marks}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.totalMarks}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-700">
                        {isNaN(percentage) ? "0%" : `${percentage}%`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}