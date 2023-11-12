import { createSpinner } from 'nanospinner';
import { sleep } from './sleep.js';

export async function loading(message: string, time: number) {
    const spinner = createSpinner(message).start();
    await sleep(time).then(() => {
        spinner.success();
    });
}
