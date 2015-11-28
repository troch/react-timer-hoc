import React from 'react';

function timer(delay) {
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
                    this.setTimeout();
                }, delay);
            }

            stop() {
                clearTimeout(this.timer);
            }

            componentDidMount() {
                this.startTime = Date.now();
                this.setTimeout();
            }

            componentWillUnmout() {
                this.stop();
            }

            render() {
                const { props, stop } = this.props;
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
