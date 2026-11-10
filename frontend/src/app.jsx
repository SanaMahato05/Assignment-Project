
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers,
  Users,
  MapPin,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/batches";
const PAGE_SIZE = 5;

function App() {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [centre, setCentre] = useState("");
  const [centres, setCentres] = useState([]);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalRecords: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch batch records from backend API
  useEffect(() => {
    const controller = new AbortController();

    const fetchBatches = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          search,
          status,
          centre,
        });

        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to connect to the server.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch batches.");
        }

        setBatches(result.data || []);
        setCentres(result.centres || []);
        setPagination(result.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
          setBatches([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchBatches, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [page, search, status, centre, refreshKey]);

  // Reset pagination when filters change
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleCentre = (value) => {
    setCentre(value);
    setPage(1);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const startRecord =
    pagination.totalRecords === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;

  const endRecord = Math.min(
    pagination.page * pagination.limit,
    pagination.totalRecords
  );

  const getPageNumbers = () =>
    Array.from(
      { length: pagination.totalPages },
      (_, index) => index + 1
    );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Layers size={23} />
          </div>
          <span>
            Batch<span className="brand-highlight">Flow</span>
          </span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <Layers size={19} />
            <span>Batch Operations</span>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">AD</div>
          <div>
            <p className="profile-name">Admin User</p>
            <p className="profile-role">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <p className="breadcrumb">Workspace / Batch Operations</p>

          <div className="topbar-right">
            <span className="admin-label">Admin Panel</span>
            <div className="top-avatar">AD</div>
          </div>
        </header>

        <section className="page-content">
          {/* Page Heading */}
          <div className="page-heading">
            <div>
              <h1>Batch Operations</h1>
              <p>
                Manage, monitor and organize all your training batches.
              </p>
            </div>

            <button className="create-button" type="button">
              <Plus size={18} />
              Create Batch
            </button>
          </div>

          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon purple">
                <Layers size={21} />
              </div>
              <div>
                <p>Total Batches</p>
                <h2>{pagination.totalRecords}</h2>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon green">
                <Users size={21} />
              </div>
              <div>
                <p>Records Displayed</p>
                <h2>{batches.length}</h2>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon orange">
                <MapPin size={21} />
              </div>
              <div>
                <p>Training Centres</p>
                <h2>{centres.length}</h2>
              </div>
            </div>
          </div>

          {/* Batch Listing */}
          <section className="table-section">
            <div className="table-heading">
              <div>
                <h2>All Batches</h2>
                <p>View and manage your batch records.</p>
              </div>

              <button
                className="refresh-button"
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
              >
                <RefreshCw size={17} />
                Refresh
              </button>
            </div>

            {/* Search and Filters */}
            <div className="filter-section">
              <div className="search-box">
                <Search size={19} />
                <input
                  type="text"
                  placeholder="Search by batch code or course name..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="filter-control">
                <SlidersHorizontal size={17} />
                <select
                  value={status}
                  onChange={(e) => handleStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Running">Running</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="filter-control">
                <MapPin size={17} />
                <select
                  value={centre}
                  onChange={(e) => handleCentre(e.target.value)}
                >
                  <option value="">All Centres</option>
                  {centres.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Batch Table */}
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>BATCH CODE</th>
                    <th>COURSE NAME</th>
                    <th>CENTRE NAME</th>
                    <th>START DATE</th>
                    <th>CAPACITY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="state-cell">
                        <div className="loading-spinner"></div>
                        <p>Loading batches...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="state-cell error-text">
                        <p>{error}</p>
                        <button
                          className="retry-button"
                          onClick={() =>
                            setRefreshKey((value) => value + 1)
                          }
                        >
                          Try Again
                        </button>
                      </td>
                    </tr>
                  ) : batches.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="state-cell">
                        <Search size={28} />
                        <p>No batches found.</p>
                        <span>
                          Try changing your search or filters.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch) => (
                      <tr key={batch.id}>
                        <td>
                          <span className="batch-code">
                            {batch.batchCode}
                          </span>
                        </td>

                        <td className="course-name">
                          {batch.courseName}
                        </td>

                        <td>
                          <span className="centre-name">
                            <MapPin size={14} />
                            {batch.centreName}
                          </span>
                        </td>

                        <td>
                          <span className="date-cell">
                            <CalendarDays size={15} />
                            {formatDate(batch.startDate)}
                          </span>
                        </td>

                        <td>
                          <div className="capacity-cell">
                            <span>
                              {batch.enrolledStudents} / {batch.totalCapacity}
                            </span>

                            <div className="capacity-track">
                              <div
                                className="capacity-fill"
                                style={{
                                  width: `${
                                    batch.totalCapacity > 0
                                      ? Math.min(
                                          (batch.enrolledStudents /
                                            batch.totalCapacity) *
                                            100,
                                          100
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${batch.status.toLowerCase()}`}
                          >
                            <span className="status-dot"></span>
                            {batch.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-section">
              <p className="pagination-info">
                Showing <strong>{startRecord}–{endRecord}</strong> of{" "}
                <strong>{pagination.totalRecords}</strong> batches
              </p>

              <div className="pagination-controls">
                <button
                  className="page-arrow"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    className={`page-number ${
                      page === number ? "selected" : ""
                    }`}
                    disabled={loading}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className="page-arrow"
                  disabled={page >= pagination.totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <footer className="page-footer">
            BatchFlow · Batch Management System
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
