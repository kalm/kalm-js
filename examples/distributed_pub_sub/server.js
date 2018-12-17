const kalm = require('../../dist/bundle');
const ws = require('../../../kalm-websocket');

const seed = { host: '0.0.0.0', port: 3000 };
const tickSeed = Date.now();

const Server = kalm.listen({
    providers: [
        {
            label: 'external',
            transport: ws(),
            port: 3938,
            routine: kalm.routines.tick(120, tickSeed),
        },
        {
            label: 'internal',
            transport: kalm.transports.tcp(),
            port: 3000,
            secretKey: 'ca8bda634ac5375cf3d9adc37251d4571e85174c',
            routine: kalm.routines.realtime(),
        }
    ],
    host: '0.0.0.0',
});

Server.providers.forEach((provider) => {
    const isIntern = provider.label === 'internal';
    const isSeed = (isIntern && seed.host === Server.host);

    if (!isSeed && isIntern) {
        kalm.connect({}).write('n.add', { host: Server.host });
    }

    provider.on('connection', (client) => {
        if (isIntern) {
            client.subscribe('n.add', (msg, evt) => {
                if (isSeed) {
                    provider.broadcast('n.add', msg);
                }
                else provider.connect(evt.remote);
            });
            client.subscribe('n.evt', (msg, evt) => {
                Server.providers.forEach((_provider) => {
                    if (_provider.label === 'external') {
                        _provider.broadcast('r.evt', msg);
                    }
                });
            });
        } else {
            client.subscribe('c.evt', (msg, evt) => {
                Server.providers.forEach((_provider) => {
                    if (_provider.label === 'internal') {
                        _provider.broadcast('n.evt', msg);
                    } else {
                        _provider.broadcast('r.evt', msg);
                    }
                });
            });
        }
    });
});