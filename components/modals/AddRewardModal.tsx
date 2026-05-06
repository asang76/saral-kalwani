import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppDispatch } from '@/hooks/redux';
import { closeModal } from '@/store/slices/uiSlice';

interface AddRewardModalProps {
  isOpen: boolean;
}

export default function AddRewardModal({ isOpen }: AddRewardModalProps) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: '', amount: '', type: 'cash' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Reward name is required';
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid reward amount';
    return newErrors;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // TODO: dispatch addReward action
    dispatch(closeModal());
    setForm({ name: '', amount: '', type: 'cash' });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="Add Reward"
    >
      <div className="space-y-4">
        <Input
          label="Reward Name"
          placeholder="e.g. Sales Champion Bonus"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Amount / Value"
              type="number"
              placeholder="50"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              error={errors.amount}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 font-dm">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl text-sm border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            >
              <option value="cash">Cash ($)</option>
              <option value="product">Free Product</option>
              <option value="commission">Commission (%)</option>
              <option value="points">Points</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={() => dispatch(closeModal())}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={handleSubmit}>
            Add Reward
          </Button>
        </div>
      </div>
    </Modal>
  );
}
