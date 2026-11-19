// Class 10 Comprehensive Curriculum Database (CBSE / NCERT 2024–25 & 2025–26 Rationalised Syllabus)
// Source: cbseacademic.nic.in & ncert.nic.in

export const CLASS_10_CURRICULUM = {
  id: "class-10",
  title: "Class 10",
  board: "CBSE / State Boards",
  syllabusYear: "2024–25 & 2025–26 (Rationalised)",
  officialSource: "https://cbseacademic.nic.in / https://ncert.nic.in",
  subjects: [
    {
      id: "maths-10",
      name: "Mathematics",
      icon: "Calculator",
      color: "text-blue-500",
      chapters: [
        {
          id: "ch-real-numbers-10",
          number: 1,
          title: "Real Numbers",
          summary: "Fundamental Theorem of Arithmetic, unique prime factorisation, proofs of irrationality for √2, √3, √5, and properties of rational numbers.",
          keyPoints: [
            "Fundamental Theorem of Arithmetic: Every composite number can be uniquely expressed as a product of prime powers.",
            "Relation: HCF(a, b) × LCM(a, b) = a × b for any two positive integers.",
            "If p is a prime number and p divides a², then p divides a (where a is a positive integer).",
            "Proof by contradiction is standard for establishing irrationality of surds (e.g., √5)."
          ],
          definitions: [
            { term: "Fundamental Theorem of Arithmetic", definition: "Every composite number can be factored uniquely as a product of primes, regardless of the order of factors." },
            { term: "Irrational Number", definition: "A real number that cannot be written in the form p/q (q ≠ 0, p,q ∈ ℤ) and whose decimal expansion is non-terminating and non-repeating." }
          ],
          formulaSheet: [
            { name: "HCF-LCM Product Theorem", formula: "HCF(a, b) · LCM(a, b) = a · b" },
            { name: "Prime Factor Form", formula: "N = p₁^(a₁) · p₂^(a₂) ··· p_k^(a_k)" }
          ],
          solvedExamples: [
            {
              title: "Find HCF and LCM by Prime Factorisation",
              question: "Find the HCF and LCM of 120 and 144 using prime factorisation and verify that HCF × LCM = 120 × 144.",
              solution: "1. Factorise 120: 120 = 2³ × 3 × 5\n2. Factorise 144: 144 = 2⁴ × 3²\n3. HCF = lowest power of common primes = 2³ × 3 = 8 × 3 = 24\n4. LCM = highest power of all primes = 2⁴ × 3² × 5 = 16 × 9 × 5 = 720\n5. Verification: HCF × LCM = 24 × 720 = 17,280. Product of numbers = 120 × 144 = 17,280. LHS = RHS."
            }
          ],
          diagram: `
+-------------------------------------------------------+
|                 REAL NUMBERS (ℝ)                      |
|  +-------------------------+  +--------------------+  |
|  |     RATIONALS (ℚ)       |  |  IRRATIONALS (𝕀)   |  |
|  |  p/q format (q ≠ 0)     |  |  Non-terminating   |  |
|  |  Integers (ℤ), Whole,   |  |  Non-repeating     |  |
|  |  Natural Numbers (ℕ)    |  |  √2, √3, √5, π     |  |
|  +-------------------------+  +--------------------+  |
+-------------------------------------------------------+
          `,
          commonTraps: [
            "Trap: Assuming HCF(a,b,c) × LCM(a,b,c) = a × b × c. THIS ONLY HOLDS FOR TWO NUMBERS, NEVER FOR THREE!",
            "Trap: Writing √5 = a/b without stating that a and b are COPRIME integers."
          ],
          boardQuestions: [
            { q: "Prove that 5 - 2√3 is irrational given that √3 is irrational.", marks: "3 Marks", hint: "Assume 5 - 2√3 = a/b, rearrange to isolate √3 = (5b - a)/(2b). Show contradiction." }
          ],
          competitiveQuestions: [
            { exam: "JEE Foundation / NTSE", q: "If the HCF of 65 and 117 is expressible in the form 65m - 117, find m.", solution: "HCF(65, 117) = 13. 65m - 117 = 13 => 65m = 130 => m = 2." }
          ],
          mcqQuiz: [
            {
              id: "q10_rn_1",
              question: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
              options: ["xy", "xy²", "x³y³", "x²y²"],
              correctIndex: 1,
              explanation: "HCF is the product of the smallest power of each common prime factor: x¹ · y² = xy²."
            },
            {
              id: "q10_rn_2",
              question: "The least number that is divisible by all numbers from 1 to 10 (both inclusive) is:",
              options: ["10", "100", "504", "2520"],
              correctIndex: 3,
              explanation: "LCM(1,2,3,4,5,6,7,8,9,10) = 2³ × 3² × 5 × 7 = 8 × 9 × 5 × 7 = 2520."
            }
          ]
        },
        {
          id: "ch-polynomials-10",
          number: 2,
          title: "Polynomials",
          summary: "Geometrical meaning of zeroes, relationship between zeroes and coefficients of quadratic and cubic polynomials.",
          keyPoints: [
            "A polynomial of degree n can have at most n real zeroes.",
            "The zeroes of p(x) are the x-coordinates of the points where the graph y = p(x) intersects the x-axis.",
            "For ax² + bx + c: Sum of zeroes (α + β) = -b/a; Product of zeroes (αβ) = c/a."
          ],
          definitions: [
            { term: "Zero of a Polynomial", definition: "A real value k such that p(k) = 0." }
          ],
          formulaSheet: [
            { name: "Sum of Zeroes", formula: "α + β = -b / a" },
            { name: "Product of Zeroes", formula: "α · β = c / a" },
            { name: "Forming Polynomial", formula: "k · [x² - (α + β)x + αβ]" }
          ],
          solvedExamples: [
            {
              title: "Form Quadratic Polynomial",
              question: "Find a quadratic polynomial whose sum and product of zeroes are -3 and 2 respectively.",
              solution: "Polynomial p(x) = k[x² - (Sum)x + Product] = k[x² - (-3)x + 2] = k(x² + 3x + 2). For k = 1, p(x) = x² + 3x + 2."
            }
          ],
          diagram: `
       y ^            Parabola y = ax² + bx + c
         |        \\         /
         |         \\       /
---------+----------*-----*----------> x
         |         α     β    (Two real zeroes where graph cuts x-axis)
         |            V (Vertex)
          `,
          commonTraps: [
            "Trap: Confusing zeroes with factors. If zeroes are 2 and -3, factors are (x - 2) and (x + 3)."
          ],
          boardQuestions: [
            { q: "If α and β are the zeroes of 2x² - 5x + 7, find the value of α⁻¹ + β⁻¹.", marks: "2 Marks", hint: "α⁻¹ + β⁻¹ = (α + β) / (αβ) = (5/2) / (7/2) = 5/7." }
          ],
          competitiveQuestions: [
            { exam: "JEE / Olympiad", q: "If zeroes of x² - px + q differ by unity, find the relation between p and q.", solution: "|α - β| = 1 => (α - β)² = 1 => (α + β)² - 4αβ = 1 => p² - 4q = 1 => p² = 4q + 1." }
          ],
          mcqQuiz: [
            {
              id: "q10_poly_1",
              question: "If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is:",
              options: ["10", "-10", "-7", "-2"],
              correctIndex: 1,
              explanation: "p(2) = 2² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10."
            }
          ]
        },
        {
          id: "ch-linear-eq-10",
          number: 3,
          title: "Pair of Linear Equations in Two Variables",
          summary: "Graphical and algebraic methods (substitution, elimination), consistency conditions, and word problems on speed, age, and fractions.",
          keyPoints: [
            "Intersecting lines: a₁/a₂ ≠ b₁/b₂ (Unique solution, Consistent).",
            "Coincident lines: a₁/a₂ = b₁/b₂ = c₁/c₂ (Infinitely many solutions, Consistent dependent).",
            "Parallel lines: a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (No solution, Inconsistent)."
          ],
          definitions: [
            { term: "Consistent System", definition: "A pair of linear equations that has at least one valid solution." }
          ],
          formulaSheet: [
            { name: "Unique Solution Condition", formula: "a₁ / a₂ ≠ b₁ / b₂" },
            { name: "No Solution (Parallel)", formula: "a₁ / a₂ = b₁ / b₂ ≠ c₁ / c₂" },
            { name: "Infinite Solutions (Coincident)", formula: "a₁ / a₂ = b₁ / b₂ = c₁ / c₂" }
          ],
          solvedExamples: [
            {
              title: "Upstream and Downstream Boat Problem",
              question: "A boat goes 30 km upstream and 44 km downstream in 10 hours. In 13 hours, it can go 40 km upstream and 55 km downstream. Determine the speed of the stream and that of the boat in still water.",
              solution: "Let boat speed in still water = x km/h, stream speed = y km/h.\nSpeed upstream = x - y, speed downstream = x + y.\nLet 1/(x-y) = u, 1/(x+y) = v.\n1) 30u + 44v = 10\n2) 40u + 55v = 13\nMultiply (1) by 4 and (2) by 3:\n120u + 176v = 40\n120u + 165v = 39\nSubtracting gives 11v = 1 => v = 1/11 => x + y = 11.\nSubstitute v: 30u + 4 = 10 => 30u = 6 => u = 1/5 => x - y = 5.\nAdding: 2x = 16 => x = 8 km/h (Boat).\ny = 11 - 8 = 3 km/h (Stream)."
            }
          ],
          diagram: `
Lines Intersecting (Unique)      Lines Parallel (No Solution)    Lines Coincident (Infinite)
         \\   /                           /       /                       ============
          \\ /                           /       /                   (Both equations
           X                           /       /                     represent the
          / \\                         /       /                      same line)
         /   \\                       L1      L2
          `,
          commonTraps: [
            "Trap: Writing standard equations with constants on opposite sides of the equality when applying ratio test."
          ],
          boardQuestions: [
            { q: "Find the value of k for which the system kx + 3y = k - 3, 12x + ky = k has infinitely many solutions.", marks: "3 Marks", hint: "k/12 = 3/k = (k-3)/k => k² = 36 => k = 6 (k = -6 rejected as ratios must equal)." }
          ],
          competitiveQuestions: [
            { exam: "NTSE", q: "The sum of digits of a two-digit number is 9. Also, 9 times this number is twice the number obtained by reversing the order of digits. Find the number.", solution: "Number = 10x + y. x + y = 9 and 9(10x + y) = 2(10y + x) => 88x - 11y = 0 => 8x = y. 8x + x = 9 => x = 1, y = 8. Number is 18." }
          ],
          mcqQuiz: [
            {
              id: "q10_le_1",
              question: "The pair of equations x + 2y + 5 = 0 and -3x - 6y + 1 = 0 has:",
              options: ["A unique solution", "Exactly two solutions", "Infinitely many solutions", "No solution"],
              correctIndex: 3,
              explanation: "a₁/a₂ = 1/-3 = -1/3; b₁/b₂ = 2/-6 = -1/3; c₁/c₂ = 5/1. Since a₁/a₂ = b₁/b₂ ≠ c₁/c₂, the lines are parallel and have no solution."
            }
          ]
        },
        {
          id: "ch-quadratic-equations-10",
          number: 4,
          title: "Quadratic Equations",
          summary: "Standard form ax² + bx + c = 0, solutions by factorisation and quadratic formula, discriminant and nature of roots.",
          keyPoints: [
            "Standard Form: ax² + bx + c = 0 (a ≠ 0).",
            "Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a).",
            "Discriminant D = b² - 4ac determines root character: D > 0 (2 distinct real roots), D = 0 (2 equal real roots), D < 0 (no real roots)."
          ],
          definitions: [
            { term: "Discriminant", definition: "D = b² - 4ac, which determines whether roots are real, equal, or non-real." }
          ],
          formulaSheet: [
            { name: "Roots of Quadratic", formula: "x = (-b ± √D) / (2a)" },
            { name: "Discriminant", formula: "D = b² - 4ac" }
          ],
          solvedExamples: [
            {
              title: "Solve by Quadratic Formula",
              question: "Solve 2x² - 7x + 3 = 0 using the quadratic formula.",
              solution: "a = 2, b = -7, c = 3.\nD = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25.\nx = [-(-7) ± √25] / (2 × 2) = (7 ± 5) / 4.\nx₁ = 12/4 = 3, x₂ = 2/4 = 1/2.\nRoots are 3 and 1/2."
            }
          ],
          diagram: `
Discriminant D > 0          Discriminant D = 0          Discriminant D < 0
   \\        /                     \\        /                     \\        /
----+--*--*--+----> x      --------+---*----+----> x      --------+--------+----> x
       x1 x2                           x1=x2                     (No real intersection)
  2 distinct roots                1 repeated root
          `,
          commonTraps: [
            "Trap: When b is negative, e.g. b = -5, -b becomes +5. Students often forget and keep it -5."
          ],
          boardQuestions: [
            { q: "Find the values of k for which 2x² + kx + 3 = 0 has two real equal roots.", marks: "2 Marks", hint: "Set D = 0: k² - 4(2)(3) = 0 => k² = 24 => k = ±2√6." }
          ],
          competitiveQuestions: [
            { exam: "JEE Main Foundation", q: "If the roots of (b - c)x² + (c - a)x + (a - b) = 0 are equal, prove that 2b = a + c.", solution: "Notice x = 1 is always a root since sum of coefficients is 0. Since roots are equal, both roots are 1. Product of roots = (a - b)/(b - c) = 1 => a - b = b - c => 2b = a + c." }
          ],
          mcqQuiz: [
            {
              id: "q10_qe_1",
              question: "Which of the following equations has 2 as a root?",
              options: ["x² - 4x + 5 = 0", "x² + 3x - 12 = 0", "2x² - 7x + 6 = 0", "3x² - 6x - 2 = 0"],
              correctIndex: 2,
              explanation: "For 2x² - 7x + 6: 2(2)² - 7(2) + 6 = 8 - 14 + 6 = 0."
            }
          ]
        },
        {
          id: "ch-ap-10",
          number: 5,
          title: "Arithmetic Progressions",
          summary: "nth term of an AP, sum of the first n terms of an AP, and practical daily-life word problems.",
          keyPoints: [
            "General term: a_n = a + (n - 1)d, where a is the first term and d is the common difference.",
            "Common difference d = a_k - a_(k-1). Can be positive, negative, or zero.",
            "Sum of first n terms: S_n = n/2 · [2a + (n - 1)d] = n/2 · [a + l]."
          ],
          definitions: [
            { term: "Arithmetic Progression", definition: "A sequence of numbers in which the difference between any two consecutive terms is constant." }
          ],
          formulaSheet: [
            { name: "nth term", formula: "a_n = a + (n - 1)d" },
            { name: "Sum of n terms", formula: "S_n = (n / 2) · [2a + (n - 1)d] = (n / 2) · (a + l)" },
            { name: "nth term from Sum", formula: "a_n = S_n - S_(n-1)" }
          ],
          solvedExamples: [
            {
              title: "Find 20th term and Sum",
              question: "For the AP: 3, 8, 13, 18..., find the 20th term and the sum of first 20 terms.",
              solution: "a = 3, d = 8 - 3 = 5, n = 20.\na₂₀ = 3 + (20 - 1)(5) = 3 + 95 = 98.\nS₂₀ = (20 / 2) · [2(3) + 19(5)] = 10 · [6 + 95] = 10 · 101 = 1010."
            }
          ],
          diagram: `
Term:     a      a+d      a+2d      a+3d     ...     a+(n-1)d
Value:    3  ---(+5)--->   8  ---(+5)--->   13  ...   a_n = a + (n-1)d
          `,
          commonTraps: [
            "Trap: Confusing n (number of terms) with a_n (the value of the term). n must always be a positive integer!"
          ],
          boardQuestions: [
            { q: "How many terms of the AP: 24, 21, 18... must be taken so that their sum is 78?", marks: "3 Marks", hint: "S_n = 78 = (n/2)[48 + (n-1)(-3)]. Leads to n² - 17n + 52 = 0 => (n - 4)(n - 13) = 0. Both n = 4 and n = 13 are valid (terms from 5th to 13th sum to zero)." }
          ],
          competitiveQuestions: [
            { exam: "JEE Main Foundation", q: "If the ratio of the sum of m and n terms of an AP is m² : n², show that the ratio of mth and nth terms is (2m - 1) : (2n - 1).", solution: "S_m / S_n = m² / n² => [2a + (m-1)d] / [2a + (n-1)d] = m / n. Replace m with 2m-1 and n with 2n-1 to get a_m / a_n = (2m-1) / (2n-1)." }
          ],
          mcqQuiz: [
            {
              id: "q10_ap_1",
              question: "In an AP, if d = -4, n = 7, and a_n = 4, then a is:",
              options: ["6", "7", "20", "28"],
              correctIndex: 3,
              explanation: "a_n = a + (n - 1)d => 4 = a + 6(-4) => 4 = a - 24 => a = 28."
            }
          ]
        },
        {
          id: "ch-triangles-10",
          number: 6,
          title: "Triangles",
          summary: "Basic Proportionality Theorem (Thales Theorem) and criteria for similarity of triangles (AAA, SSS, SAS).",
          keyPoints: [
            "Basic Proportionality Theorem (BPT): If a line is drawn parallel to one side of a triangle intersecting other two sides, it divides them in the same ratio.",
            "Two triangles are similar if their corresponding angles are equal and their corresponding sides are in the same ratio.",
            "Similarity criteria: AAA (or AA), SSS, SAS."
          ],
          definitions: [
            { term: "Similar Triangles", definition: "Triangles with equal corresponding angles and proportional corresponding sides." }
          ],
          formulaSheet: [
            { name: "Thales Theorem (BPT)", formula: "AD / DB = AE / EC (if DE ∥ BC)" }
          ],
          solvedExamples: [
            {
              title: "Apply BPT to find unknown side",
              question: "In ΔABC, DE ∥ BC. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, find EC.",
              solution: "By BPT, AD / DB = AE / EC => 1.5 / 3 = 1 / EC => 1/2 = 1 / EC => EC = 2 cm."
            }
          ],
          diagram: `
              A
             / \\
            /   \\
         D /-----\\ E   (DE ∥ BC)
          /       \\    AD / DB = AE / EC
         /         \\
        B-----------C
          `,
          commonTraps: [
            "Trap: Quoting Congruence criteria (ASA, RHS) when proving Similarity."
          ],
          boardQuestions: [
            { q: "State and prove Basic Proportionality Theorem.", marks: "5 Marks", hint: "Draw ΔABC with DE ∥ BC. Construct altitudes EN ⊥ AB and DM ⊥ AC. Relate area ratios." }
          ],
          competitiveQuestions: [
            { exam: "Olympiad / NTSE", q: "In ΔABC, AD is the internal angle bisector of ∠A. If AB = 6 cm, AC = 8 cm, and BD = 3 cm, find DC.", solution: "By Angle Bisector Theorem, AB / AC = BD / DC => 6 / 8 = 3 / DC => DC = 4 cm." }
          ],
          mcqQuiz: [
            {
              id: "q10_tri_1",
              question: "If in ΔABC and ΔDEF, AB/DE = BC/FD, then they will be similar, when:",
              options: ["∠B = ∠E", "∠A = ∠D", "∠B = ∠D", "∠A = ∠F"],
              correctIndex: 2,
              explanation: "The included angle between sides AB, BC is ∠B and between DE, FD is ∠D. For SAS similarity, ∠B = ∠D."
            }
          ]
        },
        {
          id: "ch-coordinate-geom-10",
          number: 7,
          title: "Coordinate Geometry",
          summary: "Distance formula, section formula (internal division), and coordinates of the midpoint.",
          keyPoints: [
            "Distance between (x₁, y₁) and (x₂, y₂): d = √[(x₂ - x₁)² + (y₂ - y₁)²].",
            "Distance of P(x, y) from origin: √(x² + y²).",
            "Section formula: P(x, y) dividing line segment in ratio m₁:m₂ is ([m₁x₂ + m₂x₁] / [m₁ + m₂], [m₁y₂ + m₂y₁] / [m₁ + m₂]).",
            "Midpoint coordinates: ((x₁ + x₂) / 2, (y₁ + y₂) / 2)."
          ],
          definitions: [
            { term: "Collinear Points", definition: "Three or more points that lie on the same straight line (AB + BC = AC)." }
          ],
          formulaSheet: [
            { name: "Distance Formula", formula: "d = √[(x₂ - x₁)² + (y₂ - y₁)²]" },
            { name: "Section Formula", formula: "x = (m₁x₂ + m₂x₁) / (m₁ + m₂), y = (m₁y₂ + m₂y₁) / (m₁ + m₂)" },
            { name: "Midpoint Formula", formula: "M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)" }
          ],
          solvedExamples: [
            {
              title: "Find ratio of division",
              question: "Find the ratio in which the y-axis divides the line segment joining the points (5, -6) and (-1, -4). Also find the point of intersection.",
              solution: "Let ratio be k:1. Any point on y-axis has x = 0.\nx = [k(-1) + 1(5)] / (k + 1) = 0 => -k + 5 = 0 => k = 5 => Ratio is 5:1.\ny = [5(-4) + 1(-6)] / (5 + 1) = (-20 - 6) / 6 = -26/6 = -13/3.\nPoint of intersection is (0, -13/3)."
            }
          ],
          diagram: `
y ^
  |                  B(x2, y2)
  |                 /
  |         P(x, y)/   (Ratio m1 : m2)
  |               /
  |       A(x1, y1)
  +-------------------------> x
          `,
          commonTraps: [
            "Trap: Swapping m₁ with x₁ and m₂ with x₂ in section formula. Remember m₁ multiplies x₂ and m₂ multiplies x₁."
          ],
          boardQuestions: [
            { q: "Determine if the points (1, 5), (2, 3) and (-2, -11) are collinear.", marks: "3 Marks", hint: "Compute AB = √5, BC = √212 = 2√53, AC = √265. Check if sum of two equals third." }
          ],
          competitiveQuestions: [
            { exam: "JEE Foundation", q: "If the points A(6, 1), B(8, 2), C(9, 4) and D(p, 3) are vertices of a parallelogram taken in order, find the value of p.", solution: "Diagonals bisect each other: Midpoint of AC = Midpoint of BD. (6+9)/2 = (8+p)/2 => 15 = 8 + p => p = 7." }
          ],
          mcqQuiz: [
            {
              id: "q10_cg_1",
              question: "The distance of the point P(-6, 8) from the origin is:",
              options: ["8", "2√7", "10", "6"],
              correctIndex: 2,
              explanation: "d = √((-6)² + 8²) = √(36 + 64) = √100 = 10."
            }
          ]
        },
        {
          id: "ch-trig-intro-10",
          number: 8,
          title: "Introduction to Trigonometry",
          summary: "Trigonometric ratios of acute angles, values of ratios at 0°, 30°, 45°, 60°, 90°, and fundamental trigonometric identity sin²θ + cos²θ = 1.",
          keyPoints: [
            "In right triangle: sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj.",
            "Reciprocals: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.",
            "Fundamental Identity: sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ."
          ],
          definitions: [
            { term: "Trigonometric Ratio", definition: "The ratio of the sides of a right-angled triangle with respect to its acute angles." }
          ],
          formulaSheet: [
            { name: "Pythagorean Identity 1", formula: "sin²θ + cos²θ = 1" },
            { name: "Pythagorean Identity 2", formula: "sec²θ - tan²θ = 1" },
            { name: "Pythagorean Identity 3", formula: "cosec²θ - cot²θ = 1" }
          ],
          solvedExamples: [
            {
              title: "Prove Trigonometric Identity",
              question: "Prove that: (sin θ - 2 sin³θ) / (2 cos³θ - cos θ) = tan θ.",
              solution: "LHS = [sin θ(1 - 2 sin²θ)] / [cos θ(2 cos²θ - 1)]\nRecall 1 = sin²θ + cos²θ:\nNumerator: sin θ(cos²θ + sin²θ - 2 sin²θ) = sin θ(cos²θ - sin²θ)\nDenominator: cos θ(2 cos²θ - (cos²θ + sin²θ)) = cos θ(cos²θ - sin²θ)\nLHS = [sin θ(cos²θ - sin²θ)] / [cos θ(cos²θ - sin²θ)] = sin θ / cos θ = tan θ = RHS."
            }
          ],
          diagram: `
       C
       |\\
       | \\
  Opp  |  \\ Hypotenuse (H)
   (P) |   \\
       |    \\
       +-----+ A
       B (Adj / Base B)   sin θ = P/H, cos θ = B/H, tan θ = P/B
          `,
          commonTraps: [
            "Trap: Writing sin(A + B) = sin A + sin B. Trigonometric functions are NOT distributive over addition!"
          ],
          boardQuestions: [
            { q: "If tan θ = 4/3, evaluate (1 - cos²θ) / (1 + cos²θ).", marks: "2 Marks", hint: "Hypotenuse = 5, cos θ = 3/5. (1 - 9/25) / (1 + 9/25) = (16/25) / (34/25) = 16/34 = 8/17." }
          ],
          competitiveQuestions: [
            { exam: "JEE Foundation", q: "If sec θ + tan θ = p, find the value of sin θ in terms of p.", solution: "sec θ - tan θ = 1/p. Adding gives 2 sec θ = p + 1/p => sec θ = (p²+1)/(2p). Subtracting gives 2 tan θ = p - 1/p => tan θ = (p²-1)/(2p). sin θ = tan θ / sec θ = (p² - 1) / (p² + 1)." }
          ],
          mcqQuiz: [
            {
              id: "q10_trig_1",
              question: "If cos A = 4/5, then the value of tan A is:",
              options: ["3/5", "3/4", "4/3", "5/3"],
              correctIndex: 1,
              explanation: "In right triangle, adjacent = 4, hypotenuse = 5 => opposite = √(25 - 16) = 3. tan A = 3/4."
            }
          ]
        },
        {
          id: "ch-trig-applications-10",
          number: 9,
          title: "Some Applications of Trigonometry",
          summary: "Heights and distances, line of sight, angle of elevation, angle of depression, and two-triangle situational modeling.",
          keyPoints: [
            "Line of sight is drawn from the eye of an observer to the point viewed.",
            "Angle of Elevation: Angle formed by line of sight with horizontal when object is ABOVE observer.",
            "Angle of Depression: Angle formed by line of sight with horizontal when object is BELOW observer."
          ],
          definitions: [
            { term: "Angle of Elevation", definition: "The angle between the horizontal line and line of sight looking upwards." },
            { term: "Angle of Depression", definition: "The angle between the horizontal line and line of sight looking downwards." }
          ],
          formulaSheet: [
            { name: "Height / Distance relation", formula: "tan θ = Opposite (Height) / Adjacent (Distance)" }
          ],
          solvedExamples: [
            {
              title: "Lighthouse Problem",
              question: "As observed from the top of a 75m high lighthouse from the sea-level, the angles of depression of two ships are 30° and 45°. If one ship is exactly behind the other on the same side, find the distance between the two ships.",
              solution: "Let lighthouse AB = 75 m. Let ships be at C and D (D further away).\nIn ΔABC: tan 45° = AB / BC => 1 = 75 / BC => BC = 75 m.\nIn ΔABD: tan 30° = AB / BD => 1/√3 = 75 / BD => BD = 75√3 m.\nDistance between ships CD = BD - BC = 75√3 - 75 = 75(√3 - 1) m ≈ 75(1.732 - 1) = 75 × 0.732 = 54.9 m."
            }
          ],
          diagram: `
Observer (Top of tower)
       O ---------- Horizontal
        \\  \\  (Depression angles)
         \\   \\
          \\    \\
           \\     \\
            C ---- D (Ships on sea surface)
          `,
          commonTraps: [
            "Trap: Measuring angle of depression from vertical tower instead of the HORIZONTAL line."
          ],
          boardQuestions: [
            { q: "A 1.5m tall boy looks at top of 30m building. Angle of elevation increases from 30° to 60° as he walks towards building. Find distance walked.", marks: "5 Marks", hint: "Effective height h = 30 - 1.5 = 28.5 m. Use tan 30° and tan 60° to find x₁ - x₂ = 19√3 m." }
          ],
          competitiveQuestions: [
            { exam: "NDA / CDS", q: "The shadow of a vertical tower on level ground increases by 10 m when sun's altitude changes from 45° to 30°. Find height of tower.", solution: "h / (h + 10) = tan 30° = 1/√3 => √3 h = h + 10 => h(√3 - 1) = 10 => h = 10 / (√3 - 1) = 5(√3 + 1) m." }
          ],
          mcqQuiz: [
            {
              id: "q10_app_1",
              question: "If a pole 6 m high casts a shadow 2√3 m long on the ground, then the sun's elevation is:",
              options: ["60°", "45°", "30°", "90°"],
              correctIndex: 0,
              explanation: "tan θ = Height / Shadow = 6 / (2√3) = 3 / √3 = √3 => θ = 60°."
            }
          ]
        },
        {
          id: "ch-circles-10",
          number: 10,
          title: "Circles",
          summary: "Tangents to a circle, point of contact, theorem: tangent is perpendicular to radius, theorem: tangents drawn from external point are equal.",
          keyPoints: [
            "A tangent to a circle intersects it at exactly one point (point of contact).",
            "Theorem 1: The tangent at any point of a circle is perpendicular to the radius through the point of contact (OP ⊥ PT).",
            "Theorem 2: The lengths of tangents drawn from an external point to a circle are equal (PA = PB)."
          ],
          definitions: [
            { term: "Tangent to Circle", definition: "A straight line that touches the circle at exactly one point." }
          ],
          formulaSheet: [
            { name: "External Tangents Equality", formula: "PA = PB (from external point P)" }
          ],
          solvedExamples: [
            {
              title: "Prove Tangent Angles Supplementary",
              question: "Prove that the angle between the two tangents drawn from an external point to a circle is supplementary to the angle subtended by the line-segment joining the points of contact at the centre.",
              solution: "Let PA, PB be tangents touching circle at A, B. Centre is O.\nIn quadrilateral OAPB:\n∠OAP = 90° (radius ⊥ tangent)\n∠OBP = 90° (radius ⊥ tangent)\nSum of angles in quadrilateral = 360°:\n∠APB + ∠AOB + 90° + 90° = 360° => ∠APB + ∠AOB = 180°.\nHence, the angles are supplementary."
            }
          ],
          diagram: `
               A
              / \\
             /   \\
            O     P (External Point)
             \\   /   PA = PB, OA ⊥ PA, OB ⊥ PB
              \\ /
               B
          `,
          commonTraps: [
            "Trap: Assuming a secant is a tangent. A secant intersects at 2 points; a tangent at exactly 1 point."
          ],
          boardQuestions: [
            { q: "Prove that in two concentric circles, the chord of the larger circle, which touches the smaller circle, is bisected at the point of contact.", marks: "3 Marks", hint: "Perpendicular from centre to chord bisects the chord." }
          ],
          competitiveQuestions: [
            { exam: "JEE Foundation", q: "A quadrilateral ABCD is circumscribed about a circle. Prove that AB + CD = AD + BC.", solution: "Apply PA = PB for each vertex: AP = AS, BP = BQ, CR = CQ, DR = DS. Adding all 4 yields (AP+PB) + (CR+RD) = (AS+SD) + (BQ+QC) => AB + CD = AD + BC." }
          ],
          mcqQuiz: [
            {
              id: "q10_cir_1",
              question: "From a point Q, the length of the tangent to a circle is 24 cm and the distance of Q from the centre is 25 cm. The radius of the circle is:",
              options: ["7 cm", "12 cm", "15 cm", "24.5 cm"],
              correctIndex: 0,
              explanation: "r = √(25² - 24²) = √(625 - 576) = √49 = 7 cm."
            }
          ]
        },
        {
          id: "ch-areas-circles-10",
          number: 11,
          title: "Areas Related to Circles",
          summary: "Perimeter and area of circle, area of sector and segment of a circle of angle θ.",
          keyPoints: [
            "Area of sector of angle θ: (θ / 360°) × πr².",
            "Length of arc of sector of angle θ: (θ / 360°) × 2πr.",
            "Area of minor segment = Area of corresponding sector - Area of corresponding triangle."
          ],
          definitions: [
            { term: "Sector of Circle", definition: "The region between two radii and the connecting arc." }
          ],
          formulaSheet: [
            { name: "Sector Area", formula: "A = (θ / 360°) · πr²" },
            { name: "Arc Length", formula: "l = (θ / 360°) · 2πr" },
            { name: "Segment Area", formula: "A_segment = (θ / 360°) · πr² - ½ · r² · sin θ" }
          ],
          solvedExamples: [
            {
              title: "Find Area of Sector",
              question: "Find the area of a sector of a circle with radius 6 cm if angle of the sector is 60° (use π = 22/7).",
              solution: "r = 6 cm, θ = 60°.\nArea = (60 / 360) × π × 6² = (1 / 6) × (22 / 7) × 36 = 6 × 22 / 7 = 132 / 7 cm² ≈ 18.86 cm²."
            }
          ],
          diagram: `
       Sector (θ / 360° · πr²)           Segment (Sector - Triangle)
               O                                   O
              / \\                                 / \\
             / θ \\                               / θ \\
            /     \\                             /-----\\  (Triangle)
           A=======B                           A=======B (Shaded Segment)
          `,
          commonTraps: [
            "Trap: Forgetting to subtract triangle area when asked for SEGMENT instead of SECTOR."
          ],
          boardQuestions: [
            { q: "A chord of circle of radius 15 cm subtends an angle of 60° at centre. Find areas of minor and major segments.", marks: "5 Marks", hint: "Area ΔOAB = (√3/4)·r² for 60° equilateral triangle." }
          ],
          competitiveQuestions: [
            { exam: "NTSE", q: "A race track is in the form of a ring whose inner circumference is 352 m and outer circumference is 396 m. Find width of track.", solution: "2πR = 396 => R = 63 m; 2πr = 352 => r = 56 m. Width = R - r = 7 m." }
          ],
          mcqQuiz: [
            {
              id: "q10_ac_1",
              question: "If the perimeter and the area of a circle are numerically equal, then the radius of the circle is:",
              options: ["2 units", "π units", "4 units", "7 units"],
              correctIndex: 0,
              explanation: "2πr = πr² => 2 = r => r = 2 units."
            }
          ]
        },
        {
          id: "ch-surface-areas-10",
          number: 12,
          title: "Surface Areas and Volumes",
          summary: "Surface areas and volumes of combinations of cuboids, cones, cylinders, hemispheres, and spheres.",
          keyPoints: [
            "When solids are combined, total surface area is the sum of VISIBLE exposed surfaces (not the sum of individual TSAs).",
            "Volume of combined solid is always the direct sum of volumes of constituent parts."
          ],
          definitions: [
            { term: "Total Surface Area", definition: "The total area of all exposed outward faces of a solid figure." }
          ],
          formulaSheet: [
            { name: "Cylinder Volume", formula: "V = πr²h; CSA = 2πrh" },
            { name: "Cone Volume", formula: "V = ⅓πr²h; CSA = πrl (l = √(r² + h²))" },
            { name: "Sphere Volume", formula: "V = ⁴⁄₃πr³; SA = 4πr²" },
            { name: "Hemisphere Volume", formula: "V = ⅔πr³; CSA = 2πr²; TSA = 3πr²" }
          ],
          solvedExamples: [
            {
              title: "Toy Cone Mounted on Hemisphere",
              question: "A toy is in the form of a cone of radius 3.5 cm mounted on a hemisphere of same radius. Total height of toy is 15.5 cm. Find total surface area of toy.",
              solution: "r = 3.5 cm = 7/2 cm.\nHeight of cone h = 15.5 - 3.5 = 12 cm.\nSlant height l = √(r² + h²) = √(3.5² + 12²) = √(12.25 + 144) = √156.25 = 12.5 cm.\nTSA of toy = CSA of cone + CSA of hemisphere = πrl + 2πr² = πr(l + 2r)\n= (22/7) × (7/2) × (12.5 + 7) = 11 × 19.5 = 214.5 cm²."
            }
          ],
          diagram: `
         /\\       Cone (CSA = πrl)
        /  \\
       /____\\
      (      )    Hemisphere (CSA = 2πr²)
       \\____/
          `,
          commonTraps: [
            "Trap: Adding the base circles of cone and hemisphere. The junction is inside the toy and NOT exposed!"
          ],
          boardQuestions: [
            { q: "A solid iron pole consists of a cylinder of height 220 cm and base diameter 24 cm, surmounted by another cylinder of height 60 cm and radius 8 cm. Find mass if 1 cm³ iron = 8g.", marks: "5 Marks", hint: "Calculate V₁ + V₂ and multiply total volume by 8g." }
          ],
          competitiveQuestions: [
            { exam: "JEE Foundation", q: "Metallic spheres of radii 6 cm, 8 cm and 10 cm are melted to form a single solid sphere. Find radius of resulting sphere.", solution: "4/3 π R³ = 4/3 π (6³ + 8³ + 10³) => R³ = 216 + 512 + 1000 = 1728 => R = 12 cm." }
          ],
          mcqQuiz: [
            {
              id: "q10_sav_1",
              question: "A cylindrical pencil sharpened at one edge is the combination of:",
              options: ["A cone and a cylinder", "Frustum of a cone and a cylinder", "A hemisphere and a cylinder", "Two cylinders"],
              correctIndex: 0,
              explanation: "Sharpening converts one end of cylinder into a cone."
            }
          ]
        },
        {
          id: "ch-statistics-10",
          number: 13,
          title: "Statistics",
          summary: "Mean (direct, assumed mean), Mode, and Median of grouped data, and empirical relationship between the three central tendencies.",
          keyPoints: [
            "Mean of grouped data: x̄ = Σf_i x_i / Σf_i.",
            "Mode: l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h (modal class has highest frequency f₁).",
            "Median: l + [(n/2 - cf) / f] × h.",
            "Empirical Relationship: 3 Median = Mode + 2 Mean."
          ],
          definitions: [
            { term: "Modal Class", definition: "The class interval with the highest frequency in a grouped frequency distribution." }
          ],
          formulaSheet: [
            { name: "Direct Mean", formula: "x̄ = Σ(f_i · x_i) / Σf_i" },
            { name: "Mode Formula", formula: "Mode = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] · h" },
            { name: "Median Formula", formula: "Median = l + [(n/2 - cf) / f] · h" },
            { name: "Empirical Relationship", formula: "3 · Median = Mode + 2 · Mean" }
          ],
          solvedExamples: [
            {
              title: "Apply Empirical Relationship",
              question: "If for a given frequency distribution, Mode = 45 and Mean = 30, find Median.",
              solution: "3 Median = Mode + 2 Mean\n3 Median = 45 + 2(30) = 45 + 60 = 105\nMedian = 105 / 3 = 35."
            }
          ],
          diagram: `
+-------------------------------------------------------------+
|        EMPIRICAL RELATION OF CENTRAL TENDENCIES             |
|                                                             |
|                 3 · Median = Mode + 2 · Mean                |
+-------------------------------------------------------------+
          `,
          commonTraps: [
            "Trap: In median formula, using cumulative frequency of the median class instead of the class PRECEDING the median class."
          ],
          boardQuestions: [
            { q: "The median of 100 observations is 28.5. If frequencies of classes 10-20 and 40-50 are x and y, find x and y.", marks: "5 Marks", hint: "Use total frequency n = 60 + x + y = 100 => x + y = 40. Apply median formula to find x = 8, y = 12." }
          ],
          competitiveQuestions: [
            { exam: "NTSE", q: "If the mean of observations x, x+3, x+5, x+7, x+10 is 9, find the mean of last 3 observations.", solution: "Sum = 5x + 25 = 45 => x = 4. Last three are 9, 11, 14. Mean = (9 + 11 + 14)/3 = 34/3." }
          ],
          mcqQuiz: [
            {
              id: "q10_stat_1",
              question: "For a frequency distribution, Mean, Median and Mode are connected by the relation:",
              options: ["Mode = 3 Median - 2 Mean", "Mode = 2 Median - 3 Mean", "Mode = 3 Mean - 2 Median", "Mode = 2 Mean - 3 Median"],
              correctIndex: 0,
              explanation: "Rearranging 3 Median = Mode + 2 Mean yields Mode = 3 Median - 2 Mean."
            }
          ]
        },
        {
          id: "ch-probability-10",
          number: 14,
          title: "Probability",
          summary: "Classical definition of probability, elementary events, complementary events, impossible and sure events.",
          keyPoints: [
            "P(E) = Number of outcomes favorable to E / Total number of possible outcomes.",
            "For any event E: 0 ≤ P(E) ≤ 1.",
            "P(Sure Event) = 1; P(Impossible Event) = 0.",
            "Complementary event: P(E) + P(not E) = 1."
          ],
          definitions: [
            { term: "Equally Likely Outcomes", definition: "Outcomes that have the same chance of occurring (e.g. fair coin toss, unbiased die)." }
          ],
          formulaSheet: [
            { name: "Classical Probability", formula: "P(E) = n(E) / n(S)" },
            { name: "Complementary Event", formula: "P(E') = 1 - P(E)" }
          ],
          solvedExamples: [
            {
              title: "Two Dice Rolled Together",
              question: "Two dice are thrown simultaneously. What is the probability that the sum of the numbers is 8?",
              solution: "Total possible outcomes = 6 × 6 = 36.\nFavorable outcomes for sum = 8: (2, 6), (3, 5), (4, 4), (5, 3), (6, 2) => 5 outcomes.\nP(Sum = 8) = 5 / 36."
            }
          ],
          diagram: `
P(Impossible Event) = 0                 P(Sure Event) = 1
+---------------------------+---------------------------+
0                          0.5                          1
               0 ≤ P(E) ≤ 1 and P(E) + P(not E) = 1
          `,
          commonTraps: [
            "Trap: Forgetting that a probability can NEVER be negative or greater than 1."
          ],
          boardQuestions: [
            { q: "A card is drawn from a well-shuffled pack of 52 cards. Find probability of getting a king of red colour or a face card.", marks: "3 Marks", hint: "Red kings = 2. Total face cards = 12. P(Face card) = 12/52 = 3/13." }
          ],
          competitiveQuestions: [
            { exam: "JEE Foundation", q: "Find probability that a non-leap year selected at random will contain 53 Sundays.", solution: "Non-leap year = 365 days = 52 weeks + 1 extra day. 1 day can be any of 7 days. P(Sunday) = 1/7." }
          ],
          mcqQuiz: [
            {
              id: "q10_prob_1",
              question: "Which of the following cannot be the probability of an event?",
              options: ["2/3", "-1.5", "15%", "0.7"],
              correctIndex: 1,
              explanation: "Probability of an event can never be negative (-1.5)."
            }
          ]
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
          id: "ch-chemical-reactions-10",
          number: 1,
          title: "Chemical Reactions and Equations",
          summary: "Balancing chemical equations, combination, decomposition, displacement, double displacement, redox reactions, corrosion and rancidity.",
          keyPoints: [
            "Law of Conservation of Mass: Number of atoms of each element remains identical before and after a chemical reaction.",
            "Combination: Two or more reactants combine to form a single product (CaO + H₂O → Ca(OH)₂).",
            "Thermal decomposition: FeSO₄ decomposes to Fe₂O₃ + SO₂ + SO₃.",
            "Redox: Oxidation is loss of electrons/gain of oxygen; reduction is gain of electrons/loss of oxygen."
          ],
          definitions: [
            { term: "Corrosion", definition: "Oxidation and destruction of metals caused by atmospheric oxygen and moisture (e.g. 4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O)." },
            { term: "Rancidity", definition: "Oxidation of oils and fats in food creating foul taste and odor." }
          ],
          formulaSheet: [
            { name: "Slaking of Lime", formula: "CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat" },
            { name: "Respiration (Exothermic)", formula: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy" }
          ],
          solvedExamples: [
            {
              title: "Identify Oxidised and Reduced Species",
              question: "In the reaction: CuO + H₂ → Cu + H₂O, name the substance oxidised, substance reduced, oxidising agent, and reducing agent.",
              solution: "1. H₂ gains oxygen to become H₂O => H₂ is oxidised.\n2. CuO loses oxygen to become Cu => CuO is reduced.\n3. Oxidising agent is CuO (causes oxidation of H₂).\n4. Reducing agent is H₂ (causes reduction of CuO)."
            }
          ],
          diagram: `
+-------------------------------------------------------+
|             TYPES OF CHEMICAL REACTIONS               |
|                                                       |
| Combination:        A + B  ----->  AB                 |
| Decomposition:      AB     ----->  A + B              |
| Displacement:       A + BC ----->  AC + B             |
| Double Displ.:      AB + CD ---->  AD + CB (precip.)  |
| Redox:              Oxidation (loss e⁻) + Red (gain e⁻)|
+-------------------------------------------------------+
          `,
          commonTraps: [
            "Trap: Writing formulas without balancing: e.g. H₂ + O₂ → H₂O instead of 2H₂ + O₂ → 2H₂O."
          ],
          boardQuestions: [
            { q: "Why do we apply paint on iron articles?", marks: "2 Marks", hint: "Paint acts as a barrier preventing moisture and oxygen contact, halting corrosion." }
          ],
          competitiveQuestions: [
            { exam: "NEET / NTSE", q: "Identify the spectator ions in the reaction: BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s) + 2NaCl(aq).", solution: "Ba²⁺ and SO₄²⁻ form the solid precipitate. Na⁺ and Cl⁻ remain dissolved in solution, so Na⁺ and Cl⁻ are spectator ions." }
          ],
          mcqQuiz: [
            {
              id: "q10_cr_1",
              question: "Which of the following is an endothermic process?",
              options: ["Dilution of sulphuric acid", "Sublimation of dry ice", "Condensation of water vapours", "Respiration in human body"],
              correctIndex: 1,
              explanation: "Sublimation requires absorption of thermal energy to convert solid directly to gas, making it endothermic."
            }
          ]
        },
        {
          id: "ch-acids-bases-10",
          number: 2,
          title: "Acids, Bases and Salts",
          summary: "Properties of acids and bases, pH scale, role of pH in daily life, preparation and uses of Bleaching powder, Baking soda, Washing soda, and Plaster of Paris.",
          keyPoints: [
            "Acids produce H⁺(aq) / H₃O⁺ ions in water; bases produce OH⁻(aq) ions.",
            "pH = -log[H⁺]: pH < 7 is acidic, pH = 7 is neutral, pH > 7 is basic.",
            "Tooth decay begins when mouth pH falls below 5.5 (corrodes calcium hydroxyapatite enamel).",
            "Plaster of Paris: CaSO₄·½H₂O; Gypsum: CaSO₄·2H₂O."
          ],
          definitions: [
            { term: "Water of Crystallisation", definition: "The fixed number of water molecules chemically bonded in one formula unit of a salt (e.g. CuSO₄·5H₂O)." }
          ],
          formulaSheet: [
            { name: "Plaster of Paris Setting", formula: "CaSO₄·½H₂O + 1½ H₂O → CaSO₄·2H₂O (Gypsum)" },
            { name: "Bleaching Powder", formula: "Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O" },
            { name: "Baking Soda", formula: "NaCl + H₂O + CO₂ + NH₃ → NH₄Cl + NaHCO₃" }
          ],
          solvedExamples: [
            {
              title: "Action of Heat on Baking Soda",
              question: "What happens when baking soda is heated during cooking? Give balanced chemical equation.",
              solution: "On heating, sodium hydrogen carbonate decomposes to produce sodium carbonate, water, and carbon dioxide:\n2NaHCO₃ --(Heat)--> Na₂CO₃ + H₂O + CO₂↑\nThe released CO₂ gas causes cake or bread dough to rise, making it soft and spongy."
            }
          ],
          diagram: `
pH Scale:
0 ------- 3 ------- 6 --- 7 --- 8 ------- 11 ------- 14
[--- Strongly Acidic ---] Neutral [--- Strongly Basic ---]
Gastric Juice (1.2)   Pure H₂O (7)    Bleach / NaOH (14)
          `,
          commonTraps: [
            "Trap: Adding water to concentrated acid. ALWAYS ADD ACID TO WATER SLOWLY WITH STIRRING to prevent violent boiling and splashing!"
          ],
          boardQuestions: [
            { q: "Why does dry HCl gas not change the colour of dry litmus paper?", marks: "2 Marks", hint: "Hydrogen ions are only produced in the presence of water: HCl + H₂O → H₃O⁺ + Cl⁻." }
          ],
          competitiveQuestions: [
            { exam: "NEET Foundation", q: "What is the pH of a 10⁻⁸ M HCl solution?", solution: "Cannot be 8 because an acid is never basic! Total [H⁺] = 10⁻⁸ (from HCl) + 10⁻⁷ (from H₂O ionization) ≈ 1.1 × 10⁻⁷ M => pH ≈ 6.96 (slightly acidic)." }
          ],
          mcqQuiz: [
            {
              id: "q10_abs_1",
              question: "Tomato is a natural source of which acid?",
              options: ["Acetic acid", "Citric acid", "Tartaric acid", "Oxalic acid"],
              correctIndex: 3,
              explanation: "Tomatoes contain oxalic acid (along with ascorbic and citric acids)."
            }
          ]
        },
        {
          id: "ch-metals-non-metals-10",
          number: 3,
          title: "Metals and Non-metals",
          summary: "Physical and chemical properties, reactivity series, formation and properties of ionic compounds, metallurgy (roasting and calcination), and corrosion prevention.",
          keyPoints: [
            "Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.",
            "Ionic compounds have high melting points, are soluble in polar water, and conduct electricity in molten state or aqueous solution.",
            "Roasting: Heating sulphide ores in excess air (2ZnS + 3O₂ → 2ZnO + 2SO₂).",
            "Calcination: Heating carbonate ores in limited air (ZnCO₃ → ZnO + CO₂)."
          ],
          definitions: [
            { term: "Amphoteric Oxides", definition: "Metal oxides that react with both acids and bases to produce salt and water (e.g. Al₂O₃, ZnO)." },
            { term: "Thermite Reaction", definition: "Reduction of iron(III) oxide by aluminium powder releasing immense heat used to weld railway tracks (Fe₂O₃ + 2Al → 2Fe + Al₂O₃ + Heat)." }
          ],
          formulaSheet: [
            { name: "Amphoteric Al₂O₃ with Acid", formula: "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O" },
            { name: "Amphoteric Al₂O₃ with Base", formula: "Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O" }
          ],
          solvedExamples: [
            {
              title: "Electron Dot Structure of NaCl",
              question: "Show the formation of Na₂O and MgO by the transfer of electrons.",
              solution: "Na (2,8,1) loses 1e⁻ to become Na⁺.\nOxygen (2,6) needs 2e⁻ to complete octet.\nTwo Na atoms transfer 1 electron each: 2Na⁺ + :Ö:²⁻ → Na₂O.\nFor MgO: Mg (2,8,2) transfers 2e⁻ to O (2,6) forming Mg²⁺ O²⁻."
            }
          ],
          diagram: `
Metals at Top (K, Na, Ca, Mg, Al)     --> Electrolytic reduction of molten chlorides
Metals in Middle (Zn, Fe, Pb, Cu)     --> Roasting/Calcination followed by Carbon reduction
Metals at Bottom (Ag, Au, Pt)         --> Found native in uncombined free state
          `,
          commonTraps: [
            "Trap: Calling Al₂O₃ basic. It is AMPHOTERIC (reacts with both acids and alkalis)."
          ],
          boardQuestions: [
            { q: "Differentiate between roasting and calcination with balanced equations.", marks: "3 Marks", hint: "Roasting uses excess oxygen for sulphides; calcination uses limited/no air for carbonates." }
          ],
          competitiveQuestions: [
            { exam: "JEE / NEET", q: "Why is nitric acid HNO₃ generally not used to produce hydrogen gas when reacting with metals?", solution: "HNO₃ is a strong oxidising agent; it oxidises H₂ produced to water and itself gets reduced to nitrogen oxides (NO₂, NO, N₂O). Only Mg and Mn react with very dilute HNO₃ to evolve H₂." }
          ],
          mcqQuiz: [
            {
              id: "q10_mnm_1",
              question: "Which of the following metals exists in liquid state at room temperature?",
              options: ["Sodium", "Potassium", "Mercury", "Bromine"],
              correctIndex: 2,
              explanation: "Mercury (Hg) is the only metal that is liquid at room temperature. (Bromine is a liquid non-metal)."
            }
          ]
        },
        {
          id: "ch-carbon-compounds-10",
          number: 4,
          title: "Carbon and its Compounds",
          summary: "Covalent bonding, tetravalency, catenation, homologous series, functional groups, combustion, oxidation, addition, substitution, and soaps vs detergents.",
          keyPoints: [
            "Carbon forms covalent bonds due to its tetravalency (4 valence electrons) and catenation (self-linking ability).",
            "Homologous series: Same functional group, consecutive members differ by -CH₂- unit and 14 u molecular mass.",
            "Saturated hydrocarbons (alkanes) undergo substitution; unsaturated hydrocarbons (alkenes, alkynes) undergo addition reactions.",
            "Soap molecules have hydrophilic ionic heads and hydrophobic hydrocarbon tails forming cleansing micelles."
          ],
          definitions: [
            { term: "Catenation", definition: "The unique ability of carbon atoms to form strong covalent bonds with other carbon atoms, giving rise to long chains and rings." },
            { term: "Esterification", definition: "The reaction between a carboxylic acid and an alcohol in the presence of acid catalyst to form a sweet-smelling ester." }
          ],
          formulaSheet: [
            { name: "Alkanes general formula", formula: "C_n H_(2n+2)" },
            { name: "Alkenes general formula", formula: "C_n H_(2n)" },
            { name: "Alkynes general formula", formula: "C_n H_(2n-2)" },
            { name: "Esterification", formula: "CH₃COOH + C₂H₅OH --(H₂SO₄)--> CH₃COOC₂H₅ + H₂O" }
          ],
          solvedExamples: [
            {
              title: "Mechanism of Micelle Formation in Soap",
              question: "Explain the mechanism of the cleaning action of soaps.",
              solution: "1. Soap is a sodium or potassium salt of long-chain fatty acids (e.g. C₁₇H₃₅COO⁻ Na⁺).\n2. Hydrophobic tail dissolves in oil/grease droplet in the centre.\n3. Hydrophilic ionic head points outward towards water.\n4. This spherical structure is called a micelle.\n5. Agitation pulls the oil droplet into the water forming a stable emulsion that rinses away."
            }
          ],
          diagram: `
               Na⁺       Na⁺
                 \\       /
               ---O     O---
              /             \\
             |   [GREASE]    |  <-- Soap Micelle (Dirt trapped in centre)
              \\             /
               ---O     O---
                 /       \\
               Na⁺       Na⁺
          `,
          commonTraps: [
            "Trap: Expecting soaps to work in hard water. Soaps react with Ca²⁺ and Mg²⁺ forming insoluble curdy precipitate (scum). Synthetic detergents work in both soft and hard water."
          ],
          boardQuestions: [
            { q: "How would you distinguish between ethanol and ethanoic acid experimentally?", marks: "3 Marks", hint: "Add sodium hydrogen carbonate NaHCO₃: Ethanoic acid produces effervescence of CO₂ gas; ethanol gives no reaction." }
          ],
          competitiveQuestions: [
            { exam: "JEE / NEET", q: "What is the catalyst used in the industrial hydrogenation of vegetable oils to form vanaspati ghee?", solution: "Finely divided Nickel (Ni) or Palladium (Pd) at around 200°C: R₂C=CR₂ + H₂ --(Ni)--> R₂CH-CHR₂." }
          ],
          mcqQuiz: [
            {
              id: "q10_carb_1",
              question: "Which of the following compounds contains a carboxylic acid functional group?",
              options: ["CH₃COCH₃", "CH₃COOH", "CH₃CHO", "CH₃CH₂OH"],
              correctIndex: 1,
              explanation: "CH₃COOH (ethanoic acid) contains the -COOH carboxylic acid group."
            }
          ]
        },
        {
          id: "ch-life-processes-10",
          number: 5,
          title: "Life Processes",
          summary: "Autotrophic and heterotrophic nutrition, human digestive system, respiration (aerobic vs anaerobic), human double circulation, plant vascular transport, and nephron excretion.",
          keyPoints: [
            "Photosynthesis: 6CO₂ + 12H₂O + Sunlight + Chlorophyll → C₆H₁₂O₆ + 6O₂ + 6H₂O.",
            "Aerobic respiration produces 36–38 ATP; anaerobic respiration in yeast produces ethanol + CO₂ + 2 ATP; in muscle cells produces lactic acid causing fatigue.",
            "Double circulation in humans prevents mixing of oxygenated (left heart) and deoxygenated (right heart) blood.",
            "Nephron performs ultrafiltration, selective tubular reabsorption (glucose, amino acids, salts, water), and secretion."
          ],
          definitions: [
            { term: "Translocation", definition: "The transport of soluble products of photosynthesis (sucrose) through phloem sieve tubes using ATP energy." },
            { term: "Peristalsis", definition: "Involuntary rhythmic contraction and relaxation of alimentary canal muscles that moves food downward." }
          ],
          formulaSheet: [
            { name: "Breakdown of Glucose", formula: "Glucose (6C) --(Cytoplasm)--> Pyruvate (3C) + Energy" }
          ],
          solvedExamples: [
            {
              title: "Aerobic vs Anaerobic Pathways",
              question: "Write three differences between aerobic and anaerobic respiration in cells.",
              solution: "1. Oxygen Requirement: Aerobic requires oxygen; anaerobic occurs in absence of oxygen.\n2. Location: Aerobic occurs in cytoplasm and mitochondria; anaerobic occurs solely in cytoplasm.\n3. End Products & Energy: Aerobic yields CO₂ + H₂O + ~38 ATP; anaerobic yields ethanol/lactic acid + 2 ATP."
            }
          ],
          diagram: `
              LUNGS
             /     \\   (Pulmonary Circulation)
      Pulm. Art.  Pulm. Vein
           \\       /
        Right   Left
        Heart   Heart  (Double Circulation)
           /       \\
       Vena       Aorta (Systemic Circulation)
       Cava        /
             \\    /
              BODY
          `,
          commonTraps: [
            "Trap: Stating that plants respire only at night. Plants respire continuously day and night; photosynthesis occurs only in daylight."
          ],
          boardQuestions: [
            { q: "Explain the structure and functioning of a nephron with clean labeled diagram.", marks: "5 Marks", hint: "Describe Bowman's capsule, Glomerulus (filtration), PCT (reabsorption), Loop of Henle, and Collecting duct." }
          ],
          competitiveQuestions: [
            { exam: "NEET", q: "Why is the left ventricle wall much thicker than the right ventricle wall?", solution: "The left ventricle must pump blood throughout the entire high-resistance systemic circulation (whole body), requiring much higher muscular pressure than the right ventricle which only pumps to adjacent lungs." }
          ],
          mcqQuiz: [
            {
              id: "q10_lp_1",
              question: "The breakdown of pyruvate to give carbon dioxide, water and energy takes place in:",
              options: ["Cytoplasm", "Mitochondria", "Chloroplast", "Nucleus"],
              correctIndex: 1,
              explanation: "Aerobic breakdown of pyruvate occurs inside the mitochondrial matrix and cristae."
            }
          ]
        },
        {
          id: "ch-control-coordination-10",
          number: 6,
          title: "Control and Coordination",
          summary: "Nervous system, neuron structure, reflex arc, human brain (forebrain, midbrain, hindbrain), plant hormones (auxin, gibberellin, cytokinin, abscisic acid), and animal endocrine glands.",
          keyPoints: [
            "Neuron consists of Dendrites (receive impulse), Cyton/Cell body, and Axon (transmits impulse).",
            "Synapse is the microscopic gap between terminal branch of one neuron and dendrite of next where chemical neurotransmitters diffuse.",
            "Auxin promotes cell elongation and phototropism (accumulates on shaded side of shoot causing stem to bend towards light).",
            "Insulin secreted by pancreas regulates blood glucose; deficiency causes diabetes mellitus."
          ],
          definitions: [
            { term: "Reflex Arc", definition: "The shortest neural pathway that mediates a reflex action (Receptor → Sensory Neuron → Spinal Cord Interneuron → Motor Neuron → Effector Muscle)." },
            { term: "Phototropism", definition: "Directional growth movement of plant organs in response to light direction." }
          ],
          formulaSheet: [
            { name: "Reflex Pathway", formula: "Receptor → Sensory Neuron → Relay Neuron (Spinal Cord) → Motor Neuron → Effector" }
          ],
          solvedExamples: [
            {
              title: "Mechanism of Phototropism",
              question: "How do auxins promote the growth of a tendril around a support?",
              solution: "When a tendril comes into contact with any support, auxin diffuses away from the side of contact towards the outer side. The high auxin concentration stimulates cells on the outer side to grow much faster than the side in contact, causing the tendril to curve and tightly coil around the support."
            }
          ],
          diagram: `
[Stimulus] -> [Receptor] -> (Sensory Neuron) -> [SPINAL CORD (Relay)]
                                                        |
                                                 (Motor Neuron)
                                                        v
                                                [Effector Muscle] -> [Response]
          `,
          commonTraps: [
            "Trap: Assuming the brain coordinates instantaneous reflex actions. The SPINAL CORD coordinates reflex actions to protect the body rapidly without delay."
          ],
          boardQuestions: [
            { q: "Mention the function of (a) Cerebellum, (b) Medulla oblongata, (c) Hypothalamus.", marks: "3 Marks", hint: "(a) Precision of voluntary actions and body posture/balance; (b) Involuntary actions like blood pressure and vomiting; (c) Hunger, thirst, temperature regulation." }
          ],
          competitiveQuestions: [
            { exam: "NEET", q: "Which plant hormone acts as a growth inhibitor and causes wilting/abscission of leaves?", solution: "Abscisic acid (ABA), also known as the stress hormone." }
          ],
          mcqQuiz: [
            {
              id: "q10_cc_1",
              question: "The gap between two neurons is called a:",
              options: ["Dendrite", "Synapse", "Axon", "Impulse"],
              correctIndex: 1,
              explanation: "The junction across which nerve impulses pass between two neurons is the synapse."
            }
          ]
        },
        {
          id: "ch-reproduction-10",
          number: 7,
          title: "How do Organisms Reproduce?",
          summary: "Asexual reproduction (fission, fragmentation, regeneration, budding, spore formation, vegetative propagation), sexual reproduction in flowering plants, human male and female reproductive systems, and contraception.",
          keyPoints: [
            "DNA copying is essential for reproduction; errors during copying create variations which are the basis for evolution.",
            "Flower reproductive parts: Stamen (male - anther & filament) and Carpel/Pistil (female - stigma, style, ovary).",
            "Double fertilisation: One sperm fertilises egg cell to form zygote (2n); second sperm fuses with two polar nuclei to form triploid endosperm (3n).",
            "Surgical contraceptive methods: Vasectomy in males (vas deferens blocked), Tubectomy in females (fallopian tubes blocked)."
          ],
          definitions: [
            { term: "Pollination", definition: "The transfer of pollen grains from the anther to the stigma of a flower (self-pollination or cross-pollination)." },
            { term: "Placenta", definition: "A disc-like vascular tissue embedded in the uterine wall providing glucose and oxygen from mother to embryo and removing metabolic wastes." }
          ],
          formulaSheet: [
            { name: "Double Fertilisation", formula: "Sperm (n) + Egg (n) → Zygote (2n); Sperm (n) + 2 Polar Nuclei (2n) → Endosperm (3n)" }
          ],
          solvedExamples: [
            {
              title: "Significance of Vegetative Propagation",
              question: "State three advantages of vegetative propagation in plants.",
              solution: "1. Allows seedless plants (banana, orange, rose, jasmine) to reproduce.\n2. All offspring are genetically identical to the parent plant (preserves desirable traits).\n3. Plants raised through vegetative propagation flower and bear fruit much earlier than those grown from seeds."
            }
          ],
          diagram: `
         POLLEN GRAIN
              v
          [STIGMA]
             ||
          [STYLE]   <-- Pollen Tube grows downward
             ||
          [OVARY]   <-- Contains Ovule -> Zygote (2n) + Endosperm (3n)
          `,
          commonTraps: [
            "Trap: Confusing pollination with fertilisation. Pollination is merely the mechanical transfer of pollen; fertilisation is the actual nuclear fusion of gametes."
          ],
          boardQuestions: [
            { q: "What is the role of seminal vesicles and prostate gland in human males?", marks: "2 Marks", hint: "Secrete alkaline fluid that nourishes sperm and provides a fluid medium for easier motility." }
          ],
          competitiveQuestions: [
            { exam: "NEET", q: "In human females, fertilisation of the ovum normally takes place in which specific organ?", solution: "Ampullary-isthmic junction of the Fallopian tube (Oviduct)." }
          ],
          mcqQuiz: [
            {
              id: "q10_rep_1",
              question: "In human females, an event that indicates the onset of reproductive phase is:",
              options: ["Growth of body", "Changes in hair pattern", "Menstruation", "Change in voice"],
              correctIndex: 2,
              explanation: "Menarche (onset of menstruation) marks the start of female reproductive capability."
            }
          ]
        },
        {
          id: "ch-heredity-10",
          number: 8,
          title: "Heredity",
          summary: "Mendelian inheritance, monohybrid cross (3:1 ratio), dihybrid cross (9:3:3:1 ratio), dominant and recessive traits, sex determination in humans.",
          keyPoints: [
            "Mendel selected garden pea (Pisum sativum) with 7 contrasting visible characters.",
            "Monohybrid phenotypic ratio is 3:1 (Genotypic ratio 1:2:1: TT, Tt, tt).",
            "Dihybrid phenotypic ratio is 9:3:3:1 (Law of Independent Assortment).",
            "Human sex determination is chromosomal: Father donates X or Y chromosome in sperm. If sperm carries Y, offspring is male (XY); if X, female (XX)."
          ],
          definitions: [
            { term: "Gene", definition: "A functional unit of DNA on a chromosome that encodes a specific protein/trait." },
            { term: "Allele", definition: "Alternative forms of a single gene located at the same locus on homologous chromosomes (e.g. T and t)." }
          ],
          formulaSheet: [
            { name: "Monohybrid F2 Ratio", formula: "Phenotypic = 3 : 1; Genotypic = 1 : 2 : 1" },
            { name: "Dihybrid F2 Ratio", formula: "Phenotypic = 9 : 3 : 3 : 1" }
          ],
          solvedExamples: [
            {
              title: "Monohybrid Cross Analysis",
              question: "A cross between pure tall pea plants (TT) and pure dwarf pea plants (tt) produces F1 plants. When F1 plants self-pollinate, what percentage of F2 progeny are dwarf?",
              solution: "Parents: TT × tt\nF1 Generation: All Tt (Tall).\nSelfing F1: Tt × Tt gives gametes T, t from each parent.\nPunnett Square: TT (Tall), Tt (Tall), Tt (Tall), tt (Dwarf).\nProportion of dwarf (tt) = 1 out of 4 = 25%."
            }
          ],
          diagram: `
Parent Cross:    Male (XY)   x   Female (XX)
Gametes:         X     Y             X
Offspring:       XX (50% Female)    XY (50% Male)
Conclusion: Male parent determines sex of child with 50% equal probability.
          `,
          commonTraps: [
            "Trap: Blaming mother for sex of the baby. Mothers only contribute X chromosomes; the sperm cell from father carries either X or Y and strictly decides sex."
          ],
          boardQuestions: [
            { q: "Explain how sex of a child is determined in human beings.", marks: "3 Marks", hint: "Show cross of XY (father) and XX (mother) yielding 50% XX (female) and 50% XY (male)." }
          ],
          competitiveQuestions: [
            { exam: "NEET", q: "A man with blood group A marries a woman with blood group B. What are all possible blood groups of their offspring?", solution: "If parents are heterozygous (Iᴬi and Iᴮi), offspring can have blood groups A (Iᴬi), B (Iᴮi), AB (IᴬIᴮ), or O (ii) in 1:1:1:1 ratio. All four groups are possible." }
          ],
          mcqQuiz: [
            {
              id: "q10_her_1",
              question: "A zygote which has an X-chromosome inherited from the father will develop into a:",
              options: ["Boy", "Girl", "Either boy or girl", "Twins"],
              correctIndex: 1,
              explanation: "Inheriting X from father produces XX genotype which develops into a girl."
            }
          ]
        },
        {
          id: "ch-light-10",
          number: 9,
          title: "Light — Reflection and Refraction",
          summary: "Reflection of light by spherical mirrors (concave and convex), mirror formula and magnification, refraction of light, Snell's law, refractive index, lenses, lens formula, and power of a lens.",
          keyPoints: [
            "Mirror formula: 1/f = 1/v + 1/u; Magnification: m = -v/u = h'/h.",
            "Concave mirror produces real/inverted images (except when object is between P and F, producing virtual/erect image).",
            "Convex mirror ALWAYS produces virtual, erect, and diminished image (used as rear-view mirrors).",
            "Snell's Law: sin i / sin r = constant = n₂ / n₁.",
            "Lens formula: 1/f = 1/v - 1/u; Power of lens: P = 1 / f (in metres), measured in Dioptres (D)."
          ],
          definitions: [
            { term: "Refractive Index", definition: "The ratio of speed of light in vacuum to speed of light in medium (n = c / v)." },
            { term: "Power of a Lens", definition: "The degree of convergence or divergence of light rays achieved by a lens (P = 1/f in metres)." }
          ],
          formulaSheet: [
            { name: "Mirror Formula", formula: "1/f = 1/v + 1/u" },
            { name: "Lens Formula", formula: "1/f = 1/v - 1/u" },
            { name: "Lens Power", formula: "P = 1 / f(m) (Dioptre)" },
            { name: "Snell's Law", formula: "n₁ · sin i = n₂ · sin r" }
          ],
          solvedExamples: [
            {
              title: "Concave Mirror Calculation",
              question: "An object is placed at a distance of 10 cm in front of a concave mirror of focal length 15 cm. Find position and nature of image.",
              solution: "Sign convention: u = -10 cm, f = -15 cm.\n1/v = 1/f - 1/u = 1/(-15) - 1/(-10) = -1/15 + 1/10 = (-2 + 3) / 30 = 1/30.\nv = +30 cm.\nSince v is positive, image is formed BEHIND the mirror.\nMagnification m = -v/u = -(+30)/(-10) = +3.\nNature: Virtual, erect, and magnified (3 times larger)."
            }
          ],
          diagram: `
Concave Mirror (Real inverted focus):
           \\
     -------*------- Principal Axis (P, F, C)
           /
Convex Lens (Convergence):
            (
     ----->( )-----> Focus (F)
            )
          `,
          commonTraps: [
            "Trap: Forgetting sign conventions: object distance u is ALWAYS negative in both mirrors and lenses!"
          ],
          boardQuestions: [
            { q: "A doctor prescribes a corrective lens of power +2.0 D. Find focal length of lens. Is it converging or diverging?", marks: "2 Marks", hint: "f = 1/P = 1/(+2.0) = +0.5 m = +50 cm. Positive focal length means convex (converging) lens." }
          ],
          competitiveQuestions: [
            { exam: "JEE / NEET", q: "A ray of light traveling in glass (n = 1.5) enters water (n = 4/3). Find the critical angle for total internal reflection.", solution: "sin c = n_rarer / n_denser = (4/3) / (3/2) = 8/9 => c = sin⁻¹(8/9) ≈ 62.7°." }
          ],
          mcqQuiz: [
            {
              id: "q10_lt_1",
              question: "A concave mirror produces three times magnified real image of an object placed at 10 cm in front of it. The image is located at:",
              options: ["+30 cm", "-30 cm", "-10 cm", "+10 cm"],
              correctIndex: 1,
              explanation: "Real image has negative magnification m = -3. m = -v/u => -3 = -v/(-10) => v = -30 cm."
            }
          ]
        },
        {
          id: "ch-human-eye-10",
          number: 10,
          title: "The Human Eye and the Colourful World",
          summary: "Structure and functioning of human eye, accommodation, defects of vision (myopia, hypermetropia, presbyopia) and corrections, refraction through prism, dispersion, atmospheric refraction (twinkling of stars), and scattering of light (Tyndall effect).",
          keyPoints: [
            "Near point of normal eye is 25 cm; far point is infinity (least distance of distinct vision D = 25 cm).",
            "Myopia (near-sightedness): Image forms in front of retina; corrected using concave lens.",
            "Hypermetropia (far-sightedness): Image forms behind retina; corrected using convex lens.",
            "Dispersion: Splitting of white light into constituent colours (VIBGYOR) through a prism (Red bends least, Violet bends most).",
            "Atmospheric refraction causes twinkling of stars and advanced sunrise/delayed sunset by ~2 minutes.",
            "Rayleigh Scattering: Intensity of scattered light ∝ 1/λ⁴. Blue scatters more giving blue sky; red scatters least giving red sunrise/sunset."
          ],
          definitions: [
            { term: "Power of Accommodation", definition: "The ability of the ciliary muscles to adjust the focal length of the eye lens to focus nearby and distant objects clearly on the retina." },
            { term: "Tyndall Effect", definition: "The scattering of a beam of light by colloidal particles in its path, making the path of light visible." }
          ],
          formulaSheet: [
            { name: "Myopia Correction Lens", formula: "f = -d (where d is person's far point)" },
            { name: "Rayleigh Scattering", formula: "I ∝ 1 / λ⁴" }
          ],
          solvedExamples: [
            {
              title: "Myopic Eye Correction",
              question: "A myopic person cannot see objects distinctly beyond 80 cm. What is the power of the lens required to correct this defect?",
              solution: "Object is at infinity: u = -∞.\nImage must form at person's far point: v = -80 cm = -0.8 m.\nBy lens formula: 1/f = 1/v - 1/u = 1/(-0.8) - 1/(-∞) = -1/0.8 = -1.25 D.\nPower P = -1.25 D (concave lens of focal length 80 cm)."
            }
          ],
          diagram: `
Myopic Eye (Image falls short of retina):
        ( (      )
  ----->( (  *   )   <-- Focus in front of retina
        ( (      )
Correction: Concave lens diverges rays to focus exactly on retina.
          `,
          commonTraps: [
            "Trap: Confusing Myopia correction with Hypermetropia correction. Myopia = Concave (minus power); Hypermetropia = Convex (plus power)."
          ],
          boardQuestions: [
            { q: "Why do stars twinkle while planets do not?", marks: "3 Marks", hint: "Stars are point sources of light whose rays continually bend due to atmospheric density turbulence; planets are extended disks where individual fluctuations cancel out." }
          ],
          competitiveQuestions: [
            { exam: "NEET / JEE", q: "Why does the sun appear reddish early in the morning and at sunset?", solution: "At sunrise/sunset, sunlight traverses thicker layers of atmosphere. Shorter blue wavelengths are scattered away; longer red wavelengths reach observer's eye (I ∝ 1/λ⁴)." }
          ],
          mcqQuiz: [
            {
              id: "q10_he_1",
              question: "The human eye forms the image of an object at its:",
              options: ["Cornea", "Iris", "Pupil", "Retina"],
              correctIndex: 3,
              explanation: "Light-sensitive photoreceptors (rods and cones) on the retina capture the real inverted optical image."
            }
          ]
        },
        {
          id: "ch-electricity-10",
          number: 11,
          title: "Electricity",
          summary: "Electric current, potential difference, Ohm's law, resistance, factors affecting resistance, resistivity, series and parallel circuits, Joule's heating effect, electric power and commercial energy units.",
          keyPoints: [
            "Current I = Q/t (Ampere = Coulomb/second). Direction of conventional current is opposite to electron flow.",
            "Potential Difference: V = W/Q (Volt = Joule/Coulomb).",
            "Ohm's Law: V = I·R (at constant temperature).",
            "Resistance R = ρ·L/A. Depends directly on length, inversely on cross-sectional area, and on material resistivity ρ.",
            "Series resistors: R_s = R₁ + R₂ + R₃ (same current through all).",
            "Parallel resistors: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃ (same voltage across all).",
            "Joule's Law of Heating: H = I²Rt = VIt = (V²/R)t.",
            "Commercial unit: 1 kilowatt-hour (1 kWh) = 3.6 × 10⁶ Joules."
          ],
          definitions: [
            { term: "Resistivity (ρ)", definition: "The resistance of a conductor of unit length and unit cross-sectional area (Unit: Ohm-metre, Ω·m)." },
            { term: "1 Kilowatt-hour", definition: "The electrical energy consumed when an appliance of 1000 W operates for 1 hour (1 unit = 3.6 × 10⁶ J)." }
          ],
          formulaSheet: [
            { name: "Ohm's Law", formula: "V = I · R" },
            { name: "Resistance & Resistivity", formula: "R = ρ · (L / A)" },
            { name: "Series Equivalent", formula: "R_s = R₁ + R₂ + ··· + R_n" },
            { name: "Parallel Equivalent", formula: "1/R_p = 1/R₁ + 1/R₂ + ··· + 1/R_n" },
            { name: "Electric Power", formula: "P = V · I = I² · R = V² / R" },
            { name: "Heating Effect", formula: "H = I² · R · t" }
          ],
          solvedExamples: [
            {
              title: "Equivalent Resistance and Heating",
              question: "Two electric bulbs rated 220V, 100W and 220V, 60W are connected in parallel to a 220V supply. Find total current drawn from line.",
              solution: "Current through bulb 1: I₁ = P₁ / V = 100 / 220 = 5/11 A.\nCurrent through bulb 2: I₂ = P₂ / V = 60 / 220 = 3/11 A.\nIn parallel, total current I = I₁ + I₂ = 5/11 + 3/11 = 8/11 A ≈ 0.727 A."
            }
          ],
          diagram: `
Series:     +---[ R1 ]---[ R2 ]---[ R3 ]---+  (I is constant throughout)
Parallel:       +---[ R1 ]---+
            ----+---[ R2 ]---+----            (V is constant across branches)
                +---[ R3 ]---+
          `,
          commonTraps: [
            "Trap: When a wire is stretched to double length, its area halves! R' = ρ(2L)/(A/2) = 4R (resistance increases 4 times, NOT 2 times!)."
          ],
          boardQuestions: [
            { q: "Why are copper and aluminium wires usually employed for electricity transmission?", marks: "2 Marks", hint: "They have very low electrical resistivity, minimizing I²Rt energy losses during transmission." }
          ],
          competitiveQuestions: [
            { exam: "JEE Main Foundation", q: "Three identical resistors each of 6 Ω are connected together. What are all possible equivalent resistances?", solution: "All series: 18 Ω; All parallel: 2 Ω; 2 in parallel + 1 series: 3 + 6 = 9 Ω; 2 in series + 1 parallel: (12 × 6)/(12 + 6) = 4 Ω." }
          ],
          mcqQuiz: [
            {
              id: "q10_el_1",
              question: "A cylindrical conductor of length l and uniform area of cross-section A has resistance R. Another conductor of length 2l and resistance R of the same material has area of cross-section:",
              options: ["A/2", "3A/2", "2A", "3A"],
              correctIndex: 2,
              explanation: "R = ρ·l/A. For second wire R = ρ·(2l)/A'. Equating gives ρ·l/A = 2ρ·l/A' => A' = 2A."
            }
          ]
        },
        {
          id: "ch-magnetic-effects-10",
          number: 12,
          title: "Magnetic Effects of Electric Current",
          summary: "Magnetic field and field lines, field due to straight wire, circular loop, and solenoid, Fleming's Left-Hand Rule, electric motor principle, electromagnetic induction, domestic electric circuits (earthing, short circuit, fuse).",
          keyPoints: [
            "Magnetic field lines emerge from North pole and enter South pole outside magnet; inside magnet they travel from South to North.",
            "Right-Hand Thumb Rule: Thumb points along current; curled fingers give circular magnetic field direction.",
            "Solenoid produces uniform magnetic field inside identical to a bar magnet (B = μ₀ n I).",
            "Fleming's Left-Hand Rule: Forefinger = Field (B), Center finger = Current (I), Thumb = Force (F) on conductor (F = B I L sin θ).",
            "Domestic circuit: Live wire (red/brown, 220V), Neutral wire (black/blue, 0V), Earth wire (green) protects against electric shock."
          ],
          definitions: [
            { term: "Solenoid", definition: "A long cylindrical coil of many circular turns of insulated copper wire closely wrapped in the shape of a cylinder." },
            { term: "Short Circuit", definition: "Accidental direct contact between live and neutral wires having negligible resistance, causing sudden dangerous surge in electric current." }
          ],
          formulaSheet: [
            { name: "Magnetic Force", formula: "F = B · I · L · sin θ" }
          ],
          solvedExamples: [
            {
              title: "Force on Moving Charge",
              question: "A positively charged alpha particle projected towards west is deflected towards north by a magnetic field. Find direction of magnetic field.",
              solution: "Use Fleming's Left-Hand Rule:\n1. Motion of positive alpha particle = Direction of current = West (middle finger points West).\n2. Deflection = Force = North (thumb points North).\n3. Forefinger automatically points UPWARDS.\nTherefore, the magnetic field is directed vertically upwards."
            }
          ],
          diagram: `
Fleming's Left-Hand Rule:
       Thumb: Force (F) / Motion
         |
         |   Forefinger: Magnetic Field (B)
         |  /
         | /
         +------- Middle Finger: Current (I)
          `,
          commonTraps: [
            "Trap: Forgetting that magnetic field lines form CONTINUOUS CLOSED LOOPS (they do not originate or terminate at poles)."
          ],
          boardQuestions: [
            { q: "What is the function of an earth wire? Why is it necessary to earth metallic appliances?", marks: "3 Marks", hint: "Provides low-resistance discharge path to ground. If live wire touches metal body, current flows to earth blowing fuse, preventing lethal user electric shock." }
          ],
          competitiveQuestions: [
            { exam: "JEE / NEET", q: "What is the magnetic field at the centre of a long solenoid of n turns per unit length carrying current I?", solution: "B = μ₀ · n · I. It is uniform and independent of the solenoid radius or length." }
          ],
          mcqQuiz: [
            {
              id: "q10_mag_1",
              question: "The phenomenon of electromagnetic induction is:",
              options: [
                "The process of charging a body",
                "The process of generating magnetic field due to a current passing through a coil",
                "Producing induced current in a coil due to relative motion between a magnet and the coil",
                "The process of rotating a coil of an electric motor"
              ],
              correctIndex: 2,
              explanation: "Faraday discovered that relative motion between a magnet and coil induces an electric current."
            }
          ]
        },
        {
          id: "ch-our-environment-10",
          number: 13,
          title: "Our Environment",
          summary: "Ecosystem, biotic and abiotic components, food chains and webs, 10 percent law of energy transfer, biological magnification, and ozone layer depletion by CFCs.",
          keyPoints: [
            "Ecosystem consists of biotic (producers, consumers, decomposers) and abiotic components (air, water, temperature).",
            "Lindeman's 10% Law: Only ~10% of energy is transferred from one trophic level to the next; 90% is lost as heat and metabolic maintenance.",
            "Energy flow through an ecosystem is strictly UNIDIRECTIONAL.",
            "Biological Magnification: Progressive increase in concentration of non-biodegradable toxins (DDT) at successive trophic levels.",
            "Ozone (O₃) in stratosphere shields Earth from deadly UV-B rays. Depleted by Chlorofluorocarbons (CFCs): Cl· radicals catalytically destroy O₃."
          ],
          definitions: [
            { term: "Biomagnification", definition: "The accumulation and progressive concentration of persistent toxic chemicals in organisms at higher trophic levels." },
            { term: "10% Law of Energy", definition: "During energy transfer in food chains, only about 10% of organic energy is stored as flesh in the next trophic level." }
          ],
          formulaSheet: [
            { name: "Ozone Formation", formula: "O₂ --(UV)--> O + O;  O + O₂ → O₃" },
            { name: "10 Percent Energy Rule", formula: "E_(n+1) = 0.10 · E_n" }
          ],
          solvedExamples: [
            {
              title: "Calculate Energy at Tertiary Consumer",
              question: "In a food chain: Grass → Grasshopper → Frog → Snake → Hawk, if 20,000 J of solar energy is captured by grass, how much energy is available to the hawk?",
              solution: "1. Producers (Grass) = 20,000 J\n2. Primary Consumer (Grasshopper) = 10% of 20,000 = 2,000 J\n3. Secondary Consumer (Frog) = 10% of 2,000 = 200 J\n4. Tertiary Consumer (Snake) = 10% of 200 = 20 J\n5. Top Consumer (Hawk) = 10% of 20 = 2 J."
            }
          ],
          diagram: `
       [Top Carnivore: Hawk (0.1%)]
             ^
       [Carnivores: Snake (1%)]
             ^
       [Herbivores: Grasshopper (10%)]
             ^
       [Producers: Green Plants (100%)]   <-- Energy Flow is strictly UNIDIRECTIONAL
          `,
          commonTraps: [
            "Trap: Thinking energy can be recycled in an ecosystem. Matter (nutrients) is recycled by decomposers, but energy dissipates as heat and is NEVER recycled!"
          ],
          boardQuestions: [
            { q: "What is biological magnification? Will levels be different at different trophic levels?", marks: "3 Marks", hint: "Define biomagnification. Maximum concentration occurs at top trophic level (e.g. human/hawk) because chemicals are non-biodegradable and cannot be excreted." }
          ],
          competitiveQuestions: [
            { exam: "NEET", q: "Which international agreement successfully froze CFC production to protect the ozone layer?", solution: "Montreal Protocol (1987), an international treaty designed to protect the ozone layer by phasing out the production of substances responsible for ozone depletion." }
          ],
          mcqQuiz: [
            {
              id: "q10_env_1",
              question: "In an ecosystem, the 10% of energy available for transfer from one trophic level to the next is in the form of:",
              options: ["Heat energy", "Light energy", "Chemical energy", "Mechanical energy"],
              correctIndex: 2,
              explanation: "Energy is stored as organic chemical bonds in cellular biomass before transfer."
            }
          ]
        }
      ]
    },
    {
      id: "social-science-10",
      name: "Social Science",
      icon: "Globe",
      color: "text-amber-500",
      chapters: [
        {
          id: "ch-nationalism-europe-10",
          number: 1,
          title: "The Rise of Nationalism in Europe",
          summary: "French Revolution and idea of the nation, Napoleonic Code (1804), romanticism, revolutions of 1848, unification of Germany and Italy, and nationalism leading to imperialism.",
          keyPoints: [
            "Napoleonic Code of 1804 abolished birth privileges, established equality before law, and secured right to property.",
            "Congress of Vienna (1815): Hosted by Austrian Chancellor Duke Metternich to restore Bourbon dynasty and re-establish conservative order.",
            "Unification of Italy: Engineered by Giuseppe Mazzini (Young Italy), Count Cavour (diplomatic alliances), and Giuseppe Garibaldi (Red Shirts).",
            "Unification of Germany: Led by Prussian Chief Minister Otto von Bismarck using 'Blood and Iron' policy, crowned Kaiser William I in 1871."
          ],
          definitions: [
            { term: "Plebiscite", definition: "A direct vote by which all the people of a region are asked to accept or reject a proposal." },
            { term: "Romanticism", definition: "A cultural movement that sought to develop a particular form of nationalist sentiment focusing on emotions, intuition, and mystical feelings." }
          ],
          formulaSheet: [],
          solvedExamples: [],
          diagram: `
+-------------------------------------------------------------+
|              UNIFICATION OF ITALY & GERMANY                 |
|                                                             |
| Italy (1861):    Mazzini (Ideology) + Cavour (Diplomacy) +   |
|                  Garibaldi (Armed Force) -> Victor Emmanuel |
|                                                             |
| Germany (1871):  Otto von Bismarck (Blood and Iron policy)   |
|                  -> Kaiser William I at Versailles          |
+-------------------------------------------------------------+
          `,
          commonTraps: [
            "Trap: Confusing Duke Metternich with Napoleon. Metternich was the conservative Austrian Chancellor who said 'When France sneezes, the rest of Europe catches cold'."
          ],
          boardQuestions: [
            { q: "Explain any three provisions of the Napoleonic Civil Code of 1804.", marks: "3 Marks", hint: "1. Did away with all privileges based on birth. 2. Established equality before law. 3. Secured right to property." }
          ],
          competitiveQuestions: [
            { exam: "UPSC / NDA", q: "Which treaty recognized Greece as an independent nation in 1832?", solution: "Treaty of Constantinople of 1832." }
          ],
          mcqQuiz: [
            {
              id: "q10_hist_1",
              question: "Who was proclaimed the first German Emperor in 1871?",
              options: ["Otto von Bismarck", "Kaiser William I", "Victor Emmanuel II", "Count Cavour"],
              correctIndex: 1,
              explanation: "In January 1871, King William I of Prussia was proclaimed German Emperor at the Palace of Versailles."
            }
          ]
        },
        {
          id: "ch-nationalism-india-10",
          number: 2,
          title: "Nationalism in India",
          summary: "First World War impacts, Rowlatt Act, Jallianwala Bagh massacre, Khilafat movement, Non-Cooperation Movement, Salt March, Civil Disobedience Movement, and sense of collective belonging.",
          keyPoints: [
            "Rowlatt Act (1919) gave British government power to repress political activities and detain political prisoners without trial for two years.",
            "Jallianwala Bagh massacre occurred on 13 April 1919 in Amritsar, ordered by General Dyer.",
            "Non-Cooperation Movement launched in 1920, abruptly called off by Gandhiji in Feb 1922 due to the Chauri Chaura violent clash.",
            "Salt March: 240 miles from Sabarmati to Dandi (March 12 – April 6, 1930) broke salt law, initiating the Civil Disobedience Movement.",
            "Gandhi-Irwin Pact (March 1931) led to participation in the Second Round Table Conference in London."
          ],
          definitions: [
            { term: "Satyagraha", definition: "A non-violent philosophy meaning holding on to truth; power of truth and the need to search for truth without physical force." }
          ],
          formulaSheet: [],
          solvedExamples: [],
          diagram: `
1919: Rowlatt Act & Jallianwala Bagh
  |
1920-1922: Non-Cooperation & Khilafat Movement (Withdrawn after Chauri Chaura)
  |
1930: Dandi Salt March & Civil Disobedience Movement
  |
1931: Gandhi-Irwin Pact & Round Table Conferences
  |
1942: Quit India Movement ("Do or Die")
          `,
          commonTraps: [
            "Trap: Confusing Non-Cooperation with Civil Disobedience. Non-cooperation refused collaboration with British; Civil Disobedience actively broke colonial laws (e.g. Salt Law)."
          ],
          boardQuestions: [
            { q: "Why did Mahatma Gandhi decide to withdraw the Non-Cooperation Movement in 1922?", marks: "3 Marks", hint: "Chauri Chaura incident in Gorakhpur where a peaceful crowd turned violent and burned a police station with 22 policemen." }
          ],
          competitiveQuestions: [
            { exam: "UPSC / NDA", q: "Who authored the famous book 'Hind Swaraj' published in 1909?", solution: "Mahatma Gandhi." }
          ],
          mcqQuiz: [
            {
              id: "q10_ind_1",
              question: "The resolution of 'Poorna Swaraj' (Complete Independence) was adopted at which session of the Congress?",
              options: ["Karachi Session 1931", "Lahore Session 1929", "Calcutta Session 1928", "Nagpur Session 1920"],
              correctIndex: 1,
              explanation: "In December 1929, under the presidency of Jawaharlal Nehru, the Lahore Congress formalized the demand of 'Poorna Swaraj'."
            }
          ]
        },
        {
          id: "ch-power-sharing-10",
          number: 3,
          title: "Power Sharing",
          summary: "Case studies of Belgium and Sri Lanka, majoritarianism in Sri Lanka, accommodation in Belgium, and horizontal vs vertical power sharing.",
          keyPoints: [
            "Belgium accommodated linguistic diversity (Dutch, French, German) by amending constitution 4 times, ensuring peace and stability.",
            "Sri Lanka pursued majoritarianism favoring Sinhala majority (1956 Sinhala Only Act), triggering decades of brutal civil war.",
            "Horizontal Power Sharing: Separation of power among Legislature, Executive, and Judiciary (System of Checks and Balances).",
            "Vertical Power Sharing: Federalism with power shared among Central, State, and Local government levels."
          ],
          definitions: [
            { term: "Majoritarianism", definition: "A belief that the majority community should be able to rule a country in whichever way it wants, by disregarding the wishes and needs of the minority." },
            { term: "Checks and Balances", definition: "A system where each organ of government checks the others, resulting in a balance of power among various institutions." }
          ],
          formulaSheet: [],
          solvedExamples: [],
          diagram: `
+-------------------------------------------------------------+
|                FORMS OF POWER SHARING                       |
|                                                             |
| Horizontal:   Legislature <---> Executive <---> Judiciary   |
|               (System of Checks and Balances)               |
|                                                             |
| Vertical:     Union Govt. -> State Govt. -> Local Govt.     |
|               (Federalism)                                  |
+-------------------------------------------------------------+
          `,
          commonTraps: [
            "Trap: Confusing horizontal and vertical power sharing. Horizontal is between equal organs of same level; vertical is between higher and lower governmental tiers."
          ],
          boardQuestions: [
            { q: "Why is power sharing desirable? Give one prudential and one moral reason.", marks: "3 Marks", hint: "Prudential: Reduces conflict between social groups and ensures political stability. Moral: Power sharing is the very spirit of democracy." }
          ],
          competitiveQuestions: [
            { exam: "UPSC Prelims", q: "The headquarters of the European Union was chosen to be located in which city?", solution: "Brussels, Belgium, because of Belgium's exemplary conflict resolution model." }
          ],
          mcqQuiz: [
            {
              id: "q10_ps_1",
              question: "Which language was declared as the only official language of Sri Lanka by the Act of 1956?",
              options: ["Tamil", "Sinhala", "English", "Pali"],
              correctIndex: 1,
              explanation: "The 1956 Act recognized Sinhala as the sole official language, disregarding Tamil and alienating Sri Lankan Tamils."
            }
          ]
        }
      ]
    }
  ]
};
