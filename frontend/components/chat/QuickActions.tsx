import { QUICK_ACTIONS, QuickAction } from "@/lib/quickActions";

export default function QuickActions({
  onAction,
  disabled,
}: {
  onAction: (action: QuickAction) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 border-t border-gray-200 px-3 pt-2 dark:border-gray-700">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action)}
          disabled={disabled}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {action.emoji} {action.label}
        </button>
      ))}
    </div>
  );
}
