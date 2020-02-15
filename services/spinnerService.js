import { Subject } from "rxjs";

const subject = new Subject();

export const spinnerService = {
  setSpinnerStatus: status => subject.next(status),
  getSpinnerStatus: () => subject.asObservable()
};
