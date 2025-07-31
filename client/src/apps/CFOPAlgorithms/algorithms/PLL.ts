interface AlgSet {
  name: string
  alg: string[]
  group: string
  prob: number
  arrows: Array<{
    s1: { n: number }
    s2: { n: number }
  }>
}

const algsetAlgs: AlgSet[] = [
  {
    name: 'H',
    alg: ['M2 U M2 U2 M2 U M2', "M2 U' M2 U2 M2 U' M2"],
    group: 'Edges Only',
    prob: 1,
    arrows: [
      {
        s1: { n: 1 },
        s2: { n: 7 }
      },
      {
        s1: { n: 7 },
        s2: { n: 1 }
      },
      {
        s1: { n: 3 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 3 }
      }
    ]
  },
  {
    name: 'Z',
    alg: [
      "M' U M2 U M2 U M' U2 M2",
      "y M' U' M2 U' M2 U' M' U2 M2",
      "y M2 U M2 U M' U2 M2 U2 M'",
      "M2 U' M2 U' M' U2 M2 U2 M'"
    ],
    group: 'Edges Only',
    prob: 2,
    arrows: [
      {
        s1: { n: 3 },
        s2: { n: 7 }
      },
      {
        s1: { n: 7 },
        s2: { n: 3 }
      },
      {
        s1: { n: 1 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 1 }
      }
    ]
  },
  {
    name: 'Ua',
    alg: [
      "M2 U M U2 M' U M2",
      "R U' R U R U R U' R' U' R2",
      "y2 R2 U' R' U' R U R U R U' R"
    ],
    group: 'Edges Only',
    prob: 4,
    arrows: [
      {
        s1: { n: 5 },
        s2: { n: 3 }
      },
      {
        s1: { n: 7 },
        s2: { n: 5 }
      },
      {
        s1: { n: 3 },
        s2: { n: 7 }
      }
    ]
  },
  {
    name: 'Ub',
    alg: [
      "M2 U' M U2 M' U' M2",
      "R2 U (R U R' U') R' U' R' U R'",
      "y2 R' U R' U' R' U' (R' U R U) R2",
      "y2 R' U R' U' R3 U' (R' U R U) R2"
    ],
    group: 'Edges Only',
    prob: 4,
    arrows: [
      {
        s1: { n: 3 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 7 }
      },
      {
        s1: { n: 7 },
        s2: { n: 3 }
      }
    ]
  },
  {
    name: 'Aa',
    alg: [
      "x L2 D2 L' U' L D2 L' U L'",
      "y' x' L' U L' D2 L U' L' D2 L2",
      "y x R' U R' D2 R U' R' D2 R2",
      "y2 x' R2 D2 R' U' R D2 R' U R'"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 2 },
        s2: { n: 6 }
      },
      {
        s1: { n: 6 },
        s2: { n: 0 }
      },
      {
        s1: { n: 0 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Ab',
    alg: [
      "x' L2 D2 L U L' D2 L U' L",
      "y x L U' L D2 L' U L D2 L2",
      "y2 x R2 D2 R U R' D2 R U' R",
      "y' x' R U' R D2 R' U R D2 R2"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 8 },
        s2: { n: 0 }
      },
      {
        s1: { n: 0 },
        s2: { n: 6 }
      },
      {
        s1: { n: 6 },
        s2: { n: 8 }
      }
    ]
  },
  {
    name: 'E',
    alg: [
      "x' L' U L D' L' U' L D L' U' L D' L' U L D",
      "x' R U' R' D R U R' D' R U R' D R U' R' D'"
    ],
    group: 'Diagonal Corner Swap',
    prob: 2,
    arrows: [
      {
        s1: { n: 0 },
        s2: { n: 6 }
      },
      {
        s1: { n: 6 },
        s2: { n: 0 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'F',
    alg: ["R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 1 },
        s2: { n: 7 }
      },
      {
        s1: { n: 7 },
        s2: { n: 1 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Ja',
    alg: [
      "x R2 F R F' R U2 r' U r U2",
      "y2 L' U' L F L' U' L U L F' L2 U L",
      "y' R' U L' U2 R U' R' U2 R L"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 1 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 1 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Jb',
    alg: ["R U R' F' R U R' U' R' F R2 U' R'"],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 5 },
        s2: { n: 7 }
      },
      {
        s1: { n: 7 },
        s2: { n: 5 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Ra',
    alg: [
      "R U' R' U' R U R D R' U' R D' R' U2 R'",
      "R U R' F' R U2 R' U2 R' F R U R U2 R'",
      "y' L U2 L' U2 L F' L' U' L U L F L2"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 1 },
        s2: { n: 3 }
      },
      {
        s1: { n: 3 },
        s2: { n: 1 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Rb',
    alg: [
      "R2 F R U R U' R' F' R U2 R' U2 R",
      "y' R' U2 R U2 R' F R U R' U' R' F' R2",
      "R' U2 R' D' R U' R' D R U R U' R' U' R"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 3 },
        s2: { n: 7 }
      },
      {
        s1: { n: 7 },
        s2: { n: 3 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'T',
    alg: ["R U R' U' R' F R2 U' R' U' (R U R') F'"],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 3 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 3 }
      },
      {
        s1: { n: 2 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Y',
    alg: [
      "F R U' R' U' R U R' F' R U R' U' R' F R F'",
      "F R' F R2 U' R' U' R U R' F' R U R' U' F'"
    ],
    group: 'Diagonal Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 1 },
        s2: { n: 3 }
      },
      {
        s1: { n: 3 },
        s2: { n: 1 }
      },
      {
        s1: { n: 0 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 0 }
      }
    ]
  },
  {
    name: 'V',
    alg: [
      "R' U R' U' y R' F' R2 U' R' U R' F R F",
      "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
      "z D' R2 D R2 U R' D' R U' R U R' D R U' z'",
      "R U2 R' D R U' R U' R U R2 D R' U' R D2",
      "x' R' F R F' U R U2 R' U' R U' R' U2 R U R' U'"
    ],
    group: 'Diagonal Corner Swap',
    prob: 4,
    arrows: [
      {
        s1: { n: 1 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 1 }
      },
      {
        s1: { n: 0 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 0 }
      }
    ]
  },
  {
    name: 'Na',
    alg: [
      "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
      "z U R' D R2 U' R D' U R' D R2 U' R D'"
    ],
    group: 'Diagonal Corner Swap',
    prob: 1,
    arrows: [
      {
        s1: { n: 3 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 3 }
      },
      {
        s1: { n: 2 },
        s2: { n: 6 }
      },
      {
        s1: { n: 6 },
        s2: { n: 2 }
      }
    ]
  },
  {
    name: 'Nb',
    alg: [
      "R' (U R U' R') F' U' F R U R' F R' F' R U' R",
      "z D' R U' R2 D R' U D' R U' R2 D R' U"
    ],
    group: 'Diagonal Corner Swap',
    prob: 1,
    arrows: [
      {
        s1: { n: 3 },
        s2: { n: 5 }
      },
      {
        s1: { n: 5 },
        s2: { n: 3 }
      },
      {
        s1: { n: 0 },
        s2: { n: 8 }
      },
      {
        s1: { n: 8 },
        s2: { n: 0 }
      }
    ]
  },
  {
    name: 'Ga',
    alg: [
      "R2 U R' U R' U' R U' R2 (U' D) R' U R D'",
      "R2 u R' U R' U' R u' R2 y' R' U R"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: []
  },
  {
    name: 'Gb',
    alg: [
      "R' U' R (U D') R2 U R' U R U' R U' R2 D",
      "y F' U' F R2 u R' U R U' R u' R2"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: []
  },
  {
    name: 'Gc',
    alg: [
      "R2 U' R U' R U R' U R2 (U D') R U' R' D",
      "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
      "R2 u' R U' R U R' u R2 y R U' R'"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: []
  },
  {
    name: 'Gd',
    alg: [
      "R U R' (U' D) R2 U' R U' R' U R' U R2 D'",
      "R U R' y' R2 u' R U' R' U R' u R2"
    ],
    group: 'Adjacent Corner Swap',
    prob: 4,
    arrows: []
  }
]

const algsetScrambles: string[][] = [
  [
    'R L D2 R L D2 R2 B2 D2 B2 L2 F2 U2 R2 F2 U2',
    'F B D2 F B D2 F2 R2 D2 R2 B2 L2 U2 F2 L2 U2',
    'B F D2 B F D2 B2 L2 D2 L2 F2 R2 U2 B2 R2 U2',
    'L R D2 L R D2 L2 F2 D2 F2 R2 B2 U2 L2 B2 U2'
  ],
  [
    "R L U2 R L' U' R2 U' R2 U' R2 U' R2 U' R2 B2 R2 B2",
    "F B U2 F B' U R2 F2 R2 U F2 U R2 F2 R2 U F2 U'",
    "B F U2 B F' U L2 B2 L2 U B2 U L2 B2 L2 U B2 U'",
    "L R U2 L R' U' L2 U' L2 U' L2 U' L2 U' L2 F2 L2 F2"
  ],
  [
    'F2 D F2 R2 F2 D R2 F2 D2 F2 B2 L2 B2 R2 D2 R2',
    "R2 U' B2 R2 B2 U B2 R2 B2 U2 B2 U2 R2 B2 R2 U2 B2",
    "R2 U' F2 R2 F2 U R' L F2 D2 B2 U2 R L B2 D2",
    "R2 D' R2 F2 R2 D R L' F2 D2 B2 U2 R' L' B2 D2"
  ],
  [
    "F2 U' L2 F2 L2 U F2 L2 U2 L2 F2 L2 U2 F2 L2 U2 F2",
    "F2 D' F2 R2 B2 U R D2 F2 B2 U2 L' F2 R2 U2 B2 U2",
    "F2 D' F2 L2 F2 D F2 L2 D2 L2 B2 R2 U2 F2 R2 U2 B2",
    'L2 U B2 L2 B2 U B2 U2 B2 U2 L2 B2 L2 U2 L2 U2'
  ],
  [
    "R L U2 R L' U F2 U2 R2 F2 R2 U' B2 U' F2 U R2 B2",
    "F B U2 F B L2 U R2 B2 U L2 U' B2 R2 U' L2 F2 B2",
    "B F U2 B F R2 U F2 L2 D B2 U' F2 R2 D' R2 B2 F2",
    "L R U2 L R' D F2 D' F2 U2 L2 F2 L2 U L2 U L2 F2"
  ],
  [
    "R L U2 R L U' D' F2 D L2 F2 D B2 D' F2 L2 U' L2",
    "F B U2 F B' R2 U L2 U' B2 U2 B2 L2 F2 D L2 D L2",
    "B F U2 B' F R2 U L2 U' B2 U2 B2 L2 F2 D L2 D L2",
    "L R U2 L R U' D' B2 D B2 R2 U L2 U' R2 B2 U' R2"
  ],
  [
    "R L F2 R L' U' L2 D2 F2 U' B2 U' R2 F2 D2 B2 U' R2",
    "F B L2 F' B' L2 U R2 D' L2 B2 L2 D R2 U F2 U2 L2",
    "B F R2 B' F' R2 U L2 D' R2 F2 R2 D L2 U B2 U2 R2",
    "L R B2 L R' U' R2 D2 B2 U' F2 U' L2 B2 D2 F2 U' L2"
  ],
  [
    "R L' F2 R L' U' R2 U' R2 L2 F2 U L2 D' B2 D L2 F2",
    "F B D2 F B' D' L2 B2 D' L2 B2 U' F2 L2 R2 U L2 D'",
    "B F D2 B' F D' R2 L2 F2 U B2 L2 D B2 L2 U L2 D'",
    "L R' B2 L R' U R2 U L2 R2 B2 U' L2 D F2 D' L2 B2"
  ],
  [
    "R L U2 R L' B2 U R2 F2 B2 U' L2 U L2 B2 D F2 U'",
    "F B U2 F B' U F2 D' F2 D R2 F2 L2 B2 D B2 L2 U",
    "B F U2 B' F U R2 B2 D B2 D' L2 U F2 R2 B2 R2 D",
    "L R U2 L' R B2 U L2 U' R2 U R2 F2 D F2 L2 R2 U'"
  ],
  [
    "R L U2 R L U D' F2 U' F2 D R2 D' F2 D L2 U2",
    "F B U2 F B U L2 U B2 U' L2 R2 F2 U F2 U' L2 D",
    "B F U2 B F U L2 U B2 U' R2 L2 F2 U F2 U' L2 D",
    "L R U2 L R U D' F2 U' F2 D R2 D' F2 D L2 U2"
  ],
  [
    "R L U2 R L' U' R2 L2 B2 U L2 D' R2 F2 B2 D R2 U2",
    "F B U2 F B U R2 U' L2 U F2 U' L2 D B2 D' F2 B2",
    "B F U2 B F U R2 U' L2 U F2 U' L2 D B2 D' B2 F2",
    "L R U2 L R' D' L2 F2 U' L2 U R2 U' B2 R2 F2 L2 U2"
  ],
  [
    "R L U2 R L' U L2 U' L2 D F2 D' F2 R2 L2 F2 L2 U2",
    "F B U2 F B L2 U' F2 R2 D' F2 D L2 D' R2 F2",
    "B F U2 B F L2 U' F2 R2 D' F2 D L2 D' R2 F2",
    "L R U2 L R' U L2 B2 L2 R2 D B2 D' F2 D R2 F2 U2"
  ],
  [
    "R L F2 R L U R2 U' L2 F2 U' F2 U F2 R2 U' R2 F2",
    "F B L2 F B' U2 F2 U F2 U' R2 B2 U' L2 U B2 D' R2",
    "B F R2 B' F' U' R2 U R2 D' R2 D2 B2 U B2 D' R2",
    "L R B2 L' R D B2 U2 F2 R2 F2 U L2 U R2 U' F2 U"
  ],
  [
    "R L B2 R' L' U' L2 U' L2 U B2 D B2 D' R2 U R2 U",
    "F B U2 F B' U' L2 U R2 D' R2 U' B2 D R2 D' L2 U'",
    "B F U2 B' F U' L2 U R2 D' R2 U' B2 D R2 D' L2 U'",
    "L R B2 L' R' U' L2 U' L2 U B2 D B2 D' R2 U R2 U"
  ],
  [
    "F B U2 F B U F2 U2 L2 U' L2 F2 U2 F2 U L2 U2 B2",
    "L R U2 L R U B2 U2 L2 D' L2 F2 D2 F2 U R2 U2 F2",
    "R L U2 R L U B2 U2 L2 D' L2 F2 D2 F2 U R2 U2 F2",
    "B F U2 B F U F2 U2 L2 U' L2 F2 U2 F2 U L2 U2 B2"
  ],
  [
    "R L' U2 R' L U2 F2 L2 U' L2 U2 F2 U L2 U2 L2 F2 U'",
    "F B' U2 F' B U2 L2 B2 U' B2 U2 L2 U B2 U2 B2 L2 U",
    "B F' U2 B' F U2 R2 F2 U' F2 U2 R2 U F2 U2 F2 R2 U",
    "L R' U2 L' R U2 B2 R2 U' R2 U2 B2 U R2 U2 R2 B2 U'"
  ],
  [
    "R L' U2 R' L U2 F2 R2 U R2 U2 F2 U' R2 U2 R2 F2 U",
    "F B' U2 F' B U2 L2 F2 U F2 U2 L2 U' F2 U2 F2 L2 U'",
    "B F' U2 B' F U2 R2 B2 U B2 U2 R2 U' B2 U2 B2 R2 U'",
    "L R' U2 L' R U2 B2 L2 U L2 U2 B2 U' L2 U2 L2 B2 U"
  ],
  [
    "R L U2 R' L F2 U' B2 R2 F2 L2 D' R2 D L2 D' B2 U",
    "F B U2 F B' L2 R2 U' R2 U F2 U' R2 D F2 B2 R2 D'",
    "B F U2 B F' U' B2 L2 U' L2 U F2 U' B2 U F2 L2 B2",
    "L R U2 L R' F2 U' B2 R2 F2 L2 D' R2 D L2 D' B2 U"
  ],
  [
    "R L U2 R L F2 U L2 U' R2 U B2 R2 D B2 R2 U",
    "F B U2 F B' U' R2 F2 U' F2 U F2 R2 D R2 D'",
    "B F U2 B F' U D' R2 U' F2 U B2 U' B2 D L2 U' R2",
    "L R U2 L R F2 U L2 U' R2 U B2 R2 D B2 R2 U"
  ],
  [
    "R L U2 R L' B2 U R2 F2 L2 B2 U B2 U' L2 D F2 U'",
    "F B U2 F B' U L2 B2 R2 B2 L2 D' F2 D R2 U' F2 U",
    "B F U2 B F' U R2 U' B2 U R2 D' B2 L2 U' B2 L2 F2",
    "L R U2 L' R B2 U L2 U' L2 D F2 D' L2 R2 B2 L2 U'"
  ],
  [
    "R L U2 R L' F2 U F2 U' L2 U R2 L2 B2 R2 D B2 U'",
    "F B U2 F B' D' L2 U L2 B2 D F2 D' B2 D R2 F2 R2",
    "B F U2 B F' U B2 R2 U R2 U' F2 U B2 U' B2 R2 F2",
    "L R U2 L R' F2 U B2 U' R2 U B2 L2 B2 F2 D B2 U'"
  ]
]

export { algsetAlgs, algsetScrambles }
