import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Calendar, Award, UserCheck, ShieldAlert, Plus, Edit2, CheckSquare, ClipboardList, X } from 'lucide-react';

export default function EmployeeManagement() {
  const { employees, updateEmployeeAttendance, assignEmployeeTask, addEmployee, deleteEmployee, updateEmployee, addNotification, user } = useContext(AppContext);
  const [taskModalEmployee, setTaskModalEmployee] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  
  // Roster Form Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Photographer');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  // Check if current logged in user has access (restricted for Editor and Employee)
  const isRestricted = user?.role === 'Editor' || user?.role === 'Employee';

  if (isRestricted) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'rgba(13,13,13,0.3)', border: '1px solid #ef4444' }}>
        <ShieldAlert size={60} color="#ef4444" style={{ marginBottom: '1.5rem', marginInline: 'auto' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your profile role ({user.role}) does not have administrative permissions to view or edit the Employee roster database. Please contact a Super Admin.
        </p>
      </div>
    );
  }

  const handleOpenTaskModal = (emp) => {
    setTaskModalEmployee(emp);
    setTaskInput(emp.tasks || '');
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (taskModalEmployee) {
      assignEmployeeTask(taskModalEmployee.id, taskInput);
      setTaskModalEmployee(null);
    }
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setName('');
    setRole('Photographer');
    setPhone('');
    setEmail('');
    setSalary('');
    setEmpId(`EMP${Math.floor(10 + Math.random() * 90)}`);
    setPassword(Math.random().toString(36).substring(2, 8));
    setFormModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setRole(emp.role);
    setPhone(emp.phone);
    setEmail(emp.email);
    const rawSalary = emp.salary ? emp.salary.replace(/[^0-9]/g, '') : '';
    setSalary(rawSalary);
    setEmpId(emp.id);
    setPassword(emp.password || Math.random().toString(36).substring(2, 8));
    setFormModalOpen(true);
  };

  const handleDeleteEmployee = (id, empName) => {
    if (window.confirm(`Are you sure you want to permanently remove ${empName} from the roster?`)) {
      deleteEmployee(id);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const empData = {
      id: empId,
      name,
      role,
      phone,
      email,
      salary: salary ? `$${Number(salary).toLocaleString()}/mo` : undefined,
      password
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, empData);
    } else {
      addEmployee(empData);
    }
    setFormModalOpen(false);
    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setSalary('');
    setEmpId('');
    setPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Human Resources
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem' }}>Staff Roster & Scheduling</h2>
        </div>
        <button onClick={openAddModal} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: 'var(--gold-primary)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{employees.length} Registered</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Full-Time Creative Crew</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(13,13,13,0.3)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {employees.filter(e => e.attendance).length} Present
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>On Shift Today</span>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-panel" style={{ padding: '1rem', backgroundColor: 'rgba(13,13,13,0.3)' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee Details</th>
                <th>Creative Role</th>
                <th>Contacts</th>
                <th>Joined Date</th>
                <th>Compensation</th>
                <th style={{ textAlign: 'center' }}>Shift Checklist</th>
                <th>Active Task Allocation</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{emp.name}</div>
                    <code style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {emp.id}</code>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'var(--gold-primary)',
                      textTransform: 'uppercase'
                    }}>
                      {emp.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{emp.email}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.phone}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{emp.joined}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>{emp.salary}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={emp.attendance}
                      onChange={(e) => {
                        updateEmployeeAttendance(emp.id, e.target.checked);
                        addNotification("Attendance Updated", `${emp.name} marked ${e.target.checked ? 'present' : 'absent'}.`, "info");
                      }}
                      style={{ 
                        width: '18px', 
                        height: '18px', 
                        accentColor: 'var(--gold-primary)',
                        cursor: 'pointer' 
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#fff', fontStyle: emp.tasks === 'Unassigned' ? 'italic' : 'normal' }}>
                        {emp.tasks}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button 
                        onClick={() => handleOpenTaskModal(emp)}
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        title="Assign Task"
                      >
                        <ClipboardList size={12} />
                        <span>Task</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="btn btn-dark" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        title="Edit Employee"
                      >
                        <Edit2 size={12} color="var(--gold-primary)" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(220,38,38,0.2)' }}
                        title="Remove Employee"
                      >
                        <X size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TASK ALLOCATION MODAL */}
      {taskModalEmployee && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={(e) => { if (e.target === e.currentTarget) setTaskModalEmployee(null); }}>
          <div className="glass-panel" style={{
            maxWidth: '450px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid var(--gold-primary)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Schedule Task</h3>
              <button onClick={() => setTaskModalEmployee(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit}>
              <h4 style={{ color: 'var(--gold-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                Assigning Task to: <b>{taskModalEmployee.name} ({taskModalEmployee.role})</b>
              </h4>

              <div className="form-group">
                <label className="form-label">Task Assignment details</label>
                <input 
                  type="text" 
                  value={taskInput} 
                  onChange={(e) => setTaskInput(e.target.value)} 
                  className="form-control" 
                  required 
                  placeholder="e.g. Color Grading Ceremony Batch 3" 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setTaskModalEmployee(null)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT EMPLOYEE MODAL */}
      {formModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(5px)'
        }} onClick={(e) => { if (e.target === e.currentTarget) setFormModalOpen(false); }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#0a0a0a',
            border: '1px solid var(--gold-primary)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>
                {editingEmployee ? `Edit Staff: ${editingEmployee.name}` : 'Add New Staff'}
              </h3>
              <button onClick={() => setFormModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required placeholder="Christian Vance" />
              </div>

              <div className="form-group">
                <label className="form-label">Creative Roster Position</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control form-select">
                  <option value="Photographer">Photographer</option>
                  <option value="Videographer">Videographer</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="modal-grid">
                <style dangerouslySetInnerHTML={{__html: `
                  @media (max-width: 500px) {
                    .modal-grid { grid-template-columns: 1fr !important; }
                  }
                `}} />
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Employee ID</label>
                  <input type="text" value={empId} onChange={(e) => setEmpId(e.target.value)} className="form-control" required placeholder="EMP01" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">System Password</label>
                  <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required placeholder="password123" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" required placeholder="+1 (555) 123-4567" />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required placeholder="christian@antigravity.studio" />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Salary Allocation (USD)</label>
                <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="form-control" required placeholder="4200" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" onClick={() => setFormModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>
                  {editingEmployee ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
