import inquirer from 'inquirer';
import { Title } from './titles.js';
export interface MenuProps {
    options: string[];
    message: string;
    title: string;
    showUser?: boolean;
    path?: string;
    color: Function;
}

export async function Menu({
    options,
    message,
    title,
    color,
    path,
    showUser = false,
}: MenuProps) {
    Title({
        path,
        showUser,
        color,
        title,
    });

    const { option } = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message,
            choices: options.map((option: string, index: number) => ({
                name: option,
                value: index,
            })),
        },
    ]);

    return option;
}
