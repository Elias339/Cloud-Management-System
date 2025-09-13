import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { AuthContext } from './Auth.jsx'; 

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: 'admin@gmail.com', password: 'password' }
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/login', data);  
      const payload = res.data || {};
      if (payload.token) {
        const userInfo = { token: payload.token };
        login(userInfo);
        toast.success('Login successful');
        navigate('/servers', { replace: true });
      } else {
        toast.error(payload.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <>
      <main>
        <div className="container my-5 d-flex justify-content-center">
          <div className="w-100" style={{ maxWidth: 440 }}>
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="mb-3">Admin Login</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      {...register('email', { required: 'Email required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      {...register('password', { required: 'Password required' })}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>

                  <button className="btn btn-primary" disabled={isSubmitting}>Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
