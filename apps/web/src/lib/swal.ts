import Swal, { type SweetAlertIcon, type SweetAlertResult } from 'sweetalert2';

/**
 * TrimOrg Custom SweetAlert2 theme config
 */
const customSwal = Swal.mixin({
  customClass: {
    popup:
      'rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 font-sans backdrop-blur-md',
    title: 'text-lg font-bold text-foreground tracking-tight',
    htmlContainer: 'text-sm text-muted-foreground mt-2',
    confirmButton:
      'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 mx-1.5 cursor-pointer',
    cancelButton:
      'inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mx-1.5 cursor-pointer',
    denyButton:
      'inline-flex items-center justify-center rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-danger/90 mx-1.5 cursor-pointer',
  },
  buttonsStyling: false,
});

export interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: SweetAlertIcon;
  isDangerous?: boolean;
}

/**
 * Show a sleek confirmation dialog returning true if confirmed, false if cancelled
 */
export async function showConfirm({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmText = 'Yes, confirm',
  cancelText = 'Cancel',
  icon = 'warning',
  isDangerous = true,
}: ConfirmOptions = {}): Promise<boolean> {
  const result: SweetAlertResult = await customSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    customClass: {
      popup:
        'rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 font-sans',
      title: 'text-lg font-bold text-foreground',
      htmlContainer: 'text-sm text-muted-foreground mt-2',
      confirmButton: isDangerous
        ? 'inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 mx-1.5 cursor-pointer transition-colors'
        : 'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mx-1.5 cursor-pointer transition-colors',
      cancelButton:
        'inline-flex items-center justify-center rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-foreground shadow-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mx-1.5 cursor-pointer transition-colors',
    },
  });

  return result.isConfirmed;
}

/**
 * Show a success modal alert
 */
export async function showSuccess(title: string, text?: string): Promise<SweetAlertResult> {
  return customSwal.fire({
    icon: 'success',
    title,
    text,
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

/**
 * Show an error modal alert
 */
export async function showError(title: string, text?: string): Promise<SweetAlertResult> {
  return customSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  });
}

/**
 * Show a warning modal alert
 */
export async function showWarning(title: string, text?: string): Promise<SweetAlertResult> {
  return customSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Understood',
  });
}

/**
 * Show a lightweight top-end toast
 */
export function showToast(title: string, icon: SweetAlertIcon = 'success') {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup:
        'rounded-xl border border-border bg-card text-foreground shadow-lg px-4 py-3 text-sm flex items-center gap-2 font-medium',
    },
  });

  return Toast.fire({
    icon,
    title,
  });
}

export default customSwal;
