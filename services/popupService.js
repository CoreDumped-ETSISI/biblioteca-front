import { Subject } from "rxjs";

const subject = new Subject();

export const popupService = {
  setPopup: popup => subject.next(popup),
  getPopup: () => subject.asObservable()
};
