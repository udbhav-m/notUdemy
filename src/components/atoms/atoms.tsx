import { atom } from "recoil";

export const appBarState = atom({
  key: "appBarState",
  default: "",
});

export const usernameState = atom({
  key: "usernameState",
  default: "",
});

export const passwordState = atom({
  key: "passwordState",
  default: "",
});

export const coursesState = atom({
  key: "coursesState",
  default: [],
});

export const loadingState = atom({
  key: "loadingState",
  default: true,
});

export const addCourseState = atom({
  key: "addCourseState",
  default: {
    title: "",
    description: "",
    price: 0,
    imageLink: "",
    published: true,
    CourseId: 0,
  },
});

export const userLoginState = atom({
  key: "userLoginState",
  default: false,
});

export const adminLoginState = atom({
  key: "adminLoginState",
  default: false,
});
