const yaml = require('js-yaml')
const fs = require('fs')

let locations, roles

const displayHelp = () => {
  // Top salaries
  // Top locations
  // Top locations x salaries
  console.log('---------------------------------------')
  console.log('Help:')
  console.log('1. Top 10 salaries')
  console.log('2. Top 10 locations')
  console.log('3. Top 10 locations x salaries')
  console.log('4. All salaries sorted by salary')
  console.log('5. All locations sorted by coefficient')
  console.log('6. Top 3 and lowest 3 salaries')
  console.log('7. Top 3 and lowest 3 locations')
  console.log('---------------------------------------')
}

const getUserInput = () => {
  const stdin = process.openStdin()

  stdin.addListener('data', function(d) {
    console.log('\033[2J')
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    let selected
    try {
      selected = parseInt(d.toString().trim())
    } catch (e) {
      console.error(e)
    }
    console.log('you entered: [' + selected + ']')
    switch (selected) {
      case 1:
        console.log('1. Top 10 salaries, $')
        break
      case 2:
        console.log('2. Top 10 locations')
        break
      case 3:
        console.log('3. Top 10 locations x salaries')
        break
      case 4:
        console.log('4. All salaries sorted by salary')
        console.log(roles)
        break
      case 5:
        console.log('5. All locations sorted by coefficient')
        console.log(locations)
        break
      case 6:
        console.log('6. Top 3 and lowest 3 salaries')
        break
      case 7:
        console.log('7. Top 3 and lowest 3 locations')
        break
    }
    displayHelp()
  })
}

const loadSalariesData = () => {
  locations = yaml
    .safeLoad(
      fs.readFileSync('./gitlab-salaries__data_location_factors.yml', 'utf8')
    )
    .sort((a, b) => a.locationFactor - b.locationFactor)
  roles = yaml
    .safeLoad(fs.readFileSync('./gitlab-salaries__data_roles.yml', 'utf8'))
    .sort((a, b) => a.salary - b.salary)
}

// Display help
displayHelp()
// Get document, or throw exception on error
try {
  loadSalariesData()
  getUserInput()
} catch (e) {
  console.log(e)
}
