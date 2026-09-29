import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { CheckCircle2, XCircle, ArrowLeft, BookOpen, Check, Award } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const DetailedSolutionsPage = ({ attemptId, onBack }) => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/results/${attemptId}/solutions`);
      if (res.success) setSolutions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [attemptId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading step-by-step solutions...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back to Results
        </Button>
        <span className="text-xs font-bold text-slate-500">
          Total {solutions.length} Question Solutions
        </span>
      </div>

      <div className="space-y-6">
        {solutions.map((item, idx) => {
          const isCorrect = !!item.is_correct;
          const userSelected = item.selected_option;
          const correctOpt = item.correct_option;

          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    Question {idx + 1}
                  </span>
                  <Badge variant={item.difficulty} size="sm">
                    {item.difficulty?.toUpperCase()}
                  </Badge>
                  {item.subject_name && (
                    <span className="text-xs font-semibold text-slate-500">{item.subject_name}</span>
                  )}
                </div>

                <div>
                  <Badge variant={isCorrect ? 'success' : userSelected ? 'danger' : 'default'} size="sm">
                    {isCorrect ? 'CORRECT (+1.0)' : userSelected ? 'INCORRECT' : 'NOT ANSWERED (0.0)'}
                  </Badge>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                {item.question_text}
              </h3>

              {/* 4 MCQ Options */}
              <div className="space-y-2.5">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const text = item[`option_${opt.toLowerCase()}`];
                  const isUserPick = userSelected === opt;
                  const isThisCorrect = correctOpt === opt;

                  let cardStyle = 'border-slate-200 bg-white text-slate-800';
                  if (isThisCorrect) {
                    cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                  } else if (isUserPick && !isThisCorrect) {
                    cardStyle = 'border-rose-400 bg-rose-50/60 text-rose-950 font-bold';
                  }

                  return (
                    <div
                      key={opt}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs ${
                            isThisCorrect
                              ? 'bg-emerald-600 text-white'
                              : isUserPick
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt}
                        </span>
                        <span>{text}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isThisCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> Correct Answer
                          </span>
                        )}
                        {isUserPick && !isThisCorrect && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
                            Your Selection
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step-by-Step Explanation */}
              {item.explanation && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">
                    Step-by-Step Mathematical & Conceptual Solution:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {item.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
