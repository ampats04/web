// Tutorial Status
export enum TutorialStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  DONE = "Done"
}

// Order status
export enum OrderStatus {
  PENDING_PAYMENT = 1,
  COMPLETED = 2,
  CANCELLED_BY_USER = 3,
  CANCELLED_BY_ADMIN = 4,
  REMOVED = 5,
  REJECTED = 6,
}

// Mode of payments
export enum ModeOfPayment {
  WALK_IN = 1,
  GCASH = 2
}
