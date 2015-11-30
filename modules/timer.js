import React from 'react';
import invariant from 'invariant';

function checkDelay(delay) {
    invariant(
        typeof delay === 'number' && delay > 0,
        '[react-timer-hoc] `delay` should be a number greater than 0.'
    );
}

function timer(delay) {
    checkDelay(delay);

    return function TimerHoc(TimedComponent) {
        class Timer extends React.Component {
            constructor(props) {
                super(props);
                this.delay = delay;
                this.state = { tick: 0 };

                this.setTimeout = ::this.setTimeout;
                this.stop = ::this.stop;
                this.resume = ::this.resume;
                this.setDelay = ::this.setDelay;
            }

            setTimeout() {
                const { delay, startTime } = this;
                const duration = delay - (startTime - Date.now()) % delay;

                this.timer = setTimeout(() => {
                    this.setState({ tick: this.state.tick + 1 });
                    if (!this.stopped) this.setTimeout();
                }, delay);
            }

            resume() {
                if (this.stopped) {
                    this.stopped = false;
                    this.startTime = Date.now();
                    this.setTimeout();
                }
            }

            stop() {
                this.stopped = true;
                clearTimeout(this.timer);
            }

            setDelay(delay) {
                checkDelay(delay);
                this.delay = delay;
                if (!this.stopped) {
                    this.stop();
                    this.resume();
                }
            }

            componentDidMount() {
                this.stopped = false;
                this.startTime = Date.now();
                this.setTimeout();
            }

            componentWillUnmount() {
                this.stop();
            }

            render() {
                const { props, stop, resume, setDelay } = this;
                const { tick } = this.state;

                const timer = { delay, tick, stop, resume, setDelay };

                return React.createElement(TimedComponent, { ...props, timer });
            }
        };

        const componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
        Timer.displayName = `Timer@${delay}[${componentName}]`;

        return Timer;
    };
}

export default timer;
