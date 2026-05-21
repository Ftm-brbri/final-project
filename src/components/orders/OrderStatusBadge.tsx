import { getOrderStatusConfig } from "@/src/lib/orders-api";

type Props = {
  status: string;
  className?: string;
};

export default function OrderStatusBadge({ status, className = "" }: Props) {
  const config = getOrderStatusConfig(status);

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
