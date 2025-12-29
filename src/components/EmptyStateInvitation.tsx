import { MousePointerClick, ArrowLeft } from 'lucide-react';

interface EmptyStateInvitationProps {
  module: 'intelligence' | 'scenario';
}

export function EmptyStateInvitation({ module }: EmptyStateInvitationProps) {
  const config = {
    intelligence: {
      title: 'No Stock Selected',
      description: 'Pick a candidate from The Board to begin your analysis.',
      icon: MousePointerClick,
      gradient: 'from-indigo-500 to-purple-600',
      lightGradient: 'from-indigo-50 to-purple-50'
    },
    scenario: {
      title: 'Ready to Model a Trade',
      description: 'Pick a candidate from The Board to begin your simulation.',
      icon: ArrowLeft,
      gradient: 'from-purple-500 to-pink-600',
      lightGradient: 'from-purple-50 to-pink-50'
    }
  };

  const { title, description, icon: Icon, gradient, lightGradient } = config[module];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className={`bg-gradient-to-br ${lightGradient} p-12 sm:p-16 text-center`}>
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Visual Hint */}
          <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <p className="text-sm text-slate-700">
                Click any stock on <span className="font-semibold text-indigo-600">The Board</span> to get started
              </p>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 justify-center text-sm text-slate-500">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span>Look for scores above 85 for highest probability</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-sm text-slate-500">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span>Filter by index for targeted opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
