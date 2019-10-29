/* Requires ------------------------------------------------------------------*/

import Peer from 'simple-peer';

if (!Peer.WEBRTC_SUPPORT) {
    throw new Error('Unsupported environement for WebRTC');
}

/* Methods -------------------------------------------------------------------*/

function ws({}: WebRTCConfig = {}): KalmTransport {
  return function socket(params: ClientConfig, emitter: NodeJS.EventEmitter): Socket {
    let listener;

    function bind(): void {
      listener = new Peer();
      listener.on('connect', soc => emitter.emit('socket', soc));
      listener.on('error', err => emitter.emit('error', err));
      emitter.emit('ready');
    }

    function send(handle: any, payload: number[]): void {
      handle.write(Buffer.from(payload));
    }

    function stop(): void {
      if (listener) listener.close();
    }

    function connect(handle?: Peer): Peer {
      const connection = handle || new Peer({ initiator: true });
      connection.on('signal', () => {
        // Todo
      });
      connection.on('data', evt => emitter.emit('rawFrame', Buffer.from(evt.data || evt)));
      connection.on('error', err => emitter.emit('error', err));
      connection.on('connect', () => emitter.emit('connect', connection));
      connection.on('close', () => emitter.emit('disconnect'));

      return connection;
    }

    function remote(handle: Peer): Remote {
      console.log(handle)
      return {
        host: handle,
        port: handle || 0,
      };
    }

    function disconnect(handle) {
      if (handle) {
        handle.destroy();
      }
    }

    return {
      bind,
      connect,
      disconnect,
      remote,
      send,
      stop,
    };
  };
}

/* Exports -------------------------------------------------------------------*/

module.exports = ws;
