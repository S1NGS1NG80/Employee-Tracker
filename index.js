const inquirer = require('inquirer');
const pool = require('./db/db');
const viewAllDepartments = require('./functions/viewAllDepartments');
const viewAllRoles = require('./functions/viewAllRoles');
const viewAllEmployees = require('./functions/viewAllEmployees');
const addDepartment = require('./functions/addDepartment');
const addRole = require('./functions/addRole');
const addEmployee = require('./functions/addEmployee');
const updateEmployeeRole = require('./functions/updateEmployeeRole');
const updateEmployeeManager = require('./functions/updateEmployeeManager');
const viewEmployeesByManager = require('./functions/viewEmployeesByManager');
const viewEmployeesByDepartment = require('./functions/viewEmployeesByDepartment');
const deleteDepartment = require('./functions/deleteDepartment');
const deleteRole = require('./functions/deleteRole');
const deleteEmployee = require('./functions/deleteEmployee');
const viewTotalUtilizedBudget = require('./functions/viewTotalUtilizedBudget');


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
                viewAllDepartments(mainMenu);
                break;
            case 'View all roles':
                viewAllRoles(mainMenu);
                break;
            case 'View all employees':
                viewAllEmployees(mainMenu);
                break;
            case 'Add a department':
                addDepartment(mainMenu);
                break;
            case 'Add a role':
                addRole(mainMenu);
                break;
            case 'Add an employee':
                addEmployee(mainMenu);
                break;
            case 'Update an employee role':
                updateEmployeeRole(mainMenu);
                break;
            case 'Update employee manager':
                updateEmployeeManager(mainMenu);
                break;
            case 'View employees by manager':
                viewEmployeesByManager(mainMenu);
                break;
            case 'View employees by department':
                viewEmployeesByDepartment(mainMenu);
                break;
            case 'Delete department':
                deleteDepartment(mainMenu);
                break;
            case 'Delete role':
                deleteRole(mainMenu);
                break;
            case 'Delete employee':
                deleteEmployee(mainMenu);
                break;
            case 'View total utilized budget by department':
                viewTotalUtilizedBudget(mainMenu);
                break;
            case 'Exit':
                pool.end();
                process.exit();
        }
    });
}

// Start the application
mainMenu();