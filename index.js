
const task = require("./config/functions.js");
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
    }).then(function ({ choice }) {
        if (choice === "-View all employees") {
            task.viewEmployees()
                .then(function () {
                    console.log("\n");
                    mainMenu();
                });
        } else if (choice === "-View list of departments") {
            task.viewDepartments()
                .then(function () {
                    console.log("\n");
                    mainMenu();
                });
        } else if (choice === "-View all employee roles") {
            task.viewRoles()
                .then(function () {
                    console.log("\n");
                    mainMenu();
                });
        } else if (choice === "-Add employee") {
            addEmployeePrompt();
        } else if (choice === "-Add department") {
            addDepartmentPrompt();
        } else if (choice === "-Add role") {
            addRolePrompt();
        } else if (choice === "-Update an employee's role") {
            updateRolePrompt();
        } else {
            task.endConnection();
        }
    });

}

function addEmployeePrompt() {
    task.getEmployees()
    .then(function(res) {
        const managerArray = [];
        for (let i=0; i<res.length; i++) {
            managerArray.push(res[i].name);
        }
        managerArray.push("none");
        task.getRoles()
        .then(function(response) {
            const roleTitleArray = [];
            for (let i=0; i<response.length; i++) {
                roleTitleArray.push(response[i].title);
            }
            inquirer.prompt([{
                type: "input",
                message: "Enter employee's first name: ",
                name: "firstName"
            },
            {
                type: "input",
                message: "Enter employee's last name: ",
                name: "lastName"
            },
            {
                type: "list",
                message: "Select employee's role: ",
                choices: roleTitleArray,
                name: "role"
            },
            {
                type: "list",
                message: "Select employee's manager",
                choices: managerArray,
                name: "manager"
            }]).then(function({firstName, lastName, role, manager}) {
                const roleId = response[roleTitleArray.indexOf(role)].id;
                if (manager === "none") {
                    task.addEmployee(firstName, lastName, roleId)
                    .then(function() {
                        console.log("\n");
                        mainMenu();
                    });
                } else {
                    const managerId = res[managerArray.indexOf(manager)].id;
                    task.addEmployee(firstName, lastName, roleId, managerId)
                    .then(function() {
                        console.log("\n");
                        mainMenu();
                    });
                }
            });
    });
    });
}

// Prompts user for information needed to make new department, then calls task function to add it to the database
function addDepartmentPrompt() {
    task.getDepartments()
    .then(function(response) {
        const deptArray = [];
        for (let i=0; i<response.length; i++) {
            deptArray.push(response[i].name);
        }
        inquirer.prompt({
            type: "input",
            message: "Enter the name of new department you'd like to add",
            name: "deptName"
        }).then(function({deptName}) {
            if (deptArray.includes(deptName)) {
                console.log("There is already a department with that name!\n");
                mainMenu();
            } else {
                task.addDepartment(deptName)
                .then(function() {
                    console.log("\n");
                    mainMenu();
                });
            }
        });
    });
}

// Prompts user for information needed to make a new role, then calls ORM function to add it to the database
function addRolePrompt() {
    task.getRoles()
    .then(function(roles) {
        const roleArray = [];
        for (let i=0; i<roles.length; i++) {
            roleArray.push(roles[i].title);
        }
        task.getDepartments()
        .then(function(deptArray) {
            const deptNames = [];
            for (let i=0; i<deptArray.length; i++) {
                deptNames.push(deptArray[i].name);
            }
            inquirer.prompt([{
                type: "input",
                message: "Enter the name of the role you would like to add",
                name: "title"
            },
            {
                type: "input",
                message: "Enter the annual salary of the new role",
                name: "salary"
            },
            {
                type: "list",
                message: "Select the department in which the new role will work",
                choices: deptNames,
                name: "department"
            }]).then(function({title, salary, department}) {
                const deptId = deptArray[deptNames.indexOf(department)].id;
                if (roleArray.includes(title)) {
                    console.log("Error - that title already exists!\n");
                    mainMenu();
                } else {
                    task.addRole(title, salary, deptId)
                    .then(function() {
                        console.log("\n");
                        mainMenu();
                    });
                }
            });
        });
    }); 
}

// Grabs all employees, asks user which one they want to update, asks what role the employee should have, then calls task function to update the database
function updateRolePrompt() {
    task.getEmployees()
    .then(function(res) {
        const empArray = [];
        for (let i=0; i<res.length; i++) {
            empArray.push(res[i].name);
        }
        task.getRoles()
        .then(function(response) {
            const roleArray = [];
            for (let i=0; i<response.length; i++) {
                roleArray.push(response[i].title);
            }
            inquirer.prompt([{
                type: "list",
                message: "Choose the employee whose role you'd like to update",
                choices: empArray,
                name: "employee"
            },
            {
                type: "list",
                message: "Select the employee's new role",
                choices: roleArray,
                name: "role"
            }]).then(function({employee, role}) {
                const empId = res[empArray.indexOf(employee)].id;
                task.updateRole(empId, role)
                .then(function() {
                    console.log("\n");
                    mainMenu();
                })
            })
        })
    })
}

mainMenu();