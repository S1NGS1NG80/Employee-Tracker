const inquirer = require('inquirer');
const pool = require('./db/db');
const cTable = require('console.table');

// Main menu
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee manager',
                'View employees by manager',
                'View employees by department',
                'Delete department',
                'Delete role',
                'Delete employee',
                'View total utilized budget by department',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Delete department':
                deleteDepartment();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete employee':
                deleteEmployee();
                break;
            case 'View total utilized budget by department':
                viewTotalUtilizedBudget();
                break;
            case 'Exit':
                pool.end();
                process.exit();
        }
    });
}

// View all departments
function viewAllDepartments() {
    pool.query('SELECT id, name FROM department', (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// View all roles
function viewAllRoles() {
    pool.query(`
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role
        JOIN department ON role.department_id = department.id
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// View all employees
function viewAllEmployees() {
    pool.query(`
        SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
               CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN role ON e.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// Add a department
function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the department name:'
        }
    ]).then(answer => {
        pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Added department ${answer.name}`);
            }
            mainMenu();
        });
    });
}

// Add a role
function addRole() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the role title:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the role salary:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments
            }
        ]).then(answer => {
            pool.query(
                'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
                [answer.title, answer.salary, answer.department_id],
                (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`Added role ${answer.title}`);
                    }
                    mainMenu();
                }
            );
        });
    });
}

// Add an employee
function addEmployee() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
        pool.query('SELECT * FROM employee', (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            const managers = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
            managers.unshift({ name: 'None', value: null });
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the employee\'s first name:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the employee\'s last name:'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the employee\'s role:',
                    choices: roles
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the employee\'s manager:',
                    choices: managers
                }
            ]).then(answer => {
                pool.query(
                    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                    [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
                    (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Added employee ${answer.first_name} ${answer.last_name}`);
                        }
                        mainMenu();
                    }
                );
            });
        });
    });
}

// Update an employee role
function updateEmployeeRole() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        pool.query('SELECT * FROM role', (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roles
                }
            ]).then(answer => {
                pool.query(
                    'UPDATE employee SET role_id = $1 WHERE id = $2',
                    [answer.role_id, answer.employee_id],
                    (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Updated employee's role`);
                        }
                        mainMenu();
                    }
                );
            });
        });
    });
}

// Update employee manager
function updateEmployeeManager() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employees
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the new manager:',
                choices: [{ name: 'None', value: null }, ...employees]
            }
        ]).then(answer => {
            pool.query(
                'UPDATE employee SET manager_id = $1 WHERE id = $2',
                [answer.manager_id, answer.employee_id],
                (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`Updated employee's manager`);
                    }
                    mainMenu();
                }
            );
        });
    });
}

// View employees by manager
function viewEmployeesByManager() {
    pool.query(`
        SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, CONCAT(e.first_name, ' ', e.last_name) AS employee
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY manager, employee
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// View employees by department
function viewEmployeesByDepartment() {
    pool.query(`
        SELECT department.name AS department, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY department, employee
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// Delete a department
function deleteDepartment() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department to delete:',
                choices: departments
            }
        ]).then(answer => {
            pool.query('DELETE FROM department WHERE id = $1', [answer.department_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted department`);
                }
                mainMenu();
            });
        });
    });
}

// Delete a role
function deleteRole() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
        inquirer.prompt([
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role to delete:',
                choices: roles
            }
        ]).then(answer => {
            pool.query('DELETE FROM role WHERE id = $1', [answer.role_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted role`);
                }
                mainMenu();
            });
        });
    });
}

// Delete an employee
function deleteEmployee() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to delete:',
                choices: employees
            }
        ]).then(answer => {
            pool.query('DELETE FROM employee WHERE id = $1', [answer.employee_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted employee`);
                }
                mainMenu();
            });
        });
    });
}

// View total utilized budget by department
function viewTotalUtilizedBudget() {
    pool.query(`
        SELECT department.name AS department, SUM(role.salary) AS utilized_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        GROUP BY department.name
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// Start the application
mainMenu();