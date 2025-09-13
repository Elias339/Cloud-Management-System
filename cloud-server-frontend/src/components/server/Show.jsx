import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../common/header";
import Skeleton from "react-loading-skeleton"; 

const Show = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/servers/${id}`);
        const data = res.data.data || res.data;
        setServer(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

   
  if (loading)
    return (
      <>
        <Header />
        <div className="container my-5">
          <Skeleton height={40} width={250} className="mb-4" />
          <div className="row">
            <div className="col-md-6 mb-3">
              <Skeleton height={30} className="mb-2" />
              <Skeleton height={30} className="mb-2" />
              <Skeleton height={30} className="mb-2" />
            </div>
            <div className="col-md-6 mb-3">
              <Skeleton height={30} className="mb-2" />
              <Skeleton height={30} className="mb-2" />
              <Skeleton height={30} className="mb-2" />
            </div>
          </div>

          <Skeleton height={200} className="mt-4" />
          <Skeleton height={200} className="mt-4" />
        </div>
      </>
    );

  if (!server)
    return (
      <>
        <Header />
        <div className="container my-5 text-center text-danger fw-bold">
          Server not found
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="container my-5 fade-in"> 

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold"> <i className="bi bi-hdd-network me-2 text-primary"></i> Server Details </h3>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={() => navigate("/servers")} >
              <i className="bi bi-arrow-left-circle me-1"></i> Back to List
            </button>
            <button className="btn btn-primary" onClick={() => navigate(`/servers/edit/${server.id}`)} >
              <i className="bi bi-pencil-square me-1"></i> Edit Server
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-10 offset-1"> 

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Name:</strong> {server.name || <Skeleton width={100} />}
                    </p>
                    <p>
                      <strong>IP Address:</strong>{" "}
                      {server.ip_address || <Skeleton width={120} />}
                    </p>
                    <p>
                      <strong>Provider:</strong>{" "}
                      <span className="badge bg-secondary">
                        {server.provider?.toUpperCase() || <Skeleton width={80} />}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge server-status-${server.status} px-2 py-2`} >
                        <i className="bi bi-circle-fill me-1"></i>
                        {server.status ? capitalize(server.status) : <Skeleton width={60} />}
                      </span>
                    </p>
                    <p>
                      <strong>Version:</strong> {server.version || <Skeleton width={40} />}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {server.updated_at
                        ? new Date(server.updated_at).toLocaleString()
                        : <Skeleton width={120} />}
                    </p>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h5 className="mb-0">Hardware Specifications</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <div className="stats-card card border-0 shadow">
                      <div className="card-body">
                        <i className="bi bi-cpu display-4 text-primary"></i>
                        <h3>{server.cpu_cores || <Skeleton width={40} />}</h3>
                        <p className="text-muted">CPU Cores</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="stats-card card border-0 shadow">
                      <div className="card-body">
                        <i className="bi bi-memory display-4 text-success"></i>
                        <h3>
                          {server.ram_mb ? (server.ram_mb / 1024).toFixed(1) + " GB" : <Skeleton width={50} />}
                        </h3>
                        <p className="text-muted">RAM</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="stats-card card border-0 shadow">
                      <div className="card-body">
                        <i className="bi bi-hdd display-4 text-warning"></i>
                        <h3>{server.storage_gb || <Skeleton width={50} />} GB</h3>
                        <p className="text-muted">Storage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
