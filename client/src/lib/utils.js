import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function getCurrencySymbol(code) {
    switch (code) {
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'INR': return '₹';
        case 'JPY': return '¥';
        case 'CAD': return 'C$';
        case 'AUD': return 'A$';
        case 'USD': return '$';
        default: return '$';
    }
}
