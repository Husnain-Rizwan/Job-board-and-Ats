import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <Link to="/" className="text-xl font-bold">
          Job Board
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/jobs" className="hover:text-blue-600">
            Jobs
          </Link>

          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/register"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;