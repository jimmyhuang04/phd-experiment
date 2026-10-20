let jsPsych = initJsPsych({});

let timeline = [];

// Bonus payment information
let bonusPaymentInfo = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `
    <div class="experience-layout">
      <div class="status-bar">
        <span>Current points: ${currentPoints}</span>
        <span>Instructions</span>
      </div>

      <section class="instructions-panel">
        ${bonusPaymentInfoText}
      </section> 

      <section class="stimulus-panel">
        ${createWaterTank("Nothing happens")}
      </section>
    </div>`;
  },
  choices: [" "],
};

let coverStoryInfo = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `
    <div class="experience-layout">
      <div class="status-bar">
        <span>Current points: ${currentPoints}</span>
        <span>Instructions</span>
      </div>

      <section class="instructions-panel">
        ${coverStoryInfoText}
      </section> 

      <section class="stimulus-panel">
        ${createWaterTank("Nothing happens")}
      </section>
    </div>`;
  },
  choices: [" "],
};

timeline.push(bonusPaymentInfo, coverStoryInfo);

for (const block of experienceSequence) {
  let protectedThisBlock = false;

  let choice = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      return `
    <div class="experience-layout">
      <div class="status-bar">
        <span>Current points: ${currentPoints}</span>
        <span>Year ${block.year}</span>
      </div>

      <section class="instructions-panel">
        <p>You may spend ${costProtection} to protect for this block.</p>
      </section> 

      <section class="stimulus-panel">
        ${createWaterTank("Nothing happens")}
      </section>
    </div>`;
    },
    choices: ["Protect", "Don't protect"],
    on_finish: function (data) {
      protectedThisBlock = data.response === 0;

      if (protectedThisBlock) {
        currentPoints -= costProtection;
      }
    },
  };

  timeline.push(choice);

  for (const trial of block.trials) {
    let experience = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let outcomeMessage = "";

        if (trial.outcome === "Shock") {
          if (protectedThisBlock) {
            outcomeMessage = `A shock occurred. Your protection covered the repair cost.`;
          } else {
            currentPoints -= costShock;
            outcomeMessage = `A shock occurred. You must spent ${costShock} points to repair.`;
          }
        }

        return `
    <div class="experience-layout">
      <div class="status-bar">
        <span>Current points: ${currentPoints}</span>
        <span>Year ${block.year}, ${trial.month}</span>
      </div>
      
      <section class="instructions-panel">
        <p>${outcomeMessage}</p>
        <p>Press <kbd>Space</kbd> to continue.</p>
      </section>

      <section class="stimulus-panel">
        <p>Outcome: ${trial.outcome}</p>
        ${createWaterTank(trial.outcome)}
      </section>
    </div>`;
      },

      choices: [" "],
    };

    timeline.push(experience);
  }
}

// survey-multi-choice is probably better

let measureExpectations = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <p>What is your expectation for the water level in the next several years?</p>
    `,
  choices: ["Stable", "Increasing"],
};

timeline.push(measureExpectations);

let measureExpectationsExplanation = {
  type: jsPsychSurveyText,
  preamble: `
    <p>You have indicated that you expect this will happen in the future.</p>
    `,
  questions: [
    {
      prompt:
        "Please explain you reasoning behind why you expect this to happen in the future.",
      rows: 5,
    },
  ],
};

timeline.push(measureExpectationsExplanation);

jsPsych.run(timeline);
