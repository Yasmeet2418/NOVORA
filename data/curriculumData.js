// Comprehensive Class-Wise Curriculum Database for Classes 6 to 12
// Supports CBSE, ICSE, and State Boards with real chapter syllabi, key points, formulas, definitions, quizzes, and practice questions.

export const BOARDS = [
  { id: "cbse", name: "CBSE (Central Board of Secondary Education)", default: true },
  { id: "icse", name: "ICSE / ISC (CISCE Board)" },
  { id: "state", name: "State Education Boards (State Curricula)" }
];

export const CLASS_LEVELS = [
  { id: "class-6", label: "Class 6", stage: "Middle School" },
  { id: "class-7", label: "Class 7", stage: "Middle School" },
  { id: "class-8", label: "Class 8", stage: "Middle School" },
  { id: "class-9", label: "Class 9", stage: "Secondary School" },
  { id: "class-10", label: "Class 10", stage: "Secondary Board Year" },
  { id: "class-11", label: "Class 11", stage: "Senior Secondary" },
  { id: "class-12", label: "Class 12", stage: "Senior Secondary Board Year" }
];

export const CURRICULUM_DATA = {
  "class-10": {
    subjects: [
      {
        id: "maths-10",
        name: "Mathematics",
        icon: "Calculator",
        color: "text-blue-500",
        chapters: [
          {
            id: "ch-real-numbers",
            title: "Real Numbers",
            number: 1,
            summary: "Covers the Fundamental Theorem of Arithmetic, prime factorization, proof of irrationality for √2, √3, √5, and decimal expansions of rational numbers.",
            keyPoints: [
              "Fundamental Theorem of Arithmetic: Every composite number can be expressed as a unique product of primes.",
              "HCF(a, b) × LCM(a, b) = a × b for any two positive integers a and b.",
              "If p is a prime and p divides a², then p divides a, where a is a positive integer.",
              "A rational number p/q has a terminating decimal expansion if the prime factorization of q is of the form 2^n × 5^m."
            ],
            definitions: [
              { term: "Fundamental Theorem of Arithmetic", definition: "Every composite number can be represented as the product of primes in a unique way, except for the order in which prime factors occur." },
              { term: "Rational Number", definition: "A number that can be expressed in the form p/q, where p and q are integers and q ≠ 0." },
              { term: "Irrational Number", definition: "A number that cannot be written in the form p/q and has a non-terminating, non-repeating decimal expansion." }
            ],
            formulaSheet: [
              { name: "HCF-LCM Relation", formula: "HCF(a, b) × LCM(a, b) = a × b" },
              { name: "Terminating Condition", formula: "Denominator q = 2^m × 5^n (where m, n are non-negative integers)" }
            ],
            mcqQuiz: [
              {
                id: "q1",
                question: "If HCF(306, 657) = 9, what is LCM(306, 657)?",
                options: ["22338", "21450", "22500", "23348"],
                correctIndex: 0,
                explanation: "Using LCM(a,b) = (a × b) / HCF(a,b) = (306 × 657) / 9 = 34 × 657 = 22,338."
              },
              {
                id: "q2",
                question: "The decimal expansion of 23 / (2³ × 5²) will terminate after how many decimal places?",
                options: ["1 decimal place", "2 decimal places", "3 decimal places", "Does not terminate"],
                correctIndex: 2,
                explanation: "The maximum power between 2 and 5 in the denominator is 3 (2³). Hence, the decimal expansion terminates after 3 places."
              },
              {
                id: "q3",
                question: "Which of the following is an irrational number?",
                options: ["22/7", "3.141414...", "√7", "√16"],
                correctIndex: 2,
                explanation: "√7 cannot be expressed as p/q with integer p,q; its square root is non-terminating and non-repeating."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Explain why 7 × 11 × 13 + 13 is a composite number.", modelAnswer: "Factoring out 13 gives 13 × (7 × 11 + 1) = 13 × (77 + 1) = 13 × 78. Since it has more than two factors (1, 13, 78, and the number itself), it is composite by the Fundamental Theorem of Arithmetic." },
                { q: "Given that √5 is irrational, prove that 3 + 2√5 is irrational.", modelAnswer: "Assume 3 + 2√5 is rational = a/b (b ≠ 0, a, b coprime). Then 2√5 = a/b - 3 = (a - 3b)/b, so √5 = (a - 3b)/(2b). Since a and b are integers, the RHS is rational, which contradicts the fact that √5 is irrational. Hence 3 + 2√5 is irrational." }
              ],
              longAnswer: [
                { q: "Find the HCF and LCM of 404 and 96 and verify that HCF × LCM = Product of the two given numbers.", keyPointsToCover: ["Prime factorize 404 = 2² × 101", "Prime factorize 96 = 2⁵ × 3", "HCF = 2² = 4", "LCM = 2⁵ × 3 × 101 = 9696", "Check product: 404 × 96 = 38784", "HCF × LCM = 4 × 9696 = 38784. Verified."] }
              ]
            }
          },
          {
            id: "ch-polynomials",
            title: "Polynomials",
            number: 2,
            summary: "Focuses on zeroes of quadratic polynomials, relationship between zeroes and coefficients, and graphical representation of polynomials.",
            keyPoints: [
              "For a quadratic polynomial ax² + bx + c: Sum of zeroes (α + β) = -b/a.",
              "Product of zeroes (α × β) = c/a.",
              "A quadratic polynomial with roots α and β is given by k[x² - (α + β)x + αβ].",
              "The number of zeroes corresponds to the number of points where the graph y = p(x) intersects the x-axis."
            ],
            definitions: [
              { term: "Zero of a Polynomial", definition: "A real number k is a zero of polynomial p(x) if p(k) = 0." },
              { term: "Quadratic Polynomial", definition: "A polynomial of degree 2, commonly represented in standard form as ax² + bx + c (a ≠ 0)." }
            ],
            formulaSheet: [
              { name: "Sum of Zeroes", formula: "α + β = -b / a" },
              { name: "Product of Zeroes", formula: "α × β = c / a" },
              { name: "Constructing Polynomial", formula: "p(x) = k [x² - (Sum)x + Product]" }
            ],
            mcqQuiz: [
              {
                id: "qp1",
                question: "If α and β are the zeroes of 2x² + 5x - 10, then α × β equals:",
                options: ["5/2", "-5/2", "-5", "-10"],
                correctIndex: 2,
                explanation: "Product of zeroes = c/a = -10 / 2 = -5."
              },
              {
                id: "qp2",
                question: "A quadratic polynomial whose zeroes are -3 and 4 is:",
                options: ["x² - x - 12", "x² + x - 12", "x² - 7x + 12", "x² + 7x - 12"],
                correctIndex: 0,
                explanation: "Sum = -3 + 4 = 1. Product = (-3)(4) = -12. Form: x² - (Sum)x + Product = x² - x - 12."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Find the zeroes of the quadratic polynomial x² + 7x + 10 and verify the relationship with coefficients.", modelAnswer: "Factorizing x² + 7x + 10 = (x + 2)(x + 5). Zeroes are α = -2, β = -5. Sum = -7 = -b/a = -7/1. Product = 10 = c/a = 10/1. Verified." }
              ],
              longAnswer: [
                { q: "If α and β are zeroes of p(x) = x² - 5x + k such that α - β = 1, find the value of k.", keyPointsToCover: ["α + β = 5", "α - β = 1 -> 2α = 6 -> α = 3", "β = 2", "k = α × β = 3 × 2 = 6"] }
              ]
            }
          },
          {
            id: "ch-quadratic-equations-10",
            title: "Quadratic Equations",
            number: 4,
            summary: "Standard form ax² + bx + c = 0, solution by factorisation, quadratic formula, nature of roots, and real-world word problems.",
            keyPoints: [
              "Standard form: ax² + bx + c = 0, where a ≠ 0.",
              "Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a).",
              "Discriminant D = b² - 4ac: D > 0 (2 distinct real roots), D = 0 (2 equal real roots), D < 0 (no real roots)."
            ],
            definitions: [
              { term: "Discriminant", definition: "The algebraic expression D = b² - 4ac that determines the nature of the roots of a quadratic equation." }
            ],
            formulaSheet: [
              { name: "Roots formula", formula: "x = (-b ± √D) / (2a)" },
              { name: "Discriminant", formula: "D = b² - 4ac" }
            ],
            mcqQuiz: [
              {
                id: "qq1",
                question: "The roots of the quadratic equation 2x² - 4x + 3 = 0 are:",
                options: ["Real and distinct", "Real and equal", "Not real (imaginary)", "Zero"],
                correctIndex: 2,
                explanation: "D = (-4)² - 4(2)(3) = 16 - 24 = -8 < 0. Hence roots are not real."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Find the value of k for which 2x² + kx + 3 = 0 has two equal roots.", modelAnswer: "For equal roots, D = 0 => k² - 4(2)(3) = 0 => k² - 24 = 0 => k = ±√24 = ±2√6." }
              ],
              longAnswer: [
                { q: "A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.", keyPointsToCover: ["Let stream speed = x km/h", "Upstream speed = 18 - x, Downstream speed = 18 + x", "Equation: 24/(18 - x) - 24/(18 + x) = 1", "Solves to x² + 48x - 324 = 0", "(x - 6)(x + 54) = 0", "Stream speed = 6 km/h."] }
              ]
            }
          }
        ]
      },
      {
        id: "science-10",
        name: "Science",
        icon: "FlaskConical",
        color: "text-emerald-500",
        chapters: [
          {
            id: "ch-chemical-reactions",
            title: "Chemical Reactions and Equations",
            number: 1,
            summary: "Balancing chemical equations, types of chemical reactions (combination, decomposition, displacement, double displacement, redox), and oxidation effects in daily life (corrosion and rancidity).",
            keyPoints: [
              "Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction.",
              "Exothermic reactions release energy (e.g. respiration), while endothermic reactions absorb heat (e.g. photosynthesis).",
              "Precipitation reactions produce an insoluble salt.",
              "Oxidation is the gain of oxygen or loss of electrons; Reduction is the loss of oxygen or gain of electrons."
            ],
            definitions: [
              { term: "Oxidation", definition: "A process that involves gain of oxygen or loss of hydrogen/electrons." },
              { term: "Corrosion", definition: "The gradual deterioration of metals due to reaction with air, moisture, and acids (e.g. rusting of iron: hydrated ferric oxide)." },
              { term: "Rancidity", definition: "The oxidation of fats and oils in food resulting in unpleasant odor and taste." }
            ],
            formulaSheet: [
              { name: "Rusting equation", formula: "4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O" },
              { name: "Respiration reaction", formula: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy" }
            ],
            mcqQuiz: [
              {
                id: "cr1",
                question: "Heating ferrous sulphate crystals (FeSO₄·7H₂O) results in the evolution of which gases?",
                options: ["SO₂ and SO₃", "CO₂ and CO", "O₂ and H₂", "NO₂ and NO"],
                correctIndex: 0,
                explanation: "Thermal decomposition of FeSO₄ yields solid Fe₂O₃ and suffocating gases SO₂ and SO₃."
              },
              {
                id: "cr2",
                question: "Which antioxidant gas is commonly flushed into chip packets to prevent rancidity?",
                options: ["Oxygen", "Nitrogen", "Chlorine", "Argon"],
                correctIndex: 1,
                explanation: "Nitrogen is an unreactive inert gas that displaces oxygen and prevents oxidative rancidity of fats."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Why is respiration considered an exothermic reaction?", modelAnswer: "During respiration, glucose reacts with oxygen in body cells to produce carbon dioxide, water, and releases energy in the form of ATP: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy." }
              ],
              longAnswer: [
                { q: "Differentiate between displacement and double displacement reactions with balanced chemical equations.", keyPointsToCover: ["Displacement: A more reactive element displaces a less reactive element from its salt solution (e.g. Fe + CuSO₄ → FeSO₄ + Cu)", "Double Displacement: Exchange of ions between two ionic compounds (e.g. Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl)", "Mention formation of insoluble precipitate BaSO₄."] }
              ]
            }
          },
          {
            id: "ch-life-processes",
            title: "Life Processes",
            number: 6,
            summary: "Nutrition, respiration, transportation, and excretion in human beings and plants.",
            keyPoints: [
              "Autotrophic nutrition uses light/chemical energy to fix inorganic carbon; heterotrophs rely on external organic carbon.",
              "Human heart has 4 chambers to prevent mixing of oxygenated and deoxygenated blood.",
              "Xylem transports water and minerals unidirectionally; Phloem translocates sucrose bidirectionally.",
              "Nephron is the basic structural and functional filtration unit of the human kidney."
            ],
            definitions: [
              { term: "Peristalsis", definition: "Rhythmic contraction and relaxation of the muscular lining of the alimentary canal to push food forward." },
              { term: "Transpiration", definition: "Loss of water vapor from the aerial parts (stomata) of the plant, generating suction pull." }
            ],
            formulaSheet: [
              { name: "Photosynthesis Overall Equation", formula: "6CO₂ + 12H₂O + Sunlight + Chlorophyll → C₆H₁₂O₆ + 6O₂ + 6H₂O" }
            ],
            mcqQuiz: [
              {
                id: "lp1",
                question: "What is the enzyme in human saliva that hydrolyses starch into maltose?",
                options: ["Pepsin", "Salivary Amylase (Ptyalin)", "Trypsin", "Lipase"],
                correctIndex: 1,
                explanation: "Salivary amylase breaks complex starch polymers into simpler disaccharide maltose."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "What is the function of the cartilaginous rings present in the human trachea?", modelAnswer: "C-shaped cartilaginous rings support the tracheal wall and ensure the airway does not collapse even when air pressure decreases during exhalation." }
              ],
              longAnswer: [
                { q: "Describe the structure and functioning of a nephron in human urine formation.", keyPointsToCover: ["Bowman's capsule and Glomerulus: Ultrafiltration under hydrostatic pressure", "Proximal Convoluted Tubule: Selective reabsorption of glucose, amino acids, salts, and water", "Loop of Henle & Distal Tubule: Osmoregulation and tubular secretion", "Collecting Duct: Carries concentrated urine to renal pelvis and ureter."] }
              ]
            }
          }
        ]
      }
    ]
  },
  "class-12": {
    subjects: [
      {
        id: "physics-12",
        name: "Physics",
        icon: "Zap",
        color: "text-amber-500",
        chapters: [
          {
            id: "ch-electrostatics-12",
            title: "Electric Charges and Fields",
            number: 1,
            summary: "Coulomb's Law, electric field intensity, field lines, electric dipole in uniform field, electric flux, Gauss's Theorem and its applications.",
            keyPoints: [
              "Quantization of charge: q = ±ne, where e = 1.6 × 10⁻¹⁹ C.",
              "Coulomb's Law in vector form: F = (1 / 4πε₀) × (q₁q₂ / r²) r̂.",
              "Electric field inside a hollow spherical conductor in electrostatic equilibrium is zero.",
              "Gauss's Law states that total flux through a closed surface is Φ = Q_enclosed / ε₀."
            ],
            definitions: [
              { term: "Electric Dipole Moment", definition: "A vector directed from the negative to the positive charge with magnitude p = q × 2a." },
              { term: "Gauss's Theorem", definition: "The total electric flux passing through any closed Gaussian surface equals 1/ε₀ times the net charge enclosed by the surface." }
            ],
            formulaSheet: [
              { name: "Coulomb's Law", formula: "F = (1 / 4πε₀) · (q₁q₂ / r²)" },
              { name: "Gauss's Law", formula: "∮ E · dA = Q_enclosed / ε₀" },
              { name: "Field due to infinite wire", formula: "E = λ / (2πε₀r)" },
              { name: "Torque on dipole", formula: "τ = p × E = pE sin θ" }
            ],
            mcqQuiz: [
              {
                id: "ph12_1",
                question: "What is the electric field intensity at a distance r from an infinitely long straight wire carrying uniform linear charge density λ?",
                options: ["λ / (2πε₀r)", "λ / (4πε₀r²)", "λ / (2ε₀)", "Zero"],
                correctIndex: 0,
                explanation: "By Gauss's theorem with a cylindrical Gaussian surface of radius r and length L, E(2πrL) = λL/ε₀ => E = λ/(2πε₀r)."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Why do electric field lines never intersect each other?", modelAnswer: "If two electric field lines intersected, at the point of intersection there would be two tangents, meaning two different directions for the electric field at that single point, which is physically impossible." }
              ],
              longAnswer: [
                { q: "State Gauss's Law in electrostatics. Use it to derive the expression for the electric field due to a uniformly charged thin spherical shell at points outside and inside the shell.", keyPointsToCover: ["Statement of Gauss's Law: ∮ E·dA = q_enc/ε₀", "Outside (r > R): Gaussian sphere of radius r gives E(4πr²) = q/ε₀ => E = q/(4πε₀r²)", "Inside (r < R): q_enc = 0 => E(4πr²) = 0 => E = 0", "Sketch showing E rising to peak at surface and falling as 1/r² outside."] }
              ]
            }
          },
          {
            id: "ch-optics-12",
            title: "Ray Optics and Optical Instruments",
            number: 9,
            summary: "Refraction at spherical surfaces, lenses, thin lens formula, lens maker's formula, prism deviation, compound microscope, and astronomical telescope.",
            keyPoints: [
              "Snell's Law: n₁ sin i = n₂ sin r.",
              "Total Internal Reflection occurs when light travels from denser to rarer medium with angle of incidence i > critical angle c (sin c = 1/n).",
              "Lens Maker's Formula: 1/f = (n - 1) × (1/R₁ - 1/R₂).",
              "Magnifying power of compound microscope in normal adjustment: m = -(L / f₀) × (D / f_e)."
            ],
            definitions: [
              { term: "Total Internal Reflection", definition: "Complete reflection of a ray of light within a denser medium when incident at an angle exceeding the critical angle." }
            ],
            formulaSheet: [
              { name: "Lens Maker's Formula", formula: "1/f = (μ - 1) · (1/R₁ - 1/R₂)" },
              { name: "Prism Formula", formula: "μ = sin((A + Dm)/2) / sin(A/2)" },
              { name: "Critical Angle", formula: "sin(ic) = 1 / μ" }
            ],
            mcqQuiz: [
              {
                id: "opt1",
                question: "An equiconvex lens of focal length f in air is cut symmetrically into two halves by a plane perpendicular to the principal axis. The focal length of each half is:",
                options: ["f/2", "f", "2f", "4f"],
                correctIndex: 2,
                explanation: "For the full lens 1/f = (μ-1)(1/R - (-1/R)) = 2(μ-1)/R. For each half (plano-convex), 1/f' = (μ-1)(1/R - 0) = (μ-1)/R = 1/(2f). Hence f' = 2f."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Why is the objective of an astronomical telescope made of large focal length and large aperture?", modelAnswer: "Large aperture gathers more light from faint distant stars giving a bright image and high resolving power (limit of resolution = 1.22λ/D). Large focal length f₀ maximizes angular magnification m = f₀/f_e." }
              ],
              longAnswer: [
                { q: "Derive the prism formula relating the refractive index μ of a prism to the angle of the prism A and angle of minimum deviation Dm.", keyPointsToCover: ["Ray diagram through triangular prism", "Relation A = r₁ + r₂", "Deviation δ = (i + e) - A", "At minimum deviation δ = Dm, i = e and r₁ = r₂ = r = A/2", "i = (A + Dm)/2", "Apply Snell's law: μ = sin i / sin r = sin((A + Dm)/2) / sin(A/2)."] }
              ]
            }
          }
        ]
      },
      {
        id: "chemistry-12",
        name: "Chemistry",
        icon: "Atom",
        color: "text-purple-500",
        chapters: [
          {
            id: "ch-solutions-12",
            title: "Solutions",
            number: 1,
            summary: "Types of solutions, Henry's Law, Raoult's Law for volatile liquids, ideal and non-ideal solutions, colligative properties, van 't Hoff factor.",
            keyPoints: [
              "Henry's Law: p = K_H × x (solubility of gas in liquid is proportional to partial pressure).",
              "Raoult's Law: Partial vapor pressure of each component is p_i = p_i° × x_i.",
              "Four colligative properties: Relative lowering of vapor pressure, elevation in boiling point (ΔTb = Kb × m), depression in freezing point (ΔTf = Kf × m), osmotic pressure (π = iCRT).",
              "van 't Hoff factor i = normal molar mass / abnormal molar mass = total moles after association/dissociation / initial moles."
            ],
            definitions: [
              { term: "Colligative Properties", definition: "Properties of dilute solutions that depend only on the number of solute particles, not on their nature or chemical identity." },
              { term: "Azeotrope", definition: "A liquid mixture of constant composition that boils at a constant temperature without undergoing change in composition." }
            ],
            formulaSheet: [
              { name: "Elevation in Boiling Point", formula: "ΔTb = i · Kb · m" },
              { name: "Depression in Freezing Point", formula: "ΔTf = i · Kf · m" },
              { name: "Osmotic Pressure", formula: "π = i · C · R · T" },
              { name: "van 't Hoff factor (dissociation)", formula: "i = 1 + (n - 1)α" }
            ],
            mcqQuiz: [
              {
                id: "ch12_1",
                question: "Which 0.1 M aqueous solution will exhibit the highest boiling point?",
                options: ["0.1 M Glucose", "0.1 M NaCl", "0.1 M BaCl₂", "0.1 M Al₂(SO₄)₃"],
                correctIndex: 3,
                explanation: "Al₂(SO₄)₃ dissociates into 2 Al³⁺ + 3 SO₄²⁻ (i = 5). Higher particle concentration yields the highest elevation in boiling point."
              }
            ],
            practiceQuestions: {
              shortAnswer: [
                { q: "Why do aquatic species feel more comfortable in cold water than in warm water?", modelAnswer: "According to Henry's law, gas solubility decreases with temperature rise (Henry's constant K_H increases with temperature). Cold water contains more dissolved oxygen than warm water." }
              ],
              longAnswer: [
                { q: "Calculate the depression in freezing point of water when 10 g of CH₃CH₂CHClCOOH is added to 250 g of water (Ka = 1.4 × 10⁻³, Kf = 1.86 K kg/mol).", keyPointsToCover: ["Molar mass of solute = 122.5 g/mol", "Molality m = (10/122.5) / 0.25 kg = 0.326 m", "Degree of dissociation α = √(Ka / C) = √(1.4×10⁻³ / 0.326) = 0.065", "i = 1 + α = 1.065", "ΔTf = i × Kf × m = 1.065 × 1.86 × 0.326 = 0.65 K."] }
              ]
            }
          }
        ]
      }
    ]
  },
  "class-6": {
    subjects: [
      {
        id: "science-6",
        name: "Science",
        icon: "Compass",
        color: "text-teal-500",
        chapters: [
          {
            id: "ch-food-sources-6",
            title: "Components of Food",
            number: 1,
            summary: "Nutrients in food: carbohydrates, proteins, fats, vitamins, minerals, dietary fibre, and balanced diet.",
            keyPoints: [
              "Carbohydrates and fats are energy-giving foods.",
              "Proteins are bodybuilding foods required for growth and tissue repair.",
              "Vitamins and minerals protect the body from diseases.",
              "Lack of vitamin C causes scurvy; deficiency of vitamin D causes rickets."
            ],
            definitions: [
              { term: "Balanced Diet", definition: "A diet containing all essential nutrients in proper proportion along with sufficient roughage and water." }
            ],
            formulaSheet: [],
            mcqQuiz: [
              {
                id: "sc6_1",
                question: "Which chemical reagent turns starch blue-black during food testing?",
                options: ["Copper sulphate", "Dilute Iodine solution", "Caustic soda", "Ethanol"],
                correctIndex: 1,
                explanation: "Iodine solution forms a characteristic blue-black complex in the presence of starch."
              }
            ],
            practiceQuestions: {
              shortAnswer: [{ q: "What is roughage and why is it important in our diet?", modelAnswer: "Roughage is dietary fibre mainly provided by plant products. Although it does not supply nutrients, it adds bulk to food and aids in bowel movement." }],
              longAnswer: [{ q: "List major deficiency diseases and their associated vitamin or mineral deficiencies.", keyPointsToCover: ["Vitamin A: Night blindness", "Vitamin B1: Beriberi", "Vitamin C: Scurvy", "Vitamin D: Rickets", "Iron: Anaemia", "Iodine: Goitre."] }]
            }
          }
        ]
      }
    ]
  },
  "class-7": {
    subjects: [
      {
        id: "science-7",
        name: "Science",
        icon: "Leaf",
        color: "text-emerald-600",
        chapters: [
          {
            id: "ch-nutrition-plants-7",
            title: "Nutrition in Plants",
            number: 1,
            summary: "Mode of nutrition in plants, photosynthesis process, insectivorous and saprotrophic nutrition.",
            keyPoints: ["Autotrophs make their own food.", "Chlorophyll traps sunlight.", "Stomata allow gas exchange.", "Cuscuta is a parasitic plant."],
            definitions: [{ term: "Autotrophic Nutrition", definition: "Mode of nutrition in which organisms make food themselves from simple substances." }],
            formulaSheet: [],
            mcqQuiz: [{ id: "n7_1", question: "Which of the following is a parasitic plant?", options: ["Pitcher plant", "Cuscuta (Amarbel)", "Algae", "Mushroom"], correctIndex: 1, explanation: "Cuscuta is a yellow non-green parasite that absorbs nutrients from a host tree." }],
            practiceQuestions: {
              shortAnswer: [{ q: "Why are leaves called the food factories of plants?", modelAnswer: "Leaves synthesize food through photosynthesis using sunlight trapped by chlorophyll." }],
              longAnswer: [{ q: "Explain how insectivorous plants obtain nutrition.", keyPointsToCover: ["Pitcher plants grow in nitrogen-deficient soil", "Leaves modified into pitcher with lid", "Insects trapped and digested by enzymes to obtain nitrogen."] }]
            }
          }
        ]
      }
    ]
  },
  "class-8": {
    subjects: [
      {
        id: "science-8",
        name: "Science",
        icon: "Lightbulb",
        color: "text-amber-600",
        chapters: [
          {
            id: "ch-force-pressure-8",
            title: "Force and Pressure",
            number: 11,
            summary: "Contact and non-contact forces, atmospheric pressure, and pressure exerted by liquids.",
            keyPoints: ["Force is a push or pull.", "SI unit of force is Newton (N).", "Pressure = Force / Area.", "Liquids exert equal pressure at the same depth in all directions."],
            definitions: [{ term: "Pressure", definition: "The continuous physical force exerted per unit area of a surface: P = F / A." }],
            formulaSheet: [{ name: "Pressure Formula", formula: "Pressure = Force / Area (P = F / A, Unit: N/m² or Pascal)" }],
            mcqQuiz: [{ id: "fp8_1", question: "If the area of contact is halved while the applied force remains constant, the pressure will:", options: ["Be halved", "Remain unchanged", "Double", "Quadruple"], correctIndex: 2, explanation: "Since Pressure = Force / Area, pressure is inversely proportional to area. Halving area doubles pressure." }],
            practiceQuestions: {
              shortAnswer: [{ q: "Why do porter caps use round cloth rolls when carrying heavy loads?", modelAnswer: "The cloth roll increases the contact area with the head, thereby reducing pressure exerted on the head (P = F/A)." }],
              longAnswer: [{ q: "Differentiate between contact and non-contact forces with examples.", keyPointsToCover: ["Contact forces require physical contact: Muscular force, Friction", "Non-contact forces act from a distance: Gravitational, Magnetic, Electrostatic force."] }]
            }
          }
        ]
      }
    ]
  },
  "class-9": {
    subjects: [
      {
        id: "science-9",
        name: "Science",
        icon: "Flame",
        color: "text-red-500",
        chapters: [
          {
            id: "ch-motion-9",
            title: "Motion",
            number: 8,
            summary: "Distance and displacement, uniform and non-uniform motion, velocity, acceleration, three equations of motion, and uniform circular motion.",
            keyPoints: [
              "Displacement is the shortest straight-line vector from initial to final position.",
              "Acceleration is rate of change of velocity: a = (v - u) / t.",
              "Three kinematic equations: v = u + at, s = ut + ½at², v² = u² + 2as.",
              "In uniform circular motion, speed is constant while velocity continuously changes direction."
            ],
            definitions: [
              { term: "Displacement", definition: "The vector distance between the starting point and ending point of a moving object." },
              { term: "Acceleration", definition: "The time rate of change of velocity: a = Δv / Δt." }
            ],
            formulaSheet: [
              { name: "First Equation of Motion", formula: "v = u + at" },
              { name: "Second Equation of Motion", formula: "s = ut + ½at²" },
              { name: "Third Equation of Motion", formula: "v² = u² + 2as" }
            ],
            mcqQuiz: [
              {
                id: "m9_1",
                question: "A car accelerates uniformly from rest at 2 m/s² for 5 seconds. What distance does it cover?",
                options: ["10 m", "25 m", "50 m", "100 m"],
                correctIndex: 1,
                explanation: "Using s = ut + ½at² with u = 0, a = 2, t = 5 => s = 0 + ½(2)(5²) = 25 m."
              }
            ],
            practiceQuestions: {
              shortAnswer: [{ q: "Can an object have zero displacement even if it has moved through a non-zero distance?", modelAnswer: "Yes. If an athlete runs around a circular track and returns to the initial starting point, total distance is 2πr, but displacement is zero because initial and final positions coincide." }],
              longAnswer: [{ q: "Derive the second equation of motion s = ut + ½at² graphically using a velocity-time graph.", keyPointsToCover: ["Draw v-t graph for uniform acceleration", "Total distance s is area under the graph = Area of rectangle (OADC) + Area of triangle (ABD)", "Area of rectangle = u × t", "Area of triangle = ½ × Base × Height = ½ × t × (at) = ½at²", "Sum = ut + ½at²."] }]
            }
          }
        ]
      }
    ]
  },
  "class-11": {
    subjects: [
      {
        id: "physics-11",
        name: "Physics",
        icon: "Orbit",
        color: "text-indigo-500",
        chapters: [
          {
            id: "ch-laws-of-motion-11",
            title: "Laws of Motion",
            number: 5,
            summary: "Newton's laws of motion, momentum, impulse, law of conservation of linear momentum, equilibrium of a particle, friction, circular motion and banked roads.",
            keyPoints: [
              "Newton's First Law: Law of Inertia.",
              "Newton's Second Law: F = dp/dt = ma (when mass is constant).",
              "Newton's Third Law: For every action, there is an equal and opposite reaction.",
              "Maximum safe velocity on a banked circular road: v_max = √[Rg(μ + tan θ) / (1 - μ tan θ)]."
            ],
            definitions: [
              { term: "Impulse", definition: "The product of average force and time of contact: J = F_avg × Δt = Δp (change in momentum)." },
              { term: "Angle of Repose", definition: "The minimum angle of an inclined plane at which a body placed on it just begins to slide down." }
            ],
            formulaSheet: [
              { name: "Newton's Second Law", formula: "F = m · a" },
              { name: "Linear Momentum", formula: "p = m · v" },
              { name: "Frictional Force", formula: "f_s ≤ μ_s · N,  f_k = μ_k · N" },
              { name: "Safe Banking Speed", formula: "v = √(R · g · tan θ)" }
            ],
            mcqQuiz: [
              {
                id: "ph11_1",
                question: "A rocket works on the principle of conservation of:",
                options: ["Mass", "Energy", "Linear Momentum", "Angular Momentum"],
                correctIndex: 2,
                explanation: "The backward momentum of expelled exhaust gases imparts an equal forward momentum to the rocket."
              }
            ],
            practiceQuestions: {
              shortAnswer: [{ q: "Why does a cricketer lower his hands while catching a fast cricket ball?", modelAnswer: "By pulling hands backward, the cricketer increases the time interval Δt of stopping the ball. Since F = Δp / Δt, increasing time decreases the impact force, preventing hand injury." }],
              longAnswer: [{ q: "Derive an expression for the optimum and maximum safe speed of a car on a curved road of radius R banked at an angle θ with friction coefficient μ.", keyPointsToCover: ["Free body diagram resolving normal force N and friction f", "Vertical equilibrium: N cos θ = mg + f sin θ", "Centripetal requirement: N sin θ + f cos θ = mv²/R", "Substitute f = μN", "Derivation yields v_max = √[Rg(tan θ + μ) / (1 - μ tan θ)]."] }]
            }
          }
        ]
      }
    ]
  }
};
