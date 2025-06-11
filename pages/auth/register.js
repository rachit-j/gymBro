import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/auth/signin");
    else alert("Error registering");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <label>Password</label>
      <input type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
}
