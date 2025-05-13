import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Select, SelectItem, Spinner } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const { login } = useAuth(); // This will access setUser internally
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password, role);
    if (success) {
      // redirect or show success message
      setError('Login successful');
      setLoading(false);
      navigate(role === 'admin' ? '/admin' : "/");
    } else {
      setError('Invalid credentials or role mismatch');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto  p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <Input label="Email" type="email" value={email} onValueChange={setEmail} startContent={<Mail size={16} className="text-gray-400" />}
          isRequired className="mb-4" />
      <Input label="Password" type={isVisible ? "text" : "password"} placeholder="Enter your password" value={password} onValueChange={setPassword} className="mb-4" startContent={<Lock size={16} className="text-gray-400" />}
        endContent={
          <button
            onClick={toggleVisibility}
            className="focus:outline-none"
          >
            {isVisible ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        }
        isRequired />
      <Select label="Role" selectedKeys={[role]} onSelectionChange={(keys) => setRole(Array.from(keys)[0] as 'admin' | 'customer')} className="mb-4">
        {['admin', 'customer'].map((r) => (
          <SelectItem key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </SelectItem>
        ))}
      </Select>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Button color="default" onClick={handleSubmit} fullWidth isDisabled={isLoading} className="mb-4">
        {isLoading ? <Spinner size="sm" /> : 'Login'}
      </Button>
      <div className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </Link>
        </div>
    </div>
  );
};

export default Login;
