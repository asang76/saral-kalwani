import { useState } from "react";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  closeModal,
  toggleDropdown,
  closeDropdown,
  openDropdown,
} from "@/store/slices/uiSlice";


import SmartDropdown from "./createRewardModal/SmartDropdown";
import TierSelectPanel from "./createRewardModal/TireSelectpanel";
import Toggle from "./createRewardModal/Toggle";
import EndDatePicker from "./createRewardModal/EndDatePicker";


import {
  EMPTY_FORM,
  REWARD_EVENT_OPTIONS,
  REWARD_WITH_OPTIONS,
  type View,
  type CreateRewardForm,
  type FormErrors,
  type DropdownOption,
  type Duration,
} from "./createRewardModal/types";

import {
  getEventDisplayValue,
  getRewardDisplayValue,
} from "./createRewardModal/utils";

interface CreateRewardModalProps {
  isOpen: boolean;
}

export default function CreateRewardModal({ isOpen }: CreateRewardModalProps) {
  const dispatch = useAppDispatch();

  
  const activeDropdown = useAppSelector((s) => s.ui.activeDropdown);


  const [view, setView] = useState<View>("main");
  const [form, setForm] = useState<CreateRewardForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rewardRowHovered, setRewardRowHovered] = useState(false);
  const [draftTier, setDraftTier] = useState("");

  const patch = (p: Partial<CreateRewardForm>) =>
    setForm((f) => ({ ...f, ...p }));

  const clearErr = (keys: (keyof FormErrors)[]) =>
    setErrors((e) => {
      const next = { ...e };
      keys.forEach((k) => delete next[k]);
      return next;
    });

  const eventDisplayValue = getEventDisplayValue(form);
  const rewardDisplayValue = getRewardDisplayValue(form);
  const selectedRewardOpt = REWARD_WITH_OPTIONS.find(
    (o) => o.label === form.rewardWith,
  );

  const evtOpt = REWARD_EVENT_OPTIONS.find((o) => o.label === form.rewardEvent);
  const isSubmitDisabled = (() => {
    if (!form.rewardEvent) return true;

    if (evtOpt?.needsAmount && !form.rewardEventAmount) return true;

    if (
      evtOpt?.needsPostsInput &&
      (!form.rewardEventCount || !form.rewardEventDuration)
    )
      return true;

    if (!form.rewardWith) return true;

    if (selectedRewardOpt?.needsAmount && !form.rewardWithAmount) return true;

    if (selectedRewardOpt?.needsTier && !form.selectedTier) return true;

    if (form.timeBound && !form.endDate) return true;
    return false;
  })();

  // ── Reward event handlers ────────────────────────────────────────────────────
  const handleSelectEvent = (opt: DropdownOption) => {
    if (!opt.label) {
      patch({ rewardEvent: "", rewardEventCount: "", rewardEventDuration: "" });
      dispatch(closeDropdown());
      return;
    }
    const tierDisabled = [
      "Posts X times every Y period",
      "Is Onboarded",
    ].includes(opt.label);
    const tierWasSelected = form.rewardWith === "Upgrade Commission Tier";
    patch({
      rewardEvent: opt.label,
      rewardEventAmount:
        form.rewardEvent === opt.label ? form.rewardEventAmount : "",
      rewardEventCount:
        form.rewardEvent === opt.label ? form.rewardEventCount : "",
      rewardEventDuration:
        form.rewardEvent === opt.label ? form.rewardEventDuration : "",
      rewardWith: tierDisabled && tierWasSelected ? "" : form.rewardWith,
      selectedTier: tierDisabled && tierWasSelected ? "" : form.selectedTier,
    });
    clearErr(["rewardEvent", "rewardEventAmount", "rewardEventCount"]);
    if (!opt.needsAmount && !opt.needsPostsInput)
      dispatch(openDropdown("reward"));
  };

  const handleSaveEventAmount = () => {
    if (!form.rewardEventAmount || Number(form.rewardEventAmount) <= 0) {
      setErrors((e) => ({
        ...e,
        rewardEventAmount: "Enter the sales target amount to continue",
      }));
      return;
    }
    clearErr(["rewardEventAmount"]);
    dispatch(openDropdown("reward"));
  };

  const handleCancelEventAmount = () => {
    patch({ rewardEvent: "", rewardEventAmount: "" });
    dispatch(closeDropdown());
  };

  const handleSavePostsInput = () => {
    if (!form.rewardEventCount || Number(form.rewardEventCount) <= 0) {
      setErrors((e) => ({
        ...e,
        rewardEventCount: "Enter the posts count to continue",
      }));
      return;
    }
    if (!form.rewardEventDuration) {
      setErrors((e) => ({ ...e, rewardEventDuration: "Select a duration" }));
      return;
    }
    clearErr(["rewardEventCount", "rewardEventDuration"]);
    dispatch(openDropdown("reward"));
  };

  const handleCancelPostsInput = () => {
    patch({ rewardEvent: "", rewardEventCount: "", rewardEventDuration: "" });
    dispatch(closeDropdown());
  };

  // ── Reward with handlers ─────────────────────────────────────────────────────
  const handleSelectReward = (opt: DropdownOption) => {
    if (!opt.label) return;
    if (opt.needsTier) {
      patch({ rewardWith: opt.label });
      setDraftTier(form.selectedTier);
      dispatch(closeDropdown());
      setView("tier-select");
      return;
    }
    patch({
      rewardWith: opt.label,
      rewardWithAmount:
        form.rewardWith === opt.label ? form.rewardWithAmount : "",
      selectedTier: "",
    });
    clearErr(["rewardWith", "rewardWithAmount"]);
    if (!opt.needsAmount) dispatch(closeDropdown());
  };

  const handleSaveRewardAmount = () => {
    if (!form.rewardWithAmount || Number(form.rewardWithAmount) <= 0) {
      setErrors((e) => ({
        ...e,
        rewardWithAmount: "Enter the bonus amount to continue",
      }));
      return;
    }
    clearErr(["rewardWithAmount"]);
    dispatch(closeDropdown());
  };

  const handleCancelRewardAmount = () => {
    patch({ rewardWith: "", rewardWithAmount: "" });
    dispatch(closeDropdown());
  };

  // ── Tier handlers ────────────────────────────────────────────────────────────
  const handleSaveTier = () => {
    if (!draftTier) {
      setErrors((e) => ({
        ...e,
        selectedTier: "Please select a commission tier",
      }));
      return;
    }
    patch({ selectedTier: draftTier });
    clearErr(["rewardWith", "selectedTier"]);
    setView("main");
  };

  const handleBackFromTier = () => {
    if (!form.selectedTier) patch({ rewardWith: "", selectedTier: "" });
    setView("main");
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    const evtOpt = REWARD_EVENT_OPTIONS.find(
      (o) => o.label === form.rewardEvent,
    );
    if (!form.rewardEvent) e.rewardEvent = "Please select a reward event";
    if (evtOpt?.needsAmount && !form.rewardEventAmount)
      e.rewardEventAmount = "Enter the sales target amount to continue";
    if (evtOpt?.needsPostsInput && !form.rewardEventCount)
      e.rewardEventCount = "Enter the posts count to continue";
    if (evtOpt?.needsPostsInput && !form.rewardEventDuration)
      e.rewardEventDuration = "Select a duration";
    if (!form.rewardWith) e.rewardWith = "Please select a reward type";
    if (selectedRewardOpt?.needsAmount && !form.rewardWithAmount)
      e.rewardWithAmount = "Enter the bonus amount to continue";
    if (selectedRewardOpt?.needsTier && !form.selectedTier)
      e.selectedTier = "Please select a commission tier";
    if (form.timeBound && !form.endDate) e.endDate = "Please pick an end date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit + close ───────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) return;
    console.log("Creating reward:", {
      event: eventDisplayValue,
      reward: rewardDisplayValue,
    });
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal());
    setForm(EMPTY_FORM);
    setErrors({});
    setView("main");
    setDraftTier("");
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        view === "tier-select"
          ? "Select a commission tier"
          : "Create your reward system"
      }
    >
      {/* ── Tier select panel ── */}
      {view === "tier-select" && (
        <TierSelectPanel
          selectedTier={draftTier}
          error={errors.selectedTier}
          onTierChange={(t) => {
            setDraftTier(t);
            clearErr(["selectedTier"]);
          }}
          onBack={handleBackFromTier}
          onSave={handleSaveTier}
        />
      )}

      {/* ── Main panel ── */}
      {view === "main" && (
        <div className="space-y-5">
          {/* Reward event dropdown */}
          <SmartDropdown
            label="Reward event"
            placeholder="Select an event"
            options={REWARD_EVENT_OPTIONS}
            selectedLabel={form.rewardEvent}
            displayValue={eventDisplayValue}
            form={form}
            amount={form.rewardEventAmount}
            amountError={errors.rewardEventAmount}
            postsCount={form.rewardEventCount}
            postsDuration={form.rewardEventDuration}
            postsCountError={errors.rewardEventCount}
            isOpen={activeDropdown === "event"}
            error={errors.rewardEvent}
            onToggle={() => dispatch(toggleDropdown("event"))}
            onSelect={handleSelectEvent}
            onAmountChange={(v) => {
              patch({ rewardEventAmount: v });
              clearErr(["rewardEventAmount"]);
            }}
            onAmountSave={handleSaveEventAmount}
            onAmountCancel={handleCancelEventAmount}
            onPostsCountChange={(v) => {
              patch({ rewardEventCount: v });
              clearErr(["rewardEventCount"]);
            }}
            onPostsDurationChange={(v: Duration) => {
              patch({ rewardEventDuration: v });
              clearErr(["rewardEventDuration"]);
            }}
            onPostsSave={handleSavePostsInput}
            onPostsCancel={handleCancelPostsInput}
          />

          {/* Reward with dropdown */}
          <div
            onMouseEnter={() => setRewardRowHovered(true)}
            onMouseLeave={() => setRewardRowHovered(false)}
          >
            <SmartDropdown
              label="Reward with"
              placeholder="Select a reward"
              options={REWARD_WITH_OPTIONS}
              selectedLabel={form.rewardWith}
              displayValue={rewardDisplayValue}
              form={form}
              amount={form.rewardWithAmount}
              amountError={errors.rewardWithAmount}
              postsCount=""
              postsDuration=""
              isOpen={activeDropdown === "reward"}
              error={errors.rewardWith}
              hoveredRow={rewardRowHovered}
              onToggle={() => dispatch(toggleDropdown("reward"))}
              onSelect={handleSelectReward}
              onAmountChange={(v) => {
                patch({ rewardWithAmount: v });
                clearErr(["rewardWithAmount"]);
              }}
              onAmountSave={handleSaveRewardAmount}
              onAmountCancel={handleCancelRewardAmount}
              onPostsCountChange={() => {}}
              onPostsDurationChange={() => {}}
              onPostsSave={() => {}}
              onPostsCancel={() => {}}
              onEditTier={() => {
                setDraftTier(form.selectedTier);
                setView("tier-select");
              }}
            />
          </div>

          {/* Is Onboarded → hint only, others → toggle */}
          {form.rewardEvent === "Is Onboarded" ? (
            <p className="text-xs text-gray-400 -mt-1">
              Choose an end date to stop this reward automatically.
            </p>
          ) : (
            <Toggle
              label="Make the reward time bound"
              hint="Choose an end date to stop this reward automatically."
              checked={form.timeBound}
              onChange={(val) => {
                patch({ timeBound: val, endDate: "" });
                dispatch(closeDropdown());
              }}
            />
          )}

          {/* End date picker */}
          {form.timeBound && (
            <EndDatePicker
              value={form.endDate}
              error={errors.endDate}
              onChange={(v) => {
                patch({ endDate: v });
                clearErr(["endDate"]);
              }}
              onError={(msg) => setErrors((e) => ({ ...e, endDate: msg }))}
            />
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isSubmitDisabled
                  ? "bg-pink-100 text-gray-300 cursor-not-allowed"
                  : "bg-pink-500 text-white hover:-translate-y-0.5",
              )}
            >
              Create Reward
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
