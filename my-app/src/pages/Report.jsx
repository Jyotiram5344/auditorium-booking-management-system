import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Filter, Loader2, Menu } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../Component/Sidebar";

const Report = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Fetch user-specific bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/mybookings/${storedUser.username}`);
      const data = await res.json();
      setBookings(data || []);
      setFiltered(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Same filtering logic as AdminReport
  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFiltered(bookings);
      return;
    }

    const filteredData = bookings.filter((b) => {
      const start = new Date(b.startDate);
      const s = startDate ? new Date(startDate) : null;
      const e = endDate ? new Date(endDate) : null;
      if (s && e) return start >= s && start <= e;
      if (s) return start >= s;
      if (e) return start <= e;
      return true;
    });

    setFiltered(filteredData);
  };

  // ✅ Excel Export
  const downloadExcel = () => {
    if (filtered.length === 0) {
      alert("No data to export!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      filtered.map((b, index) => ({
        "S.No": index + 1,
        Event: b.eventName,
        Hall: b.hallName,
        Department: b.department,
        Start: b.startDate,
        End: b.endDate,
        Slot: b.slot,
        Speaker: b.speaker,
        Status: b.status,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "My Bookings Report");
    XLSX.writeFile(wb, "My_Bookings_Report.xlsx");
  };

  // ✅ PDF Export
  const downloadPDF = () => {
    if (filtered.length === 0) {
      alert("No data to export!");
      return;
    }

    try {
      const doc = new jsPDF("l", "pt", "a4");
      doc.setFontSize(16);
      doc.text("My Bookings Report", 40, 30);

      const headers = [
        [
          "S.No",
          "Event",
          "Hall",
          "Department",
          "Start",
          "End",
          "Slot",
          "Speaker",
          "Status",
        ],
      ];

      const data = filtered.map((b, index) => [
        index + 1,
        b.eventName,
        b.hallName,
        b.department,
        b.startDate?.substring(0, 10),
        b.endDate?.substring(0, 10),
        b.slot,
        b.speaker,
        b.status,
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 50,
        theme: "striped",
        headStyles: { fillColor: [111, 66, 193], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 4 },
      });

      doc.save("My_Bookings_Report.pdf");
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
      alert("PDF generation failed — check console for details.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sidebar Animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 z-50 h-full"
            >
              <Sidebar
                user={storedUser}
                onSignOut={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between bg-pink-200 py-3 px-4 md:px-6 shadow-md">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="text-purple-800" size={26} />
        </button>
        <h1 className="text-lg md:text-2xl font-bold text-purple-800 text-center flex-1">
          📊 My Booking Report
        </h1>
        <div className="w-6 md:w-10" />
      </header>

      {/* Filter Section */}
      <motion.div
        className="m-4 md:m-6 bg-white/80 backdrop-blur-lg border border-purple-200 rounded-2xl p-4 md:p-6 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-3 sm:gap-4">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handleFilter}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <Filter size={18} /> Filter
            </button>
            <button
              onClick={fetchBookings}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Reset
            </button>
            <button
              onClick={downloadExcel}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Download size={18} /> Excel
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Download size={18} /> PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <div className="flex-1 overflow-x-auto px-2 md:px-6 mb-6">
        {loading ? (
          <div className="text-center mt-20 text-gray-600 flex justify-center items-center">
            <Loader2 className="animate-spin mr-2" /> Loading report...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-600 mt-10 px-4">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-purple-100">
            <table className="min-w-[1000px] text-sm text-left text-gray-600">
              <thead className="bg-purple-100 text-purple-900 uppercase text-xs font-semibold">
                <tr>
                  {[
                    "S.No",
                    "Event",
                    "Hall",
                    "Department",
                    "Start",
                    "End",
                    "Slot",
                    "Speaker",
                    "Status",
                  ].map((col) => (
                    <th key={col} className="px-4 py-2 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr
                    key={i}
                    className={`border-b hover:bg-purple-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2 break-words">{b.eventName}</td>
                    <td className="px-4 py-2 break-words">{b.hallName}</td>
                    <td className="px-4 py-2 break-words">{b.department}</td>
                    <td className="px-4 py-2">{b.startDate?.substring(0, 10)}</td>
                    <td className="px-4 py-2">{b.endDate?.substring(0, 10)}</td>
                    <td className="px-4 py-2">{b.slot}</td>
                    <td className="px-4 py-2">{b.speaker}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs ${
                          b.status === "Approved"
                            ? "bg-green-500"
                            : b.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
