import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    full_name: string;
    role: string;
}

interface NavbarProps {
    user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const router = useRouter();

    return (
        <nav className="bg-white dark:bg-zinc-800 shadow-md p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href={'/'}>
                    <h1 className="text-2xl font-bold cursor-pointer">
                        My Store
                    </h1>
                </Link>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <Link
                                href={'/cart'}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                🛒 Cart
                            </Link>
                            <span className="text-sm">Welcome, {user.full_name}</span>
                        </>
                    ) : (
                        <Link
                        href={'/login'}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}