import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../common/header";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const providers = ["aws", "digitalocean", "vultr", "other"];
const statuses = ["active", "inactive", "maintenance"];

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i}>
        <div className="placeholder-glow">
          <span className="placeholder col-8"></span>
        </div>
      </td>
    ))}
  </tr>
);

const Index = () => {

  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    q: "",
    provider: "",
    status: "",
    min_cpu: "",
    max_cpu: "",
  });

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
 
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("desc");
  const [meta, setMeta] = useState({});
 
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchServers();  
  }, [filters, page, perPage, sort, order]);

  const fetchServers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/servers", {
        params: {
          ...filters,
          per_page: perPage,
          page,
          sort,
          order,
        },
      });
      const data = res.data;
      setServers(data.data || []);
      setMeta(data.meta || {});
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error("Failed to load servers");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target; 
    if (["min_cpu", "max_cpu"].includes(name) && value < 0) return;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ q: "", provider: "", status: "", min_cpu: "", max_cpu: "" });
    setPage(1);
  };

  const changeSort = (field) => {
    if (sort === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this server?")) return;
    try {
      await api.delete(`/servers/${id}`);
      toast.success("Deleted");
      fetchServers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} server(s)?`)) return;
    try {
      await Promise.all(selected.map((id) => api.delete(`/servers/${id}`)));
      toast.success("Deleted selected servers");
      setSelected([]);
      fetchServers();
    } catch {
      toast.error("Bulk delete failed");
    }
  
  };

  const toggleSelectAll = () => {
    if (selected.length === servers.length) setSelected([]);
    else setSelected(servers.map((s) => s.id));
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const getPaginationRange = (current, last) => {
    const delta = 2;  
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };


  return (
    <>
      <Header />
      <div className="container my-4 fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">
            <i className="bi bi-server me-2 text-primary"></i> Servers
          </h3>
          <Link to="/servers/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-1"></i> Create Server
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

         {/* Filtter card */} 
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Filters</h5>
            <button className="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse" aria-expanded="true" aria-controls="filterCollapse" >
              <i className="bi bi-funnel"></i>
            </button>
          </div>

          <div className="collapse show" id="filterCollapse">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <input type="text" name="q" className="form-control" value={filters.q} onChange={handleFilterChange} placeholder="Search name or IP" />
                </div>

                <div className="col-md-2">
                  <select name="provider" value={filters.provider} onChange={handleFilterChange} className="form-select" >
                    <option value="">All providers</option>
                    {providers.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="form-select" >
                    <option value="">All statuses</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <input type="number" name="min_cpu" value={filters.min_cpu} onChange={handleFilterChange} min="0" className="form-control" placeholder="Min CPU" />
                </div>

                <div className="col-md-2">
                  <input type="number" name="max_cpu" value={filters.max_cpu} onChange={handleFilterChange} min="0" className="form-control" placeholder="Max CPU" />
                </div>

                <div className="col-md-3 d-flex gap-2">
                  <button className="btn btn-secondary" onClick={resetFilters}> Reset </button>
                  <button className="btn btn-primary" onClick={fetchServers}> Apply </button>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {selected.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between">
            <span>{selected.length} server(s) selected</span>
            <button className="btn btn-danger btn-sm" onClick={handleBulkDelete} > Delete Selected </button>
          </div>
        )}

        {/* Table card */}
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <input type="checkbox" className="form-check-input" checked={selected.length === servers.length && servers.length > 0} onChange={toggleSelectAll} />
                  </th>
                  <th onClick={() => changeSort("name")} style={{cursor:"pointer"}}>
                    Name {sort === "name" ? (order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>IP</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th onClick={() => changeSort("cpu_cores")} style={{cursor:"pointer"}}>
                    CPU {sort === "cpu_cores" ? (order === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>RAM</th>
                  <th>Storage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : servers.length ? (
                  servers.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <input type="checkbox" className="form-check-input" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                      </td>
                      <td>{s.name}</td>
                      <td>{s.ip_address}</td>
                      <td><span className="badge bg-secondary">{s.provider.toUpperCase()}</span></td> 
                      <td><span className={`badge bg-${s.status === "active" ? "success" : s.status === "inactive" ? "secondary" : "primary"}`}>{capitalize(s.status)}</span></td>
                      <td>{s.cpu_cores}</td>
                      <td>{s.ram_mb}</td>
                      <td>{s.storage_gb}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link to={`/servers/${s.id}`} className="btn btn-outline-primary"><i className="bi bi-eye"></i></Link>
                          <Link to={`/servers/edit/${s.id}`} className="btn btn-outline-secondary"><i className="bi bi-pencil"></i></Link>
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(s.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-4">
                      <i className="bi bi-server text-muted fs-1"></i>
                      <p>No servers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
 
        {meta.total > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(meta.from || 1)} to {(meta.to || servers.length)} of {meta.total} servers
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" style={{ width: "auto" }} value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} >
                {[5, 10, 15, 25, 50].map(n => <option key={n} value={n}>{n}/Page</option>)}
              </select>
              <nav>

                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>Prev</button>
                  </li>

                  {getPaginationRange(page, meta.last_page || 1).map((p, i) => (
                    <li key={i} className={`page-item ${page === p ? "active" : ""} ${p === "..." ? "disabled" : ""}`}>
                      {p === "..." ? (
                        <span className="page-link">...</span>
                      ) : (
                        <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                      )}
                    </li>
                  ))}

                  <li className={`page-item ${page === (meta.last_page || 1) ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                  </li>
                </ul>
 
              </nav>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Index;
