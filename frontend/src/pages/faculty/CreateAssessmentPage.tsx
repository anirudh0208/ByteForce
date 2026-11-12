import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';
import { Assessment, Question, RubricCriterion } from '../../types';

export const CreateAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { addAssessment, showToast } = useGradeX();

  const [assessmentTitle, setAssessmentTitle] = useState('Neural Encoding & Synaptic Plasticity');
  const [courseCode, setCourseCode] = useState('COG-302');
  const [subject, setSubject] = useState('Cognitive Neuroscience');
  const [cohort, setCohort] = useState('Fall Cohort A (4th Year Honours)');
  const [dueDate, setDueDate] = useState('2026-10-24');
  const [activeStep, setActiveStep] = useState(2);
  const [gradingStrictness, setGradingStrictness] = useState<'Balanced' | 'Strict' | 'Lenient'>('Balanced');

  // Question state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      number: 1,
      title: 'Biophysical Basis of Long-Term Potentiation (LTP)',
      prompt: 'Explain the cellular mechanism of Long-Term Potentiation (LTP) in the CA1 hippocampal region, detailing the dual role of NMDA and AMPA receptor channels and subsequent retrograde signaling.',
      benchmarkAnswer: `High-frequency stimulation releases glutamate which initially binds to post-synaptic AMPA receptors, causing local sodium (Na+) influx and depolarizing the dendritic membrane to dispel the magnesium (Mg2+) block from NMDA receptors.

Unblocked NMDA receptors allow rapid calcium (Ca2+) influx, which activates CaMKII to insert additional AMPA receptors into the post-synaptic membrane for enhanced conductivity.

Sustained calcium influx triggers retrograde nitric oxide (NO) signaling back to the presynaptic terminal, increasing long-term neurotransmitter release.`,
      maxMarks: 15,
      criteria: [
        {
          id: 'c1',
          name: 'Receptor Activation',
          description: 'Clearly explains that AMPA receptor-mediated sodium influx is required to depolarize the membrane and remove the magnesium block from NMDA channels.',
          maxMarks: 5
        },
        {
          id: 'c2',
          name: 'Calcium Cascade',
          description: 'Mentions Ca2+ influx activating CaMKII for receptor trafficking and AMPAR insertion.',
          maxMarks: 5
        },
        {
          id: 'c3',
          name: 'Retrograde Signaling',
          description: 'Identifies retrograde messengers (Nitric Oxide) diffusing back to enhance presynaptic vesicle release probability.',
          maxMarks: 5
        }
      ]
    },
    {
      id: 'q2',
      number: 2,
      title: 'Early vs. Late Phase Molecular Transitions',
      prompt: 'Compare and contrast early-phase LTP (E-LTP) with late-phase LTP (L-LTP), identifying the transcriptional factors and structural synaptic modifications involved.',
      benchmarkAnswer: 'E-LTP relies solely on post-translational modifications of pre-existing proteins and lasts 1-3 hours without protein synthesis. L-LTP requires adenylyl cyclase activation, cAMP elevation, PKA nuclear translocation, and CREB-1 phosphorylation, driving de novo gene transcription, protein synthesis, and spine enlargement.',
      maxMarks: 10,
      criteria: [
        {
          id: 'c4',
          name: 'Protein Synthesis Dependence',
          description: 'Distinguishes post-translational modification in E-LTP from de novo transcription/translation in L-LTP.',
          maxMarks: 5
        },
        {
          id: 'c5',
          name: 'Transcriptional Regulators',
          description: 'Identifies CREB-1, PKA signaling, and dendritic spine structural remodeling.',
          maxMarks: 5
        }
      ]
    },
    {
      id: 'q3',
      number: 3,
      title: 'Morris Water Maze Behavioral Pharmacology',
      prompt: 'Design an experiment evaluating the behavioral impact of AP5 (NMDA antagonist) administration on Morris water maze acquisition trials versus memory retention probes.',
      benchmarkAnswer: 'AP5 administered intrahippocampally prior to acquisition trials impairs escape latency reduction and spatial learning in the Morris water maze without affecting baseline swimming speed. Probe trials reveal lack of quadrant bias for the trained platform location. Administration post-training does not disrupt established retention, proving NMDA receptors are necessary for induction but not expression of spatial memory traces.',
      maxMarks: 25,
      criteria: [
        {
          id: 'c6',
          name: 'Experimental Design & Controls',
          description: 'Appropriate vehicle controls, cannulation site verification, and sensory/motor swim baseline measurements.',
          maxMarks: 10
        },
        {
          id: 'c7',
          name: 'Acquisition vs. Retention Dissection',
          description: 'Distinction between training phase infusion and post-training retention probe testing.',
          maxMarks: 10
        },
        {
          id: 'c8',
          name: 'Mechanistic Interpretation',
          description: 'Relating behavioural findings back to hippocampal LTP induction mechanisms.',
          maxMarks: 5
        }
      ]
    }
  ]);

  const [expandedQId, setExpandedQId] = useState<string>('q1');
  const [keyConcepts, setKeyConcepts] = useState<string[]>([
    'AMPA receptor depolarization',
    'Mg2+ block removal',
    'NMDA Ca2+ channel opening',
    'CaMKII enzyme activation',
    'Retrograde messenger NO'
  ]);
  const [newConceptInput, setNewConceptInput] = useState('');

  // Calculations
  const totalScore = questions.reduce((sum, q) => sum + q.maxMarks, 0);

  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const newQ: Question = {
      id: `q${Date.now()}`,
      number: nextNum,
      title: `Question ${nextNum}: Subjective Synthesis`,
      prompt: 'Enter prompt for student response here...',
      benchmarkAnswer: 'Provide the ideal reference answer / benchmark rubric here...',
      maxMarks: 10,
      criteria: [
        {
          id: `c_${Date.now()}_1`,
          name: 'Core Concept Comprehension',
          description: 'Demonstrates deep conceptual understanding of the prompt topic.',
          maxMarks: 5
        },
        {
          id: `c_${Date.now()}_2`,
          name: 'Methodological Precision',
          description: 'Accurate terminology, analytical flow, and supportive reasoning.',
          maxMarks: 5
        }
      ]
    };
    setQuestions([...questions, newQ]);
    setExpandedQId(newQ.id);
    showToast(`Added Question ${nextNum}`, 'info');
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) {
      showToast('Assessment must contain at least 1 question', 'warning');
      return;
    }
    const filtered = questions.filter(q => q.id !== id).map((q, idx) => ({ ...q, number: idx + 1 }));
    setQuestions(filtered);
    if (expandedQId === id) {
      setExpandedQId(filtered[0]?.id || '');
    }
    showToast('Question removed', 'info');
  };

  const handleAddCriterion = (qId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qId) return q;
        const newCrit: RubricCriterion = {
          id: `crit_${Date.now()}`,
          name: 'New Specific Criterion',
          description: 'Specific observable elements the evaluator / AI should check.',
          maxMarks: 5
        };
        const updatedCriteria = [...q.criteria, newCrit];
        const newMax = updatedCriteria.reduce((sum, c) => sum + c.maxMarks, 0);
        return {
          ...q,
          criteria: updatedCriteria,
          maxMarks: newMax
        };
      })
    );
    showToast('Added rubric criterion', 'info');
  };

  const handleRemoveCriterion = (qId: string, cId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qId) return q;
        if (q.criteria.length <= 1) {
          showToast('Each question must have at least one rubric criterion', 'warning');
          return q;
        }
        const updatedCriteria = q.criteria.filter(c => c.id !== cId);
        const newMax = updatedCriteria.reduce((sum, c) => sum + c.maxMarks, 0);
        return {
          ...q,
          criteria: updatedCriteria,
          maxMarks: newMax
        };
      })
    );
  };

  const handleAddConcept = () => {
    if (!newConceptInput.trim()) return;
    setKeyConcepts([...keyConcepts, newConceptInput.trim()]);
    setNewConceptInput('');
    showToast('Added concept keyword', 'info');
  };

  const handleSaveDraft = () => {
    showToast('Draft assessment saved successfully', 'info');
  };

  const handlePublish = () => {
    const newAsmt: Assessment = {
      id: `asmt-${Date.now()}`,
      code: courseCode,
      title: assessmentTitle,
      subject: subject,
      cohort: cohort,
      dueDate: dueDate,
      totalMarks: totalScore,
      questionsCount: questions.length,
      submissionsCount: 0,
      totalEnrolled: 48,
      gradedCount: 0,
      pendingReviewCount: 0,
      status: 'Published',
      averageScore: 0,
      estimatedGradingSpeed: '~1.2s per script',
      questions: questions
    };
    addAssessment(newAsmt);
    navigate('/faculty/submissions');
  };

  return (
    <div className="w-full rounded-2xl bg-surface border border-border min-h-[calc(100vh-134px)] p-4 md:p-6 shadow-[0_4px_20px_-2px_rgba(39,37,34,0.04)]">
      <div className="flex flex-col w-full">
        {/* Stepper / Stage Flow */}
        <div className="w-full bg-surface-soft p-space-md rounded-xl mb-space-lg">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-7 h-7 rounded-full bg-success text-white flex items-center justify-center font-label-sm shadow-sm">
                <MaterialIcon name="check" className="text-[16px]" />
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider">Step 01</span>
                <span className="font-title-sm text-sm text-ink font-semibold">Assessment Details</span>
              </div>
            </div>
            <div className="h-0.5 w-12 bg-blue-border shrink-0 hidden sm:block"></div>

            <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-pale rounded-full shrink-0">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-label-sm text-xs font-bold">
                2
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-title-sm text-sm text-on-primary-container font-semibold">
                  Questions & Reference Answers
                </span>
              </div>
            </div>
            <div className="h-0.5 w-12 bg-border shrink-0 hidden sm:block"></div>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full shrink-0 opacity-70">
              <span className="w-6 h-6 rounded-full bg-surface-container-high text-text-secondary flex items-center justify-center font-label-sm text-xs">
                3
              </span>
              <span className="font-body-md text-sm text-text-secondary">Rubric Calibration</span>
            </div>
            <div className="h-0.5 w-12 bg-border shrink-0 hidden sm:block"></div>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full shrink-0 opacity-70">
              <span className="w-6 h-6 rounded-full bg-surface-container-high text-text-secondary flex items-center justify-center font-label-sm text-xs">
                4
              </span>
              <span className="font-body-md text-sm text-text-secondary">AI Ingestion Test</span>
            </div>
          </div>
        </div>

        {/* Assessment Metadata Card */}
        <div className="bg-surface-soft rounded-2xl p-space-lg mb-space-lg border border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <span className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider block mb-1">
                Assessment Title
              </span>
              <input
                type="text"
                value={assessmentTitle}
                onChange={e => setAssessmentTitle(e.target.value)}
                className="w-full bg-surface text-ink font-headline-md text-xl md:text-2xl font-bold rounded-xl px-3.5 py-2 border border-border focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider mb-1">
                  Course Code
                </span>
                <input
                  type="text"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  className="w-28 bg-surface text-ink font-semibold rounded-xl px-3 py-2 border border-border focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider mb-1">
                  Subject Domain
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="bg-surface text-ink font-semibold rounded-xl px-3 py-2 border border-border focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/60">
            <div>
              <span className="text-text-secondary text-xs block mb-1">Target Cohort</span>
              <input
                type="text"
                value={cohort}
                onChange={e => setCohort(e.target.value)}
                className="w-full bg-surface text-sm text-ink rounded-lg px-2.5 py-1.5 border border-border"
              />
            </div>
            <div>
              <span className="text-text-secondary text-xs block mb-1">Submission Deadline</span>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-surface text-sm text-ink rounded-lg px-2.5 py-1.5 border border-border"
              />
            </div>
            <div>
              <span className="text-text-secondary text-xs block mb-1">Evaluation AI Strictness</span>
              <div className="flex items-center gap-1">
                {(['Lenient', 'Balanced', 'Strict'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setGradingStrictness(mode)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      gradingStrictness === mode
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface text-text-secondary hover:text-ink'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Section Intro */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-headline-sm text-2xl font-bold text-ink">Assessment Questions & Criteria</h2>
            <p className="font-body-sm text-sm text-text-secondary">
              Configure subjective prompts, ideal benchmark responses, and granular rubric weighting for AI grading.
            </p>
          </div>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-pale text-on-primary-container rounded-xl font-label-md font-semibold text-xs border border-blue-border hover:bg-blue-primary/30 transition-all shadow-xs"
          >
            <MaterialIcon name="add_circle" className="text-[18px]" />
            <span>Add Question</span>
          </button>
        </div>

        {/* QUESTIONS LIST */}
        <div className="flex flex-col gap-space-lg mb-space-xl">
          {questions.map(q => {
            const isExpanded = expandedQId === q.id;

            return (
              <div
                key={q.id}
                className="bg-surface rounded-2xl border border-border p-space-lg shadow-sm transition-all"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4 pb-space-md border-b border-border">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-blue-pale text-primary flex items-center justify-center font-title-sm text-title-sm shrink-0 font-bold">
                      Q{q.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-soft font-label-sm text-xs text-text-secondary font-medium">
                          Subjective Synthesis
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-gold-soft text-gold-primary font-label-sm text-xs font-semibold">
                          {subject}
                        </span>
                      </div>
                      {isExpanded ? (
                        <textarea
                          rows={2}
                          value={q.prompt}
                          onChange={e => {
                            const val = e.target.value;
                            setQuestions(prev => prev.map(item => (item.id === q.id ? { ...item, prompt: val } : item)));
                          }}
                          className="w-full bg-surface-soft text-ink font-body-lg text-sm md:text-base rounded-xl p-3 focus:outline-none focus:bg-white resize-none leading-relaxed border border-border"
                        />
                      ) : (
                        <p className="text-ink font-body-md font-medium line-clamp-1">{q.prompt}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-soft rounded-xl border border-border">
                      <span className="font-label-sm text-xs text-text-secondary">Total:</span>
                      <span className="font-title-sm text-sm font-bold text-ink">{q.maxMarks}</span>
                      <span className="font-label-sm text-xs text-text-secondary">Marks</span>
                    </div>
                    <button
                      onClick={() => setExpandedQId(isExpanded ? '' : q.id)}
                      className="p-2 rounded-lg text-text-secondary hover:text-ink hover:bg-surface-soft transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <MaterialIcon name={isExpanded ? 'expand_less' : 'expand_more'} className="text-[20px]" />
                    </button>
                    {questions.length > 1 && (
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                        title="Remove Question"
                      >
                        <MaterialIcon name="delete" className="text-[20px]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* EXPANDED QUESTION CONTENT */}
                {isExpanded && (
                  <div className="mt-space-md">
                    {/* Left & Right Benchmark Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg my-space-md">
                      {/* Left: Sample Answer */}
                      <div className="lg:col-span-8 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-title-sm text-sm text-ink font-semibold">
                            Benchmark Reference Answer
                          </span>
                          <span className="font-label-sm text-xs text-text-secondary">
                            Used by AI as gold standard
                          </span>
                        </div>
                        <textarea
                          rows={6}
                          value={q.benchmarkAnswer}
                          onChange={e => {
                            const val = e.target.value;
                            setQuestions(prev =>
                              prev.map(item => (item.id === q.id ? { ...item, benchmarkAnswer: val } : item))
                            );
                          }}
                          className="w-full bg-surface-soft rounded-xl p-space-md border border-border text-ink font-body-md text-sm leading-relaxed focus:outline-none focus:bg-white resize-y"
                        />
                        <div className="flex items-center justify-between text-text-secondary font-label-sm text-xs px-1">
                          <span>Recommended Length: ~180–300 words</span>
                          <span className="text-primary font-medium">Automatic Semantic Alignment Active</span>
                        </div>
                      </div>

                      {/* Right: Key Concepts to Check For */}
                      <div className="lg:col-span-4 bg-surface-soft rounded-xl p-space-md border border-border flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-title-sm text-sm text-ink font-semibold">
                              Key Concepts to Check For
                            </span>
                            <span className="px-2 py-0.5 bg-blue-pale text-primary rounded-full font-label-sm text-[10px] font-semibold">
                              Auto-Check
                            </span>
                          </div>
                          <p className="font-body-sm text-xs text-text-secondary mb-3">
                            Mandatory conceptual anchors required in student responses:
                          </p>
                          <ul className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                            {keyConcepts.map((kc, idx) => (
                              <li
                                key={idx}
                                className="flex items-center justify-between px-2.5 py-1.5 bg-surface rounded-lg border border-border/80 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  <span className="font-medium text-ink">{kc}</span>
                                </div>
                                <button
                                  onClick={() => setKeyConcepts(keyConcepts.filter((_, i) => i !== idx))}
                                  className="text-text-secondary hover:text-danger"
                                >
                                  <MaterialIcon name="close" className="text-[14px]" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Add Concept Input */}
                        <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add concept keyword..."
                            value={newConceptInput}
                            onChange={e => setNewConceptInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddConcept()}
                            className="flex-1 bg-surface text-xs text-ink rounded-lg px-2.5 py-1.5 border border-border focus:outline-none"
                          />
                          <button
                            onClick={handleAddConcept}
                            className="p-1.5 rounded-lg bg-primary text-white hover:bg-blue-deep transition-all"
                          >
                            <MaterialIcon name="add" className="text-[16px]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Clean Rubric Criteria Table */}
                    <div className="mt-space-md pt-space-md border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-title-sm text-sm text-ink font-semibold">Rubric Criteria</span>
                          <span className="font-label-sm text-xs text-text-secondary">
                            ({q.criteria.length} criteria · {q.maxMarks} Marks total)
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddCriterion(q.id)}
                          className="flex items-center gap-1 text-primary hover:underline font-label-md text-xs font-semibold"
                        >
                          <MaterialIcon name="add" className="text-[16px]" />
                          <span>Add Criterion</span>
                        </button>
                      </div>

                      <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
                        <table className="w-full text-left">
                          <thead className="bg-surface-soft text-text-secondary font-label-sm text-xs uppercase tracking-wider border-b border-border">
                            <tr>
                              <th className="py-2.5 px-4 w-[25%]">Criterion</th>
                              <th className="py-2.5 px-4 w-[15%]">Points</th>
                              <th className="py-2.5 px-4 w-[50%]">Description & Key Requirements</th>
                              <th className="py-2.5 px-4 w-[10%] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40 text-ink font-body-sm text-xs md:text-sm">
                            {q.criteria.map(crit => (
                              <tr key={crit.id} className="hover:bg-surface-soft/60 transition-colors">
                                <td className="py-3 px-4 align-top">
                                  <input
                                    type="text"
                                    value={crit.name}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setQuestions(prev =>
                                        prev.map(item => {
                                          if (item.id !== q.id) return item;
                                          return {
                                            ...item,
                                            criteria: item.criteria.map(c =>
                                              c.id === crit.id ? { ...c, name: val } : c
                                            )
                                          };
                                        })
                                      );
                                    }}
                                    className="font-title-sm text-xs md:text-sm font-semibold text-ink bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none w-full"
                                  />
                                </td>
                                <td className="py-3 px-4 align-top">
                                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-surface-soft rounded-lg border border-border">
                                    <input
                                      type="number"
                                      min={1}
                                      max={50}
                                      value={crit.maxMarks}
                                      onChange={e => {
                                        const num = Number(e.target.value);
                                        setQuestions(prev =>
                                          prev.map(item => {
                                            if (item.id !== q.id) return item;
                                            const updatedCrit = item.criteria.map(c =>
                                              c.id === crit.id ? { ...c, maxMarks: num } : c
                                            );
                                            const newTotal = updatedCrit.reduce((s, c) => s + c.maxMarks, 0);
                                            return {
                                              ...item,
                                              criteria: updatedCrit,
                                              maxMarks: newTotal
                                            };
                                          })
                                        );
                                      }}
                                      className="w-10 text-center bg-transparent font-bold text-ink focus:outline-none"
                                    />
                                    <span className="text-text-secondary text-[11px]">pts</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 align-top">
                                  <textarea
                                    rows={2}
                                    value={crit.description}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setQuestions(prev =>
                                        prev.map(item => {
                                          if (item.id !== q.id) return item;
                                          return {
                                            ...item,
                                            criteria: item.criteria.map(c =>
                                              c.id === crit.id ? { ...c, description: val } : c
                                            )
                                          };
                                        })
                                      );
                                    }}
                                    className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none text-xs md:text-sm resize-none"
                                  />
                                </td>
                                <td className="py-3 px-4 align-top text-right">
                                  <button
                                    onClick={() => handleRemoveCriterion(q.id, crit.id)}
                                    className="p-1 rounded text-text-secondary hover:text-danger hover:bg-danger/10"
                                    title="Delete Criterion"
                                  >
                                    <MaterialIcon name="delete" className="text-[18px]" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Question CTA Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-space-md bg-surface-container-low rounded-2xl mb-space-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-pale text-primary flex items-center justify-center shrink-0">
              <MaterialIcon name="library_add" className="text-[24px]" />
            </div>
            <div>
              <span className="font-title-sm text-sm text-ink block font-semibold">
                Need to append additional assessment items?
              </span>
              <span className="font-body-sm text-xs text-text-secondary">
                Choose standard essay, short synthesis, or multi-part analytical questions.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => showToast('AI Syllabus parser generated 2 suggested questions', 'info')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-surface text-ink hover:bg-surface-soft rounded-xl font-label-md text-xs font-semibold border border-border transition-colors shadow-xs"
            >
              <MaterialIcon name="auto_awesome" className="text-[16px] text-primary" />
              <span>AI Generate from Syllabus</span>
            </button>
            <button
              onClick={handleAddQuestion}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white hover:bg-blue-deep rounded-xl font-label-md text-xs font-semibold transition-all shadow-xs"
            >
              <MaterialIcon name="add_circle" className="text-[16px]" />
              <span>Add Question Item</span>
            </button>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="sticky bottom-4 z-30 w-full mt-auto">
          <div className="bg-surface/95 backdrop-blur-md rounded-2xl p-space-md shadow-xl border border-border flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Live Metrics Summary */}
            <div className="flex flex-wrap items-center gap-4 text-ink font-body-sm text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                <span className="font-title-sm font-semibold text-ink">{questions.length} Questions Configured</span>
              </div>
              <span className="text-text-secondary">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-text-secondary">Total Score:</span>
                <span className="font-title-sm text-primary font-bold">{totalScore} Marks</span>
              </div>
              <span className="text-text-secondary">·</span>
              <div className="flex items-center gap-1.5 text-text-secondary">
                <MaterialIcon name="speed" className="text-gold-primary text-[18px]" />
                <span>
                  Estimated AI Grading Speed: <strong className="text-ink font-semibold">~1.2s per script</strong>
                </span>
              </div>
            </div>

            {/* Action Button Group */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded-xl bg-surface text-ink hover:bg-surface-soft font-label-md text-xs font-semibold border border-border transition-colors shadow-xs"
              >
                Save Draft
              </button>
              <button
                onClick={() => showToast('Simulating evaluation against gold benchmark...', 'info')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-soft text-ink hover:bg-surface-container-high font-label-md text-xs font-semibold border border-border transition-colors shadow-xs"
              >
                <MaterialIcon name="science" className="text-primary text-[16px]" />
                <span>Test with Sample</span>
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-blue-deep font-label-md text-xs font-semibold transition-all shadow-md"
              >
                <MaterialIcon name="publish" className="text-[18px]" />
                <span>Publish Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

