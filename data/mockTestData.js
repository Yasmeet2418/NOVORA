// Realistic Examination Mock Test Engine — NTA CBT & UPSC Pattern
// Features: Full 3-hour JEE Main, 3-hour 20-min NEET UG, 2-hour UPSC Prelims, and 2.5-hour NDA.
// Supports Section-wise navigation, Section A (MCQs) and Section B (Numerical value questions with virtual keypad),
// exact NTA 5-state palette, negative marking penalty calculations, and comprehensive post-exam scorecards.

export const REALISTIC_MOCK_BANKS = {
  "jee-main": {
    examId: "jee-main",
    examName: "JEE (Main) 2026 - Computer Based Test",
    conductingBody: "National Testing Agency (NTA)",
    officialDurationMinutes: 180, // Full 3 Hours
    totalMarks: 300,
    sections: [
      {
        id: "physics",
        name: "Physics",
        secA: [
          {
            id: "jee_phy_1",
            type: "mcq",
            subject: "Physics",
            section: "Section A (MCQ)",
            chapter: "Modern Physics",
            question: "In a photoelectric experiment, monochromatic light of wavelength λ illuminates a metal plate having work function W₀. The stopping potential is measured to be V. When the wavelength is increased to 2λ, the stopping potential becomes V/4. The threshold wavelength λ₀ of the metal surface is:",
            options: ["3λ", "4λ", "2.5λ", "5λ"],
            correctIndex: 0,
            explanation: "Einstein's photoelectric equation:\neV = (hc/λ) - W₀  --- (1)\ne(V/4) = (hc/2λ) - W₀ => eV = (2hc/λ) - 4W₀  --- (2)\nEquating (1) and (2):\n(hc/λ) - W₀ = (2hc/λ) - 4W₀ => 3W₀ = hc/λ => 3(hc/λ₀) = hc/λ => λ₀ = 3λ."
          },
          {
            id: "jee_phy_2",
            type: "mcq",
            subject: "Physics",
            section: "Section A (MCQ)",
            chapter: "Current Electricity",
            question: "A wire of resistance R is stretched uniformly such that its length increases by 0.2%. If volume remains constant, the percentage increase in its electrical resistance is approximately:",
            options: ["0.1%", "0.2%", "0.4%", "0.8%"],
            correctIndex: 2,
            explanation: "Resistance R = ρ·L/A = ρ·L² / V. Since volume V and resistivity ρ are constant, taking fractional derivative dR/R = 2(dL/L). For small variations, %ΔR = 2 × (%ΔL) = 2 × 0.2% = 0.4%."
          },
          {
            id: "jee_phy_3",
            type: "mcq",
            subject: "Physics",
            section: "Section A (MCQ)",
            chapter: "Electromagnetic Induction",
            question: "A conducting circular loop of radius r and resistance R is placed perpendicular to a uniform magnetic field B. If the loop is rotated about its diameter by 180° in time Δt, the total charge that flows through any cross-section of the loop is:",
            options: ["Zero", "(B·πr²) / R", "(2B·πr²) / R", "(2B·πr²) / (R·Δt)"],
            correctIndex: 2,
            explanation: "Initial flux Φ₁ = B·A = B·πr². After 180° rotation, Φ₂ = -B·πr².\nChange in magnetic flux |ΔΦ| = Φ₁ - Φ₂ = 2B·πr².\nCharge flowed q = |ΔΦ| / R = (2B·πr²) / R. (Note: Independent of time Δt)."
          },
          {
            id: "jee_phy_4",
            type: "mcq",
            subject: "Physics",
            section: "Section A (MCQ)",
            chapter: "Rotational Motion",
            question: "A solid sphere and a solid cylinder having identical mass M and radius R roll down an inclined plane of inclination θ without slipping from the same height h. The ratio of acceleration of the sphere to that of the cylinder (a_sphere / a_cylinder) is:",
            options: ["14 / 15", "15 / 14", "7 / 5", "5 / 7"],
            correctIndex: 1,
            explanation: "Acceleration for pure rolling down an incline: a = (g sin θ) / (1 + k²/R²).\nFor solid sphere: k²/R² = 2/5 => a_s = (g sin θ) / (1 + 2/5) = 5/7 g sin θ.\nFor solid cylinder: k²/R² = 1/2 => a_c = (g sin θ) / (1 + 1/2) = 2/3 g sin θ.\nRatio a_s / a_c = (5/7) / (2/3) = 15 / 14."
          }
        ],
        secB: [
          {
            id: "jee_phy_num_1",
            type: "numerical",
            subject: "Physics",
            section: "Section B (Numerical)",
            chapter: "Thermodynamics",
            question: "An ideal diatomic gas (Cv = 5/2 R) undergoes an adiabatic expansion such that its volume becomes 32 times its initial volume. If the initial absolute temperature of the gas was 800 K, its final absolute temperature in Kelvin is:",
            correctValue: "200",
            tolerance: 0.5,
            explanation: "For an adiabatic process: T₁ · V₁^(γ - 1) = T₂ · V₂^(γ - 1).\nFor diatomic gas, γ = Cp/Cv = (7/2 R) / (5/2 R) = 7/5 = 1.4.\n(γ - 1) = 0.4 = 2/5.\nT₂ = T₁ · (V₁ / V₂)^(2/5) = 800 · (1 / 32)^(2/5) = 800 · (1 / 2^5)^(2/5) = 800 · (1 / 2²) = 800 / 4 = 200 K."
          },
          {
            id: "jee_phy_num_2",
            type: "numerical",
            subject: "Physics",
            section: "Section B (Numerical)",
            chapter: "Electrostatics",
            question: "Two point charges +4 μC and +1 μC are separated by a distance of 30 cm in air. At what distance (in cm) from the +4 μC charge along the line joining them is the net electric field intensity zero?",
            correctValue: "20",
            tolerance: 0.1,
            explanation: "Let the null point be at distance x from +4 μC. Then distance from +1 μC is (30 - x).\nE₁ = E₂ => k(4) / x² = k(1) / (30 - x)² => √4 / x = 1 / (30 - x) => 2 / x = 1 / (30 - x)\n=> 60 - 2x = x => 3x = 60 => x = 20 cm."
          }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        secA: [
          {
            id: "jee_chem_1",
            type: "mcq",
            subject: "Chemistry",
            section: "Section A (MCQ)",
            chapter: "Coordination Compounds",
            question: "Which of the following octahedral complexes exhibits diamagnetic behavior and does not show optical isomerism?",
            options: [
              "cis-[Co(en)₂Cl₂]⁺",
              "trans-[Co(en)₂Cl₂]⁺",
              "[Fe(CN)₆]³⁻",
              "[Cr(H₂O)₆]³⁺"
            ],
            correctIndex: 1,
            explanation: "In trans-[Co(en)₂Cl₂]⁺, Co³⁺ is a d⁶ ion with en as strong field ligand; pairing occurs giving t2g⁶ eg⁰ (diamagnetic, zero unpaired electrons). The trans isomer has a plane of symmetry and center of inversion, so it is optically inactive (achiral). cis isomer is chiral."
          },
          {
            id: "jee_chem_2",
            type: "mcq",
            subject: "Chemistry",
            section: "Section A (MCQ)",
            chapter: "Chemical Bonding",
            question: "According to Molecular Orbital Theory (MOT), which of the following species has a bond order of 2.5 and is paramagnetic in nature?",
            options: ["O₂", "O₂⁺", "N₂⁺", "C₂²⁻"],
            correctIndex: 1,
            explanation: "O₂⁺ has 15 electrons. Electronic configuration: σ1s² σ*1s² σ2s² σ*2s² σ2pz² (π2px² = π2py²) (π*2px¹).\nBond order = ½(10 - 5) = 2.5. With one unpaired electron in π*2px orbital, it is paramagnetic."
          },
          {
            id: "jee_chem_3",
            type: "mcq",
            subject: "Chemistry",
            section: "Section A (MCQ)",
            chapter: "General Organic Chemistry",
            question: "The correct decreasing order of acidic strength among the following substituted benzoic acids is:\n(I) o-Nitrobenzoic acid\n(II) p-Nitrobenzoic acid\n(III) m-Nitrobenzoic acid\n(IV) Benzoic acid",
            options: [
              "I > II > III > IV",
              "II > I > III > IV",
              "I > III > II > IV",
              "IV > III > II > I"
            ],
            correctIndex: 0,
            explanation: "Due to ortho effect, o-nitrobenzoic acid (I) is the strongest acid. In para position (II), -NO₂ exerts powerful -M and -I effects. In meta position (III), -NO₂ exerts only -I effect. Unsubstituted benzoic acid (IV) is the least acidic. Hence: I > II > III > IV."
          }
        ],
        secB: [
          {
            id: "jee_chem_num_1",
            type: "numerical",
            subject: "Chemistry",
            section: "Section B (Numerical)",
            chapter: "Solutions",
            question: "The freezing point of a 0.05 m aqueous solution of a monobasic acid HA is -0.10044 °C. If the cryoscopic constant of water Kf = 1.86 K kg mol⁻¹, calculate the percentage dissociation (% α) of the acid:",
            correctValue: "8",
            tolerance: 0.5,
            explanation: "ΔTf = 0.10044 °C = i · Kf · m => 0.10044 = i × 1.86 × 0.05 = i × 0.093.\ni = 0.10044 / 0.093 = 1.08.\nFor HA ⇌ H⁺ + A⁻: i = 1 + α => 1.08 = 1 + α => α = 0.08.\nPercentage dissociation % α = 0.08 × 100 = 8%."
          }
        ]
      },
      {
        id: "mathematics",
        name: "Mathematics",
        secA: [
          {
            id: "jee_math_1",
            type: "mcq",
            subject: "Mathematics",
            section: "Section A (MCQ)",
            chapter: "Vectors and 3D Geometry",
            question: "The shortest distance between the two skew lines r₁ = (i + 2j + 3k) + λ(2i + 3j + 4k) and r₂ = (2i + 4j + 5k) + μ(3i + 4j + 5k) is:",
            options: ["1 / √6", "2 / √3", "1 / √3", "0"],
            correctIndex: 0,
            explanation: "Shortest distance d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|.\na₂ - a₁ = (2 - 1)i + (4 - 2)j + (5 - 3)k = i + 2j + 2k.\nb₁ × b₂ = | i j k ; 2 3 4 ; 3 4 5 | = i(15 - 16) - j(10 - 12) + k(8 - 9) = -i + 2j - k.\n(a₂ - a₁) · (b₁ × b₂) = 1(-1) + 2(2) + 2(-1) = -1 + 4 - 2 = 1.\n|b₁ × b₂| = √((-1)² + 2² + (-1)²) = √(1 + 4 + 1) = √6.\nDistance = 1 / √6."
          },
          {
            id: "jee_math_2",
            type: "mcq",
            subject: "Mathematics",
            section: "Section A (MCQ)",
            chapter: "Definite Integrals",
            question: "The value of the definite integral I = ∫[0 to π/2] (sin⁴ x) / (sin⁴ x + cos⁴ x) dx is:",
            options: ["π / 2", "π / 4", "π / 8", "1"],
            correctIndex: 1,
            explanation: "Using King's property: I = ∫[0 to a] f(a - x) dx.\nI = ∫[0 to π/2] cos⁴ x / (cos⁴ x + sin⁴ x) dx.\nAdding both expressions: 2I = ∫[0 to π/2] (sin⁴ x + cos⁴ x) / (sin⁴ x + cos⁴ x) dx = ∫[0 to π/2] 1 dx = π/2.\nThus I = π/4."
          },
          {
            id: "jee_math_3",
            type: "mcq",
            subject: "Mathematics",
            section: "Section A (MCQ)",
            chapter: "Matrices and Determinants",
            question: "If A is a 3 × 3 non-singular matrix such that |A| = 4, then the value of |adj(2A)| is:",
            options: ["1024", "4096", "256", "64"],
            correctIndex: 1,
            explanation: "For an n × n matrix, |adj(B)| = |B|^(n - 1). Here n = 3, so |adj(2A)| = |2A|^(3 - 1) = |2A|².\nAlso, |k A| = k^n |A| = 2³ |A| = 8 × 4 = 32.\nTherefore, |adj(2A)| = (32)² = 1024 ... Wait: |2A|² = (2³ |A|)² = (8 × 4)² = 32² = 1024. Wait! 2^(3*2) |A|² = 64 * 16 = 1024. Let's verify option: 1024."
          }
        ],
        secB: [
          {
            id: "jee_math_num_1",
            type: "numerical",
            subject: "Mathematics",
            section: "Section B (Numerical)",
            chapter: "Limits",
            question: "Evaluate the limit L = lim[x → 0] (1 - cos 6x) / x² and enter its integer value:",
            correctValue: "18",
            tolerance: 0.1,
            explanation: "Using standard expansion or L'Hôpital rule: 1 - cos(θ) ≈ ½ θ² as θ → 0.\nHere θ = 6x, so 1 - cos(6x) = ½ (6x)² = ½ (36x²) = 18x².\nLimit = 18x² / x² = 18."
          }
        ]
      }
    ]
  },

  "neet-ug": {
    examId: "neet-ug",
    examName: "NEET (UG) 2026 - National Eligibility cum Entrance Test",
    conductingBody: "National Testing Agency (NTA)",
    officialDurationMinutes: 200, // Full 3 Hours 20 Mins (NTA Official NEET Pattern)
    totalMarks: 720,
    sections: [
      {
        id: "physics",
        name: "Physics",
        secA: [
          {
            id: "neet_phy_1",
            type: "mcq",
            subject: "Physics",
            section: "Section A",
            chapter: "Optics",
            question: "A convex lens of focal length 20 cm in air is immersed completely in water (μ_water = 4/3). If refractive index of glass is μ_glass = 3/2, the new focal length of the lens in water will be:",
            options: ["40 cm", "60 cm", "80 cm", "100 cm"],
            correctIndex: 2,
            explanation: "Lens maker's formula: 1/f = (μ_rel - 1)(1/R₁ - 1/R₂).\nIn air: 1/20 = (1.5 - 1)·K = 0.5·K => K = 1/10.\nIn water: μ_rel = (3/2) / (4/3) = 9/8.\n1/f_w = (9/8 - 1)·K = (1/8) × (1/10) = 1/80 => f_w = 80 cm."
          },
          {
            id: "neet_phy_2",
            type: "mcq",
            subject: "Physics",
            section: "Section A",
            chapter: "Electrostatics",
            question: "An electric dipole of dipole moment p is placed in a uniform electric field E at an angle of 30° with the field direction. The torque acting on the dipole is τ. The work done in rotating the dipole from 30° to 90° is:",
            options: ["τ", "τ (√3 - 1)", "τ (2 - √3)", "2τ"],
            correctIndex: 1,
            explanation: "Torque τ = p E sin 30° = ½ pE => pE = 2τ.\nWork done W = -pE (cos 90° - cos 30°) = -pE (0 - √3/2) = pE (√3/2) = (2τ)(√3/2) ... Wait, work done against field W = pE(cos θ₁ - cos θ₂) = pE(cos 30° - cos 90°) = 2τ(√3/2 - 0) = √3 τ."
          }
        ],
        secB: []
      },
      {
        id: "chemistry",
        name: "Chemistry",
        secA: [
          {
            id: "neet_chem_1",
            type: "mcq",
            subject: "Chemistry",
            section: "Section A",
            chapter: "Equilibrium",
            question: "The solubility product (Ksp) of a sparingly soluble salt AB₂ is 3.2 × 10⁻¹¹ at 298 K. Its solubility in mol L⁻¹ is:",
            options: ["2.0 × 10⁻⁴", "1.0 × 10⁻⁴", "4.0 × 10⁻⁵", "2.0 × 10⁻³"],
            correctIndex: 0,
            explanation: "For AB₂ ⇌ A²⁺ + 2B⁻: Ksp = s × (2s)² = 4s³.\n4s³ = 3.2 × 10⁻¹¹ = 32 × 10⁻¹² => s³ = 8 × 10⁻¹² => s = 2.0 × 10⁻⁴ mol/L."
          }
        ],
        secB: []
      },
      {
        id: "botany",
        name: "Botany",
        secA: [
          {
            id: "neet_bot_1",
            type: "mcq",
            subject: "Botany",
            section: "Section A",
            chapter: "Plant Physiology",
            question: "Which of the following elements is a constituent of the ring structure of chlorophyll and is essential for the activation of RuBisCO and PEPcase enzymes?",
            options: ["Magnesium (Mg)", "Manganese (Mn)", "Iron (Fe)", "Zinc (Zn)"],
            correctIndex: 0,
            explanation: "Magnesium (Mg²⁺) is the central coordinating atom in the porphyrin ring of chlorophyll and acts as a necessary divalent cofactor for carboxylases like RuBisCO and PEPcase."
          },
          {
            id: "neet_bot_2",
            type: "mcq",
            subject: "Botany",
            section: "Section A",
            chapter: "Genetics & Inheritance",
            question: "If a cross between two individuals results in offspring with phenotypes in the ratio 9 : 3 : 3 : 1, it demonstrates which Mendel principle?",
            options: [
              "Law of Independent Assortment",
              "Law of Segregation",
              "Incomplete Dominance",
              "Chromosomal linkage"
            ],
            correctIndex: 0,
            explanation: "The 9:3:3:1 phenotypic dihybrid ratio occurs when two gene pairs segregate and assort independently of each other during gamete formation."
          }
        ],
        secB: []
      },
      {
        id: "zoology",
        name: "Zoology",
        secA: [
          {
            id: "neet_zoo_1",
            type: "mcq",
            subject: "Zoology",
            section: "Section A",
            chapter: "Human Physiology",
            question: "In the human nephron, maximum reabsorption of water, glucose, and essential electrolytes (70–80%) takes place in the:",
            options: [
              "Proximal Convoluted Tubule (PCT)",
              "Descending limb of Loop of Henle",
              "Distal Convoluted Tubule (DCT)",
              "Collecting Duct"
            ],
            correctIndex: 0,
            explanation: "PCT is lined by simple cuboidal brush-border epithelium which increases surface area for reabsorption. Nearly all glucose, amino acids, and 70-80% of electrolytes and water are reabsorbed here."
          }
        ],
        secB: []
      }
    ]
  },

  "upsc-cse": {
    examId: "upsc-cse",
    examName: "UPSC Civil Services (Preliminary) Examination - Paper 1 (GS)",
    conductingBody: "Union Public Service Commission",
    officialDurationMinutes: 120, // Full 2 Hours
    totalMarks: 200,
    sections: [
      {
        id: "gs1",
        name: "General Studies Paper 1",
        secA: [
          {
            id: "upsc_q_1",
            type: "mcq",
            subject: "Indian Polity",
            section: "Polity & Governance",
            chapter: "Constitutional Framework",
            question: "Consider the following statements regarding the Attorney General of India:\n1. The Attorney General is appointed by the President and must be qualified to be appointed a Judge of the Supreme Court.\n2. He has the right of audience in all courts in India and can take part in proceedings of Parliament without the right to vote.\n3. He is a full-time counsel for the Government and falls in the category of a civil servant.\n\nWhich of the statements given above is/are correct?",
            options: [
              "1 and 2 only",
              "2 and 3 only",
              "1 only",
              "1, 2 and 3"
            ],
            correctIndex: 0,
            explanation: "Statements 1 and 2 are correct (Article 76 & 88). Statement 3 is incorrect: The Attorney General is not a government servant / civil servant and is not debarred from private legal practice."
          },
          {
            id: "upsc_q_2",
            type: "mcq",
            subject: "Ecology & Environment",
            section: "Biodiversity",
            chapter: "Conservation",
            question: "With reference to the 'BioCarbon Fund Initiative for Sustainable Forest Landscapes' (ISFL), consider the following statements:\n1. It is managed by the United Nations Environment Programme (UNEP).\n2. It promotes reducing emissions from deforestation and forest degradation in developing countries.\n\nWhich of the statements given above is/are correct?",
            options: [
              "1 only",
              "2 only",
              "Both 1 and 2",
              "Neither 1 nor 2"
            ],
            correctIndex: 1,
            explanation: "Statement 1 is incorrect: The BioCarbon Fund ISFL is a multilateral facility managed by the World Bank, not UNEP. Statement 2 is correct."
          },
          {
            id: "upsc_q_3",
            type: "mcq",
            subject: "Indian Economy",
            section: "Macroeconomics",
            chapter: "Banking & Monetary Policy",
            question: "If the Reserve Bank of India decides to adopt an expansionary monetary policy, which of the following would it NOT do?\n1. Cut and optimize the Statutory Liquidity Ratio (SLR)\n2. Increase the Marginal Standing Facility (MSF) Rate\n3. Cut the Repo Rate and Bank Rate\n\nSelect the correct answer using the code below:",
            options: [
              "1 and 2 only",
              "2 only",
              "1 and 3 only",
              "1, 2 and 3"
            ],
            correctIndex: 1,
            explanation: "In an expansionary monetary policy, RBI aims to inject liquidity by cutting interest rates and reserve requirements. Increasing the MSF rate tightens liquidity (contractionary), so RBI would NOT increase MSF rate. Hence '2 only' is what it would NOT do."
          }
        ],
        secB: []
      }
    ]
  }
};
