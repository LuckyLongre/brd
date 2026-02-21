import { useEffect } from 'react';

export function Modal({ children, onClose }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="relative">{children}</div>
        </div>
    );
}

export function LoadingModal({ message = 'Processing...' }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-sm w-full mx-4">
                <div className="flex flex-col items-center">
                    <div
                        className="w-16 h-16 border-4 rounded-full animate-spin mb-4"
                        style={{ borderColor: '#2563EB', borderTopColor: 'transparent' }}
                    />
                    <p className="text-lg font-medium" style={{ color: '#111827' }}>
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function ErrorModal({ title = 'Error', message, onClose }) {
    return (
        <Modal onClose={onClose}>
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-sm w-full">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2' }}>
                        <svg className="w-8 h-8" style={{ color: '#DC2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>{title}</h3>
                    <p className="mb-6" style={{ color: '#6B7280' }}>{message}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#2563EB' }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export function SuccessModal({ title = 'Success', message, onClose }) {
    return (
        <Modal onClose={onClose}>
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-sm w-full">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                        <svg className="w-8 h-8" style={{ color: '#16A34A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>{title}</h3>
                    <p className="mb-6" style={{ color: '#6B7280' }}>{message}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#2563EB' }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <Modal onClose={onCancel}>
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#111827' }}>{title}</h3>
                <p className="mb-6" style={{ color: '#6B7280' }}>{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg border font-medium transition-colors hover:bg-gray-50"
                        style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#2563EB' }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
}
