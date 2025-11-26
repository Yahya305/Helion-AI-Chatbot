import { v4 as uuidv4 } from "uuid";

const GUEST_ID_KEY = "guest_id";

export const getGuestId = (): string => {
    let guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
        guestId = uuidv4();
        localStorage.setItem(GUEST_ID_KEY, guestId);
    }
    return guestId;
};

export const clearGuestId = (): void => {
    localStorage.removeItem(GUEST_ID_KEY);
};
