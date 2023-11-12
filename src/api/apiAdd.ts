import { API_URL } from './config/vars.js';
import { OutInterface } from './outInterface.js';

export async function apiAdd<T>(data: T, url: string) {
    const dataFetch = await fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const res = (await dataFetch.json()) as OutInterface<any>;

    if (res.state !== 201) {
        throw new Error(res.message, { cause: res });
    }

    return res;
}
