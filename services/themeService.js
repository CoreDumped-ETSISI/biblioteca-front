import { Subject } from "rxjs";

const subject = new Subject();

export const themeService = {
  setTheme: theme => subject.next(theme),
  getTheme: () => subject.asObservable()
};
