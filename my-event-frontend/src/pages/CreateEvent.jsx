import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../components/Card";
import { createEvent } from "../services/api";

const seatMapSchema = z
  .object({
    type: z.enum(["ga", "grid"], {
      required_error: "Este campo es requerido",
      invalid_type_error:
        "El rol debe ser algunos de los valores: 'GA', 'Grid'",
    }),
    rows: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => Number.isInteger(val) && val > 0, {
        message: "Debe de ser un número entero positivo",
      })
      .optional(),
    cols: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => Number.isInteger(val) && val > 0, {
        message: "Debe de ser un número entero positivo",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "grid") {
      if (data.rows === undefined || Number.isNaN(data.rows)) {
        ctx.addIssue({
          path: ["rows"],
          code: z.ZodIssueCode.custom,
          message: "Este campo es requerido",
        });
      }

      if (data.cols === undefined || Number.isNaN(data.cols)) {
        ctx.addIssue({
          path: ["cols"],
          code: z.ZodIssueCode.custom,
          message: "Este campo es requerido",
        });
      }
    }
  });

const schema = z.object({
  title: z.string().min(3, { message: "Debe contener al menos 3 caracteres" }),
  description: z.string().min(3, { message: "Debe contener al menos 3 caracteres" }),
  date: z.string().min(3, { message: "Este campo es requerido" }),
  venue: z.string().min(3, { message: "Este campo es requerido" }),
  imageUrl: z.string().min(3, { message: "Este campo es requerido" }),
  seatMap: seatMapSchema,
  price: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
      message: "Este campo debe ser mayor a cero",
  }),
  isPublished: z.boolean().default(true),
});

const defaultValues = {
  title: "",
  description: "",
  date: "",
  venue: "",
  imageUrl: "",
  seatMap: { type: "ga", rows: 1, cols: 1 },
  price: 0,
  isPublished: true,
};

export default function CreateEvent() {
  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    // defaultValues
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  const seat_type = watch('seatMap.type');

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setOk(null);
    try {
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        seatMap: {
          ...data.seatMap,
          rows: data.seatMap.type == 'ga' ? 1 : data.seatMap.rows, 
          cols: data.seatMap.type == 'ga' ? 1 : data.seatMap.cols
        }
      };

      const res = await createEvent(payload);
      setOk(`Evento creado: ${res?.item?.title} (${res?.item?._id})`);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Crear evento</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input
              className="input"
              {...register("title")}
              required
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input"
              {...register("description")}
              rows={3}
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label">Fecha y hora</label>
            <input
              className="input"
              type="datetime-local"
              {...register("date")}
              required
            />
            {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Lugar</label>
              <input
                className="input"
                {...register("venue")}
                required
              />
              {errors.venue && <p className="text-red-600 text-sm">{errors.venue.message}</p>}
            </div>
            <div>
              <label className="label">Imagen (URL)</label>
              <input
                className="input"
                {...register("imageUrl")}
              />
              {errors.imageUrl && <p className="text-red-600 text-sm">{errors.imageUrl.message}</p>}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Tipo de mapa</label>
              <select
                className="input"
                {...register("seatMap.type")}
              >
                <option value="ga">GA</option>
                <option value="grid">Grid</option>
              </select>
              {errors.seatMap?.type && <p className="text-red-600 text-sm">{errors.seatMap?.type?.message}</p>}
            </div>
            {seat_type == 'grid' && (
              <>
                <div>
                  <label className="label">Filas</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    {...register("seatMap.rows")}
                  />
                  {errors.seatMap?.rows && <p className="text-red-600 text-sm">{errors.seatMap?.rows?.message}</p>}
                </div>
                <div>
                  <label className="label">Columnas</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    {...register("seatMap.cols")}
                  />
                  {errors.seatMap?.cols && <p className="text-red-600 text-sm">{errors.seatMap?.cols?.message}</p>}
                </div>
              
              </>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Precio</label>
              <input
                className="input"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                id="pub"
                type="checkbox"
                {...register("isPublished")}
              />
              <label htmlFor="pub">Publicar</label>
              {errors.isPublished && <p className="text-red-600 text-sm">{errors.isPublished.message}</p>}
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {ok && <p className="text-green-600">{ok}</p>}
          <button className="btn btn-primary" disabled={loading || !isValid}>
            {loading ? "Creando..." : "Crear evento"}
          </button>
        </form>
      </Card>
    </div>
  );
}
