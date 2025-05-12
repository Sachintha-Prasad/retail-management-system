import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Input, Tab, Tabs, Checkbox } from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');

  const from = location.state?.from?.pathname || '/';

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password, selectedRole);
      
      if (success) {
        navigate(selectedRole === 'admin' ? '/admin' : from);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRole = (key) => {
    setSelectedRole(key);
  };

  // Sample credentials for demo
  const sampleCredentials = {
    admin: {
      email: 'admin@example.com',
      password: 'admin123',
    },
    customer: {
      email: 'customer@example.com',
      password: 'customer123',
    },
  };

  return (
    <div>
      <Tabs 
        fullWidth 
        size="lg" 
        aria-label="Login tabs" 
        selectedKey={selectedRole}
        onSelectionChange={handleSelectRole}
      >
        <Tab key="customer" title="Customer" />
        <Tab key="admin" title="Admin" />
      </Tabs>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startContent={<Mail size={16} className="text-gray-400" />}
          isRequired
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startContent={<Lock size={16} className="text-gray-400" />}
          endContent={
            <button
              type="button"
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
          isRequired
        />

        <div className="flex items-center justify-between">
          <Checkbox size="sm">Remember me</Checkbox>
          <a
            href="#"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>
        )}

        <Button
          type="submit"
          color="default"
          fullWidth
          isLoading={isLoading}
          className="font-medium"
        >
          Sign in
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

        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-2">Demo credentials for {selectedRole}:</p>
          <p>Email: {sampleCredentials[selectedRole].email}</p>
          <p>Password: {sampleCredentials[selectedRole].password}</p>
        </div>
      </form>
    </div>
  );
};

export default Login;