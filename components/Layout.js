import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const year = new Date().getFullYear();

  return (
    <div>
      <header>
        <div className="header-container">
          <Link href="/" legacyBehavior><a className="logo">🏋️‍♂️ gymBro</a></Link>
          <nav className="header-nav">
            {!session ? (
              <>
                <button onClick={() => signIn()}>Sign In</button>
                <Link href="/auth/register" legacyBehavior><a>Sign Up</a></Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" legacyBehavior><a>Dashboard</a></Link>
                <Link href="/dashboard/sessions" legacyBehavior><a>Sessions</a></Link>
                <Link href="/dashboard/calendar" legacyBehavior><a>Calendar</a></Link>
                <Link href="/dashboard/exercises" className="hover:underline">Exercises</Link>
                <Link href="/dashboard/exercises-manager" className="hover:underline">Customize</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <div className="card">{children}</div>
      </main>
      <footer>
        <div className="footer-container">
          <span>© {year} gymBro</span>
          <button onClick={() => router.back()}>← Back</button>
        </div>
      </footer>
    </div>
  );
}
