import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <span className="text-gray-600">Welcome, {user?.name}</span>
    </header>
  );
};

export default Header;

