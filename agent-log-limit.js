console.log = (...args) => { if (Date.now() % 2000 < 50) process.stdout.write('[Agent] ' + args.join(' ') + '\n') };
