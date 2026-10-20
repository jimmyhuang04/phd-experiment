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
        <span>Bonus payment information</span>
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
        <span>Cover story</span>
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
        <p>It is the start of Year ${block.year}</p>
        <p>You may choose to spend ${costProtection} points to protect your house from any water damage just for this year.</p>
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
            outcomeMessage = `The water level rose this month, resulting in an overflow. The protection you paid for this year covered the repair cost of ${costShock} points.`;
          } else {
            currentPoints -= costShock;
            outcomeMessage = `The water level rose this month, resulting in an overflow. You must spend ${costShock} points to repair your house.`;
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
  stimulus: function () {
    return `
    <div class="experience-layout">
      <div class="status-bar">
        <span></span>
        <span>Measure of future expectations</span>
      </div>

      <section class="instructions-panel">
        <p>The figures of the left represent different potential future trajectories of water levels that may play out over the next several years.</p>
        
        <p>Please indicate which future trajectory you expect will occur (note buttons on bottom).</p>
        <p>(Also note; there are a multitude of ways to elicit people's beliefs about what wil happen in the future [e.g., rather than selecting from a list of options, we can ask them to manually generate future outcomes trial by trial]. This is just one way.)
      </section> 

      <section class="stimulus-panel">
        <img src="assets/trajectories.png" width="550">
      </section>
    </div>`;
  },
  choices: ["Stable (safe)", "Increasing", "Stable (occasional shocks)"],
};

timeline.push(measureExpectations);

let measureExpectationsExplanation = {
  type: jsPsychSurveyText,
  preamble: `
    <p>You have indicated that you expect X will happen in the future.</p>
    `,
  questions: [
    {
      prompt: `
        <p>Please explain your reasoning as to why you expect this to happen in the future.</p>,
        <p>You may reference your experiences, your background knowledge, etc</p>`,
      rows: 5,
    },
  ],
};

timeline.push(measureExpectationsExplanation);

jsPsych.run(timeline);
