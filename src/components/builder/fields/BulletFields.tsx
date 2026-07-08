import { Plus, Trash2, MoveDown, MoveUp } from "lucide-react";
import { useFormContext, type Path } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getFieldError } from "@/lib/forms/getFieldError";
import type { ResumeBullet, ResumeData } from "@/types/resume";

type BulletFieldsProps = {
  bullets: ResumeBullet[];
  fieldPrefix: string;
  label: string;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
};

export function BulletFields({ bullets, fieldPrefix, label, onAdd, onDelete, onMove }: BulletFieldsProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext<ResumeData>();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <Button icon={<Plus aria-hidden size={16} />} onClick={onAdd} size="sm" variant="secondary">
          Add bullet
        </Button>
      </div>
      {bullets.length === 0 ? <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">No bullets added.</p> : null}
      {bullets.map((bullet, index) => {
        const fieldName = `${fieldPrefix}.${index}.text` as Path<ResumeData>;
        return (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]" key={bullet.id}>
            <Input
              error={getFieldError(errors, fieldName)}
              label={`Bullet ${index + 1}`}
              placeholder="Led a project that improved a measurable outcome"
              {...register(fieldName)}
            />
            <div className="flex items-end gap-2">
              <Button disabled={index === 0} icon={<MoveUp aria-hidden size={16} />} onClick={() => onMove(index, -1)} size="sm" variant="ghost">
                Up
              </Button>
              <Button disabled={index === bullets.length - 1} icon={<MoveDown aria-hidden size={16} />} onClick={() => onMove(index, 1)} size="sm" variant="ghost">
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
