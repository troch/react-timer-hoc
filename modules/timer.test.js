import { createRenderer, renderIntoDocument, findRenderedComponentWithType } from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import React, { Component } from 'react';
import h from 'react-hyperscript';
import timer from './timer';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.document = window.document;
global.window = window;

class Counter extends Component {
    render() {
        const { tick } = this.props;
        return h('div', { tick });
    }
}

const WrappedCounter = timer(1000)(Counter);

describe('Timer', function() {
    let clock, wrappedCounter, counter;

    before(() => clock = sinon.useFakeTimers());
    after(() => clock.restore());

    it('should pass down a timer property alongside other props', function() {
        expect(WrappedCounter.displayName).to.equal('Timer@1000[Counter]');
        wrappedCounter = renderIntoDocument(h(WrappedCounter, { customProp: 1 }));
        counter = findRenderedComponentWithType(wrappedCounter, Counter);

        expect(counter.props.timer.tick).to.equal(0);
        expect(counter.props.timer.timestamp).to.equal(0);
        expect(counter.props.timer.delay).to.equal(1000);
        expect(counter.props.timer.stop).to.be.a.function;
        expect(counter.props.timer.setDelay).to.be.a.function;
        expect(counter.props.customProp).to.equal(1);
    });

    it('should increment a tick property', function() {
        clock.tick(1100);
        expect(counter.props.timer.tick).to.equal(1);
        clock.tick(1000);
        expect(counter.props.timer.tick).to.equal(2);
    });

    it('should pass down current timestamp', function() {
        // Timestamp should already be at 2000ms from previous test.
        expect(counter.props.timer.timestamp).to.equal(2000);
        clock.tick(1000);
        expect(counter.props.timer.timestamp).to.equal(3000);
        clock.tick(1100);
        expect(counter.props.timer.timestamp).to.equal(4000);
    });

    it('should have the ability to be stopped and resumed', function() {
        expect(wrappedCounter.stopped).to.be.false;
        counter.props.timer.stop();
        expect(wrappedCounter.stopped).to.be.true;
        counter.props.timer.resume();
        expect(wrappedCounter.stopped).to.be.false;
    });

    it('shoud give the ability to change its delay', function() {
        counter.props.timer.setDelay(60000);
        expect(wrappedCounter.delay).to.be.equal(60000);

        clock.tick(60100);
        expect(counter.props.timer.tick).to.equal(5);
        expect(counter.props.timer.delay).to.equal(60000);
        counter.props.timer.stop();
    });

    it('should be synchronized with a provided value', function() {
        clock.restore();
        clock = sinon.useFakeTimers(500);

        wrappedCounter = renderIntoDocument(h(WrappedCounter, { synchronizeWith: 0 }));
        counter = findRenderedComponentWithType(wrappedCounter, Counter);

        expect(counter.props.timer.tick).to.equal(0);
        clock.tick(600);
        expect(counter.props.timer.tick).to.equal(1);
        clock.tick(1000);
        expect(counter.props.timer.tick).to.equal(2);
    });
});
