import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function ServicePlanCard({ plan, onDelete }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{plan.theme}</h3>
      <p className="text-gray-600 text-sm mb-4">
        Created: {formatDate(plan.created_at.toDate())}
      </p>
      <div className="flex space-x-2">
        <Link
          href={`/plan/${plan.id}`}
          className="btn-primary text-sm"
        >
          View
        </Link>
        <button
          onClick={() => onDelete(plan.id)}
          className="btn-secondary text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
