type PaymentStatus = "to_execute" | "pending" | "done" | "cancelled";

const gatewayStatusMaps: Record<string, Record<string, PaymentStatus>> = {
  asaas: {
    DONE: "done",
    RECEIVED: "done",
    CONFIRMED: "done",
    PENDING: "pending",
    OVERDUE: "pending",
    CANCELLED: "cancelled",
    REFUNDED: "cancelled",
    CHARGEBACK: "cancelled",
  },
  anotherGateway: {
    SUCCESS: "done",
    FAILED: "cancelled",
    PENDING: "pending",
  },
};

export function mapGatewayStatusToLocalStatus(
  status: string,
  gatewayName: string = "asaas"
): PaymentStatus {
  const statusMap = gatewayStatusMaps[gatewayName];

  if (!statusMap) {
    throw new Error(`Unknown gateway: ${gatewayName}`);
  }

  return statusMap[status] || "pending";
}
