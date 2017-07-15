import React from 'react';
import PropTypes from 'prop-types';
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
                this.state = { tick: 0, timestamp: Date.now() };

                this.synchronizeWith = props.synchronizeWith;
                this.synchronized = props.synchronizeWith !== undefined;

                this.setTimeout = ::this.setTimeout;
                this.stop = ::this.stop;
                this.resume = ::this.resume;
                this.setDelay = ::this.setDelay;
            }

            setTimeout() {
                const { delay, synchronizeWith } = this;
                const duration = delay - Math.abs(synchronizeWith - Date.now()) % delay;

                this.timer = setTimeout(() => {
                    if (!this.stopped) this.setTimeout();
                    this.setState({
                        tick: this.state.tick + 1,
                        timestamp: Date.now()
                    });
                }, duration);
            }

            start() {
                this.stopped = false;
                if (!this.synchronized) {
                    this.synchronizeWith = Date.now();
                }
                this.setTimeout();
            }

            resume() {
                if (this.stopped) {
                    this.start();
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
                this.start();
            }

            componentWillUnmount() {
                this.stop();
            }

            render() {
                const { props, delay, stop, resume, setDelay } = this;
                const { tick, timestamp } = this.state;

                const timer = { delay, tick, timestamp, stop, resume, setDelay };

                return React.createElement(TimedComponent, { ...props, timer });
            }
        }

        Timer.propTypes = {
            synchronizeWith: PropTypes.number
        };

        const componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
        Timer.displayName = `Timer@${delay}[${componentName}]`;

        return Timer;
    };
}

export default timer;
