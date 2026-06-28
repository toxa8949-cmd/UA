export function Field({
  label, name, defaultValue, type = "text", placeholder, required,
}: {
  label: string; name: string; defaultValue?: string | number | null;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

export function TextArea({
  label, name, defaultValue, rows = 4, placeholder,
}: {
  label: string; name: string; defaultValue?: string | null; rows?: number; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

export function StatusSelect({ defaultValue }: { defaultValue?: string | null }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">Статус</span>
      <select name="status" defaultValue={defaultValue ?? "draft"}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
        <option value="draft">Чернетка</option>
        <option value="published">Опубліковано</option>
        <option value="archived">В архіві</option>
      </select>
    </label>
  );
}
