import { API_URL } from './config/vars.js';
import { OutInterface } from './outInterface.js';

export async function apiDel(id: string) {
    const data = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    const res = (await data.json()) as OutInterface<any>;

    if (res.state !== 200) {
        throw new Error(res.message, { cause: res });
    }

    return res;
}
