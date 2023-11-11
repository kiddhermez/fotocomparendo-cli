import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';

export async function mainMenu() {
    console.clear();
    console.log(
        gradient.cristal.multiline(
            figlet.textSync('FOTO COMPARENDO', {
                horizontalLayout: 'full',
                font: 'ANSI Shadow',
                whitespaceBreak: true,
            })
        )
    );

    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Digite su nombre:',
    });
}
