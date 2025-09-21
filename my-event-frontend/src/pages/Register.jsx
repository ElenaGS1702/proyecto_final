import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from "../components/Card";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";

const schema = z.object({
  name: z.string().min(3, { message: "Debe contener al menos 3 caracteres" }),
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
  role: z.enum(["user", "organizer", "staff", "admin"], {
    required_error: "El rol es obligatorio",
    invalid_type_error: "El rol debe ser algunos de los valores: 'user', 'admin', 'organizer', 'staff'",
  })
});


export default function Register() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register: signup } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await signup(data);
      navigate("/events", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-2">Crea tu cuenta</h1>
        <p className="opacity-80 mb-6">
          Regístrate para organizar o comprar entradas.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input
              className="input"
              {...register("name")}
              required
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              {...register("email")}
              type="email"
              required
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              {...register("password")}
              type="password"
              required
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">Rol</label>
            <select
              className="input"
              {...register("role")}
            >
              <option value="user">user</option>
              <option value="organizer">organizer</option>
              <option value="staff">staff</option>
              <option value="admin">admin</option>
            </select>
            {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading || !isValid}>
            {loading ? "Creando..." : "Registrarme"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
