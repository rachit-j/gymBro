// pages/auth/signin.js
import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      // show the error message inline
      setError("Invalid email or password.");
    } else {
      // success → go home
      router.push("/");
    }
  };

  return (
    <div className="form-card card">
      <h2>Sign In to gymBro</h2>

      {/* Inline error bar */}
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* include CSRF token for credentials provider */}
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
    </div>
  );
}

// still fetch CSRF token for the Credentials provider
export async function getServerSideProps(ctx) {
  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
    },
  };
}
