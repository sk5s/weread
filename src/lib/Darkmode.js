import { Preferences } from "@capacitor/preferences";
import key from "./storage.json"

const matchMedia = window.matchMedia(
  "(prefers-color-scheme: dark)"
)
export const prefersDark = matchMedia.matches;
const preferDarkChange = () => {
  console.log("Prefer dark change", matchMedia.matches)
  getUserThemePreference();
}

matchMedia.addEventListener("change", () => preferDarkChange());

function darkEnable(value) {
  console.log("DarkEnable: ", value, matchMedia.matches);
  if (value === "dark") {
    document.body.classList.add("dark");
  } else if (value === "light") {
    document.body.classList.remove("dark");
  } else if (matchMedia.matches) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

export async function getUserThemePreference() {
  const { value } = await Preferences.get({
    key: key.settings,
  });
  console.log(JSON.parse(value));
  darkEnable(JSON.parse(value).theme);
}