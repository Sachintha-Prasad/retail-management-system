import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Checkbox } from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });
  
  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(name, email, password);
      
      if (success) {
        navigate('/');
      } else {
        setErrors({
          ...errors,
          general: 'Registration failed. Email may already be in use.',
        });
      }
    } catch (err) {
      setErrors({
        ...errors,
        general: 'An error occurred during registration',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          startContent={<User size={16} className="text-gray-400" />}
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          isRequired
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startContent={<Mail size={16} className="text-gray-400" />}
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          isRequired
        />

        <Input
          label="Password"
          placeholder="Create a password"
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
          isInvalid={!!errors.password}
          errorMessage={errors.password}
          isRequired
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          type={isVisible ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          startContent={<Lock size={16} className="text-gray-400" />}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          isRequired
        />

        <Checkbox size="sm">
          I agree to the <a href="#" className="text-primary-600">Terms of Service</a> and <a href="#" className="text-primary-600">Privacy Policy</a>
        </Checkbox>

        {errors.general && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{errors.general}</div>
        )}

        <Button
          type="submit"
          color="default"
          fullWidth
          isLoading={isLoading}
          className="font-medium"
        >
          Sign up
        </Button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;