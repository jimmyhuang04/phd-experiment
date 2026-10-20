let house = `
  <!-- House roof -->
  <polygon
    points="170,135 200,105 230,135"
    fill="#c98255"
    stroke="#34596b"
    stroke-width="2"
  />

  <!-- House body -->
  <rect
    x="178"
    y="135"
    width="44"
    height="45"
    fill="#f3d7a5"
    stroke="#34596b"
    stroke-width="2"
  />
`;

/* =========================================
   COMPONENT: Tank body
   Creates the pale blue tank interior and
   the main outline of the tank.
   ========================================= */

const tankBody = `
  <path
    d="M 40 55 L 40 220 C 40 235 160 235 160 220 L 160 55"
    fill="#eaf7fc"
    stroke="#34596b"
    stroke-width="3"
  />
`;

/* =========================================
   COMPONENT: Tank opening
   Creates the elliptical opening at the top
   of the tank.
   ========================================= */

const tankOpening = `
  <ellipse
    cx="100"
    cy="55"
    rx="60"
    ry="14"
    fill="#dce8ed"
    stroke="#34596b"
    stroke-width="3"
  />
`;

/* =========================================
   COMPONENT: Foreground outline
   Draws the tank outline again over the water
   and other elements to keep its edges crisp.
   ========================================= */

const tankOutline = `
  <path
    d="M 40 55 L 40 220 C 40 235 160 235 160 220 L 160 55"
    fill="none"
    stroke="#34596b"
    stroke-width="3"
  />
`;

// Water height

function getWaterHeight(outcome) {
  if (outcome === "Shock") {
    return 60; // Very high water
  }

  return 160; // Normal water level
}

/* =========================================
   COMPONENT: Water
   Creates the blue water inside the tank.
   The y-coordinate of the surface (160)
   determines the current water level.
   ========================================= */

function createTankWater(waterHeight) {
  // Fixed tank geometry
  const left = 41;
  const right = 159;
  const bottom = 230;

  // Wave shape, measured relative to the water level
  const wave = 6;

  return `
    <path
      d="
        M ${left} ${waterHeight}
        Q 55 ${waterHeight - wave}
          70 ${waterHeight}
        T 100 ${waterHeight}
        T 130 ${waterHeight}
        T ${right} ${waterHeight}
        L ${right} ${bottom}
        Q ${right} 232 100 232
        Q ${left} 232 ${left} ${bottom}
        Z
      "
      fill="#43b5e5"
    />
  `;
}

// Assesmble the components

function createWaterTank(outcome) {
  const waterHeight = getWaterHeight(outcome);
  const tankWater = createTankWater(waterHeight);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 280"
      width="240"
      height="280"
    >
      ${tankBody}
      ${tankWater}
      ${tankOpening}
      ${tankOutline}
      ${house}
    </svg>
  `;
}
