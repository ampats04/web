import { OrderStatus } from "~/types/enums";

/**
 * Set page title
 * @param title Page title
 */
export function setPageTitle(title: string) {
  document.title = `${title === "Home" ? "" : title + " | "} UC Main Computing Society of the Philippines - Students`;
}

/**
 * Get history length
 */
export function getHistoryLength() {
  const { state } = window.history;
  return state ? state.position : 0;
}
 
 /* 
 * Convert order status to label
 * @param status Generic status
 */
export function mapOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return "Pending Payment";
    case OrderStatus.COMPLETED:
      return "Completed";
    case OrderStatus.CANCELLED_BY_USER:
      return "Cancelled by user";
    case OrderStatus.CANCELLED_BY_ADMIN:
      return "Cancelled by admin";
    case OrderStatus.REMOVED:
      return "Removed";
    case OrderStatus.REJECTED:
      return "Rejected";
    default:
      return "Unknown";
  }
}

/**
 * Map year
 */
export function mapYear(year: number | string): string {
  if (typeof year === "string") {
    year = parseInt(year);
  }

  switch (year) {
    case 1:
      return "1st Year";
    case 2:
      return "2nd Year";
    case 3:
      return "3rd Year";
    case 4:
      return "4th Year";
    default:
      return "Unknown";
  }
}