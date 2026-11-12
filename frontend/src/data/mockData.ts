import { Assessment, StudentSubmission, AnalyticsSummary } from '../types';

export const initialAssessments: Assessment[] = [
  {
    id: 'asmt-1',
    code: 'COG-302',
    title: 'Neural Encoding & Synaptic Plasticity',
    subject: 'Cognitive Neuroscience',
    cohort: 'Fall Cohort A (4th Year Honours)',
    dueDate: 'Oct 24, 2026',
    totalMarks: 50,
    questionsCount: 3,
    submissionsCount: 48,
    totalEnrolled: 52,
    gradedCount: 48,
    pendingReviewCount: 14,
    status: 'Grading',
    averageScore: 78.4,
    estimatedGradingSpeed: '~1.2s per script',
    questions: [
      {
        id: 'q1',
        number: 1,
        title: 'Biophysical Basis of Long-Term Potentiation (LTP)',
        prompt: 'Explain the biophysical basis of Long-Term Potentiation (LTP) in the CA1 hippocampus, focusing on NMDA receptor kinetics, Mg2+ unblock, and downstream CaMKII cascade activation.',
        benchmarkAnswer: 'Sufficient post-synaptic depolarization via AMPA receptor activation expels the Mg2+ block from the NMDA receptor pore. Ca2+ influx activates calmodulin, which stimulates CaMKII autophosphorylation at Thr286. CaMKII phosphorylates existing AMPA receptors (enhancing single-channel conductance) and drives exocytosis of GluA1-containing AMPARs into the postsynaptic density.',
        maxMarks: 15,
        criteria: [
          {
            id: 'c1',
            name: 'Receptor Channel Kinetics & Mg2+ Extrusion',
            description: 'Accurate description of baseline AMPA activation, post-synaptic depolarization, and the voltage-dependent displacement of the magnesium block from NMDA channels.',
            maxMarks: 5
          },
          {
            id: 'c2',
            name: 'Secondary Messenger Cascades & CaMKII Activation',
            description: 'Clear breakdown of calcium influx through NMDA channels, binding to calmodulin, and autonomous CaMKII autophosphorylation at Thr286.',
            maxMarks: 5
          },
          {
            id: 'c3',
            name: 'Retrograde Messenger Signaling',
            description: 'Explanation of retrograde messengers (e.g., Nitric Oxide or endocannabinoids) enhancing presynaptic neurotransmitter release probability.',
            maxMarks: 5
          }
        ]
      },
      {
        id: 'q2',
        number: 2,
        title: 'Early-Phase vs. Late-Phase LTP Transitions',
        prompt: 'Compare and contrast early-phase LTP (E-LTP) with late-phase LTP (L-LTP), identifying the transcriptional factors and structural synaptic modifications involved.',
        benchmarkAnswer: 'E-LTP relies solely on post-translational modifications of pre-existing proteins and lasts 1-3 hours without protein synthesis. L-LTP requires adenylyl cyclase activation, cAMP elevation, PKA nuclear translocation, and CREB-1 phosphorylation, driving de novo gene transcription, protein synthesis, and spine enlargement/perforated synapse formation.',
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
            name: 'Transcriptional Regulators & Structural Changes',
            description: 'Identifies CREB-1, PKA signaling, and dendritic spine structural remodeling.',
            maxMarks: 5
          }
        ]
      },
      {
        id: 'q3',
        number: 3,
        title: 'Behavioral Pharmacology & Spatial Memory Protocol',
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
    ]
  },
  {
    id: 'asmt-2',
    code: 'BIO-410',
    title: 'Advanced Synaptic Biophysics & Patch Clamp Analysis',
    subject: 'Neurobiology',
    cohort: 'Spring Senior Seminar',
    dueDate: 'Nov 02, 2026',
    totalMarks: 40,
    questionsCount: 4,
    submissionsCount: 36,
    totalEnrolled: 36,
    gradedCount: 36,
    pendingReviewCount: 3,
    status: 'Completed',
    averageScore: 82.1,
    estimatedGradingSpeed: '~1.4s per script',
    questions: []
  },
  {
    id: 'asmt-3',
    code: 'NEUR-201',
    title: 'Cellular Neuroscience Midterm Examination',
    subject: 'Cellular Neuroscience',
    cohort: 'Undergraduate Core B',
    dueDate: 'Nov 18, 2026',
    totalMarks: 60,
    questionsCount: 5,
    submissionsCount: 78,
    totalEnrolled: 80,
    gradedCount: 52,
    pendingReviewCount: 18,
    status: 'Published',
    averageScore: 74.6,
    estimatedGradingSpeed: '~1.1s per script',
    questions: []
  }
];

