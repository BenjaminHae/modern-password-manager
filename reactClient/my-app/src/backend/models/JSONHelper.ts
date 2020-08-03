export function exists(json: any, key: string): boolean {
    const value = json[key];
    return value !== null && value !== undefined;
}
