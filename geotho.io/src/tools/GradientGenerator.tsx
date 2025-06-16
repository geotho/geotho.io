import { useEffect, useState } from "react";
import { tailwindColors, type TailwindColor } from "./tailwind-colors";

const directions = [
  { value: "t", name: "Top" },
  { value: "tr", name: "Top Right" },
  { value: "r", name: "Right" },
  { value: "br", name: "Bottom Right" },
  { value: "b", name: "Bottom" },
  { value: "bl", name: "Bottom Left" },
  { value: "l", name: "Left" },
  { value: "tl", name: "Top Left" },
];

interface GradientPreset {
  name: string;
  colors: string[];
}

const presets: GradientPreset[] = [
  { name: "Sunset", colors: ["#ff7e5f", "#feb47b", "#ff7e5f"] },
  { name: "Ocean", colors: ["#00c6ff", "#0072ff"] },
  { name: "Lush", colors: ["#56ab2f", "#a8e063"] },
  { name: "Gold", colors: ["#FDB813", "#F2994A"] },
  { name: "Royal", colors: ["#4e54c8", "#8f94fb"] },
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper functions for Tailwind colors
const getColorNames = () => Object.keys(tailwindColors);
const getTints = () => Object.keys(tailwindColors.red); // All colors have the same tints
const getTailwindColor = (colorName: string, tint: string): TailwindColor => ({
  name: `${colorName}-${tint}`,
  hex: tailwindColors[colorName][tint],
});

const GradientGenerator = () => {
  const [startColor, setStartColor] = useState<TailwindColor>({
    hex: "#ff7e5f",
    name: "#ff7e5f",
  });
  const [startColorName, setStartColorName] = useState("red");
  const [startColorTint, setStartColorTint] = useState("500");

  const [useViaColor, setUseViaColor] = useState(true);
  const [viaColor, setViaColor] = useState<TailwindColor>({
    hex: "#feb47b",
    name: "#feb47b",
  });
  const [viaColorName, setViaColorName] = useState("orange");
  const [viaColorTint, setViaColorTint] = useState("300");

  const [endColor, setEndColor] = useState<TailwindColor>({
    hex: "#ff7e5f",
    name: "#ff7e5f",
  });
  const [endColorName, setEndColorName] = useState("red");
  const [endColorTint, setEndColorTint] = useState("500");

  const [direction, setDirection] = useState("r");
  const [tailwindClass, setTailwindClass] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [useTailwindColors, setUseTailwindColors] = useState(false);

  // Update colors when Tailwind color names/tints change
  useEffect(() => {
    if (useTailwindColors) {
      setStartColor(getTailwindColor(startColorName, startColorTint));
      setViaColor(getTailwindColor(viaColorName, viaColorTint));
      setEndColor(getTailwindColor(endColorName, endColorTint));
    }
  }, [
    useTailwindColors,
    startColorName,
    startColorTint,
    viaColorName,
    viaColorTint,
    endColorName,
    endColorTint,
  ]);

  // Helper function to convert direction codes to CSS direction strings
  const getDirectionString = (dir: string) => {
    const directionMap: { [key: string]: string } = {
      t: "top",
      tr: "top right",
      r: "right",
      br: "bottom right",
      b: "bottom",
      bl: "bottom left",
      l: "left",
      tl: "top left",
    };
    return directionMap[dir] || "right";
  };

  useEffect(() => {
    const from = startColor.name.startsWith("#")
      ? `from-[${startColor.name}]`
      : `from-${startColor.name}`;
    const via = useViaColor
      ? viaColor.name.startsWith("#")
        ? `via-[${viaColor.name}]`
        : `via-${viaColor.name}`
      : "";
    const to = endColor.name.startsWith("#")
      ? `to-[${endColor.name}]`
      : `to-${endColor.name}`;
    const dir = `bg-gradient-to-${direction}`;

    setTailwindClass(`${dir} ${from} ${via} ${to}`);

    const viaCss = useViaColor ? `, ${viaColor.hex}` : "";
    setCssCode(
      `background-image: linear-gradient(to ${getDirectionString(direction)}, ${
        startColor.hex
      }${viaCss}, ${endColor.hex});`
    );
  }, [startColor, viaColor, endColor, direction, useViaColor]);

  const handleRandomize = () => {
    if (useTailwindColors) {
      const colorNames = getColorNames();
      const tints = getTints();
      setStartColorName(
        colorNames[Math.floor(Math.random() * colorNames.length)]
      );
      setStartColorTint(tints[Math.floor(Math.random() * tints.length)]);
      if (useViaColor) {
        setViaColorName(
          colorNames[Math.floor(Math.random() * colorNames.length)]
        );
        setViaColorTint(tints[Math.floor(Math.random() * tints.length)]);
      }
      setEndColorName(
        colorNames[Math.floor(Math.random() * colorNames.length)]
      );
      setEndColorTint(tints[Math.floor(Math.random() * tints.length)]);
    } else {
      const randomHex1 = getRandomColor();
      setStartColor({ hex: randomHex1, name: randomHex1 });
      if (useViaColor) {
        const randomHex2 = getRandomColor();
        setViaColor({ hex: randomHex2, name: randomHex2 });
      }
      const randomHex3 = getRandomColor();
      setEndColor({ hex: randomHex3, name: randomHex3 });
    }
  };

  const applyPreset = (preset: GradientPreset) => {
    setUseTailwindColors(false);
    setStartColor({ hex: preset.colors[0], name: preset.colors[0] });
    if (preset.colors.length > 2) {
      setUseViaColor(true);
      setViaColor({ hex: preset.colors[1], name: preset.colors[1] });
      setEndColor({ hex: preset.colors[2], name: preset.colors[2] });
    } else {
      setUseViaColor(false);
      setEndColor({ hex: preset.colors[1], name: preset.colors[1] });
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-black/10 rounded-lg p-8">
      <title>George Thomas - Gradient Generator</title>
      <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">
        Gradient Generator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useTailwindColors"
                    checked={useTailwindColors}
                    onChange={(e) => {
                      setUseTailwindColors(e.target.checked);
                      if (e.target.checked) {
                        setStartColorName("slate");
                        setStartColorTint("500");
                        setViaColorName("red");
                        setViaColorTint("500");
                        setEndColorName("blue");
                        setEndColorTint("500");
                      }
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="useTailwindColors"
                    className="text-sm font-medium text-gray-700"
                  >
                    Use Tailwind Colors
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Color
                </label>
                {useTailwindColors ? (
                  <div className="flex gap-2">
                    <select
                      value={startColorName}
                      onChange={(e) => setStartColorName(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {getColorNames().map((colorName) => (
                        <option key={colorName} value={colorName}>
                          {colorName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startColorTint}
                      onChange={(e) => setStartColorTint(e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {getTints().map((tint) => (
                        <option key={tint} value={tint}>
                          {tint}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="color"
                    value={startColor.hex}
                    onChange={(e) =>
                      setStartColor({
                        hex: e.target.value,
                        name: e.target.value,
                      })
                    }
                    className="w-full h-10"
                  />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useViaColor"
                    checked={useViaColor}
                    onChange={(e) => setUseViaColor(e.target.checked)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="viaColor"
                    className="text-sm font-medium text-gray-700"
                  >
                    Via Color
                  </label>
                </div>
                {useTailwindColors ? (
                  <div className="flex gap-2">
                    <select
                      value={viaColorName}
                      onChange={(e) => setViaColorName(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={!useViaColor}
                    >
                      {getColorNames().map((colorName) => (
                        <option key={colorName} value={colorName}>
                          {colorName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={viaColorTint}
                      onChange={(e) => setViaColorTint(e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={!useViaColor}
                    >
                      {getTints().map((tint) => (
                        <option key={tint} value={tint}>
                          {tint}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="color"
                    value={viaColor.hex}
                    onChange={(e) =>
                      setViaColor({ hex: e.target.value, name: e.target.value })
                    }
                    className="w-full h-10"
                    disabled={!useViaColor}
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  End Color
                </label>
                {useTailwindColors ? (
                  <div className="flex gap-2">
                    <select
                      value={endColorName}
                      onChange={(e) => setEndColorName(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {getColorNames().map((colorName) => (
                        <option key={colorName} value={colorName}>
                          {colorName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={endColorTint}
                      onChange={(e) => setEndColorTint(e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {getTints().map((tint) => (
                        <option key={tint} value={tint}>
                          {tint}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="color"
                    value={endColor.hex}
                    onChange={(e) =>
                      setEndColor({ hex: e.target.value, name: e.target.value })
                    }
                    className="w-full h-10"
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="direction"
                  className="text-sm font-medium text-gray-700"
                >
                  Direction
                </label>
                <select
                  id="direction"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  {directions.map((dir) => (
                    <option key={dir.value} value={dir.value}>
                      {dir.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Actions</h3>
            <button
              onClick={handleRandomize}
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Randomize
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="p-2 rounded-lg text-sm text-center"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${p.colors.join(
                      ", "
                    )})`,
                  }}
                >
                  <span
                    className="font-bold text-white"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
                  >
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div
            className="w-full h-64 rounded-lg"
            style={{
              backgroundImage: `linear-gradient(to ${getDirectionString(
                direction
              )}, ${startColor.hex}${useViaColor ? `, ${viaColor.hex}` : ""}, ${
                endColor.hex
              })`,
            }}
          ></div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Tailwind CSS Class
            </h3>
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
              <code>{tailwindClass}</code>
            </pre>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">CSS Code</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