export const initialSubmissions: StudentSubmission[] = [
  {
    id: 'sub-1',
    studentId: 'STU-8821',
    studentName: 'Julian Vance',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 14:32',
    status: 'Needs Review',
    confidenceScore: 74,
    totalAiMarks: 39.5,
    totalFacultyMarks: undefined,
    maxPossibleMarks: 50,
    flagReason: 'Ambiguous terminology regarding retrograde nitric oxide diffusion in Q1; borderline score on Q2.',
    reviewed: false,
    answers: [
      {
        questionId: 'q1',
        questionNumber: 1,
        studentText: `During high-frequency tetanic stimulation of Schaffer collaterals, repetitive glutamate release causes substantial activation of AMPA receptors. The resulting inward sodium flux produces a strong post-synaptic depolarization in the dendritic spine.

This electrical change removes the voltage-dependent magnesium (Mg2+) ion block that obstructs the pore of NMDA receptors at resting membrane potentials (-70mV). Once relieved, extracellular calcium (Ca2+) flows rapidly into the post-synaptic density.

Within the spine, Ca2+ binds to calmodulin, forming the Ca2+/calmodulin complex which binds to CaMKII (calcium/calmodulin-dependent protein kinase II). This induces autophosphorylation of CaMKII at Threonine-286, locking the kinase into an autonomously active conformation that persists even after calcium levels recede.

CaMKII phosphorylates existing AMPA receptors (enhancing conductance) and facilitates trafficking and insertion of additional AMPA receptors into the postsynaptic membrane. Retrograde messengers like nitric oxide (NO) may also diffuse back to presynaptic terminals, though the precise mechanism of retrograde transport in this experiment remains partially debated.`,
        aiMarks: 13.5,
        facultyMarks: undefined,
        maxMarks: 15,
        correctConcepts: [
          'Tetanic stimulation',
          'AMPA depolarization',
          'Voltage-dependent Mg2+ expulsion',
          'Ca2+ influx via NMDA',
          'CaMKII autophosphorylation at Thr286',
          'AMPAR insertion/trafficking'
        ],
        missingConcepts: [
          'Detailed role of soluble guanylyl cyclase in retrograde NO target'
        ],
        strengths: [
          'Accurate description of NMDA voltage sensitivity and ion unblocking sequence',
          'Correct identification of Thr-286 autonomous phosphorylation site on CaMKII',
          'Clear logical progression from electrical to biochemical events'
        ],
        improvements: [
          'Clarify the presynaptic targets of nitric oxide (e.g. guanylyl cyclase activation and cGMP elevation)',
          'Mention the specific AMPA receptor subunits involved (GluA1 vs GluA2)'
        ],
        criteriaScores: [
          {
            criterionId: 'c1',
            criterionName: 'Receptor Channel Kinetics & Mg2+ Extrusion',
            marks: 5,
            maxMarks: 5,
            feedback: 'Thorough, accurate description of the voltage-dependent magnesium unblock mechanism under tetanic depolarization.'
          },
          {
            criterionId: 'c2',
            criterionName: 'Secondary Messenger Cascades & CaMKII Activation',
            marks: 4.5,
            maxMarks: 5,
            feedback: 'Excellent capture of Ca2+/calmodulin kinetics and Thr286 autophosphorylation. Minor omission of phosphatase interplay (PP1).'
          },
          {
            criterionId: 'c3',
            criterionName: 'Retrograde Messenger Signaling',
            marks: 4,
            maxMarks: 5,
            feedback: 'Identified nitric oxide diffusion; could specify cGMP second messenger pathway in the presynaptic terminal.'
          }
        ]
      },
      {
        questionId: 'q2',
        questionNumber: 2,
        studentText: `Early LTP persists for about 2 hours and does not require new protein translation, relying on phosphorylation of existing channels. In contrast, late-phase LTP lasts for days or weeks. Late LTP involves cAMP and PKA activation, leading to CREB phosphorylation in the cell nucleus, which drives gene expression for synaptic growth and spine enlargement.`,
        aiMarks: 8.5,
        facultyMarks: undefined,
        maxMarks: 10,
        correctConcepts: [
          'Translation independence in E-LTP',
          'PKA / CREB signaling in L-LTP',
          'De novo gene expression',
          'Spine structural changes'
        ],
        missingConcepts: [
          'Explicit mention of synaptic tagging and capture hypothesis'
        ],
        strengths: [
          'Correctly bifurcates timeframes and protein synthesis requirements',
          'Identifies CREB-mediated transcriptional control'
        ],
        improvements: [
          'Elaborate on structural remodeling such as mushroom spine maturation'
        ],
        criteriaScores: [
          {
            criterionId: 'c4',
            criterionName: 'Protein Synthesis Dependence',
            marks: 4.5,
            maxMarks: 5,
            feedback: 'Accurately articulated the distinction in translation dependence between phases.'
          },
          {
            criterionId: 'c5',
            criterionName: 'Transcriptional Regulators & Structural Changes',
            marks: 4.0,
            maxMarks: 5,
            feedback: 'Good recognition of CREB; missed synaptic tagging mechanism.'
          }
        ]
      },
      {
        questionId: 'q3',
        questionNumber: 3,
        studentText: `In this experiment, rats receive bilateral hippocampal cannula implants. Group 1 receives AP5 (NMDA competitive antagonist, 50uM) while Group 2 receives artificial CSF vehicle prior to daily Morris water maze acquisition trials. Over 5 training days, vehicle-treated rats show significant reductions in latency to reach the submerged platform, whereas AP5-treated rats continue searching randomly, displaying marked impairment in spatial learning.

On day 6, a 60-second probe trial is conducted without the platform. Control rats spend significantly more time in the target quadrant, whereas AP5 rats show no quadrant preference. In a separate retention cohort where AP5 was infused only after successful training, escape latency remained intact, demonstrating that NMDA activation is vital for learning acquisition rather than expression of consolidated memory.`,
        aiMarks: 17.5,
        facultyMarks: undefined,
        maxMarks: 25,
        correctConcepts: [
          'AP5 competitive antagonism of NMDA',
          'Vehicle control design',
          'Acquisition latency impairment',
          'Probe trial quadrant preference test',
          'Post-training retention dissection'
        ],
        missingConcepts: [
          'Sensorimotor swim speed control (visible platform task)',
          'Histological verification of cannula placement'
        ],
        strengths: [
          'Clear experimental groups and temporal separation of acquisition vs retention',
          'Probe trial protocol is described with appropriate behavioral metric'
        ],
        improvements: [
          'Must include a visible platform control test to rule out drug-induced visual or motor deficits',
          'Specify statistical testing strategy (two-way repeated measures ANOVA)'
        ],
        criteriaScores: [
          {
            criterionId: 'c6',
            criterionName: 'Experimental Design & Controls',
            marks: 7.0,
            maxMarks: 10,
            feedback: 'Solid cannula protocol, but missing visible platform control to eliminate sensory/locomotor confounds.'
          },
          {
            criterionId: 'c7',
            criterionName: 'Acquisition vs. Retention Dissection',
            marks: 7.5,
            maxMarks: 10,
            feedback: 'Good dual-cohort setup to delineate acquisition from retrieval phases.'
          },
          {
            criterionId: 'c8',
            criterionName: 'Mechanistic Interpretation',
            marks: 3.0,
            maxMarks: 5,
            feedback: 'Correctly linked lack of acquisition to NMDA LTP requirement.'
          }
        ]
      }
    ]
  },
  {
    id: 'sub-2',
    studentId: 'STU-8822',
    studentName: 'Maya Lin',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 15:10',
    status: 'Graded',
    confidenceScore: 96,
    totalAiMarks: 47.0,
    totalFacultyMarks: 47.0,
    maxPossibleMarks: 50,
    reviewed: true,
    reviewedBy: 'Prof. Eleanor Vance',
    reviewedAt: 'Oct 24, 2026',
    answers: [
      {
        questionId: 'q1',
        questionNumber: 1,
        studentText: 'Detailed and masterfully illustrated response covering the complete biophysical cascade of LTP induction in CA1 pyramidal neurons.',
        aiMarks: 14.5,
        facultyMarks: 14.5,
        maxMarks: 15,
        correctConcepts: ['All key biophysical and biochemical checkpoints included'],
        missingConcepts: [],
        strengths: ['Exemplary precision in ionic currents and phosphorylation mechanics'],
        improvements: ['Include diagrammatic pathway mapping'],
        criteriaScores: [
          { criterionId: 'c1', criterionName: 'Receptor Channel Kinetics & Mg2+ Extrusion', marks: 5, maxMarks: 5, feedback: 'Flawless analysis.' },
          { criterionId: 'c2', criterionName: 'Secondary Messenger Cascades & CaMKII Activation', marks: 5, maxMarks: 5, feedback: 'Comprehensive.' },
          { criterionId: 'c3', criterionName: 'Retrograde Messenger Signaling', marks: 4.5, maxMarks: 5, feedback: 'Strong coverage of NO and endocannabinoids.' }
        ]
      },
      {
        questionId: 'q2',
        questionNumber: 2,
        studentText: 'Masterful synthesis of transcription factors (CREB, C/EBP) and synaptic tagging and capture.',
        aiMarks: 9.5,
        facultyMarks: 9.5,
        maxMarks: 10,
        correctConcepts: ['Synaptic tagging', 'PKA-CREB', 'Mushroom spines', 'Protein synthesis'],
        missingConcepts: [],
        strengths: ['Exceptional depth on synaptic tagging hypothesis'],
        improvements: [],
        criteriaScores: [
          { criterionId: 'c4', criterionName: 'Protein Synthesis Dependence', marks: 5, maxMarks: 5, feedback: 'Perfect.' },
          { criterionId: 'c5', criterionName: 'Transcriptional Regulators & Structural Changes', marks: 4.5, maxMarks: 5, feedback: 'Outstanding.' }
        ]
      },
      {
        questionId: 'q3',
        questionNumber: 3,
        studentText: 'Impeccable behavioral protocol including visible platform control, swimming velocity tracking, and repeated measures ANOVA.',
        aiMarks: 23.0,
        facultyMarks: 23.0,
        maxMarks: 25,
        correctConcepts: ['Visible platform', 'AP5 microinfusion', 'Probe trial quadrant analysis', 'Dissociation of induction vs expression'],
        missingConcepts: [],
        strengths: ['Complete experimental rigor and statistical treatment'],
        improvements: [],
        criteriaScores: [
          { criterionId: 'c6', criterionName: 'Experimental Design & Controls', marks: 9.5, maxMarks: 10, feedback: 'Gold standard experimental controls.' },
          { criterionId: 'c7', criterionName: 'Acquisition vs. Retention Dissection', marks: 9.0, maxMarks: 10, feedback: 'Clear distinction between temporal phases.' },
          { criterionId: 'c8', criterionName: 'Mechanistic Interpretation', marks: 4.5, maxMarks: 5, feedback: 'Rigorous mechanistic synthesis.' }
        ]
      }
    ]
  },
  {
    id: 'sub-3',
    studentId: 'STU-8823',
    studentName: 'Marcus Chen',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 16:04',
    status: 'Needs Review',
    confidenceScore: 71,
    totalAiMarks: 34.0,
    totalFacultyMarks: undefined,
    maxPossibleMarks: 50,
    flagReason: 'Incomplete CaMKII phosphorylation cascade explanation; low score on experimental controls in Q3.',
    reviewed: false,
    answers: [
      {
        questionId: 'q1',
        questionNumber: 1,
        studentText: 'Glutamate activates AMPA receptors which depolarize the post-synaptic cell, knocking out the magnesium plug from NMDA channels. Calcium enters and triggers CaMKII, making the synapse stronger.',
        aiMarks: 10.0,
        facultyMarks: undefined,
        maxMarks: 15,
        correctConcepts: ['AMPA depolarization', 'Mg2+ unblock', 'Ca2+ influx', 'CaMKII involvement'],
        missingConcepts: ['Thr286 autophosphorylation', 'Calmodulin binding', 'Retrograde messengers'],
        strengths: ['Understands basic sequence of ion channel activation'],
        improvements: ['Needs molecular precision regarding CaMKII autonomous state'],
        criteriaScores: [
          { criterionId: 'c1', criterionName: 'Receptor Channel Kinetics & Mg2+ Extrusion', marks: 4, maxMarks: 5, feedback: 'Good conceptual grasp.' },
          { criterionId: 'c2', criterionName: 'Secondary Messenger Cascades & CaMKII Activation', marks: 3, maxMarks: 5, feedback: 'Missing Thr286 and calmodulin details.' },
          { criterionId: 'c3', criterionName: 'Retrograde Messenger Signaling', marks: 3, maxMarks: 5, feedback: 'Very brief.' }
        ]
      },
      {
        questionId: 'q2',
        questionNumber: 2,
        studentText: 'E-LTP is fast and doesn’t need proteins. L-LTP needs new RNA and proteins from the nucleus so the synapse stays big.',
        aiMarks: 7.0,
        facultyMarks: undefined,
        maxMarks: 10,
        correctConcepts: ['Protein synthesis difference', 'Nuclear transcription'],
        missingConcepts: ['CREB-1', 'PKA translocation', 'Spine morphology details'],
        strengths: ['Clear concise differentiation'],
        improvements: ['Specify transcriptional regulators and pathways'],
        criteriaScores: [
          { criterionId: 'c4', criterionName: 'Protein Synthesis Dependence', marks: 4, maxMarks: 5, feedback: 'Identified correct difference.' },
          { criterionId: 'c5', criterionName: 'Transcriptional Regulators & Structural Changes', marks: 3, maxMarks: 5, feedback: 'No specific transcription factors named.' }
        ]
      },
      {
        questionId: 'q3',
        questionNumber: 3,
        studentText: 'Rats were tested in a water maze with AP5 injected. They took longer to find the hidden platform than control rats. In probe trials they wandered everywhere without learning.',
        aiMarks: 17.0,
        facultyMarks: undefined,
        maxMarks: 25,
        correctConcepts: ['AP5 injection', 'Water maze test', 'Quadrant search deficit'],
        missingConcepts: ['Pre vs post training infusion', 'Visible platform control', 'Cannulation details'],
        strengths: ['Behavioral outcome correctly predicted'],
        improvements: ['Include proper vehicle controls and retention protocol'],
        criteriaScores: [
          { criterionId: 'c6', criterionName: 'Experimental Design & Controls', marks: 6.5, maxMarks: 10, feedback: 'Missing baseline control and cannula verification.' },
          { criterionId: 'c7', criterionName: 'Acquisition vs. Retention Dissection', marks: 7.0, maxMarks: 10, feedback: 'Did not clearly separate post-training retention tests.' },
          { criterionId: 'c8', criterionName: 'Mechanistic Interpretation', marks: 3.5, maxMarks: 5, feedback: 'Satisfactory link to NMDA receptor block.' }
        ]
      }
    ]
  },
  {
    id: 'sub-4',
    studentId: 'STU-8824',
    studentName: 'Elena Rostova',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 17:22',
    status: 'Graded',
    confidenceScore: 89,
    totalAiMarks: 42.5,
    totalFacultyMarks: 42.5,
    maxPossibleMarks: 50,
    reviewed: true,
    reviewedBy: 'Prof. Eleanor Vance',
    reviewedAt: 'Oct 24, 2026',
    answers: []
  },
  {
    id: 'sub-5',
    studentId: 'STU-8825',
    studentName: 'David Kim',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 18:45',
    status: 'Flagged',
    confidenceScore: 64,
    totalAiMarks: 28.0,
    totalFacultyMarks: undefined,
    maxPossibleMarks: 50,
    flagReason: 'Potential conceptual confusion between AMPA and NMDA receptor trafficking; conflicting statements in Q1.',
    reviewed: false,
    answers: []
  },
  {
    id: 'sub-6',
    studentId: 'STU-8826',
    studentName: 'Sophia Patel',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 19:12',
    status: 'Needs Review',
    confidenceScore: 78,
    totalAiMarks: 36.5,
    totalFacultyMarks: undefined,
    maxPossibleMarks: 50,
    flagReason: 'Unclear justification of AP5 dosage protocol in Q3.',
    reviewed: false,
    answers: []
  },
  {
    id: 'sub-7',
    studentId: 'STU-8827',
    studentName: 'Chloe Tremblay',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 20:05',
    status: 'Graded',
    confidenceScore: 92,
    totalAiMarks: 44.0,
    totalFacultyMarks: 44.0,
    maxPossibleMarks: 50,
    reviewed: true,
    answers: []
  },
  {
    id: 'sub-8',
    studentId: 'STU-8828',
    studentName: 'Liam O’Connor',
    assessmentId: 'asmt-1',
    assessmentTitle: 'Neural Encoding & Synaptic Plasticity',
    submittedAt: 'Oct 23, 2026 · 21:30',
    status: 'Graded',
    confidenceScore: 85,
    totalAiMarks: 40.0,
    totalFacultyMarks: 40.0,
    maxPossibleMarks: 50,
    reviewed: true,
    answers: []
  }
];

