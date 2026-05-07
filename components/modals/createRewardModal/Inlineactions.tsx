interface InlineActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Reusable Save + Cancel button pair used inside dropdown sub-inputs.
 * Cancel is white, Save is pink.
 */
export default function InlineActions({ onSave, onCancel }: InlineActionsProps) {
  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex-1 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
      >
        Save
      </button>
    </div>
  );
}