export function applyComplexGradient(element: any, options: any) {
  const {
    colorStep,
    gradientCount,
    colorsPerGradient,
    rowHeight,
    colorSets = [],
    initialY,
    yStep,
    defaultColor = "transparent",
  } = options;

  const requiredColorsCount = gradientCount * colorsPerGradient;

  const paddedColorSets = [...colorSets];

  while (paddedColorSets.length < requiredColorsCount) {
    paddedColorSets.push(defaultColor);
  }

  const finalColorSets = paddedColorSets.slice(0, requiredColorsCount);

  let backgroundValue = "";

  for (let i = 0; i < gradientCount; i++) {
    const currentY = initialY + i * yStep;

    const startIdx = i * colorsPerGradient;
    const endIdx = startIdx + colorsPerGradient;
    const currentColors = finalColorSets.slice(startIdx, endIdx);

    let gradientParts = [];

    for (let j = 0; j < colorsPerGradient; j++) {
      const start = j * colorStep;
      const end = (j + 1) * colorStep;

      if (
        i === 1 &&
        j === colorsPerGradient - 1 &&
        currentColors[j] === "transparent"
      ) {
        gradientParts.push(`transparent ${start}px`);
      } else {
        gradientParts.push(`${currentColors[j]} ${start}px ${end}px`);
      }
    }

    const gradient = `linear-gradient(90deg, ${gradientParts.join(", ")})`;
    const position = `0px ${currentY}px`;
    const size = `${colorStep * colorsPerGradient}px ${rowHeight}px`;

    backgroundValue += `${gradient} ${position} / ${size} no-repeat`;

    if (i < gradientCount - 1) {
      backgroundValue += ", ";
    }
  }

  element.style.background = backgroundValue;
};