export const mockAnalyticsSummary: AnalyticsSummary = {
  classAverage: 78.4,
  medianScore: 80.5,
  highestScore: 47.0,
  lowestScore: 28.0,
  standardDeviation: 6.8,
  gradeDistribution: [
    { grade: 'A (90–100%)', range: '45–50 pts', count: 8, percentage: 16.7 },
    { grade: 'B (80–89%)', range: '40–44 pts', count: 18, percentage: 37.5 },
    { grade: 'C (70–79%)', range: '35–39 pts', count: 14, percentage: 29.2 },
    { grade: 'D (60–69%)', range: '30–34 pts', count: 6, percentage: 12.5 },
    { grade: 'F (<60%)', range: '<30 pts', count: 2, percentage: 4.1 }
  ],
  questionPerformance: [
    {
      questionNumber: 1,
      title: 'Biophysical Basis of LTP & Mg2+ Dynamics',
      averageMarks: 12.8,
      maxMarks: 15,
      successRate: 85.3,
      difficulty: 'Moderate'
    },
    {
      questionNumber: 2,
      title: 'Early vs. Late Phase Molecular Transitions',
      averageMarks: 8.2,
      maxMarks: 10,
      successRate: 82.0,
      difficulty: 'Easy'
    },
    {
      questionNumber: 3,
      title: 'Morris Water Maze Behavioral Pharmacology',
      averageMarks: 18.2,
      maxMarks: 25,
      successRate: 72.8,
      difficulty: 'Challenging'
    }
  ],
  difficultConcepts: [
    {
      concept: 'Retrograde NO diffusion vs Endocannabinoid pathways',
      missedPercentage: 42,
      affectedStudents: 20,
      topic: 'Synaptic Plasticity'
    },
    {
      concept: 'Visible platform control in water maze design',
      missedPercentage: 35,
      affectedStudents: 17,
      topic: 'Behavioral Pharmacology'
    },
    {
      concept: 'CaMKII autonomous Thr286 autophosphorylation',
      missedPercentage: 23,
      affectedStudents: 11,
      topic: 'Enzymatic Cascades'
    }
  ],
  studentsNeedingSupport: [
    {
      studentName: 'David Kim',
      studentId: 'STU-8825',
      score: 56,
      gapArea: 'Receptor Trafficking & Biophysics',
      trend: 'declining'
    },
    {
      studentName: 'Marcus Chen',
      studentId: 'STU-8823',
      score: 68,
      gapArea: 'Behavioral Controls & Pharmacology',
      trend: 'stable'
    },
    {
      studentName: 'Sophia Patel',
      studentId: 'STU-8826',
      score: 73,
      gapArea: 'Experimental Protocols',
      trend: 'improving'
    }
  ]
};

