export function urgencyBadgeVariant(urgency: string): 'teal' | 'urgent' | 'featured' {
  if (urgency === 'Critical') return 'urgent';
  if (urgency === 'Urgent') return 'featured';
  return 'teal';
}
