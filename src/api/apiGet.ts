import { API_URL } from './config/vars.js';
import { OutInterface } from './outInterface.js';

export async function apiGet<T>(url: string) {
    const data = await fetch(`${API_URL}/${url}`);
    const res = (await data.json()) as OutInterface<T>;

    if (res.state === 500) {
        throw new Error(res.message, { cause: res });
    }

    return res;
}
