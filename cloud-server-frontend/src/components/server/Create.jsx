import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Skeleton from 'react-loading-skeleton';

const providers = ['aws', 'digitalocean', 'vultr', 'other'];
const statuses = ['active', 'inactive', 'maintenance'];

const Create = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      provider: 'other',
      status: 'inactive',
      cpu_cores: 1,
      ram_mb: 512,
      storage_gb: 10
    }
  });

  const cpu = watch('cpu_cores');
  const ram = watch('ram_mb');
  const storage = watch('storage_gb');
 
  const handleNumberChange = (field, minValue) => (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < minValue) {
      setValue(field, minValue);
    } else {
      setValue(field, val);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/servers', data);
      toast.success('Server created successfully!');
      navigate('/servers');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
 
  if (loading)
    return (
      <>
        <Header />
        <div className="container my-5">
          <Skeleton height={40} width={200} className="mb-4" />
          <Skeleton height={50} count={6} className="mb-3" />
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="container my-4 fade-in">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold"> <i className="bi bi-server me-2 text-primary"></i>  Create New Server </h3>
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
                      <option key={p} value={p}>
                        {p.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Status</label>
                  <select {...register('status')} className="form-select">
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">CPU</label>
                  <input type="number" {...register('cpu_cores')} className="form-control" value={cpu} onChange={handleNumberChange('cpu_cores', 1)} min={1} />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">RAM (MB)</label>
                  <input type="number" {...register('ram_mb')} className="form-control" value={ram} onChange={handleNumberChange('ram_mb', 512)} min={512} />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Storage (GB)</label>
                  <input type="number" {...register('storage_gb')} className="form-control" value={storage} onChange={handleNumberChange('storage_gb', 10)} min={10} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <i className="bi bi-plus-lg"></i> Create Server 
              </button>  

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
