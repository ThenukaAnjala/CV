import { MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ResumeData, ResumeLink } from "@/types/resume";

type LinkFieldsProps = {
  links: ResumeLink[];
  fieldPrefix: string;
  label: string;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
};

export function LinkFields({ links, fieldPrefix, label, onAdd, onDelete, onMove }: LinkFieldsProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext<ResumeData>();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <Button icon={<Plus aria-hidden size={16} />} onClick={onAdd} size="sm" variant="secondary">
          Add link
        </Button>
      </div>
      {links.length === 0 ? <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">No links added.</p> : null}
      {links.map((link, index) => {
        const labelName = `${fieldPrefix}.${index}.label` as Path<ResumeData>;
        const urlName = `${fieldPrefix}.${index}.url` as Path<ResumeData>;
        return (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={link.id}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input error={getFieldError(errors, labelName)} label="Link label" placeholder="Portfolio" {...register(labelName)} />
              <Input error={getFieldError(errors, urlName)} label="URL" placeholder="https://example.com" type="url" {...register(urlName)} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button disabled={index === 0} icon={<MoveUp aria-hidden size={16} />} onClick={() => onMove(index, -1)} size="sm" variant="ghost">
                Up
              </Button>
              <Button disabled={index === links.length - 1} icon={<MoveDown aria-hidden size={16} />} onClick={() => onMove(index, 1)} size="sm" variant="ghost">
                Down
              </Button>
              <Button icon={<Trash2 aria-hidden size={16} />} onClick={() => onDelete(index)} size="sm" variant="ghost">
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
