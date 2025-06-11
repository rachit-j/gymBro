import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/auth/signin");
    else console.error("Registration failed");
  };

  return (
    <div className="form-card card">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label>Password</label>
        <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
