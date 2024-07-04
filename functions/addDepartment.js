const pool = require('../db/db');
const inquirer = require('inquirer');

function addDepartment(mainMenu) {
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

module.exports = addDepartment;