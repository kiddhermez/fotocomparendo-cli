import inquirer from 'inquirer';
import { Title } from '../titles.js';

export interface DelProps<T> {
    title: string;
    showUser?: boolean;
    path?: string;
    color: Function;
    object: T[];
    keys: keyProps[];
    customTitle?: string;
}

class keyProps {
    name: string;
    type?: RegExp;
    customName?: string;
    isPrimaryKey?: boolean;
    isOptional?: boolean;
}

export async function del<T>({
    path,
    showUser,
    color,
    title,
    object,
    keys,
    customTitle,
}: DelProps<T>) {
    Title({
        path,
        showUser,
        color,
        title: customTitle ?? 'Eliminar ' + title,
    });

    const { option: objectToDelete }: { option: T } = await inquirer.prompt([
        {
            name: 'option',
            message: 'Seleccione ' + title + ' a eliminar:',
            type: 'list',
            choices: object.map((obj) => {
                const nameKey = obj[keys[0].name];
                const primary = keys.find((key) => key.isPrimaryKey)?.name;

                const name =
                    nameKey +
                    ' - ' +
                    (obj[primary] === nameKey
                        ? obj[keys[1].name].split('T')[0] ?? obj[keys[1].name]
                        : obj[primary]);
                return {
                    name,
                    value: obj,
                };
            }),
        },
    ]);

    return objectToDelete;
}
