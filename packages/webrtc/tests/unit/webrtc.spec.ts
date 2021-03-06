import { EventEmitter } from 'events';
import * as webrtc from '../../src/webrtc';

describe('webrtc transport', () => {
  it('basic setup', () => {
    expect(typeof webrtc.default).toBe('function');
    const transport = webrtc.default();
    expect(typeof transport).toBe('function');
    const socket = transport({}, new EventEmitter());

    expect(socket).toHaveProperty('bind', expect.any(Function));
    expect(socket).toHaveProperty('connect', expect.any(Function));
    expect(socket).toHaveProperty('disconnect', expect.any(Function));
    expect(socket).toHaveProperty('remote', expect.any(Function));
    expect(socket).toHaveProperty('stop', expect.any(Function));
    expect(socket).toHaveProperty('send', expect.any(Function));
    expect(socket).toHaveProperty('negociate', expect.any(Function));
  });

  describe('Given an empty handle reference and no configs', () => {
    const transport = webrtc.default();
    const socket = transport({}, new EventEmitter());

    describe('when fetching remote', () => {
      it('should return null values', () => {
        expect(socket.remote()).toEqual({ host: null, port: null });
      });
    });
  });

  describe('Given a handle reference and no configs', () => {
    const transport = webrtc.default();
    const socket = transport({}, new EventEmitter());

    describe('when fetching remote', () => {
      it('should return handle\'s values', () => {
        expect(socket.remote({ host: '127.0.0.1', port: 3000 })).toEqual({ host: '127.0.0.1', port: 3000 });
      });
    });
  });
});
