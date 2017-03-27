const startButton = document.querySelector('.start');
const stopButton = document.querySelector('.stop');
const resetButton = document.querySelector('.reset');

const start$ = Rx.Observable.fromEvent(startButton, 'click');
const stop$ = Rx.Observable.fromEvent(stopButton, 'click');
const reset$ = Rx.Observable.fromEvent(resetButton, 'click');

const setHtml = (x) => {
  document.querySelector('#timer').innerHTML = x.count;
};

const data = {
  count: 0
};
const inc = (acc) => ({count: acc.count + 1});
const reset = (acc) => data;

const interval$ = Rx.Observable.interval(1000);

const intervalThatStops$ = interval$.takeUntil(stop$);

const startInterval$ = start$.switchMapTo(Rx.Observable.merge(
intervalThatStops$, reset$
));


startInterval$
  .mapTo(inc)
  .startWith(data)
  .scan((acc, curr) => curr(acc))
  .subscribe(setHtml);