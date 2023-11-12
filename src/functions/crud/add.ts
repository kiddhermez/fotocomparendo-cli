import inquirer from 'inquirer';
import { Title } from '../titles.js';
import { keyProps } from '../../../interfaces/keys.js';

export interface AddProps<T> {
    title: string;
    icon?: string;
    showUser?: boolean;
    path?: string;
    color: Function;
    object: T[];
    keys: keyProps[];
}

export async function add<T>({
    path,
    icon,
    showUser,
    color,
    title,
    object,
    keys,
}: AddProps<T>) {
    Title({
        path,
        showUser,
        color,
        title: (icon ?? '') + 'Añadir ' + title,
    });

    const data: T = await inquirer.prompt(
        keys
            .map((key) => {
                key.isOptional ??= false;
                key.isPrimaryKey ??= false;
                key.customName ??= key.name;
                key.type ??= /[0-9A-Za-zñÑ ]+/;
                key.isOptional ??= false;
                return {
                    name: key.name,
                    message: (key.customName || key.name) + ':',
                    type: 'input',
                    validate: (value) => {
                        if (key.type && !key.type.test(value) && value) {
                            return 'Por favor ingrese un valor valido';
                        }

                        if (!value && !key.isOptional) {
                            return 'Por favor ingrese un valor';
                        }
                        let exists =
                            object.find((obj) => obj[key.name] === value) ||
                            (typeof value === 'string' &&
                                object.find(
                                    (obj) =>
                                        obj[key.name] === value.toUpperCase()
                                ));
                        if (exists && key.isPrimaryKey) {
                            return key.customName + ' ya existe';
                        }

                        return true;
                    },
                };
            })
            .filter((_, index) => !keys[index].skip)
    );

    return data;
}
