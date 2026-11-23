export class NotificationFormatter {
  static formatTitle(itemTitle: string, diffDays: number): string {
    const urgencyPrefix = diffDays <= 3 ? '⚠️ ' : '📅 ';
    const dayLabel = diffDays === 1 ? '1 day' : `${diffDays} days`;
    return `${urgencyPrefix}Due in ${dayLabel}: ${itemTitle}`;
  }

  static formatBody(amount: number | null): string {
    const amountStr = amount != null
      ? `Rp ${Number(amount).toLocaleString('id-ID')}`
      : 'Rp 0';
    return `Payment of ${amountStr} is scheduled. Tap to review or mark as paid.`;
  }
}
