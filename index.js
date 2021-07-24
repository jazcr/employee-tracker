const inquirer = require("inquirer");

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "Choose a task: ",
        choices: [
            "-View all employees",
            "-View list of departments",
            "-View all employee roles",
            "-Add employee",
            "-Add department",
            "-Add role",
            "-Update an employee's role",
            "- ***Exit***"
        ],
        name: "choice"
    });
} 
mainMenu();