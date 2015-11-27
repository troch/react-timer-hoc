'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function timer(delay) {
    return function TimerHoc(TimedComponent) {
        var Timer = (function (_Component) {
            _inherits(Timer, _Component);

            function Timer(props) {
                _classCallCheck(this, Timer);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Timer).call(this, props));

                _this.state = { tick: 0 };
                _this.setInterval = _this.setInterval.bind(_this);
                return _this;
            }

            _createClass(Timer, [{
                key: 'setInterval',
                value: (function (_setInterval) {
                    function setInterval() {
                        return _setInterval.apply(this, arguments);
                    }

                    setInterval.toString = function () {
                        return _setInterval.toString();
                    };

                    return setInterval;
                })(function () {
                    var _this2 = this;

                    this.timer = setInterval(function () {
                        _this2.setState({ tick: _this2.state.tick + 1 });
                    }, delay);
                })
            }, {
                key: 'componentDidMount',
                value: function componentDidMount() {
                    this.setInterval();
                }
            }, {
                key: 'componentWillUnmout',
                value: function componentWillUnmout() {
                    clearInterval(this.timer);
                }
            }, {
                key: 'render',
                value: function render() {
                    var props = this.props;
                    var tick = this.state.tick;

                    return (0, _react.createElement)(TimedComponent, _extends({}, props, { tick: tick, delay: delay, timer: this.timer }));
                }
            }]);

            return Timer;
        })(_react.Component);

        ;

        var componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
        Timer.displayName = 'Timer@' + delay + '[' + componentName + ']';

        return Timer;
    };
}

exports.default = timer;
