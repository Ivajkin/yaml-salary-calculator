#!/usr/bin/env node
const yaml = require("js-yaml");
const fs = require("fs");

const concat = (x, y) => x.concat(y);

const flatMap = (f, xs) => xs.map(f).reduce(concat, []);

Array.prototype.flatMap = function(f) {
  return flatMap(f, this);
};

let locationsSorted, rolesSorted;

const clearScreen = () => {
  console.log("\033[2J");
};
clearScreen();

const displayHelp = () => {
  // Top salaries
  // Top locations
  // Top locations x salaries
  console.log("");
  console.log("");
  console.log("---------------------------------------");
  console.log("Help:");
  console.log("1. Top 3 salaries");
  console.log("2. Top 3 locations");
  console.log("3. Top 7 salaries");
  console.log("4. Top 7 locations");
  console.log("5. Top 7 locations x salaries");
  console.log("6. All salaries sorted by salary");
  console.log("7. All locations sorted by coefficient");
  console.log("8. Top 3 and lowest 3 salaries");
  console.log("9. Top 3 and lowest 3 locations");
  console.log("10. Remove NOT apply and NOT open");
  console.log("---------------------------------------");
  console.log("");
  console.log("");
};

const decartes = (arr1, arr2) => {
  return arr1
    .flatMap(element => {
      return arr2.map(a => {
        return { ...a, ...element };
      });
    })
    .sort((a, b) => {
      return b.salary * b.locationFactor - a.salary * a.locationFactor;
    });
};

const getUserInput = () => {
  const stdin = process.openStdin();

  stdin.addListener("data", function(d) {
    clearScreen();
    displayHelp();
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    let selected;
    try {
      selected = parseInt(d.toString().trim());
    } catch (e) {
      console.error(e);
    }
    console.log("you entered: [" + selected + "]");
    switch (selected) {
      case 1:
        console.log("1. Top 3 salaries, $");
        console.log(rolesSorted.slice(0, 3));
        break;
      case 2:
        console.log("2. Top 3 locations");
        console.log(locationsSorted.slice(0, 3));
        break;
      case 3:
        console.log("3. Top 7 salaries, $");
        console.log(rolesSorted.slice(0, 7));
        break;
      case 4:
        console.log("4. Top 7 locations");
        console.log(locationsSorted.slice(0, 7));
        break;
      case 5:
        console.log("5. Top 7 locations x salaries");
        const locationsXSalaries = decartes(locationsSorted, rolesSorted);
        console.log(locationsXSalaries.slice(0, 7));
        break;
      case 6:
        console.log("6. All salaries sorted by salary");
        console.log(rolesSorted);
        break;
      case 7:
        console.log("7. All locations sorted by coefficient");
        console.log(locationsSorted);
        break;
      case 8:
        console.log("8. Top 3 and lowest 3 salaries");
        console.log("--- TOP -----------------------------");
        console.log(rolesSorted.slice(0, 3));
        console.log("...");
        console.log(
          rolesSorted.slice(rolesSorted.length - 3, rolesSorted.length)
        );
        console.log("---^ BOTTOM ^-----------------------------");
        break;
      case 9:
        console.log("9. Top 3 and lowest 3 locations");
        console.log("--- TOP -----------------------------");
        console.log(locationsSorted.slice(0, 3));
        console.log("...");
        console.log(
          locationsSorted.slice(
            locationsSorted.length - 3,
            locationsSorted.length
          )
        );
        break;
      case 10:
        console.log("10. Refine by removing NOT open at Gitlab");
        rolesSorted = rolesSorted.filter(role => role.gitlab);
        console.log("Removed");
        break;
    }
    displayHelp();
  });
};

const loadSalariesData = () => {
  locationsSorted = yaml
    .safeLoad(
      fs.readFileSync("./gitlab-salaries__data_location_factors.yml", "utf8")
    )
    .sort((a, b) => b.locationFactor - a.locationFactor);
  rolesSorted = yaml
    .safeLoad(fs.readFileSync("./gitlab-salaries__data_roles.yml", "utf8"))
    .sort((a, b) => b.salary - a.salary)
    .map(role => {
      role.gitlab = role.open;
      delete role["apply"];
      delete role["open"];
      return role;
    });
};

// Get document, or throw exception on error
try {
  loadSalariesData();
  getUserInput();
  // Display help
  displayHelp();
} catch (e) {
  console.log(e);
}
