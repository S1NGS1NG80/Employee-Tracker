const pool = require('../db/db');


function viewAllDepartments(mainMenu) {
    pool.query('SELECT id, name FROM department', (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

module.exports = viewAllDepartments;