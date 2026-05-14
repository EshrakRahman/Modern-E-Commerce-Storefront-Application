import Container from "@/components/layout/Container";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import { MdReceipt, MdLogout, MdPerson } from "react-icons/md";

export default function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Container>
        <div className="py-20 text-center">
          <MdPerson className="text-6xl text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to your account</h1>
          <p className="text-black/60 mb-6">Access your profile, orders and more.</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences</p>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-black/40">Name</p>
              <p className="text-black font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-black/40">Email</p>
              <p className="text-black font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/orders"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-black transition-colors group"
          >
            <MdReceipt className="text-xl text-black/40 group-hover:text-black" />
            <div>
              <p className="font-medium text-black">Order History</p>
              <p className="text-sm text-black/40">View your past orders</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-red-300 transition-colors w-full group cursor-pointer"
          >
            <MdLogout className="text-xl text-black/40 group-hover:text-red-500" />
            <div className="text-left">
              <p className="font-medium text-black group-hover:text-red-500">Sign Out</p>
              <p className="text-sm text-black/40">Log out of your account</p>
            </div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-black/40 text-center">
            More account features — including password change — coming soon.
          </p>
        </div>
      </div>
    </Container>
  );
}
