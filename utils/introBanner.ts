import figlet from "figlet";
import chalk from "chalk";
import boxen from "boxen";

export function showBanner() {
  const ascii = figlet.textSync("Omkumar's Github CLI", { horizontalLayout: "default" });

  console.log(
    boxen(chalk.cyanBright(ascii), {
      padding: 1,
      margin: 1,
      borderColor: "green",
      borderStyle: "round",
    })
  );
}