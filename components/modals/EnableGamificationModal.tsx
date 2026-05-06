import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAppDispatch } from '@/hooks/redux';
import { enableGamification } from '@/store/slices/gamificationSlice';
import { closeModal } from '@/store/slices/uiSlice';

interface EnableGamificationModalProps {
  isOpen: boolean;
}

export default function EnableGamificationModal({ isOpen }: EnableGamificationModalProps) {
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    dispatch(enableGamification());
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="Enable Gamification"
    >
      <div className="space-y-5">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 mx-auto">
          <span className="text-2xl">🎮</span>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            You&apos;re about to enable gamification for your campaign. This will
            unlock reward systems, milestones, and custom incentives for your
            ambassadors.
          </p>
          <p className="text-xs text-gray-400">
            You can disable this at any time from settings.
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={handleConfirm}>
            Enable Now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
