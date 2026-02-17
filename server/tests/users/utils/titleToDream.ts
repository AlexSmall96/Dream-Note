import { guestData } from "../../../seed-data/guestSeedData"

export const titleToDream = (title: string) => {
    const dream = guestData.filter(d => d.dream.title === title)[0]
    return dream
}