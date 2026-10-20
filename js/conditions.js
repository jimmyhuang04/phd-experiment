// For example Month []

let conditions = {
  test: [
    "Nothing happens",
    "Nothing happens",
    "Nothing happens",
    "Nothing happens",
    "Shock",
    "Nothing happens",
  ],
};

let taskStructure = [
  {
    year: 1,
    trials: [
      { month: "January", outcome: null },
      { month: "February", outcome: null },
      { month: "March", outcome: null },
    ],
  },
  {
    year: 2,
    trials: [
      { month: "January", outcome: null },
      { month: "February", outcome: null },
      { month: "March", outcome: null },
    ],
  },
];

function buildTask(chosenCondition) {
  let index = 0;

  return taskStructure.map((block) => ({
    ...block,
    trials: block.trials.map((trial) => ({
      ...trial,
      outcome: conditions[chosenCondition][index++],
    })),
  }));
}

const experienceSequence = buildTask("test");
