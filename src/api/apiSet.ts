import { API_URL } from './config/vars.js';
import { OutInterface } from './outInterface.js';

export async function apiSet<T>(newData: T, id: string) {
    const data = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    });

    const res = (await data.json()) as OutInterface<any>;

    if (res.state !== 200) {
        throw new Error(res.message, { cause: res });
    }

    return res;
}
