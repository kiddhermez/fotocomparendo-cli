import inquirer from 'inquirer';
import { Title } from './titles.js';
export interface StopProps {
    title: string;
    showUser?: boolean;
    path?: string;
    color: Function;
    data: Function;
}

export async function stop({
    title,
    color,
    path,
    showUser = false,
    data,
}: StopProps) {
    Title({
        path,
        showUser,
        color,
        title,
    });

    await data();

    await inquirer.prompt([
        {
            type: 'input',
            name: 'option',
            message: 'Presione enter para continuar...',
        },
    ]);
}
