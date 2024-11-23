import { StaticLoveLinks } from "./StaticLoveLinks";

export class Rays {
    private static readonly IMAGES_PER_ROW = 5;

    /**
     * Get a div representing a key-lock connection 
     */
    public static getRayImage(key: number, lock: number): HTMLElement {
        const index = Rays.getRayIndex(key, lock);
        const image = document.createElement('div');
        image.classList.add("lovelinks-rays");

        const row = Math.floor(index / Rays.IMAGES_PER_ROW);
        const column = index % Rays.IMAGES_PER_ROW;;
        image.style.backgroundPositionX = `-${column * 100}%`;
        image.style.backgroundPositionY = `-${row * 100}%`;
        return image;
    }

    /**
     * Large switch case that enumerates all possible ray combinations
     */
    private static getRayIndex(key: number, lock: number): number {
        if      (key == 2 && lock == 2)     return 0;
        else if (key == 2 && lock == 4)     return 1;
        else if (key == 2 && lock == 6)     return 2;
        else if (key == 2 && lock == 8)     return 3;
        else if (key == 2 && lock == 10)    return 4;
        else if (key == 2)                  return 5;
        else if (key == 3 && lock == 3)     return 6;
        else if (key == 3 && lock == 6)     return 7;
        else if (key == 3 && lock == 9)     return 8;
        else if (key == 3)                  return 9;
        else if (key == 4 && lock == 4)     return 10;
        else if (key == 4 && lock == 8)     return 11;
        else if (key == 4)                  return 12;
        else if (key == 5 && lock == 5)     return 13;
        else if (key == 5 && lock == 10)    return 14;
        else if (key == 5)                  return 15;
        else if (key == 6 && lock == 6)     return 16;
        else if (key == 6)                  return 17;
        else if (key == 7)                  return 18;
        else if (key == 8 && lock == 8)     return 19;
        else if (key == 8)                  return 20;
        else if (key == 9)                  return 21;
        else if (key == 10)                 return 22;
        throw new Error(`Ray index not found for link ${key} - ${lock}`);
    }
}