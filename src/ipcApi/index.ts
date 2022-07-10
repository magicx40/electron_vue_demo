import { rename } from 'fs/promises';

export function renameByPath(filesPath: Array<Record<string, any>>) {
    let renamePromises: Array<Promise<void>> = [];
    filesPath.forEach(item => {
        renamePromises.push(rename(item.oldPath, item.newPath));
    });
    return Promise.all(renamePromises);
}