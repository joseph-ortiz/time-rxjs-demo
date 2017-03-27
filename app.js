const startButton = document.querySelector('.start');
const stopButton = document.querySelector('.stop');
const resetButton = document.querySelector('.reset');
const halfButton = document.querySelector('.half');
const quarterButton = document.querySelector('.quarter');

const start$ = Rx.Observable.fromEvent(startButton, 'click');
const stop$ = Rx.Observable.fromEvent(stopButton, 'click');
const reset$ = Rx.Observable.fromEvent(resetButton, 'click');
const half$ = Rx.Observable.fromEvent(halfButton, 'click');
const quarter$ = Rx.Observable.fromEvent(quarterButton, 'click');

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

const incOrReset$ = Rx.Observable.merge(
  intervalThatStops$.mapTo(inc),
  reset$.mapTo(reset)
);

const starters$ = Rx.Observable.merge(
  start$.mapTo(1000),
  half$.mapTo(500),
  quarter$.mapTo(250)
);

const intervalActions$ = (time) => Rx.Observable.merge(
  Rx.Observable.interval(time)
    .takeUntil(stop$)
    .mapTo(inc),
  reset$.mapTo(reset)
);

const timer$ = starters$
  .switchMap(intervalActions$)
  .startWith(data)
  .scan((acc, curr) => curr(acc));



const inputButton = document.querySelector('input');
const input$ = Rx.Observable.fromEvent(inputButton, 'input')
  .map(event => event.target.value);

timer$  
  .subscribe(setHtml);
//input$.subscribe(x => console.log(x));

Rx.Observable.combineLatest(
  timer$,
  input$,
  (timer, input) => ({count: timer.count, text: input})
  )
  .subscribe(x => console.log(x));