'use client';
import { ExternalLink, CheckCircle, FileText, MapPin } from 'lucide-react';

const CATEGORY_COLORS = {
  agriculture: 'text-green-400 bg-green-400/10 border-green-400/20',
  health: 'text-red-400 bg-red-400/10 border-red-400/20',
  housing: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  energy: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  employment: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  business: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  insurance: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  pension: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  education: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  banking: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  savings: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
  women_child: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  food: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const TYPE_ICONS = {
  cash: '💰',
  insurance: '🛡️',
  subsidy: '🏠',
  pension: '👴',
  loan: '🏦',
  wage: '⚒️',
  scholarship: '🎓',
  savings: '💹',
  credit: '💳',
  food: '🌾',
  banking: '🏛️',
  education: '📚',
};

export default function SchemeCard({ scheme, language = 'hi' }) {
  if (!scheme) return null;

  const trans = scheme.translations?.[language];
  const displayName = trans?.name || scheme.name;
  const displayDescription = trans?.description || scheme.benefit?.description;
  const displayHowToApply = trans?.howToApply || scheme.howToApply;

  const categoryColor = CATEGORY_COLORS[scheme.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  const benefitIcon = TYPE_ICONS[scheme.benefit?.type] || '✅';

  const formatBenefit = () => {
    const b = scheme.benefit;
    if (!b) return null;
    if (b.amount && b.type !== 'wage') {
      return `₹${b.amount.toLocaleString('en-IN')} ${b.frequency === 'yearly' ? '/year' : b.frequency === 'monthly' ? '/month' : ''}`;
    }
    if (b.type === 'wage') {
      return `₹${b.amount}/day`;
    }
    return null;
  };

  const benefitAmount = formatBenefit();

  return (
    <div className="bg-bharat-card border border-bharat-border rounded-2xl p-4 hover:border-bharat-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-bharat-green/5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColor}`}>
              {scheme.category.replace('_', ' ')}
            </span>
          </div>
          <h3 className="font-bold text-white text-base leading-tight">{displayName}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{scheme.fullName}</p>
        </div>
        <div className="text-3xl flex-shrink-0">{benefitIcon}</div>
      </div>

      {/* Benefit Amount - Highlighted */}
      {benefitAmount && (
        <div className="bg-bharat-green/10 border border-bharat-green/20 rounded-xl p-3 mb-3">
          <p className="text-bharat-green font-bold text-xl">{benefitAmount}</p>
          <p className="text-gray-300 text-xs mt-0.5">{scheme.benefit.description}</p>
        </div>
      )}
      {!benefitAmount && displayDescription && (
        <div className="bg-bharat-green/10 border border-bharat-green/20 rounded-xl p-3 mb-3">
          <p className="text-gray-200 text-sm">{displayDescription}</p>
        </div>
      )}

      {/* Documents needed */}
      {scheme.documents && scheme.documents.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText size={12} className="text-gray-400" />
            <span className="text-gray-400 text-xs font-medium">Documents needed:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {scheme.documents.slice(0, 4).map((doc, i) => (
              <span key={i} className="text-xs bg-bharat-muted/50 text-gray-300 px-2 py-0.5 rounded-full">
                {doc}
              </span>
            ))}
            {scheme.documents.length > 4 && (
              <span className="text-xs text-gray-500">+{scheme.documents.length - 4} more</span>
            )}
          </div>
        </div>
      )}

      {/* How to apply */}
      {displayHowToApply && (
        <div className="flex items-start gap-1.5 mb-3">
          <CheckCircle size={12} className="text-bharat-green mt-0.5 flex-shrink-0" />
          <p className="text-gray-300 text-xs leading-relaxed">{displayHowToApply}</p>
        </div>
      )}

      {/* Website link */}
      {scheme.website && (
        <a
          href={scheme.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-bharat-green text-xs hover:text-bharat-darkgreen transition-colors mt-2"
        >
          <ExternalLink size={11} />
          <span>Apply / Learn more</span>
        </a>
      )}
    </div>
  );
}
