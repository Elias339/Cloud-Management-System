import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/header';
import Skeleton from 'react-loading-skeleton'; 
import "bootstrap-icons/font/bootstrap-icons.css";

const providers = ['aws', 'digitalocean', 'vultr', 'other'];
const statuses = ['active', 'inactive', 'maintenance'];

const Edit = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      provider: 'other',
      status: 'inactive',
      cpu_cores: 1,
      ram_mb: 512,
      storage_gb: 10, 
    }
  });

  const cpu = watch('cpu_cores');
  const ram = watch('ram_mb');
  const storage = watch('storage_gb');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/servers/${id}`);
        const data = res.data.data || res.data;
        reset(data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load server');
      } finally {
        setLoading(false);
      }
    };
    fetch(); 
  }, [id]);

  const handleNumberChange = (field, minValue) => (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < minValue) {
      setValue(field, minValue);
    } else {
      setValue(field, val);
    }
  };
 
  const onSubmit = async (formData) => {
    try {
      const res = await api.put(`/servers/${id}`, formData); 
      if (res.data?.message) {
        toast.success(res.data.message);
      } else {
        toast.success('Server update successfully!');
      }
      navigate('/servers');
    } catch (err) { 
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      if (err.response?.status === 409 && err.response?.data?.error === 'version_mismatch') {
        toast.error(errorMessage);  
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="container my-5">
          <Skeleton height={40} width={200} className="mb-4" />
          <Skeleton height={50} count={8} className="mb-3" />
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="container my-4 fade-in">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold"> <i className="bi bi-pencil-square me-2"></i>Edit Server</h3>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={() => navigate("/servers")} >
              <i className="bi bi-arrow-left-circle me-1"></i> Back to List
            </button> 
          </div>
        </div> 
 
        
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Name<span className='text-danger'>*</span></label>
                <input {...register('name', { required: 'Name is required' })} className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Enter server name" />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">IP Address<span className='text-danger'>*</span></label>
                <input {...register('ip_address', { required: 'IP Address is required' })} className={`form-control ${errors.ip_address ? 'is-invalid' : ''}`} placeholder="e.g., 192.168.1.1" />
                {errors.ip_address && <div className="invalid-feedback">{errors.ip_address.message}</div>}
              </div>

              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Provider</label>
                  <select {...register('provider')} className="form-select">
                    {providers.map((p) => (
                      <option key={p} value={p}>{p.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Status</label>
                  <select {...register('status')} className="form-select">
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">CPU</label>
                  <input type="number" {...register('cpu_cores')} className="form-control" value={cpu} onChange={handleNumberChange('cpu_cores', " ")} min={1} />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">RAM (MB)</label>
                  <input type="number" {...register('ram_mb')} className="form-control" value={ram} onChange={handleNumberChange('ram_mb', " ")} min={512} />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Storage (GB)</label>
                  <input type="number" {...register('storage_gb')} className="form-control" value={storage} onChange={handleNumberChange('storage_gb', " ")} min={10} />
                </div>
              </div>
 
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <i className="bi bi-save me-2"></i> {isSubmitting ? 'Updating...' : 'Update Server'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
