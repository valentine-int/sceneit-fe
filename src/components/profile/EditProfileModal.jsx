import React from 'react';

function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = React.useState(user?.name || '');
  const [bio, setBio] = React.useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || '');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setBio(user?.bio || '');
      setAvatarUrl(user?.avatarUrl || '');
      setErrorMessage('');
    }
  }, [isOpen, user]);

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }
    try {
      setErrorMessage('');
      setIsSaving(true);
      await onSave({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      onClose();
    } catch (error) {
      console.error('EDIT PROFILE ERROR:', error);
      setErrorMessage(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#F4F4F5] p-6 text-[#090A0F] shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          className="absolute right-5 top-5 text-[#71717A] transition-colors hover:text-[#090A0F] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close edit profile"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        <h2 className="text-2xl font-bold pr-10">Edit Profile</h2>
        <p className="mt-1 text-sm text-[#71717A]">Update your profile information.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorMessage(''); }}
              disabled={isSaving}
              className="w-full rounded-lg border border-[#D4D4D8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#090A0F]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSaving}
              placeholder="Tell others about yourself..."
              className="w-full resize-none rounded-lg border border-[#D4D4D8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#090A0F]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              disabled={isSaving}
              placeholder="https://..."
              className="w-full rounded-lg border border-[#D4D4D8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#090A0F]"
            />
          </div>
        </div>

        {errorMessage && <p className="mt-3 text-xs text-red-500">{errorMessage}</p>}

        <div className="mt-6 flex justify-end border-t border-[#E4E4E7] pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-[#090A0F] px-5 py-2 text-sm font-semibold text-[#F4F4F5] transition-colors hover:bg-[#27272A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;