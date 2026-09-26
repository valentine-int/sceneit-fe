import React, { useState } from 'react';

const REASON_PRESETS = [
  'Spam or advertising',
  'Harassment or hate speech',
  'Spoiler without warning',
  'Inappropriate content',
  'Other',
];

function ReportReviewModal({ isOpen, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState(REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedReason(REASON_PRESETS[0]);
    setCustomReason('');
    setErrorMessage('');
    onClose();
  };

  const handleSubmit = async () => {
    const reason = selectedReason === 'Other' ? customReason.trim() : selectedReason;
    if (!reason || reason.length < 3) {
      setErrorMessage('Please provide a reason (at least 3 characters).');
      return;
    }
    try {
      setErrorMessage('');
      setIsSubmitting(true);
      await onSubmit(reason);
      handleClose();
    } catch (error) {
      console.error('REPORT REVIEW ERROR:', error);
      setErrorMessage(error.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[#F4F4F5] p-6 text-[#090A0F] shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 text-[#71717A] transition-colors hover:text-[#090A0F] disabled:opacity-50"
          aria-label="Close report dialog"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        <h2 className="text-xl font-bold pr-8">Report Review</h2>
        <p className="mt-1 text-sm text-[#71717A]">
          Tell us why you're reporting this review. Our team will take a look.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {REASON_PRESETS.map((reason) => (
            <label
              key={reason}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                selectedReason === reason
                  ? 'border-[#090A0F] bg-[#090A0F]/5'
                  : 'border-[#D4D4D8] hover:bg-[#090A0F]/5'
              }`}
            >
              <input
                type="radio"
                name="report-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="accent-[#090A0F]"
              />
              {reason}
            </label>
          ))}
        </div>

        {selectedReason === 'Other' && (
          <textarea
            rows="3"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Describe the issue..."
            className="mt-3 w-full resize-none rounded-lg border border-[#D4D4D8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#090A0F]"
          />
        )}

        {errorMessage && <p className="mt-3 text-xs text-red-500">{errorMessage}</p>}

        <div className="mt-5 flex justify-end gap-2 border-t border-[#E4E4E7] pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#71717A] transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportReviewModal;