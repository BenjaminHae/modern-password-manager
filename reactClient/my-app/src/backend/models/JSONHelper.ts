export function exists(json: any, key: string) {
    const value = json[key];
    return value !== null && value !== undefined;
}
