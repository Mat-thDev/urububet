import { UserData } from "@/types";
import { atomWithStorage } from "jotai/utils";

export const hasClaimedFirstBonus = atomWithStorage("claimedBonus", false);

export const openLoginModal = atomWithStorage("loggedIn", true);

const user = {
  name: "",
  profilePicture: "",
  creditsAvaliable: 1500000,
} as UserData

export const userData = atomWithStorage<UserData | null>("userData", user)
