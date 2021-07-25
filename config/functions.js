const connection = require("./connection.js");

const task = {
    addDepartment: function(deptName) {
        return new Promise(function(res, rej) {
            const queryString = `INSERT INTO departments (name) VALUES (?)`;
            connection.query(queryString, deptName, function(err, result) {
                if (err) {
                    return rej(err);
                }
                console.log("Department successfully added!");
                return res();
            });
        });
        
    },

    addRole: function(roleTitle, roleSalary, deptId) {
        return new Promise(function(res, rej) {
            const queryString = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(queryString, [roleTitle, roleSalary, deptId],function (err, result) {
                if (err) {
                    return rej(err);
                }
                console.log("Role successfully added!");
                return res();
            });
        });
        
    },
    addEmployee: function(firstName, lastName, roleId, mgrId) {
        return new Promise(function(res, rej) {
            const queryString = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            connection.query(queryString, [firstName, lastName, roleId, mgrId], function(err, result) {
                if (err) {
                    return rej(err);
                }
                console.log("Employee successfully added!");
                return res();
            });
        });
        
    },

    viewEmployees: function() {
        return new Promise(function(res, rej) {
            const queryString = 'SELECT employees.id, first_name, last_name, title, salary, name, manager_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id';
            connection.query(queryString, function(err, result) {
                if (err) {
                    return rej(err);
                }
                let newTable = [];
                for (let i=0; i< result.length; i++) {
                    let manager_name = "";
                    if (result[i].manager_id !== null) {
                        for (let j=0; j<result.length; j++) {
                            if (result[j].id === result[i].manager_id) {
                                manager_name = result[j].first_name + " " + result[j].last_name;
                            }
                        }
                    } else {
                        manager_name = "null";
                    }
                    const tableElement = {
                        "Employee ID": result[i].id,
                        "First Name": result[i].first_name,
                        "Last Name": result[i].last_name,
                        "Title": result[i].title,
                        "Salary": result[i].salary,
                        "Department": result[i].name,
                        "Manager": manager_name
                    };
                    newTable.push(tableElement);
                }
                console.table(newTable);
                return res();
            });
        });
        
    },

    getEmployees: function() {
        return new Promise(function(res, rej) {
            const queryString = "SELECT * FROM employees";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return rej(err);
                }
                const emptArr = [];
                for (let i = 0; i < result.length; i++) {
                    const empObj = {
                        id: result[i].id,
                        name: result[i].first_name + " " + result[i].last_name
                    };
                    emptArr.push(empObj);
                }
                return res(emptArr);
            });
        });
    },

    viewRoles: function() {
        return new Promise(function(res, rej) {
            const queryString = "SELECT roles.id, title, salary, name FROM roles LEFT JOIN departments ON roles.department_id = departments.id";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return rej(err);
                }
                const newTable = [];
                for (let i=0; i<result.length; i++) {
                    const roleObj = {
                        "ID": result[i].id,
                        "Title": result[i].title,
                        "Salary": result[i].salary,
                        "Department": result[i].name
                    };
                    newTable.push(roleObj);
                }
                console.table(newTable);
                return res();
            });
        });
        
    },

    getRoles: function() {
        return new Promise(function(res, rej) {
            const queryString = "SELECT * FROM roles";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return rej(err);
                }
                return res(result);
            });
        });
    },

    viewDepartments: function() {
        return new Promise(function(res, rej) {
            const queryString = "SELECT * FROM departments";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return rej(err);
                }
                console.table(result);
                return res();
            });
        });
        
    },

    getDepartments: function() {
        return new Promise(function(res, rej) {
            const queryString = "SELECT * FROM departments";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return rej(err);
                }
                return res(result);
            });
        });
    },

    updateRole: function(emptId, newRole) {
        return new Promise(function(res, rej) {
            const queryString = "SELECT id FROM roles WHERE title = ?";
            connection.query(queryString, newRole, function(err, result) {
                if (err) {
                    return rej(err);
                }
                const newRoleId = result[0].id;
                const queryString = "UPDATE employees SET ? WHERE ?";
                connection.query(queryString,
                    [{
                        role_id: newRoleId
                    },
                    {
                        id: emptId
                    }],
                    function(err, result) {
                        if (err) {
                            return rej(err);
                        }
                        console.log("Employee's role successfully updated!");
                        return res();
                    });
            });
        });
        
    },

    updateManager: function(emptId, newMgrId) {
        return new Promise(function(resolve, reject) {
            const queryString = "UPDATE employees SET ? WHERE ?";
            connection.query(queryString,
                [{
                    manager_id: newMgrId
                },
                {
                    id: emptId
                }],
                function(err, result) {
                    if (err) {
                        return reject(err);
                    }
                    console.log("Employee's manager successfully updated!");
                    return resolve();
                });
        });
        
    },

    endConnection: function() {
        connection.end();
    }

};

module.exports = task;