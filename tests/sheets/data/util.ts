export function chatAtABC(n) {
    const ord_a = 'a'.charCodeAt(0);

    const ord_z = 'z'.charCodeAt(0);

    const len = ord_z - ord_a + 1;

    let s = '';

    while (n >= 0) {
        s = String.fromCharCode((n % len) + ord_a) + s;

        n = Math.floor(n / len) - 1;
    }

    return s.toUpperCase();
}
