import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input,  Select, SelectItem } from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validate = () => {
    const err: any = {};
    if (!name) err.name = 'Name is required';
    if (!email) err.email = 'Email is required';
    if (!role) err.role = 'Role is required';
    else if (!/\S+@\S+\.\S+/.test(email)) err.email = 'Invalid email format';
    if (!password) err.password = 'Password is required';
    if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const success = await register(name, email, password, role as 'admin' | 'customer');
      if (success) {
        navigate('/');
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' });
    }

  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">Create an Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Role"
          name="role"
          onChange={(e) => setRole(e.target.value)}
          required
        >
          {['admin', 'customer'].map((role) => (
            <SelectItem key={role} >
              {role}
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          startContent={<User size={16} />}
          isInvalid={!!errors.name}
          errorMessage={errors.name}
        />

        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startContent={<Mail size={16} />}
          isInvalid={!!errors.email}
          errorMessage={errors.email}
        />

        <Input
          label="Password"
          type={isVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startContent={<Lock size={16} />}
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          isInvalid={!!errors.password}
          errorMessage={errors.password}
        />

        <Input
          label="Confirm Password"
          type={isVisible ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          startContent={<Lock size={16} />}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
        />

        {errors.general && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{errors.general}</div>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign up
        </Button>

        <div className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
