import inquirer from 'inquirer';
import { clear } from 'console';
import fs from 'fs';
import { getComunes } from '../api/index.js';
import { Title } from './titles.js';
import { Comune } from '../api/interfaces/comune.js';

export async function Login(color: Function) {
    clear();
    Title({
        color,
        title: 'Login',
        path: '',
        showUser: false,
    });
    const comunes = await getComunes();

    if (comunes.state !== 200) {
        throw new Error(comunes.message);
    }

    const answer = await inquirer.prompt([
        {
            name: 'usrname',
            type: 'input',
            message: 'Digite su nombre de usuario: ',
        },
        {
            name: 'location',
            type: 'list',
            message: 'Seleccione una comuna: ',
            choices: comunes.data.map((comune) => ({
                name: comune.nom_comuna,
                value: comune,
            })),
        },
    ]);

    const data = {
        username: answer.usrname,
        location: answer.location as Comune,
    };

    fs.writeFileSync('./src/data/user.json', JSON.stringify(data, null, 2));
    return data;
}
