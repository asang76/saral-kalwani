import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppDispatch } from '@/hooks/redux';
import { closeModal } from '@/store/slices/uiSlice';

interface AddMilestoneModalProps {
  isOpen: boolean;
}

export default function AddMilestoneModal({ isOpen }: AddMilestoneModalProps) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: '', target: '', unit: 'sales' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Milestone name is required';
    if (!form.target || Number(form.target) <= 0)
      newErrors.target = 'Enter a valid target number';
    return newErrors;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // TODO: dispatch addMilestone action
    dispatch(closeModal());
    setForm({ name: '', target: '', unit: 'sales' });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title="Add Milestone"
    >
      <div className="space-y-4">
        <Input
          label="Milestone Name"
          placeholder="e.g. First 10 Sales"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Target"
              type="number"
              placeholder="10"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              error={errors.target}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 font-dm">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl text-sm border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            >
              <option value="sales">Sales</option>
              <option value="posts">Posts</option>
              <option value="days">Days</option>
              <option value="referrals">Referrals</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={() => dispatch(closeModal())}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={handleSubmit}>
            Add Milestone
          </Button>
        </div>
      </div>
    </Modal>
  );
}
