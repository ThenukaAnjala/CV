import { Copy, Eye, EyeOff, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type RepeatedItemControlsProps = {
  itemLabel: string;
  hidden?: boolean;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleHidden: () => void;
};

export function RepeatedItemControls({
  itemLabel,
  hidden,
  disableMoveUp,
  disableMoveDown,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleHidden
}: RepeatedItemControlsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={`${itemLabel} actions`}>
      <Button icon={<EyeIcon hidden={hidden} />} onClick={onToggleHidden} size="sm" title={hidden ? "Show item" : "Hide item"} variant="ghost">
        {hidden ? "Show" : "Hide"}
      </Button>
      <Button disabled={disableMoveUp} icon={<MoveUp aria-hidden size={16} />} onClick={onMoveUp} size="sm" title="Move up" variant="ghost">
        Up
      </Button>
      <Button disabled={disableMoveDown} icon={<MoveDown aria-hidden size={16} />} onClick={onMoveDown} size="sm" title="Move down" variant="ghost">
        Down
      </Button>
      <Button icon={<Copy aria-hidden size={16} />} onClick={onDuplicate} size="sm" title="Duplicate item" variant="ghost">
        Duplicate
      </Button>
      <Button icon={<Trash2 aria-hidden size={16} />} onClick={onDelete} size="sm" title="Delete item" variant="ghost">
        Delete
      </Button>
    </div>
  );
}

function EyeIcon({ hidden }: { hidden?: boolean }) {
  return hidden ? <Eye aria-hidden size={16} /> : <EyeOff aria-hidden size={16} />;
}
