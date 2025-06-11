// pages/auth/signin.js
import { getCsrfToken } from "next-auth/react";
import { useRouter }   from "next/router";

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const { error } = router.query;

  // Map NextAuth error codes to user-friendly messages
  const errorMessages = {
    CredentialsSignin: "Invalid email or password.",
    default:          "Unable to sign in. Please try again.",
  };
  const message = errorMessages[error] || (error ? errorMessages.default : null);

  return (
    <div className="form-card card">
      <h2>Sign In to gymBro</h2>

      {message && (
        <div className="form-error">
          {message}
        </div>
      )}

      <form method="post" action="/api/auth/callback/credentials" className="space-y-4">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <label>Email</label>
        <input name="email" type="email" required />

        <label>Password</label>
        <input name="password" type="password" required />

        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return { props: { csrfToken: await getCsrfToken(ctx) } };
}
