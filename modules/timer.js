import React from 'react';
import invariant from 'invariant';

function timer(delay) {
    invariant(
        typeof delay === 'number' && delay > 0,
        '[react-timer-hoc] `delay` should be a number greater than 0.'
    );

    return function TimerHoc(TimedComponent) {
        class Timer extends React.Component {
            constructor(props) {
                super(props);
                this.state = { tick: 0 };
                this.setTimeout = ::this.setTimeout;
                this.stop = ::this.stop;
            }

            setTimeout() {
                const duration = delay - (this.startTime - Date.now()) % delay;
                this.timer = setTimeout(() => {
                    this.setState({ tick: this.state.tick + 1 });
                    if (!this.stopped) this.setTimeout();
                }, delay);
            }

            stop() {
                this.stopped = true;
                clearTimeout(this.timer);
            }

            componentDidMount() {
                this.stopped = false;
                this.startTime = Date.now();
                this.setTimeout();
            }

            componentWillUnmout() {
                this.stop();
            }

            render() {
                const { props, stop } = this;
                const { tick } = this.state;

                return React.createElement(TimedComponent, { ...props, tick, delay, stop });
            }
        };

        const componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
        Timer.displayName = `Timer@${delay}[${componentName}]`;

        return Timer;
    };
}

export default timer;
