import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(9, { message: "La contraseña debe tener al menos 9 caracteres" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "La contraseña debe contener al menos un carácter especial",
    }),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/events";

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-5">
          Bienvenido a {import.meta.env.VITE_APP_NAME || "la plataforma"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Correo</label>
            <input
              className="input"
              {...register("email")}
              type="email"
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              {...register("password")}
              type="password"
              required
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading || !isValid}>
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="underline">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  );
}
