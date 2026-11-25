const mcq = (id, subject, chapter, question, options, correctIndex, explanation) => ({
  id,
  type: "mcq",
  subject,
  section: "Section A (MCQ)",
  chapter,
  question,
  options,
  correctIndex,
  explanation
});

const numerical = (id, subject, chapter, question, correctValue, explanation, tolerance = 0.01) => ({
  id,
  type: "numerical",
  subject,
  section: "Section B (Numerical)",
  chapter,
  question,
  correctValue: String(correctValue),
  tolerance,
  explanation
});

export const JEE_MAIN_PRACTICE_SECTIONS = [
  {
    id: "physics",
    name: "Physics",
    secA: [
      mcq("p01", "Physics", "Kinematics", "A particle starts from rest and moves with constant acceleration 2 m s⁻². Its displacement in the fifth second is:", ["7 m", "9 m", "10 m", "18 m"], 1, "Distance in the nth second is u + a(2n − 1)/2. For n = 5, this is 0 + 2(9)/2 = 9 m."),
      mcq("p02", "Physics", "Laws of Motion", "A 2 kg block on a smooth horizontal surface is pulled by a 10 N force at 60° above the horizontal. Its horizontal acceleration is:", ["1.25 m s⁻²", "2.5 m s⁻²", "5 m s⁻²", "10 m s⁻²"], 1, "The horizontal component is 10 cos 60° = 5 N. Thus a = F/m = 5/2 = 2.5 m s⁻²."),
      mcq("p03", "Physics", "Work, Energy and Power", "A 2 kg body moving at 3 m s⁻¹ is brought to rest by a constant force. The work done by that force is:", ["−9 J", "−6 J", "6 J", "9 J"], 0, "Work equals the change in kinetic energy: 0 − (1/2)(2)(3²) = −9 J."),
      mcq("p04", "Physics", "Centre of Mass", "Two particles of masses 1 kg and 3 kg are at x = 0 m and x = 4 m. The x-coordinate of their centre of mass is:", ["2 m", "3 m", "3.5 m", "4 m"], 1, "x_cm = (1·0 + 3·4)/(1 + 3) = 3 m."),
      mcq("p05", "Physics", "Rotational Motion", "A uniform solid disc rolls without slipping. The ratio of its rotational kinetic energy to its translational kinetic energy is:", ["1:1", "1:2", "2:1", "1:4"], 1, "For a disc I = MR²/2 and ω = v/R. Hence K_rot = Mv²/4, while K_trans = Mv²/2; the ratio is 1:2."),
      mcq("p06", "Physics", "Gravitation", "At a height equal to Earth's radius above its surface, the acceleration due to gravity is (g is its surface value):", ["g/2", "g/3", "g/4", "g/9"], 2, "The distance from Earth's centre is 2R, so g' = GM/(2R)² = g/4."),
      mcq("p07", "Physics", "Properties of Matter", "A liquid flows through a horizontal pipe. If its speed doubles at a narrower section, the pressure there compared with the wider section is:", ["Higher", "Lower", "Unchanged", "Zero"], 1, "Bernoulli's equation at equal height gives P + ρv²/2 = constant. Greater speed corresponds to lower pressure."),
      mcq("p08", "Physics", "Thermodynamics", "One mole of an ideal gas is heated at constant volume by ΔT. The heat supplied is:", ["nRΔT", "nCᵥΔT", "nCₚΔT", "Zero"], 1, "At constant volume no boundary work is done, so Q = ΔU = nCᵥΔT."),
      mcq("p09", "Physics", "Electrostatics", "Two equal positive point charges are separated by 2a. The electric field at the midpoint is:", ["Zero", "Along the line joining them", "Perpendicular to the line", "Infinite"], 0, "The two fields at the midpoint have equal magnitudes and opposite directions, so they cancel."),
      mcq("p10", "Physics", "Capacitance", "A parallel-plate capacitor is disconnected from a battery and the plate separation is doubled. Its stored energy becomes:", ["Half", "Unchanged", "Double", "Four times"], 2, "With charge fixed, U = Q²/(2C). Doubling separation halves C, so the energy doubles."),
      mcq("p11", "Physics", "Current Electricity", "A wire of resistance R is cut into two equal lengths and the pieces are connected in parallel. The equivalent resistance is:", ["R/4", "R/2", "R", "2R"], 0, "Each half has resistance R/2. Two equal R/2 resistors in parallel give R/4."),
      mcq("p12", "Physics", "Magnetism", "A charged particle moves parallel to a uniform magnetic field. The magnetic force on it is:", ["qvB", "qvB/2", "Zero", "Dependent on its mass"], 2, "The magnetic force magnitude is qvB sin θ. For parallel motion θ = 0, so it is zero."),
      mcq("p13", "Physics", "Electromagnetic Induction", "The magnetic flux through a 50-turn coil changes by 0.02 Wb in 0.1 s. The magnitude of the average induced emf is:", ["0.1 V", "1 V", "10 V", "100 V"], 2, "Faraday's law gives |ε| = N|ΔΦ|/Δt = 50(0.02)/0.1 = 10 V."),
      mcq("p14", "Physics", "Alternating Current", "In a series LCR circuit at resonance, the impedance is:", ["Zero", "R", "ωL", "1/(ωC)"], 1, "At resonance the inductive and capacitive reactances cancel, leaving impedance Z = R."),
      mcq("p15", "Physics", "Ray Optics", "An object is placed at 2f in front of a thin convex lens. The image is formed:", ["At f, diminished", "At 2f, same size", "At infinity", "Between f and 2f, enlarged"], 1, "The thin-lens equation gives v = 2f when u = 2f; the image is real, inverted and the same size."),
      mcq("p16", "Physics", "Wave Optics", "In Young's double-slit experiment, the slit separation is doubled while all other quantities remain fixed. The fringe width:", ["Doubles", "Halves", "Is unchanged", "Becomes four times"], 1, "Fringe width β = λD/d, so doubling d halves β."),
      mcq("p17", "Physics", "Dual Nature of Matter", "If the accelerating potential of an electron is increased from V to 4V, its de Broglie wavelength becomes:", ["2λ", "λ", "λ/2", "λ/4"], 2, "For a non-relativistic electron λ ∝ 1/√V. Thus λ' = λ/2."),
      mcq("p18", "Physics", "Atoms", "The radius of the second Bohr orbit of hydrogen is:", ["a₀", "2a₀", "4a₀", "8a₀"], 2, "The Bohr radius scales as r_n = n²a₀. For n = 2, r₂ = 4a₀."),
      mcq("p19", "Physics", "Nuclei", "A radioactive sample has a half-life of 2 hours. The fraction remaining after 6 hours is:", ["1/2", "1/4", "1/8", "1/16"], 2, "Six hours is three half-lives, so the remaining fraction is (1/2)³ = 1/8."),
      mcq("p20", "Physics", "Semiconductors", "A p-n junction diode is forward biased when:", ["p-side is connected to negative terminal", "n-side is connected to positive terminal", "p-side is connected to positive terminal", "Both sides are at the same potential"], 2, "Forward bias connects the p-side to positive and the n-side to negative, reducing the depletion barrier.")
    ],
    secB: [
      numerical("pn01", "Physics", "Kinematics", "A body starts from rest and accelerates uniformly at 3 m s⁻² for 4 s. Find its displacement in metres.", 24, "s = ut + at²/2 = 0 + 3(16)/2 = 24 m."),
      numerical("pn02", "Physics", "Current Electricity", "A 6 Ω resistor is connected across a 12 V ideal source. Find the current in amperes.", 2, "Ohm's law gives I = V/R = 12/6 = 2 A."),
      numerical("pn03", "Physics", "Electrostatics", "Two 2 μC charges are 0.3 m apart in vacuum. Using k = 9 × 10⁹ N m² C⁻², find the force magnitude in newtons.", 0.4, "F = kq²/r² = 9×10⁹(2×10⁻⁶)²/(0.3)² = 0.4 N."),
      numerical("pn04", "Physics", "Work, Energy and Power", "A 2 kg object is raised vertically by 5 m. Taking g = 10 m s⁻², find the increase in gravitational potential energy in joules.", 100, "ΔU = mgh = 2×10×5 = 100 J."),
      numerical("pn05", "Physics", "Waves", "A wave travels at 340 m s⁻¹ and has frequency 170 Hz. Find its wavelength in metres.", 2, "λ = v/f = 340/170 = 2 m.")
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    secA: [
      mcq("c01", "Chemistry", "Some Basic Concepts", "The number of molecules in 0.5 mol of a substance is:", ["Nₐ/2", "Nₐ", "2Nₐ", "0.5"], 0, "Number of entities = nNₐ = 0.5Nₐ."),
      mcq("c02", "Chemistry", "Atomic Structure", "The maximum number of electrons that can occupy the shell with principal quantum number n = 3 is:", ["8", "18", "32", "9"], 1, "The maximum shell capacity is 2n² = 2(3²) = 18."),
      mcq("c03", "Chemistry", "Periodic Table", "Among the following, the element with the largest atomic radius is:", ["Li", "Na", "K", "Rb"], 3, "Atomic radius generally increases down a group as additional electron shells are occupied."),
      mcq("c04", "Chemistry", "Chemical Bonding", "The molecular shape of NH₃ is:", ["Trigonal planar", "Trigonal pyramidal", "Tetrahedral", "Linear"], 1, "Nitrogen has three bond pairs and one lone pair; the electron geometry is tetrahedral and the molecular shape is trigonal pyramidal."),
      mcq("c05", "Chemistry", "Chemical Thermodynamics", "For an exothermic reaction at constant pressure, the enthalpy change ΔH is:", ["Positive", "Negative", "Zero", "Always equal to ΔS"], 1, "An exothermic reaction releases heat, so its enthalpy change is negative."),
      mcq("c06", "Chemistry", "Chemical Equilibrium", "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing pressure at constant temperature shifts equilibrium:", ["Towards reactants", "Towards products", "Neither direction", "First right, then left"], 1, "The product side has fewer gas moles (2 versus 4), so increased pressure favours NH₃ formation."),
      mcq("c07", "Chemistry", "Ionic Equilibrium", "At 25°C, the pH of a neutral aqueous solution is:", ["0", "1", "7", "14"], 2, "For a neutral solution at 25°C, [H⁺] = 10⁻⁷ mol L⁻¹ and pH = 7."),
      mcq("c08", "Chemistry", "Redox Reactions", "The oxidation number of sulfur in H₂SO₄ is:", ["+2", "+4", "+6", "+8"], 2, "Let sulfur's oxidation number be x: 2(+1) + x + 4(−2) = 0, giving x = +6."),
      mcq("c09", "Chemistry", "Electrochemistry", "For a galvanic cell operating spontaneously, the standard cell potential E°cell is:", ["Negative", "Positive", "Zero", "Equal to the anode potential"], 1, "A spontaneous galvanic cell has ΔG° = −nFE°cell < 0, so E°cell is positive."),
      mcq("c10", "Chemistry", "Chemical Kinetics", "For a first-order reaction, the unit of its rate constant is:", ["mol L⁻¹ s⁻¹", "L mol⁻¹ s⁻¹", "s⁻¹", "mol² L⁻² s⁻¹"], 2, "A first-order rate constant has dimensions of inverse time, hence s⁻¹."),
      mcq("c11", "Chemistry", "Solutions", "For an ideal dilute solution, the relative lowering of vapour pressure equals the:", ["Mole fraction of solvent", "Mole fraction of solute", "Molarity of solvent", "Molality of solvent"], 1, "Raoult's law gives (p° − p)/p° = x_solute for a solution with a non-volatile solute."),
      mcq("c12", "Chemistry", "Coordination Compounds", "The coordination number of cobalt in [Co(NH₃)₆]Cl₃ is:", ["3", "4", "6", "9"], 2, "Six monodentate NH₃ ligands are directly bonded to cobalt, giving coordination number 6."),
      mcq("c13", "Chemistry", "d-Block Elements", "Which ion has a d⁵ configuration?", ["Fe²⁺", "Fe³⁺", "Co²⁺", "Ni²⁺"], 1, "Fe has configuration [Ar]3d⁶4s². Removing three electrons gives Fe³⁺: [Ar]3d⁵."),
      mcq("c14", "Chemistry", "Chemical Bonding", "Which molecule has a non-zero dipole moment?", ["CO₂", "BF₃", "CCl₄", "NH₃"], 3, "NH₃ is trigonal pyramidal, so its N–H bond dipoles do not cancel."),
      mcq("c15", "Chemistry", "General Organic Chemistry", "The most stable carbocation among these is:", ["CH₃⁺", "CH₃CH₂⁺", "(CH₃)₂CH⁺", "(CH₃)₃C⁺"], 3, "Alkyl groups stabilize a carbocation by hyperconjugation and the +I effect; the tertiary carbocation is most stabilized."),
      mcq("c16", "Chemistry", "Hydrocarbons", "Addition of HBr to propene in the absence of peroxide gives mainly:", ["1-bromopropane", "2-bromopropane", "1,2-dibromopropane", "2-bromopropene"], 1, "Under normal conditions Markovnikov addition places Br on the more substituted carbon, forming 2-bromopropane."),
      mcq("c17", "Chemistry", "Alcohols and Phenols", "Phenol is more acidic than ethanol mainly because its conjugate base:", ["Has a stronger O–H bond", "Is resonance-stabilized", "Has no oxygen atom", "Is positively charged"], 1, "The phenoxide ion delocalizes negative charge over the aromatic ring, stabilizing the conjugate base."),
      mcq("c18", "Chemistry", "Aldehydes and Ketones", "Which reagent gives a silver mirror with an aldehyde?", ["Tollens' reagent", "Lucas reagent", "Conc. H₂SO₄", "Br₂ in CCl₄"], 0, "Aldehydes reduce Tollens' reagent to metallic silver, producing the silver-mirror test."),
      mcq("c19", "Chemistry", "Amines", "Aniline is less basic than cyclohexylamine because the nitrogen lone pair in aniline is:", ["Localized on nitrogen only", "Delocalized into the benzene ring", "Used to form an N–H bond", "Absent"], 1, "Resonance delocalization into the aromatic ring makes the lone pair less available for protonation."),
      mcq("c20", "Chemistry", "Biomolecules", "The monomer units of proteins are:", ["Monosaccharides", "Nucleotides", "Amino acids", "Fatty acids"], 2, "Proteins are polymers of amino acids joined by peptide bonds.")
    ],
    secB: [
      numerical("cn01", "Chemistry", "Some Basic Concepts", "How many moles are present in 18 g of water? (Molar mass = 18 g mol⁻¹)", 1, "n = mass/molar mass = 18/18 = 1 mol."),
      numerical("cn02", "Chemistry", "Solutions", "A solution contains 2 mol solute and 8 mol solvent. Find the mole fraction of the solute.", 0.2, "x_solute = 2/(2 + 8) = 0.2."),
      numerical("cn03", "Chemistry", "Chemical Kinetics", "A first-order reaction has half-life 20 minutes. Find its rate constant in min⁻¹ (use k = 0.693/t₁/₂).", 0.03465, "k = 0.693/20 = 0.03465 min⁻¹.", 0.0001),
      numerical("cn04", "Chemistry", "Electrochemistry", "How many faradays of charge are required to deposit 1 mol of Ag from Ag⁺? (Ag⁺ + e⁻ → Ag)", 1, "One electron is required per Ag⁺ ion, so one mole of Ag requires one faraday."),
      numerical("cn05", "Chemistry", "Atomic Structure", "How many orbitals are present in a subshell with azimuthal quantum number l = 2?", 5, "The number of orbitals in a subshell is 2l + 1 = 5.")
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics",
    secA: [
      mcq("m01", "Mathematics", "Sets and Functions", "If f(x) = 2x + 3, then f⁻¹(x) is:", ["(x + 3)/2", "(x − 3)/2", "2x − 3", "3 − 2x"], 1, "Set y = 2x + 3 and solve for x: x = (y − 3)/2. Therefore f⁻¹(x) = (x − 3)/2."),
      mcq("m02", "Mathematics", "Complex Numbers", "The modulus of 3 − 4i is:", ["1", "5", "7", "25"], 1, "|z| = √(3² + (−4)²) = 5."),
      mcq("m03", "Mathematics", "Quadratic Equations", "The roots of x² − 5x + 6 = 0 are:", ["1, 6", "−2, −3", "2, 3", "−1, −6"], 2, "Factorization gives (x − 2)(x − 3) = 0, so the roots are 2 and 3."),
      mcq("m04", "Mathematics", "Sequences and Series", "The sum of the first 10 terms of the AP 2, 5, 8, … is:", ["145", "150", "155", "160"], 2, "Sₙ = n/2[2a + (n−1)d] = 10/2[4 + 27] = 155."),
      mcq("m05", "Mathematics", "Binomial Theorem", "The coefficient of x² in (1 + x)⁵ is:", ["5", "10", "15", "20"], 1, "The coefficient is the binomial coefficient C(5,2) = 10."),
      mcq("m06", "Mathematics", "Permutations and Combinations", "The number of ways to choose 2 students from 6 students is:", ["12", "15", "30", "36"], 1, "The number of selections is C(6,2) = 6·5/2 = 15."),
      mcq("m07", "Mathematics", "Matrices and Determinants", "The determinant of [[2, 1], [3, 4]] is:", ["5", "8", "11", "14"], 0, "The determinant is 2·4 − 1·3 = 5."),
      mcq("m08", "Mathematics", "Limits", "The value of lim(x→0) sin(5x)/x is:", ["0", "1", "5", "25"], 2, "Write sin(5x)/x = 5·sin(5x)/(5x); the standard limit is 1, giving 5."),
      mcq("m09", "Mathematics", "Continuity and Differentiability", "The derivative of x³ − 2x at x = 2 is:", ["8", "10", "12", "14"], 1, "The derivative is 3x² − 2; at x = 2 it equals 12 − 2 = 10."),
      mcq("m10", "Mathematics", "Application of Derivatives", "The function f(x) = x² − 4x has its minimum at:", ["x = 0", "x = 1", "x = 2", "x = 4"], 2, "f'(x) = 2x − 4 = 0 gives x = 2; since f''(x) = 2 > 0, this is a minimum."),
      mcq("m11", "Mathematics", "Indefinite Integration", "An antiderivative of 2x is:", ["x + C", "x² + C", "2x² + C", "x³ + C"], 1, "∫2x dx = x² + C."),
      mcq("m12", "Mathematics", "Definite Integration", "The value of ∫₀¹ 3x² dx is:", ["1/2", "1", "3/2", "3"], 1, "The antiderivative is x³; evaluating from 0 to 1 gives 1."),
      mcq("m13", "Mathematics", "Differential Equations", "The order of d²y/dx² + (dy/dx)³ + y = 0 is:", ["1", "2", "3", "6"], 1, "The highest order derivative present is the second derivative, so the order is 2."),
      mcq("m14", "Mathematics", "Coordinate Geometry", "The slope of the line through (1, 2) and (3, 6) is:", ["1", "2", "3", "4"], 1, "Slope = (6 − 2)/(3 − 1) = 2."),
      mcq("m15", "Mathematics", "Circle", "The radius of the circle x² + y² − 6x + 4y − 12 = 0 is:", ["3", "4", "5", "6"], 2, "Completing squares gives (x−3)² + (y+2)² = 25, hence radius 5."),
      mcq("m16", "Mathematics", "Vectors", "The magnitude of vector 2i − 3j + 6k is:", ["5", "6", "7", "9"], 2, "Magnitude = √(2² + (−3)² + 6²) = √49 = 7."),
      mcq("m17", "Mathematics", "Three-Dimensional Geometry", "The distance between points (1, 2, 3) and (1, 5, 7) is:", ["4", "5", "6", "7"], 1, "Distance = √[(0)² + 3² + 4²] = 5."),
      mcq("m18", "Mathematics", "Probability", "A fair die is rolled once. The probability of obtaining a prime number is:", ["1/6", "1/3", "1/2", "2/3"], 2, "The prime outcomes are 2, 3 and 5, so the probability is 3/6 = 1/2."),
      mcq("m19", "Mathematics", "Statistics", "The mean of 2, 4, 6 and 8 is:", ["4", "5", "6", "20"], 1, "The arithmetic mean is (2 + 4 + 6 + 8)/4 = 5."),
      mcq("m20", "Mathematics", "Trigonometry", "The value of sin²θ + cos²θ for every real θ is:", ["0", "1", "2", "Depends on θ"], 1, "This is the fundamental Pythagorean identity.")
    ],
    secB: [
      numerical("mn01", "Mathematics", "Limits", "Evaluate lim(x→0) (1 − cos 4x)/x².", 8, "Using 1 − cos u ~ u²/2, the limit is (4x)²/(2x²) = 8."),
      numerical("mn02", "Mathematics", "Matrices and Determinants", "Find the determinant of [[3, 2], [1, 5]].", 13, "The determinant is 3·5 − 2·1 = 13."),
      numerical("mn03", "Mathematics", "Differentiation", "If y = x⁴, find dy/dx at x = 2.", 32, "dy/dx = 4x³; at x = 2 this equals 32."),
      numerical("mn04", "Mathematics", "Definite Integration", "Evaluate ∫₀² 2x dx.", 4, "The antiderivative is x²; x² evaluated from 0 to 2 gives 4."),
      numerical("mn05", "Mathematics", "Permutations and Combinations", "How many distinct arrangements can be made from all the letters of CAT?", 6, "The three letters are distinct, giving 3! = 6 arrangements.")
    ]
  }
];

export function createJeeMainMockForm(formNumber) {
  const form = Math.max(1, Math.min(10, Number(formNumber) || 1));
  const sections = JSON.parse(JSON.stringify(JEE_MAIN_PRACTICE_SECTIONS));

  sections.forEach((section, sectionIndex) => {
    [section.secA, section.secB].forEach((questions, typeIndex) => {
      let seed = form * 31 + sectionIndex * 17 + typeIndex * 7;
      for (let index = questions.length - 1; index > 0; index--) {
        seed = (seed * 9301 + 49297) % 233280;
        const swapIndex = Math.floor((seed / 233280) * (index + 1));
        [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
      }

      questions.forEach((question, questionIndex) => {
        question.id = `jee${form}_${section.id}_${typeIndex}_${questionIndex + 1}`;
        if (question.type === "mcq") {
          const optionOffset = (form + sectionIndex + questionIndex) % question.options.length;
          question.options = question.options.map((_, optionIndex) =>
            question.options[(optionIndex + optionOffset) % question.options.length]
          );
          question.correctIndex = (question.correctIndex - optionOffset + question.options.length) % question.options.length;
        }
      });
    });
  });

  return sections;
}
