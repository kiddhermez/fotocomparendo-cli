import inquirer from 'inquirer';
import { Title } from '../titles.js';
import { keyProps } from '../../../interfaces/keys.js';

export interface SetProps<T> {
    title: string;
    showUser?: boolean;
    path?: string;
    color: Function;
    object: T[];
    keys: keyProps[];
}

export async function set<T>({
    path,
    showUser,
    color,
    title,
    object,
    keys,
}: SetProps<T>) {
    Title({
        path,
        showUser,
        color,
        title: 'Editar ' + title,
    });

    const { option: objectToEdit }: { option: T } = await inquirer.prompt([
        {
            name: 'option',
            message: 'Seleccione ' + title.toLowerCase() + ' a editar:',
            type: 'list',
            choices: object.map((obj) => {
                const nameKey = obj[keys[0].name];
                const primary = keys.find((key) => key.isPrimaryKey).name;

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

    const { option: infoToEdit }: { option: keyProps[] } =
        await inquirer.prompt([
            {
                name: 'option',
                message: 'Que desea editar?',
                type: 'checkbox',
                choices: keys.map((key) => ({
                    name:
                        (key.customName || key.name) +
                        ' - ' +
                        objectToEdit[key.name],
                    value: key,
                })),
            },
        ]);

    const data: T = await inquirer.prompt(
        infoToEdit
            .map((key: keyProps) => {
                key.isOptional ??= false;
                key.isPrimaryKey ??= false;
                key.customName ??= key.name;
                key.type ??= /[0-9A-Za-zñÑ ]+/;
                key.skip ??= false;
                if (key.skip) {
                    return;
                }

                return {
                    name: key.name,
                    message: (key.customName || key.name) + ':',
                    type: 'input',
                    validate: (value: any) => {
                        if (key.type && !key.type.test(value) && value) {
                            return 'Por favor ingrese un valor valido';
                        }

                        if (!value && !key.isOptional) {
                            return 'Por favor ingrese un valor';
                        }

                        const exists = object.find(
                            (obj) => obj[key.name] === value
                        );

                        if (exists && key.isPrimaryKey) {
                            return key.customName + ' ya existe';
                        }

                        return true;
                    },
                };
            })
            .filter((_, index) => !infoToEdit[index].skip)
    );

    return { data, objectToEdit, infoToEdit };
}
